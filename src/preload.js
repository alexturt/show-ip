const {contextBridge,ipcRenderer} = require("electron");
const validChannels = ['get_ip', 'get_all', 'get_greet', 'good_bye']; // whitelist channels

contextBridge.exposeInMainWorld(
    "ipcRenderer", {
        send: (channel, data) => {
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        on: (channel, func) => {
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
);
contextBridge.exposeInMainWorld(
    "osType", {
        current: () => process.platform,
    }
);
