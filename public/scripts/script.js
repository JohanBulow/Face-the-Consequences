$(document).ready(function () {
    $('.burgermenu').on('click', function () {
        $('.mob-nav').slideToggle();
    });
});

const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});

function attachEventListenersToMobileButtons() {
    const navButtons = document.querySelectorAll('.mob-nav .navbutton');

    navButtons.forEach((button) => {
        button.addEventListener('click', () => {
            wrapper.classList.add('active-popup');
        });
    });
}


attachEventListenersToMobileButtons();