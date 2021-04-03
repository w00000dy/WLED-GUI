const supportedVersions = ["0.10.0", "0.10.2", "0.11.0", "0.11.1", "0.12.0"]
const locIp = localStorage.getItem("locIp");
const locVersion = localStorage.getItem("locVersion");
const onlineMode = localStorage.getItem("onlineMode");

// used for finding version in array
function checkVersion(version) {
    return version === locVersion;
}

if (onlineMode === "true") {
    log.debug("Using online version from " + locIp);
    document.write("<iframe src=\"http://" + locIp + "\"></iframe>");
} else {
    if (typeof supportedVersions.find(checkVersion) !== "undefined") {
        log.debug("Using version " + locVersion);
        document.write("<iframe src=\"wled/v" + locVersion + "/index.htm\"></iframe>");
    } else {
        log.debug("Unsupported version. Using online version from " + locIp);
        document.write("<iframe src=\"http://" + locIp + "\"></iframe>");
    }
}