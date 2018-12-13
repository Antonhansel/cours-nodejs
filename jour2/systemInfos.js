const os = require('os');
const fs = require('fs');


class SystemInfo {
    constructor(frequency) {
        this.infos = {
            platform: process.platform,
            dirname: __dirname,
            filename: __filename,
            platform: os.platform(),
            arch: os.arch(),
        },
        setInterval(() => {
            this.updateInfos()
        }, frequency);
        this.fileStream = fs.createWriteStream('systemInfo.txt');
    }

    updateInfos() {
        this.infos = {
            ...this.infos,
            cpus: os.cpus(),
            totalmem: os.totalmem(),
            freemem: os.freemem(),
            uptime: os.uptime(),
            network: os.networkInterfaces()
        };
        this.saveDataToFile();
    }

    saveDataToFile() {
        this.fileStream.write(JSON.stringify(this.infos) + '\n', function() {
            console.log('Data saved! - ' + Date.now());
        });
    }

    getSystemInfos() {
        return this.infos;
    }
}

module.exports = SystemInfo