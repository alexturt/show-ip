process.on("message", (msg) => {
    const exec = require('child_process').exec;
    let count = 0;
    let result = [];
    let currentIP = msg['message'].split('.');

    function processSync(error, stdout, stderr) {
        count++;
        if (stdout.match(/TTL/gi) !== null)
            result.push([`${stdout.match(/\d{1,3}[.]\d{1,3}[.]\d{1,3}[.]\d{1,3}/g)[0].split('.')[3]}`,
                `${stdout.match(/\d{1,3}[.]\d{1,3}[.]\d{1,3}[.]\d{1,3}/g)[0]}`])
        if (count === 254) {
            const obj = Object.fromEntries(result);
            process.send({message: obj})
            process.exit(0)
        }
    }

    if (process.platform === 'win32') {
        for (let i = 1; i < 255; i++) {
            currentIP[3] = i;
            exec(`ping -n 1 ${currentIP[0]}.${currentIP[1]}.${currentIP[2]}.${currentIP[3]}`, processSync);
        }
    } else {
        for (let i = 1; i < 255; i++) {
            currentIP[3] = i;
            exec(`ping -c 1 ${currentIP[0]}.${currentIP[1]}.${currentIP[2]}.${currentIP[3]}`, processSync);
        }
    }
})
