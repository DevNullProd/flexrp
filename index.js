const {
  app,
  ipcMain,
  BrowserWindow,
  dialog
} = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  //win.setMenu(null)
  win.loadFile('main.html')
}

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

///

ipcMain.on('initial_alert', (event, path) => { 
  dialog.showMessageBox({
    type : "warning",
    message : "This app requires access to your private XRP secret key",
    checkboxLabel : "I am running this on a secure computer",
    buttons : ["OK"]
  }).then((result) => {
    if(!result.checkboxChecked)
      app.quit()
  })
}) 

///

app.whenReady().then(createWindow)
