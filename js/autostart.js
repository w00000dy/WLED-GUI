//    This is used to turn on lights automatically at startup

var lights = JSON.parse(localStorage.getItem("lights"));
var needAutostart = [];
for (let index = 0; index < lights.length; index++) {
    let autostart = lights[index].autostart;
    if (autostart) {
        let ip = lights[index].ip;
        needAutostart.push(ip);
    }
}

console.log(needAutostart.length);

if (needAutostart.length === 0) {
    window.close();
} else {
    for (let index = 0; index < needAutostart.length; index++) {
        let ip = needAutostart[index];
        console.log("Turn on " + ip);
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://' + ip + "/win&T=1", true);
        xhr.onload = function () {
            if (index === (needAutostart.length - 1)) {
                console.log("close");
                window.close();
            }
        };
        xhr.send();
    }
}