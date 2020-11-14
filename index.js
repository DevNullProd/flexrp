const {
  app,
  ipcMain,
  BrowserWindow,
  dialog
} = require('electron')

//const EthWallet = require('ethereumjs-wallet').default;

///

var main_win, help_win, settings_win;
var settings = {testnet : false, offline : false};

function createMain () {
  main_win = new BrowserWindow({
    width: 800,
    height: 600,
    title : "Flare / XRP Setup",
    webPreferences: {
      nodeIntegration: true
    }
  })

  //main_win.setMenu(null)
  main_win.loadFile('main.html')
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMain()
  }
})

///

ipcMain.on('initial_alert', (event) => { 
  dialog.showMessageBox(main_win, {
    type : "warning",
    message : "This app requires access to your private XRP secret key",
    checkboxLabel : "I am running this on a secure computer",
    buttons : ["OK"]

  }).then((result) => {
    if(!result.checkboxChecked)
      app.quit()
  })
})

ipcMain.on('show_help', (event) => { 
  help_win = new BrowserWindow({
    width: 400,
    height: 600,
    parent : main_win,
    modal : true,
    title : "Flare / XRP Setup Help",
    webPreferences: {
      nodeIntegration: true
    }
  })

  help_win.setMenu(null)
  help_win.loadFile('help.html')
})

ipcMain.on('show_settings', (event) => { 
  settings_win = new BrowserWindow({
    width: 500,
    height: 300,
    parent : main_win,
    modal : true,
    title : "Flare / XRP Setup Settings",
    webPreferences: {
      nodeIntegration: true
    }
  })

  settings_win.setMenu(null)
  settings_win.loadFile('settings.html')
})

ipcMain.on('close_settings', (event) => { 
  settings_win.close();
})

ipcMain.on('set_setting', (event, setting) => { 
  Object.assign(settings, setting)
})

ipcMain.on('confirm_generate_eth', (event) => {
  dialog.showMessageBox(main_win, {
    message : "This will generate an ETH secret key and display it on the screen. Do you wish to continue?",
    buttons : ["CANCEL", "OK"]

  }).then((result) => {
    if(result.response == 1) // OK clicked
      event.reply("generate_eth_confirmed")
  })
})

ipcMain.on('generate_eth', (event) => {
  const wallet = EthWallet.generate();

  dialog.showMessageBox(main_win, {
    message : "This is your ETH secret. Once you close this dialog it will dissapear forever. MAKE SURE TO SAVE IT: " + wallet.getPrivateKeyString(),
    checkboxLabel : "I have saved this ETH secret",
    buttons : ["CANCEL", "OK"]

  }).then((result) => {
    if(result.response == 1 && result.checkboxChecked)
      event.reply("generated_eth", wallet.getAddressString())
  })
})

///

app.whenReady().then(createMain)
