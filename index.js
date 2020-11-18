const {
  app,
  ipcMain,
  BrowserWindow,
  dialog
} = require('electron')

///

const SIZES = {
  main : {
    width : 800,
    height : 600
  },

  initial_alert : {
    width : 300,
    height: 100
  },

  help : {
    width: 400,
    height : 600
  },

  settings : {
    width : 500,
    height : 300
  }
}

var main_win, settings_win;
var settings = {
  testnet : false,
  offline : false,
  fee : null,
  sequence : null,
  maxLedgerVersion : null
};

function createMain () {
  main_win = new BrowserWindow({
    width:  SIZES.main.width,
    height: SIZES.main.height,
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

ipcMain.on('quit_app', (event) => {
  app.quit()
})

ipcMain.on('close_window', (event) => {
  BrowserWindow.getFocusedWindow().close()
})

ipcMain.on('initial_alert', (event) => {
  const alert_win = new BrowserWindow({
    width: SIZES.initial_alert.width,
    height: SIZES.initial_alert.height,
    frame : false,
    parent : main_win,
    modal : true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  alert_win.setMenu(null)
  alert_win.loadFile('initial_alert.html')
})

ipcMain.on('show_help', (event) => { 
  const help_win = new BrowserWindow({
    width: SIZES.help.width,
    height: SIZES.help.height,
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
    width: SIZES.settings.width,
    height: SIZES.settings.height,
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

ipcMain.on('get_settings', (event) => {
  event.reply('got_settings', settings)
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

ipcMain.on('show_eth_secret', (event, secret) => {
  dialog.showMessageBox(main_win, {
    message : "This is your ETH secret. Once you close this dialog it will dissapear forever. MAKE SURE TO SAVE IT: " + secret,
    checkboxLabel : "I have saved this ETH secret",
    buttons : ["CANCEL", "OK"]

  }).then((result) => {
    if(result.response == 1 && result.checkboxChecked)
      event.reply("eth_secret_saved")
  })
})

ipcMain.on('show_signed_tx', (event, signed) => {
  dialog.showMessageBox(main_win, {
    message : "Signed Transaction: " + signed + ". Must be submitted to take effect.",
    checkboxLabel : "I have copied this transaction for subsequent submission.",
    buttons : ["OK"]
  })
})

ipcMain.on("submit_success", (event) => {
  dialog.showMessageBox(main_win, {
    message : "Successfully submitted TX. You XRP account has been setup to receive Flare Spark tokens.",
    buttons : ["OK"]
  }).then((result) => {
    app.quit()
  })
})

///

app.whenReady().then(createMain)
