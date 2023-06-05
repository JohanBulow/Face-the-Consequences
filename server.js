const express = require('express');
const app = express();

const sqlite3 = require('sqlite3');
const multer = require('multer');
const bcrypt = require('bcrypt');
const path = require('path');
const session = require('express-session');

const port = 3000;

const db = new sqlite3.Database('mydatabase.db');
 

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

app.listen(port, () => console.log(`Server running on port ${port}`));
app.use(express.static('public'));
app.use(express.json());

app.get('/home', (req, res) => {
    
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.post('/recognize', (req, res) => {
    const { name } = req.body;
    console.log('Received face recognition data:', name);
  
    
    const query = 'SELECT * FROM createdAcc WHERE userName = ?';
    db.get(query, [name], (error, row) => {
      if (error) {
        console.error('Error executing the query:', error);
        res.status(500).json({ status: 'failure' });
      } else if (row) {
        
        const { summonerName, server, rank } = row;
  
        
        if (summonerName === null || server === null || rank === null) {
          res.json({ status: 'failure', message: 'One or more values are NULL' });
          return;
        }
  
        
        if (rank === 'IRON' || rank === 'BRONZE' || rank === 'SILVER' || rank === 'GOLD') {
            console.log("HEMAJGWNOA")
            res.json({ status: 'failure', message: 'Player to low...' });
            return;
          }

        
        const existsQuery = 'SELECT * FROM activeUsers WHERE summonerName = ?';
        db.get(existsQuery, [summonerName], (existsError, existsRow) => {
          if (existsError) {
            console.error('Error executing the existsQuery:', existsError);
            res.status(500).json({ status: 'failure' });
          } else if (existsRow) {
            
            res.json({ status: 'failure', message: 'User already exists in activeUsers' });
          } else {
            
            const insertQuery = 'INSERT INTO activeUsers (summonerName, server, rank) VALUES (?, ?, ?)';
            db.run(insertQuery, [summonerName, server, rank], (insertError) => {
              if (insertError) {
                console.error('Error inserting activeUser:', insertError);
                res.status(500).json({ status: 'failure' });
              } else {
                res.json({ status: 'success' });
              }
            });
          }
        });
      } else {

        res.json({ status: 'failure', message: 'Person not found' });
      }
    });
  });
  

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/faces/'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); 
      
    }
  });

  const upload = multer({ storage: storage });

  app.post('/public/faces', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No image file uploaded.'); 
    }

    return res.status(200).send('Image uploaded successfully.'); 
  });

app.get('/api', (request, response)=> {
    const sql = 'SELECT * FROM activeUsers';

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log(err);
            response.status(500).json({ error: 'Internal Server Error' });
        } else {
            response.json(rows);
        }
    });
})


app.post('/api', (request, response) => {
    console.log("I GOT A REQUEST");
    console.log(request.body);

    const rank = request.body.rank;
    const server = request.body.selectedValue;
    const summonerName = request.body.inputValue;

    const sql = 'INSERT INTO regUsers (rank, server, summonerName) VALUES (?, ?, ?)';
    const values = [rank, server, summonerName];

    db.run(sql, values, function (err) {
        if (err) {
            console.log(err);
            response.json({ status: "error" });
        } else {
            console.log("Data inserted successfully");
            response.json({
                status: "success",
                rank: rank,
                server: server,
                summonerName: summonerName
            });
        }
    });

});

app.post('/api/reg', (request, response) => {
    console.log("I GOT A REQUEST");
    console.log(request.body);

    const name = request.body.name;
    const pw = request.body.pw;
    const summonerName = null;
    const server = null;
    const connectedAcc = false;
    const picURL = null;

    if (pw === '') {
        response.json({ status: 'failure' });
        return;
    }

    const sql = 'INSERT INTO createdAcc (userName, password, summonerName, server, connectedAcc, picURL) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [name, pw, summonerName, server, connectedAcc, picURL]

    db.run(sql, values, function (err) {
        if (err) {
            console.log(err);
            response.json({ status: "error" });
        } else {
            console.log("Data inserted successfully");
            response.json({
                status: "success",
                name: name,
                pw: pw,
                server: server,
                summonerName: summonerName,
                connectedAcc: connectedAcc,
                picURL: picURL
            });
        }
    });

});

app.post('/api/login', async (request, response) => {
    const userName = request.body.userName;
    const password = request.body.password;

    const sql = 'SELECT * FROM createdAcc WHERE userName = ?';
    const values = [userName];
    db.get(sql, values, async (err, row) => {
        if (err) {
            console.error(err);
            response.json({ status: 'error' });
        } else {
            if (row) {
                const hashedPassword = row.password;
                const isPasswordValid = await bcrypt.compare(password, hashedPassword);
                if (isPasswordValid) {
                    response.json({ status: 'success', userName: row.userName });
                } else {
                    response.json({ status: 'failure' });
                }
            } else {
                response.json({ status: 'failure' });
            }
        }
    });
});

app.get('/api/check0', (request, response) => {
    const userName = request.query.userName;
    const query = 'SELECT connectedAcc FROM createdAcc WHERE userName = ?';
    db.get(query, [userName], (error, result) => {
        if (error) {
            console.error('Error executing the query:', error);
            response.status(500).json({ status: 'failure' });
            return;
        }

        if (!result) {
            response.status(404).json({ status: 'failure' });
            return;
        }

        const connectedAcc = result.connectedAcc;
        console.log(userName)
        console.log(connectedAcc)
        if (connectedAcc === 0) {
            
            const updateQuery = 'UPDATE createdAcc SET connectedAcc = 1 WHERE userName = ?';
            db.run(updateQuery, [userName], (error) => {
                if (error) {
                    console.error('Error updating the value of connectedAcc:', error);
                    response.status(500).json({ status: 'failure' });
                    return;
                }
                response.json({ status: 'success' });
            });
        } else {
            response.json({ status: 'failure' });
        }
    });
});

app.post('/api/updateInfo', (request, response) => {
    console.log("I GOT A REQUEST");
    console.log(request.body);

    const summonerName = request.body.inputValue;
    const server = request.body.selectedValue;
    const userName = request.body.userName;
    const rank = request.body.rank;

    const sql = 'UPDATE createdAcc SET summonerName = ?, server = ?, rank = ? WHERE userName = ?';
    const values = [summonerName, server, rank, userName];

    db.run(sql, values, function (err) {
        if (err) {
            console.log(err);
            response.json({ status: "error" });
        } else {
            console.log("Data updated successfully");
            response.json({
                status: "success",
                summonerName: summonerName,
                server: server,
                userName: userName,
                rank: rank
            });
        }
    });
});

app.post('/api/updatePic', (request, response) => {
    const userName = request.body.userName;
    const picURL = request.body.picURL;

    const sql = 'UPDATE createdAcc SET picURL = ? WHERE userName = ?';
    const values = [picURL, userName];

    db.run(sql, values, function (err) {
        if (err) {
            console.log(err);
            response.json({ status: "error" });
        } else {
            console.log("Data updated successfully");
            response.json({
                status: "success",
                userName: userName,
                picURL: picURL
            });
        }
    });
});

app.get('/api/activeUsers', (request, response) => {
    const userName = request.query.userName;
    const query = 'SELECT summonerName, server, rank FROM createdAcc WHERE userName = ?';

    db.get(query, [userName], (error, row) => {
        if (error) {
            response.status(500).json({ status: 'failure', error: 'An error occurred.' });
        } else if (row) {
            const { summonerName, server, rank } = row;
            response.json({ status: 'success', summonerName, server, rank });
        } else {
            response.json({ status: 'failure', error: 'No user found.' });
        }
    });
});

app.post('/api/activeUsers', (request, response) => {
    const { smName, srv } = request.body;
    const query = 'SELECT * FROM activeUsers WHERE summonerName = ? AND server = ?';

    db.get(query, [smName, srv], (error, row) => {
        if (error) {
            response.status(500).json({ status: 'failure', error: 'An error occurred.' });
        } else if (row) {
            response.json({ status: 'success', data: row });
        } else {
            response.json({ status: 'failure', error: 'No user found.' });
        }
    });
});

app.post('/api/activeUsers/drop', (request, response) => {
    const { smName, srv } = request.body;
    const query = 'DELETE FROM activeUsers WHERE summonerName = ? AND server = ?';

    db.run(query, [smName, srv], function (error) {
        if (error) {
            response.status(500).json({ status: 'failure', error: 'An error occurred.' });
        } else if (this.changes > 0) {
            response.json({ status: 'success', message: 'User deleted successfully.' });
        } else {
            response.json({ status: 'failure', error: 'No user found.' });
        }
    });
});

app.get('/check-updates', (req, res) => {
    const sql = 'SELECT COUNT(*) AS rowCount FROM activeUsers';

    db.get(sql, (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error checking for updates' });
        } else {
            const rowCount = row.rowCount;

            if (req.session.previousRowCount === undefined) {
                req.session.previousRowCount = rowCount;
            }

            if (rowCount !== req.session.previousRowCount) {
                req.session.previousRowCount = rowCount;
                console.log("UPDATING");
                res.json({ hasChanged: true });
            } else {
                res.json({ hasChanged: false });
            }
        }
    });
});

app.post('/api/hash', async (req, res) => {
    try {
        const { password } = req.body;

        const salt = await bcrypt.genSalt(10);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, salt);

        res.json({ hashedPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/checkConnected', (req, res) => {
    const userName = req.body.userName;

    const sql = `SELECT connectedAcc FROM createdAcc WHERE userName = ?`;
    const values = [userName];

    db.get(sql, values, function (err, row) {
        if (err) {
            console.error(err);
            res.json({ status: 'error' });
        } else {
            if (row && row.connectedAcc === 1) {
                res.json({ status: true });
            } else {
                res.json({ status: false });
            }
        }
    });
});

app.post('/removeContent', (req, res) => {
    const userName = req.body.userName;

    const sql = `UPDATE createdAcc SET summonerName = '', server = '', rank = '', connectedAcc = 0 WHERE userName = ?`;
    const values = [userName];

    db.run(sql, values, function (err) {
        if (err) {
            console.error(err);
            res.json({ status: 'error' });
        } else {
            res.json({ status: 'success' });
        }
    });
});

app.get('/api/createdAcc/:userName', (req, res) => {
    const userName = req.params.userName;
    console.log("IGOTREQUEST");
    console.log(userName);
    db.get('SELECT summonerName, connectedAcc FROM createdAcc WHERE userName = ?', [userName], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(row);
        }
    });
});








