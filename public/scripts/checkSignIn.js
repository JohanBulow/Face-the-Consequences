
const logoutButton = document.getElementById("logoutButton");

const logoutButtonMOB = document.getElementById("logoutButtonMOB");

logoutButton.addEventListener("click", function (event) {

    event.preventDefault();

    sessionStorage.setItem("isLoggedIn", false.toString());
    sessionStorage.removeItem('userName');

    console.log("HERE");
    console.log(isUserLoggedIn());
    loadButtons();
    loadUserName();

    window.location.href = "index.html";
});


function isUserLoggedIn() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const userName = sessionStorage.getItem("userName");
    return isLoggedIn && userName && JSON.parse(isLoggedIn);
}

const loadButtons = () => {
    const logoutButton = document.getElementById("logoutButton");
    const logoutButtonMOB = document.getElementById("logoutButtonMOB");
    const loginButton = document.getElementById("loginButton");
    const loginButtonMOB = document.getElementById("loginButtonMOB");
    const connectAccButton = document.getElementById("connectAcc");
    const connectAccButtonMOB = document.getElementById("connectAccMOB"); 
    if (isUserLoggedIn())
    {
        logoutButton.style.display = "inline-block";
        logoutButtonMOB.style.display = "inline-block";
        loginButton.style.display = "none";
        loginButtonMOB.style.display = "none";
        connectAccButton.style.display = "inline-block";
        connectAccButtonMOB.style.display = "inline-block";
    } else {
        console.log("SETTING FALSE");
        logoutButton.style.display = "none";
        logoutButtonMOB.style.display = "none";
        loginButton.style.display = "inline-block";
        loginButtonMOB.style.display = "inline-block";
        connectAccButton.style.display = "none";
        connectAccButtonMOB.style.display = "none";
    }
}

const loadUserName = () => {
    const userName = sessionStorage.getItem("userName");
    const signedInSection = document.getElementById("signedInSection");
    const userNameElement = document.getElementById("userName");
    if (isUserLoggedIn()) {
        signedInSection.style.display = "block";
        userNameElement.textContent = userName;
    } else {
        signedInSection.style.display = "none";
    }
}

// Call the function when the page loads or whenever necessary
window.addEventListener("load", function () {
    loadButtons();
    loadUserName();
});

logoutButtonMOB.addEventListener("click", function (event) {
    // Prevent the default link behavior
    event.preventDefault();

    // Clear the session storage
    sessionStorage.setItem("isLoggedIn", false.toString());
    sessionStorage.removeItem('userName');
    // Perform any additional sign out actions if needed
    console.log("HERE");
    console.log(isUserLoggedIn());
    loadButtons();
    loadUserName();
    // Redirect the user to the desired page
    window.location.href = "index.html";
});