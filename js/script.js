document.getElementById("logo").addEventListener("click", openRepositorie);
var imgClicked = false;

function openRepositorie() {
    const { shell } = require('electron')
    shell.openExternal('https://github.com/Aircoookie/WLED')
}

function showLights() {
    var lights = JSON.parse(localStorage.getItem("lights"));
    var txt = "";
    for (let index = 0; index < lights.length; index++) {
        const element = lights[index];
        txt += "<div class=\"light\" onclick=\"goToWled(" + index + ")\" style=\"cursor: pointer;\">\n<br>\n";
        txt += "<img src=\"icon_power.png\" id=\"img" + index + "\" class=\"icon\" onclick=\"toggleLight(" + index + ");\" height=75>\n";
        txt += "<h5>" + element.name + "</h5>\n" + element.ip;
        if (element.online === false) {
            txt += " (Offline)\n";
        }
        txt += "<br><br></div><hr>";
    }
    document.getElementById("lights").innerHTML = txt;
}

function showLightsDel() {
    var lights = JSON.parse(localStorage.getItem("lights"));
    var txt = "";
    for (let index = 0; index < lights.length; index++) {
        const element = lights[index];
        txt += "<div class=\"light\">\n<br>\n";
        txt += "<img src=\"icon_delete.png\" onclick=\"del(" + index + ")\" class=\"icon del\" height=75>\n";
        txt += "<h5>" + element.name + "</h5>\n" + element.ip + "\n";
        txt += "<br><br></div><hr>";
    }
    document.getElementById("lights").innerHTML = txt;
}

function getStatus() {
    var lights = JSON.parse(localStorage.getItem("lights"));
    for (let index = 0; index < lights.length; index++) {
        const ip = lights[index].ip;

        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://' + ip + "/json/state", true);
        xhr.onload = function () {
            lights[index].online = true;
            localStorage.setItem("lights", JSON.stringify(lights));
            var json = JSON.parse(xhr.response);
            var on = json.on;
            if (on === true) {
                document.getElementById("img" + index).classList.add("on"); 
            }
            else {
                document.getElementById("img" + index).classList.remove("on"); 
            }
        };
        xhr.onerror = function () {
            lights[index].online = false;
            localStorage.setItem("lights", JSON.stringify(lights));
        }
        xhr.send();
    }
    showLights();
}

function goToWled(index) {
    if (imgClicked !== true) {
        var lights = JSON.parse(localStorage.getItem("lights"));
        var ip = lights[index].ip;
        localStorage.setItem("locIp", ip);
        location.href = "wled-viewer.html";
    }
}

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

function addIP() {
    var ip = document.getElementById("ip").value;
    console.log(ip);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://' + ip + '/json/info', true);
    xhr.timeout = 2000; // time in milliseconds
    xhr.onreadystatechange = function () { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
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
    }
    function error() {
        M.toast({html: 'Error! Can\'t connect to WLED.'});
    }
    xhr.onerror = error();
    xhr.send();
}

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