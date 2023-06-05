/*let profilePic = document.getElementById("profile-pic");
let inputFile = document.getElementById("input-file");

inputFile.onchange = function(){
    profilePic.src = URL.createObjectURL(inputFile.files[0])
}*/

function updateProfilePic() {
    const userName = sessionStorage.getItem("userName");
    const fileExtension = ".jpg";


    fetch('/api/updatePic', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userName: userName,
            picURL: userName + fileExtension
        })
    })
        .then(response => response.json())
        .then(data => {
     
            console.log(data);
        })
        .catch(error => console.error(error));
}

function loadProfilePic() {
    const userName = sessionStorage.getItem("userName");
    const fileExtension = ".jpg";
    const imageUrl = `faces/${userName}${fileExtension}`;

 
    fetch(imageUrl)
        .then(response => {
            if (response.ok) {

                sessionStorage.setItem("userImage", `${userName}${fileExtension}`);

                
                const profilePic = document.getElementById("profile-pic");
                profilePic.src = imageUrl;
            } else {

                console.log("Image file does not exist");
            }
        })
        .catch(error => {
            console.error(error);
        });
}

window.onload = function () {
    loadProfilePic();
};