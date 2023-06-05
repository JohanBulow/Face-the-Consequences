const dropActiveButton = document.getElementById('dropActiveButton');

const dropActiveButtonMOB = document.getElementById('dropActiveButtonMOB');

const openDropUserPopup = () => {
    const dropUserPopup = document.getElementById("dropUserPopup");
    dropUserPopup.classList.add("open-popup");
}

const closeDropUserPopup = () => {
    const dropUserPopup = document.getElementById("dropUserPopup");
    dropUserPopup.classList.remove("open-popup");
}


window.onload = () => {
    const userName = sessionStorage.getItem("userName");

    dropActiveUser();

    async function dropActiveUser(data) {
        try {

            const response = await fetch(`/api/activeUsers?userName=${userName}`);

            const info = await response.json();
            console.log(info);

            if (info.status === 'success' && info.summonerName !== null && info.server !== null && info.rank !== null) {
                fetch('/api/activeUsers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        smName: info.summonerName,
                        srv : info.server,
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status == 'success')
                        {
                            dropActiveButton.classList.remove('hide');
                            dropActiveButton.classList.add('show');
                            dropActiveButtonMOB.classList.remove('hide');
                            dropActiveButtonMOB.classList.add('show');
                        } else {
                            dropActiveButton.classList.remove('show');
                            dropActiveButton.classList.add('hide');
                            dropActiveButtonMOB.classList.remove('show');
                            dropActiveButtonMOB.classList.add('hide');
                        }
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

dropActiveButton.addEventListener('click', function () {
    dropFromTable();
});

dropActiveButtonMOB.addEventListener('click', function () {
    console.log("TEST")
    dropFromTable();
});

function dropFromTable() {
    const userName = sessionStorage.getItem("userName");
    dropActiveUser();

    async function dropActiveUser(data) {
        try {

            const response = await fetch(`/api/activeUsers?userName=${userName}`);

            const info = await response.json();
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
                                
                                if (data.status == "success")
                                {
                                    //popup
                                    console.log("POPUP");
                                    console.log(data);
                                    dropActiveButton.classList.remove('show');
                                    dropActiveButton.classList.add('hide');
                                    dropActiveButtonMOB.classList.remove('show');
                                    dropActiveButtonMOB.classList.add('hide');
                                    openDropUserPopup();
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