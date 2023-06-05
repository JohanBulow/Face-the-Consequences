const loadName = () => {
    const userName = sessionStorage.getItem("userName");

    userNamePlaceholder.style.display = "block";
    userNamePlaceholder.textContent = userName;
}

window.addEventListener("load", function () {
    loadName();
});