const supportedVersions = ["0.10.0", "0.10.2", "0.11.0", "0.11.1"]
const locVersion = localStorage.getItem("locVersion");

// used for finding version in array
function checkVersion(version) {
    return version === locVersion;
  }

if (typeof supportedVersions.find(checkVersion) !== "undefined") {
    console.log("Using version " + locVersion);
    document.write("<iframe src=\"wled/wled_v" + locVersion + ".htm\"></iframe>");
} else {
    let version = supportedVersions[supportedVersions.length - 1];
    console.log("Using version " + version);
    document.write("<iframe src=\"wled/wled_v" + version + ".htm\"></iframe>");
}