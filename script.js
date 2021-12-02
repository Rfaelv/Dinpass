function getTablePath() {
    const { dialog } = require('electron').remote
    dialog.showOpenDialog({
        title:'Selecionar tabela',
        properties: ['openFile'],
        filters: [
            { name: 'planilha do excel', extensions: ['xlsm', 'xlsx'] },
          ]
    }).then(result => {
        const textBox = document.getElementById('tablePath')
        textBox.value = result.filePaths.length == 0? textBox.value : result.filePaths       
    })
}
function go() {
    const fs = require('fs')
    const path = require('path')
    const electron = require('electron')
    const userData = (electron.app || electron.remote.app).getPath('userData')
    var jsonData = fs.readFileSync(path.join(userData, "data/configData.json"), "utf8")
    var data = JSON.parse(jsonData)
    
    const ptGauss = data.ptGauss
    const t0 = data.t0
    const tf = data.tf
    const nInterval = data.nInterval

    const tablePath = document.getElementById('tablePath')
    var direction = document.getElementsByName('direction')
    const naturalFrequency = document.getElementById('naturalFrequency')
    const mass = document.getElementById('mass')
    const damping = document.getElementById('damping')
    const lenght = document.getElementById('lenght')
    const width = document.getElementById('width')

    const values = [tablePath, naturalFrequency, mass, damping, lenght, width]

    if (direction[0].checked) {
        direction = 'vertical'
    } else {
        direction = 'lateral'
    }
    for (let i = 0; i < values.length; i++) {
        if (values[i].value == '') {
            const {ipcRenderer, dialog} = require('electron').remote
            dialog.showErrorBox('Erro', 'Preencha todos os campos.')
            values[i].focus()
            return
        }
    }
    var props = [tablePath.value.replaceAll('\\', '/')]
    for (let i = 1; i < values.length; i++) {
        props.push(parseFloat(values[i].value.replace(',', '.')))
    }
    props.push(direction)
    props.push(Math.round(ptGauss))
    props.push(Math.round(t0))
    props.push(Math.round(tf))
    props.push(Math.round(nInterval))
    props.push(userData)
    // console.log(props)


    // if (path == '' || naturalFrequency == '' || mass == '' || damping == '' || lenght == '' || width == '') {
    //     //alert('Preencha todos os campos')
    //     const {ipcRenderer, dialog} = require('electron').remote
    //     dialog.showErrorBox('Erro', 'Preencha todos os campos.')
    //     if (path == '') {
    //         document.getElementById('tablePath').focus()
        // }

     
    // }
    const {BrowserWindow} = require('electron').remote
   

    // //const modalPath = path.join('file://', __dirname, '../../sections/windows/modal.html')
    let win = new BrowserWindow({
        title: 'Dinâmica de passarelas - Calculando...',
        width: 750,
        height: 655,
        icon: './assets/icon.ico',
        maximizable: false,
        autoHideMenuBar: true,
        modal: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
          }
    })

    win.on('close', () => { win = null })
    win.loadFile('./views/transition.html')
    // win.webContents.openDevTools()
    win.show()

    const spawn = require('child_process').spawn
    // const path = require('path')
    // const fs = require('fs')
    // fs.writeFileSync(path.resolve(__dirname, 'solution.json'), data)
    // fs.writeFileSync('solution.json', '{"a": "teste", "b": 1}')
    
    // const process = spawn('python', ['./hello.py', 5])
    // const mypath = path.join(__dirname, 'engine', 'dist', 'main.py')
    // const process = spawn('python',['./engine/main.py', props[0], props[1], props[2], props[3], props[4], props[5], props[6], props[7], props[8], props[9], props[10]])
    const process = spawn(path.resolve('engine/dist/main'), props)

    process.stdout.on('data', (data) => {
        data = data.toString().replaceAll('\'', '\"')
        const electron = require('electron')
        const userData = (electron.app || electron.remote.app).getPath('userData')
        fs.writeFile(path.join(userData, 'data/solution.json'), data, () => {
            win.loadFile('./views/modal.html')
            if (!win.isFocused()) {
                const path = require('path')
                const notification = {
                    title: 'Dinpass',
                    body: 'Sua análise está pronta  :)',
                    icon: path.join(__dirname, './assets/icon.png')
                }
                const myNotification = new window.Notification(notification.title, notification)
            }
        })
        
    })

}

