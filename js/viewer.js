switch (localStorage.getItem("locVersion")) {
    case "0.10.0":
        document.write("<iframe src=\"wled/wled_v0.10.0.htm\"></iframe>");
        break;
    case "0.10.2":
        document.write("<iframe src=\"wled/wled_v0.10.2.htm\"></iframe>");
        break;
    case "0.11.0":
        document.write("<iframe src=\"wled/wled_v0.11.0.htm\"></iframe>");
        break;
    case "0.11.1":
        document.write("<iframe src=\"wled/wled_v0.11.0.htm\"></iframe>");
        break;

    default:
        document.write("<iframe src=\"wled/wled_v0.11.0.htm\"></iframe>");
        break;
}