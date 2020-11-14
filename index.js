const {
  app,
  ipcMain,
  BrowserWindow,
  dialog
} = require('electron')

var main;

function createWindow () {
  main = new BrowserWindow({
    width: 800,
    height: 600,
    title : "Flare / XRP Setup",
    webPreferences: {
      nodeIntegration: true
    }
  })

  //main.setMenu(null)
  main.loadFile('main.html')
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
  dialog.showMessageBox(main, {
    type : "warning",
    message : "This app requires access to your private XRP secret key",
    checkboxLabel : "I am running this on a secure computer",
    buttons : ["OK"]
  }).then((result) => {
    if(!result.checkboxChecked)
      app.quit()
  })
})

ipcMain.on('confirm_generate_eth', (event, path) => {
  dialog.showMessageBox(main, {
    message : "This will generate an ETH secret key and display it on the screen. Do you wish to continue?",
    buttons : ["CANCEL", "OK"]

  }).then((result) => {
    if(result.response == 1) // OK clicked
      event.reply("generate_eth_confirmed")
  })
})

ipcMain.on('generate_eth', (event, path) => {
  // ... generate secret + address

  dialog.showMessageBox(main, {
    message : "This is your ETH secret. Once you close this dialog it will dissapear forever. MAKE SURE TO SAVE IT:",
    checkboxLabel : "I have saved this ETH secret",
    buttons : ["CANCEL", "OK"]

  }).then((result) => {
    if(result.response == 1 && result.checkboxChecked)
      event.reply("generated_eth", address)
  })
})

///

app.whenReady().then(createWindow)
