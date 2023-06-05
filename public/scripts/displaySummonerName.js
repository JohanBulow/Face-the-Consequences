const summonerNamePlaceholder = document.getElementById('summonerNamePlaceholder');

const logUserName = sessionStorage.getItem('userName');

async function fetchSummonerName() {
    try {
        const response = await fetch(`/api/createdAcc/${logUserName}`);
        const data = await response.json();

        if (data.connectedAcc === 1) {
            console.log("TRUEE")
            summonerNamePlaceholder.textContent = data.summonerName;
        }
    } catch (error) {
        console.error(error);
    }
}

window.addEventListener('load', () => {
    fetchSummonerName();
});