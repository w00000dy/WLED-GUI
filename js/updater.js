checkForUpdate();

// checks if a update is available
function checkForUpdate() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://raw.githubusercontent.com/WoodyLetsCode/WLED-GUI/master/VERSION', true);
    xhr.onload = function () {
        console.log();
        if (xhr.response !== version && (localStorage.getItem("remindLaterTime") === null || (Date.now() - localStorage.getItem("remindLaterTime")) >= 259200000)) { // 3 days
            console.log("New update avaiable!");
            let instance = M.Modal.getInstance(document.getElementById("updatePopup"));
            document.getElementById("updatePopupText").innerText = "A new update for WLED-GUI is available.\n\nYour version: " + version + "\nLatest version: " + xhr.response;
            instance.open();
        }
    };

    xhr.send();
}