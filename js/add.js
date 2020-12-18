// event listners for dicover light buttons
document.getElementById("discoverLightsButton").addEventListener("click", toggleBonjour);
// event listners for scan select field
document.getElementById("scanMethod").addEventListener("change", checkMethod);

// search for wled devices and add them
function scan(bonjour) {
    if (document.getElementById("scanMethod").value === "bruteforce") {
        console.log("Scan method: bruteforce");
        var os = require('os');

        var interfaces = os.networkInterfaces();
        var addresses = [];
        console.log(interfaces);
        for (var k in interfaces) {
            for (var k2 in interfaces[k]) {
                var address = interfaces[k][k2];
                if (address.family === 'IPv4' && !address.internal) {
                    addresses.push(address.address);
                }
            }
        }

        console.log(addresses);

        for (let index = 0; index < addresses.length; index++) {
            const element = addresses[index];
            var subnet = element.slice(0, element.lastIndexOf(".") + 1);
            for (let index = 0; index < 255; index++) {
                let ip = subnet + index;
                let xhr = new XMLHttpRequest();
                xhr.open("GET", 'http://' + ip + '/json/info', true);
                xhr.timeout = 2000; // time in milliseconds
                xhr.onload = function () { // Call a function when the state changes.
                    try {
                        var json = JSON.parse(xhr.response);
                    }
                    catch {
                        var json = { "brand": null };
                    }
                    if (json.brand === "WLED" && checkIP(ip) === false) {
                        var name = json.name;
                        var light = { "name": name, "ip": ip, "online": true };
                        var lights = JSON.parse(localStorage.getItem("lights"));
                        lights.push(light);
                        json = JSON.stringify(lights);
                        localStorage.setItem("lights", json);

                        M.toast({ html: 'Found ' + name });
                    }
                }
                xhr.onerror = null;
                xhr.send();
            }
        }
    }
    if (document.getElementById("scanMethod").value === "bonjour") {
        console.log("Scan method: bonjour");

        // browse for all http services
        bonjour.find({ type: "http" }, function (service) {
            console.log('IP: ', service["addresses"][0])

            let ip = service["addresses"][0];
            let xhr = new XMLHttpRequest();
            xhr.open("GET", 'http://' + ip + '/json/info', true);
            xhr.timeout = 2000; // time in milliseconds
            xhr.onload = function () { // Call a function when the state changes.
                try {
                    var json = JSON.parse(xhr.response);
                }
                catch {
                    var json = { "brand": null };
                }
                if (json.brand === "WLED" && checkIP(ip) === false) {
                    var name = json.name;
                    var light = { "name": name, "ip": ip, "online": true };
                    var lights = JSON.parse(localStorage.getItem("lights"));
                    lights.push(light);
                    json = JSON.stringify(lights);
                    localStorage.setItem("lights", json);

                    M.toast({ html: 'Found ' + name });
                }
            }
            xhr.onerror = null;
            xhr.send();
        })
    }
}

// check if a device with the ip already exists
function checkIP(targetIp) {
    function comparison(device) {
        return device.ip == targetIp;
    }
    let lights = JSON.parse(localStorage.getItem("lights"));
    if (typeof lights.find(comparison) !== "undefined") {
        return true;
    } else {
        return false;
    }
}

// toggle the bonjour
function toggleBonjour() {
    if (document.getElementById("scanMethod").value === "bonjour") { // only show animation for bonjour
        let button = document.getElementById("discoverLightsButton");
        if (button.innerText === "STOP DISCOVERY") {
            bonjour.destroy();
            button.innerText = "Discover lights...";
            // Hide loader
            document.getElementById("loader").style.display = "none";
        } else {
            bonjour = require('bonjour')()
            button.innerText = "Stop discovery";
            // Show loader
            document.getElementById("loader").style.display = "block";
            scan(bonjour);
        }
    }
}

// if method changes the current scan will abort
function checkMethod() {
    let button = document.getElementById("discoverLightsButton");
    button.innerText = "Discover lights...";
    document.getElementById("loader").style.display = "none";
    if (typeof bonjour !== 'undefined') {
        bonjour.destroy();
    }
}