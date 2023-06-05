

const OpenNoConnectionPopup = () => {
    const noConnectionPopup = document.getElementById("noConnectionPopup");
    noConnectionPopup.classList.add("open-popup");
}

const closeNoConnectionPopup = () => {
    const noConnectionPopup = document.getElementById("noConnectionPopup");
    noConnectionPopup.classList.remove("open-popup");
}


export function checkForUpdates() {
    fetch('/check-updates')
        .then(response => response.json())
        .then(data => {
            if (data.hasChanged) {
                console.log("UPDATE");
                location.reload(); 
            }
            closeNoConnectionPopup();
        })
        .catch(error => {
            console.error('Error checking for updates:', error);
            OpenNoConnectionPopup();
        });
}


setInterval(checkForUpdates, 5000);
