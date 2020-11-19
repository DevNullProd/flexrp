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
    width : 500,
    height: 200
  },

  generate_eth : {
    width : 400,
    height: 200
  },

  eth_secret : {
    width : 400,
    height: 225
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

var eth_account = {
  persist : false,
  address : null,
  secret : null
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

///

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

///

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

///

ipcMain.on('confirm_generate_eth', (event) => {
  const generated_eth = new BrowserWindow({
    width: SIZES.generate_eth.width,
    height: SIZES.generate_eth.height,
    frame : false,
    parent : main_win,
    modal : true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  generated_eth.setMenu(null)
  generated_eth.loadFile('generate_eth.html')
})

ipcMain.on('generate_eth_account', (event) => {
  const EthWallet = require('ethereumjs-wallet').default;
  const wallet = EthWallet.generate();
  eth_account.persist = false;
  eth_account.address = wallet.getAddressString();
  eth_account.secret = wallet.getPrivateKeyString();
})

ipcMain.on("get_eth_account", (event) => {
  event.reply("got_eth_account", eth_account)
})

ipcMain.on('show_eth_secret', (event) => {
  const eth_secret = new BrowserWindow({
    width: SIZES.eth_secret.width,
    height: SIZES.eth_secret.height,
    frame : false,
    parent : main_win,
    modal : true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  eth_secret.on("closed", (event) => {
    if(eth_account.persist)
      main_win.webContents.send("update_eth_address", eth_account.address)
  });

  eth_secret.setMenu(null)
  eth_secret.loadFile('eth_secret.html')
})

ipcMain.on("persist_eth_account", (event) => {
  eth_account.persist = true;
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
