

const regBtn = document.getElementById("regBtn");
const myName = document.getElementById("nameField");
const myPW = document.getElementById("pwField");

const lgnBtn = document.getElementById("lgnBtn");
const lgnName = document.getElementById("lgnName");
const lgnPW = document.getElementById("lgnPW");

const hashPassword = async (password) => {
    try {
        const response = await fetch('/api/hash', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        const { hashedPassword } = await response.json();
        return hashedPassword;
    } catch (error) {
        console.error(error);
    }
};

regBtn.addEventListener("click", async function (event) {
    event.preventDefault();

    const pw = myPW.value;
    const name = myName.value;
  
    if (pw.trim() === '') {

        openBadPWPopup();
        console.log('Password cannot be empty');
        return;
    }
    // Hash the password
    const hashedPW = await hashPassword(pw);

    const data = { name, pw: hashedPW };
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    fetch('/api/reg', options)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.status == 'success') {
                openSuccessRegisterPopup();
            }
            if (data.status == 'error') {
                openPopup();
            }
            if (data.status == 'failure') {
                openBadPWPopup();
            }
        })
        .catch(error => {
            console.error(error);
        });
});


const openBadPWPopup = () => {
    const BadPWPopup = document.getElementById("BadPWPopup");
    BadPWPopup.classList.add("open-popup");
}

const closeBadPWPopup = () => {
    const BadPWPopup = document.getElementById("BadPWPopup");
    BadPWPopup.classList.remove("open-popup");
}

const openSuccessLoginPopup = () => {
    const successLoginPopup = document.getElementById("successLoginPopup");
    successLoginPopup.classList.add("open-popup");
}

const closeSuccessLoginPopup = () => {
    const successLoginPopup = document.getElementById("successLoginPopup");
    successLoginPopup.classList.remove("open-popup");
    window.location.href = "/index.html";
}

const openSuccessRegisterPopup = () => {
    const successRegisterPopup = document.getElementById("successRegisterPopup");
    successRegisterPopup.classList.add("open-popup");
}

const closeSuccessRegisterPopup = () => {
    const successRegisterPopup = document.getElementById("successRegisterPopup");
    successRegisterPopup.classList.remove("open-popup");
}

const openPopup = () => {
    const popup = document.getElementById("popup");
    popup.classList.add("open-popup");
}

const closePopup = () => {
    const popup = document.getElementById("popup");
    popup.classList.remove("open-popup");
}

const openLoginPopup = () => {
    const LoginPopup = document.getElementById("LoginPopup");
    LoginPopup.classList.add("open-popup");
}

const closeLoginPopup = () => {
    const LoginPopup = document.getElementById("LoginPopup");
    LoginPopup.classList.remove("open-popup");
}

async function login(data) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const { status, userName } = await response.json(); 

        if (status === 'success') {
            sessionStorage.setItem('isLoggedIn', true);
            sessionStorage.setItem('userName', userName); 


            openSuccessLoginPopup();

        } else if (status === 'failure') {
            console.log(status);
            openLoginPopup();
        }
    } catch (error) {
        console.error(error);
    }
}

lgnBtn.addEventListener('click', function (event) {
    event.preventDefault();

    const lgnname = lgnName.value;
    const lgnpw = lgnPW.value;
    const data = { userName: lgnname, password: lgnpw };
    login(data);
});