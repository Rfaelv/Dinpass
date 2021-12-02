function setValues() {
    const fs = require('fs')
    const path = require('path')
    const electron = require('electron')
    const userData = (electron.app || electron.remote.app).getPath('userData')
    var jsonData = fs.readFileSync(path.join(userData, "data/configData.json"), "utf8")
    var data = JSON.parse(jsonData)
    
    document.getElementById('ptGauss').value = data.ptGauss
    document.getElementById('t0').value = data.t0
    document.getElementById('tf').value = data.tf
    document.getElementById('nInterval').value = data.nInterval
}
function apply() {
    const fs = require('fs')
    const path = require('path')
    const electron = require('electron')
    const userData = (electron.app || electron.remote.app).getPath('userData')

    var data = {
        ptGauss: parseFloat(document.getElementById('ptGauss').value.replace(',', '.')),
        t0: parseFloat(document.getElementById('t0').value.replace(',', '.')),
        tf: parseFloat(document.getElementById('tf').value.replace(',', '.')),
        nInterval: parseFloat(document.getElementById('nInterval').value.replace(',', '.'))
    }

    fs.writeFileSync(path.join(userData, "data/configData.json"), JSON.stringify(data))
    electron.remote.BrowserWindow.getFocusedWindow().close()
}