let localIP = "";
let ifName = "";
const exec = require('child_process').exec;

function processMac(error, stdout, stderr) {
    ifName = stdout.match(/default[ ]+\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}[ ]+\w+[ ]+\d+[ ]+\d+[ ]+\w{1,2}\d/g)[0].match(/\w{1,2}\d/g)[0];

    function processIPByIFaceMac(error, stdout, stderr) {
        localIP = stdout.match(/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/g)[0];
        process.send({ message: localIP })
        process.exit(0)
    }

    exec(`ipconfig getifaddr ${ifName}`, processIPByIFaceMac);
}

function processWin(error, stdout, stderr) {
    localIP = stdout.match(/[^0]{1,3}[.]\d{1,3}[.]\d{1,3}[.]\d{1,3}/g)[1];
    process.send({ message: localIP })
    process.exit(0)
}

function processOther(error, stdout, stderr) {
    ifName = stdout.match(/0.0.0.0[ ]+\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}[ ]+0.0.0.0[ ]+\w+[ ]+\d+[ ]+\d+[ ]+\d+[ ]+((wlan)\w+|(eth)\w+|(enp)\w+|(ppp)\w+)/g)[0]
        .match(/((wlan)\w+|(eth)\w+|(enp)\w+|(ppp)\w+)/g)[0];

    function processIPByIFaceOther(error, stdout, stderr) {
        localIP = stdout.match(/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/g)[0];
        process.send({ message: localIP })
        process.exit(0)
    }

    exec(`ifconfig ${ifName}`, processIPByIFaceOther);
}

process.on("message", (msg) => {
    if (process.platform === 'darwin') {
        exec(`netstat -nr`, processMac);
    } else if (process.platform === 'win32') {
        exec(`route print -4 0.0.0.0`, processWin);
    } else {
        exec(`netstat -nr`, processOther);
    }
})
