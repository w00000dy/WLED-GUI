document.getElementById("logo").addEventListener("click", openRepositorie);
// the imgClicked variable prevents the goToWled() function from beeing triggerd when clicking in a button
var imgClicked = false;

// Default PC Mode on
if (localStorage.getItem("pcm") === null) {
    localStorage.setItem("pcm", true);
}

// Opens Github page in defalt browser
function openRepositorie() {
    const { shell } = require('electron')
    shell.openExternal('https://github.com/Aircoookie/WLED')
}

// Shows all Lighs in main page
function showLights() {
    var lights = JSON.parse(localStorage.getItem("lights"));
    var txt = "";
    var oldTxt = document.getElementById("lights").innerHTML;
    for (let index = 0; index < lights.length; index++) {
        const element = lights[index];
        txt += "<div class=\"light\" onclick=\"goToWled(" + index + ")\" style=\"cursor: pointer;\">\n<br>\n";
        txt += "<img src=\"images/icon_power.png\" id=\"img" + index + "\" class=\"icon ";
        if (element.on === true) {
            txt += "on";
        }
        txt += "\" onclick=\"toggleLight(" + index + ");\" height=\"75\">\n";
        txt += "<h5>" + element.name + "</h5>\n" + element.ip;
        if (element.online === false) {
            txt += " (Offline)\n";
        }
        txt += "<br><br></div><hr>";
    }
    if (txt !== oldTxt) {
        document.getElementById("lights").innerHTML = txt;
    }
}

// Shows all Lighs in delete page
function showLightsDel() {
    var lights = JSON.parse(localStorage.getItem("lights"));
    var txt = "";
    for (let index = 0; index < lights.length; index++) {
        const element = lights[index];
        txt += "<div class=\"light\">\n<br>\n";
        txt += "<img src=\"images/icon_delete.png\" onclick=\"del(" + index + ")\" class=\"icon del\" height=75>\n";
        txt += "<h5>" + element.name + "</h5>\n" + element.ip;
        if (element.online === false) {
            txt += " (Offline)\n";
        }
        txt += "<br><br></div><hr>";
    }
    document.getElementById("lights").innerHTML = txt;
}

// get the status of lights
// check if on or off and connection to them
function getStatus() {
    var lights = JSON.parse(localStorage.getItem("lights"));
    for (let index = 0; index < lights.length; index++) {
        const ip = lights[index].ip;

        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://' + ip + "/json/state", true);
        xhr.onload = function () {
            var json = JSON.parse(xhr.response);
            lights[index].online = true;
            lights[index].on = json.on;
            localStorage.setItem("lights", JSON.stringify(lights));
            showLights();
        };
        xhr.onerror = function () {
            lights[index].online = false;
            localStorage.setItem("lights", JSON.stringify(lights));
            showLights();
        }
        xhr.send();
    }
}

// opens the WLED page and set the correct ip address to localstorage
function goToWled(index) {
    // doesent trigger when a button is clicked
    if (imgClicked !== true) {
        var lights = JSON.parse(localStorage.getItem("lights"));
        var ip = lights[index].ip;
        localStorage.setItem("locIp", ip);
        location.href = "wled-viewer.html";
    }
}

// toggels the light
function toggleLight(index) {
    imgClicked = true;
    var lights = JSON.parse(localStorage.getItem("lights"));
    var ip = lights[index].ip;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://' + ip + "/win&T=2", true);
    xhr.onload = function () {
        imgClicked = false;
        getStatus();
    };
    xhr.send();
}

// adds a light and save it to localstorge
// gets data from json api
function addIP() {
    var ip = document.getElementById("ip").value;
    console.log(ip);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://' + ip + '/json/info', true);
    xhr.timeout = 2000; // time in milliseconds
    xhr.onload = function () { // Call a function when the state changes.
        var json = JSON.parse(xhr.response);
        var name = json.name;
        if (localStorage.getItem("lights") === null) {
            console.log("No local storage item found. Creating one...");
            var light = { "name": name, "ip": ip, "online": true };
            var lights = [light];
            json = JSON.stringify(lights);
            localStorage.setItem("lights", json);
        } else {
            var light = { "name": name, "ip": ip, "online": true };
            var lights = JSON.parse(localStorage.getItem("lights"));
            console.log(lights);
            lights.push(light);
            json = JSON.stringify(lights);
            localStorage.setItem("lights", json);
        }
        location.href = "index.html";
    }
    xhr.onerror = function () {
        M.toast({ html: 'Error! Can\'t connect to WLED.' });
    }
    xhr.send();
}

// deletes a light from localstorage
function del(index) {
    var lights = JSON.parse(localStorage.getItem("lights"));
    lights.splice(index, 1);
    localStorage.setItem("lights", JSON.stringify(lights));
    showLightsDel();
}

function sync() {
    getStatus();
    setTimeout(sync, 1000);
}