const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { channels } = require('./constants');
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        useContentSize: true,
        resizable: false,
        transparent: true,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })
    win.loadURL('http://localhost:3000');
}

let splash;
const fork = require('child_process').fork;
const childLocalIP = fork("./src/localip.js");
childLocalIP.send({ message: "start" })
childLocalIP.on("message", (msgL) => {
    const lIP = msgL['message'];
    const childAllIP = fork("./src/allip.js");
    childAllIP.send({ message: lIP });
    childAllIP.on("message", (msgA) => {
        let aIP = "";
        Object.values(msgA['message']).forEach(element => aIP += `${element}, `)
        aIP = aIP.substring(0, aIP.length-2);
        app.whenReady().then(() => {
            const msg = "Okay, okay, I'm starting now";
            ipcMain.on(channels.GET_GREET, async (event, arg) => {
                event.sender.send(channels.GET_GREET, msg);
                event.sender.send(channels.GET_ALL, aIP);
                event.sender.send(channels.GET_IP, lIP);
                splash.destroy();
            });
            createWindow();
            app.on('activate', () => {
                if (BrowserWindow.getAllWindows().length === 0) {
                    createWindow();
                }
            });
        });
    });
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

const createSplash = () => {
    splash = new BrowserWindow({
        transparent: true,
        frame: false,
    })
    splash.loadFile('./public/splash.html')
}
app.whenReady().then(() => {
    createSplash();
});
ipcMain.on(channels.GOOD_BYE, async (event, arg) => {
    app.quit();
});
