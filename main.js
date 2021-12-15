const { app, BrowserWindow, Menu } = require('electron')
const { nativeTheme } = require('electron/main')
const { autoUpdater } = require('electron-updater')

let win

function createWindow () {
  win = new BrowserWindow({
    title: 'Dinâmica de passarelas',
    width: 480,
    height: 515,
    icon: './assets/icon.ico',
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  const shell = require('electron').shell
  var menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Configurações',
          click() {
            const configWin = new BrowserWindow({
              title: 'Configurações',
              parent: win,
              width: 300,
              height: 290,
              icon: './assets/icon.ico',
              maximizable: false,
              webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true,
              }
            })
            configWin.loadFile('./views/config.html')
            configWin.setMenu(null)
          },
          accelerator: 'Ctrl+P'
        },
        {type: 'separator'},
        {
          label: 'Exit',
          click() {
            app.quit()
          },
          accelerator: 'Ctrl+Q'
        }
      ]
    },
    {
      label: 'Ajuda',
      click() {
        shell.openExternal('https://rfaelv.github.io/Dinpass/')
      }
    }
  ])
  Menu.setApplicationMenu(menu)
  win.loadFile('index.html')
  nativeTheme.themeSource = 'light'
  
  const fs = require('fs')
  const path = require('path')
  const dir = path.join(app.getPath('userData'), 'data')

  if (!fs.existsSync(dir)){
      fs.mkdir(dir, (err) => {
          if (err) {
            return
          }
          var data = {
            ptGauss: 10,
            t0: 0,
            tf: 30,
            nInterval: 25000
          }
          fs.writeFileSync(path.join(dir, "configData.json"), JSON.stringify(data))
      })
  }

  win.on('close', function(event) {
    app.quit()
  })

  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

autoUpdater.on('update-available', () => {
  win.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  win.webContents.send('update_downloaded');
});


