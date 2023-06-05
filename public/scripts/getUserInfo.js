const apiKey = "RGAPI-fc1be595-0898-47ef-a8b1-51f885500cd0";


const openTwoManyPopupPopup = () => {
    twoManyPopup.classList.add("open-popup");
}

const closeTwoManyPopupPopup = () => {
    twoManyPopup.classList.remove("open-popup");
}


document.addEventListener('DOMContentLoaded', () => {
    console.log("Page loaded");
    getData();

    async function getData() {
        try {
            const response = await fetch('/api');
            const data = await response.json();
            console.log(data);

            const parentDiv = document.querySelector('.herobox');
            for (const item of data) {
                const icon = await getIcon(item.summonerName, item.server);
                const top3 = await getTopChampionMastery(item.summonerName, item.server);
                const { imageUrl, boxShadowColor } = getRank(item.rank);
                const card = document.createElement('div');
                card.classList.add('card');
                let imageSource = '';
                card.style.boxShadow = `0px 0px 30px ${boxShadowColor}`;
                if (item.server === 'na') {
                    imageSource = 'images/usflag.jpg';
                } else {
                    imageSource = 'images/euflaghorizontal.jpg';
                }
                card.innerHTML = `
                    <div class="imgWrap">
                        <img src="${imageSource}" alt="">
                    </div>
                    <div class="leftpart">
                        <div class="profPic">
                            <img src="${icon}">
                        </div>
                        <div class="userInfo">
                            <div class="Align">
                                <div class="userNameAlign">
                                    <h2 class="userName">${item.summonerName}</h2>
                                </div>
                                <div class="rankPart">
                                    <div class="rankPic">
                                        <img src="${imageUrl}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rightPart">
                        <div class="mostPlayed">
                            <h3>Most Played</h3>
                            <div class="imgWrapper">
                                <img src="${top3[0]}" class="zoomed-image" alt="">
                                <img src="${top3[1]}" class="zoomed-image" alt="">
                                <img src="${top3[2]}" class="zoomed-image" alt="">
                            </div>
                        </div>
                    </div>
                `;

                parentDiv.appendChild(card);

                const container = document.querySelector('.container');
                const currentMinHeight = parseInt(getComputedStyle(container).getPropertyValue('min-height'));
                const newMinHeight = currentMinHeight + 80;
                container.style.minHeight = newMinHeight + 'px';
            }
        } catch (error) {
            openTwoManyPopupPopup();
            console.error(error);
        }
    }
});

function getIcon(sName, serv) {
    let summonerIconUrl = ''
    return fetch(`https://${serv}1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${sName}?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const id = data.profileIconId;
            summonerIconUrl = `https://ddragon.leagueoflegends.com/cdn/13.9.1/img/profileicon/${id}.png`;
            return summonerIconUrl;
        })
        .catch((error) => {
            openTwoManyPopupPopup();
            console.error('An error occurred (error code 1):', error);
        });
}

function getRank(rank) {
    let imageUrl = '';
    let boxShadowColor = '';

    if (rank == "BRONZE") {
        imageUrl = 'images/emblem-bronze.png';
        boxShadowColor = 'rgba(205, 127, 50, 0.9)';
    } else if (rank == "SILVER") {
        imageUrl = 'images/emblem-silver.png';
        boxShadowColor = 'rgba(192, 192, 192, 0.9)';
    } else if (rank == "GOLD") {
        imageUrl = 'images/emblem-gold.png';
        boxShadowColor = 'rgba(255, 215, 0, 0.9)';
    } else if (rank == "PLATINUM") {
        imageUrl = 'images/emblem-platinum.png';
        boxShadowColor = 'rgba(31, 104, 76, 0.9)';
    } else if (rank == "DIAMOND") {
        imageUrl = 'images/emblem-diamond.png';
        boxShadowColor = 'rgba(8, 90, 161, 0.9)';
    } else if (rank == "MASTER") {
        imageUrl = 'images/emblem-master.png';
        boxShadowColor = 'rgba(76, 16, 113, 0.9)';
    } else if (rank == "GRANDMASTER") {
        imageUrl = 'images/emblem-grandmaster.png';
        boxShadowColor = 'rgba(246, 23, 23, 0.9)';
    } else if (rank == "CHALLENGER") {
        imageUrl = 'images/emblem-challenger.png';
        boxShadowColor = 'rgba(243, 151, 14, 0.9)';
    }
    return { imageUrl, boxShadowColor };
}

function getTopChampionMastery(sName, serv) {
    return fetch(`https://${serv}1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${sName}?api_key=${apiKey}`)
        .then((response) => response.json())
        .then((summonerData) => {
            const encryptedSummonerId = summonerData.id;
            return fetch(`https://${serv}1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${encryptedSummonerId}?api_key=${apiKey}`)
                .then((response) => response.json())
                .then((championMasteryData) => {
                    if (championMasteryData.length > 0) {
                        const top3ChampionIcons = championMasteryData
                            .slice(0, 3)
                            .map((mastery) => {
                                const championId = mastery.championId;
                                return fetch(`https://ddragon.leagueoflegends.com/cdn/11.14.1/data/en_US/champion.json`)
                                    .then((response) => response.json())
                                    .then((championData) => {
                                        const championDataValues = Object.values(championData.data);
                                        const champion = championDataValues.find((champ) => champ.key === championId.toString());
                                        if (champion) {
                                            const championIconUrl = `https://ddragon.leagueoflegends.com/cdn/11.14.1/img/champion/${champion.image.full}`;
                                            return championIconUrl;
                                        }
                                        return null;
                                    });
                            });

                        return Promise.all(top3ChampionIcons);
                    } else {
                        return [];
                    }
                });
        })
        .catch((error) => {
            openTwoManyPopupPopup();
            console.error('An error occurred (error code 1):', error);
        });
}


