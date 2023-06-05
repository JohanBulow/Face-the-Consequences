const mySelect = document.getElementById("format");
const myInput = document.getElementById("myInput");
const myButton = document.getElementById("myButton");
const dropAcc = document.getElementById("dropAcc");

const dropActiveButton = document.getElementById('dropActiveButton');

const dropActiveButtonMOB = document.getElementById('dropActiveButtonMOB');

const apiKey = "RGAPI-fc1be595-0898-47ef-a8b1-51f885500cd0"

const updateInfo = async (userName, summonerName, server, rank) => {
    try {
        const response = await fetch('/api/updateInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: userName,
                inputValue: summonerName,
                selectedValue: server,
                rank: rank,
            }),
        });
        console.log("HJE");
        if (response.ok) {
            const data = await response.json();
            if (data.status == 'success')
            {
                openAccountAddedPopup();
            }
            console.log(data);
        } else {
            console.log('Request failed:', response.status);
        }
    } catch (error) {
        console.error('Request error:', error);
    }
};

const openConnectPopup = () => {
    const connectPopup = document.getElementById("connectPopup");
    connectPopup.classList.add("open-popup");
}

const closeConnectPopup = () => {
    const connectPopup = document.getElementById("connectPopup");
    connectPopup.classList.remove("open-popup");
}

const openAccountAddedPopup = () => {
    const accountAddedPopup = document.getElementById("accountAddedPopup");
    accountAddedPopup.classList.add("open-popup");
}

const closeAccountAddedPopup = () => {
    const accountAddedPopup = document.getElementById("accountAddedPopup");
    accountAddedPopup.classList.remove("open-popup");
    location.reload();
}

const openNoAccountAddedPopup = () => {
    const noAccountAddedPopup = document.getElementById("noAccountAddedPopup");
    noAccountAddedPopup.classList.add("open-popup");
}

const closeNoAccountAddedPopup = () => {
    const noAccountAddedPopup = document.getElementById("noAccountAddedPopup");
    noAccountAddedPopup.classList.remove("open-popup");
}

const openAccountRemovedPopup = () => {
    const accountRemovedPopup = document.getElementById("accountRemovedPopup");
    accountRemovedPopup.classList.add("open-popup");
}

const closeAccountRemovedPopup = () => {
    const accountRemovedPopup = document.getElementById("accountRemovedPopup");
    accountRemovedPopup.classList.remove("open-popup");
    location.reload();
}



myButton.addEventListener("click", async function () {
    const selectedValue = mySelect.value;
    const inputValue = myInput.value;
    const userName = sessionStorage.getItem("userName");
    const check = await CheckIfConnected();
    if (check) {
        console.log("Selected value:", selectedValue);
        console.log("Input value:", inputValue);
        if (selectedValue !== "" && inputValue !== "") {
            // Get the encrypted summoner ID from the summoner name
            fetch(`https://${selectedValue}1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${inputValue}?api_key=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    const encryptedSummonerId = data.id;
                    console.log(`Encrypted Summoner ID: ${encryptedSummonerId}`);

                    // Use the encrypted summoner ID to get the players rank
                    fetch(`https://${selectedValue}1.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${apiKey}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.length > 0) {
                                const rank = data[0].tier;
                                console.log(`Current rank: ${rank}`);

                                // Send data to web server
                                const postData = {
                                    rank: rank,
                                    selectedValue: selectedValue,
                                    inputValue: inputValue
                                };
                                console.log(postData);
                                console.log("HJE");
                                updateInfo(userName, inputValue, selectedValue, rank);

                                fetch('/api', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(postData)
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.status == 'success')
                                        {
                                            openAccountAddedPopup();
                                        }
                                        console.log(data);
                                    })
                                    .catch(error => console.error(error));
                            } else {
                                console.log("This player is currently unranked.");
                            }
                        })
                        .catch(error => console.error(error));
                })
                .catch(error => console.error(error));
        } else {
            console.log("Please fill in both fields.");
        }
    } else {
        openConnectPopup();
    }
});

dropAcc.addEventListener("click", async function () {
    const userName = sessionStorage.getItem('userName');
    dropFromTable();
    const response = await fetch('/checkConnected', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName }),
    });
    const { status } = await response.json();

    if (status === true) {
        try {
            const response = await fetch('/removeContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName }),
            });

            const data = await response.json();
            if (data.status == 'success')
            {
                openAccountRemovedPopup();
            }
            console.log(data); 
        } catch (error) {
            console.error(error);
        }
    } else {
        openNoAccountAddedPopup();
    }
});


async function CheckIfConnected() {
    try {
        const userName = sessionStorage.getItem("userName");
        const response = await fetch(`/api/check0?userName=${userName}`);
        const info = await response.json();
        if (info.status === "success") {
            return true;
        }
        } catch (error) {
            console.error(error);
            return false;
        }
}



function dropFromTable() {
    const userName = sessionStorage.getItem("userName");
    console.log(userName)
    dropActiveUser();
    async function dropActiveUser(data) {
        try {

            const response = await fetch(`/api/activeUsers?userName=${userName}`);

            const info = await response.json();
            console.log("CHEKING INFO.STATUS")
            console.log(info);

            if (info.status === 'success' && info.summonerName !== null && info.server !== null && info.rank !== null) {
                fetch('/api/activeUsers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        smName: info.summonerName,
                        srv: info.server,
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        
                        fetch('/api/activeUsers/drop', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                smName: info.summonerName,
                                srv: info.server,
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                
                                if (data.status == "success") {
                                    //popup
                                    console.log("POPUP");
                                    console.log(data);
                                    dropActiveButton.classList.remove('show');
                                    dropActiveButton.classList.add('hide');
                                    dropActiveButtonMOB.classList.remove('show');
                                    dropActiveButtonMOB.classList.add('hide');
                                }
                            })
                            .catch(error => console.error(error));
                    })
                    .catch(error => console.error(error));

            }
            if (info.status === "failure") {
                //popup
            }
        } catch (error) {
            console.error(error);
        }
    }
}



