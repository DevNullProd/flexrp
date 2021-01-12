const {
  app,
  ipcMain,
  BrowserWindow,
  dialog
} = require('electron')

///

// Default window sizes
const SIZES = {
  main : {
    width : 800,
    height : 600
  },

  initial_alert : {
    width : 500,
    height: 250
  },

  generate_eth : {
    width : 400,
    height: 200
  },

  eth_secret : {
    width : 575,
    height: 275
  },

  signed_tx : {
    width : 425,
    height: 400 
  },

  security : {
    width: 600,
    height : 625
  },

  help : {
    width: 600,
    height : 625
  },

  settings : {
    width : 500,
    height : 250
  }
}

var main_win;

// Global application settings
var settings = {
  testnet : false,
  offline : false,
  fee : null,
  sequence : null,
  maxLedgerVersion : null,
  specify_account : false
};

// Generated ethereum account
var eth_account = {
  persist : false,
  address : null,
  secret : null
};

// Signed transaction
var signed_tx = null;

///

// Create main window
function createMain () {
  main_win = new BrowserWindow({
    width:  SIZES.main.width,
    height: SIZES.main.height,
    title : "Flare / XRP Setup",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false
    }
  })

  main_win.setMenu(null)
  main_win.loadFile('html/main.html')
}

// Quit application when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Create main window on app activation
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMain()
  }
})

// Electron Security Guideline: Disable Navigation
// https://www.electronjs.org/docs/tutorial/security#12-disable-or-limit-navigation
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', () => {
    event.preventDefault();
  })
})

///

// Quit application IPC command
ipcMain.on('quit_app', (event) => {
  app.quit()
})

// Close current window IPC command
ipcMain.on('close_window', (event) => {
  BrowserWindow.getFocusedWindow().close()
})

///

// Render initial_alert window
ipcMain.on('initial_alert', (event) => {
  const alert_win = new BrowserWindow({
    width: SIZES.initial_alert.width,
    height: SIZES.initial_alert.height,
    frame : false,
    parent : main_win,
    modal : true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false
    }
  })

  alert_win.setMenu(null)
  alert_win.loadFile('html/initial_alert.html')
})

// Render show_help window
ipcMain.on('show_help', (event) => { 
  const help_win = new BrowserWindow({
    width: SIZES.help.width,
    height: SIZES.help.height,
    frame : false,
    parent : main_win,
    modal : true,
    title : "Flare / XRP Setup Help",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false
    }
  })

  help_win.setMenu(null)
  help_win.loadFile('html/help.html')
})

// Render show_security window
ipcMain.on('show_security', (event) => {
  const security_win = new BrowserWindow({
    width: SIZES.security.width,
    height: SIZES.security.height,
    frame : false,
    parent : main_win,
    modal : true,
    title : "Securing your system",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false
    }
  })

  security_win.setMenu(null)
  security_win.loadFile('html/security.html')
})

///

// Render show_settings window
ipcMain.on('show_settings', (event) => { 
  const settings_win = new BrowserWindow({
    width: SIZES.settings.width,
    height: SIZES.settings.height,
    frame : false,
    parent : main_win,
    modal : true,
    title : "Flare / XRP Setup Settings",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false
    }
  })

  // When window is closed, update settings in main window
  settings_win.on("closed", (event) => {
    main_win.webContents.send("settings_updated", settings);
  });


  settings_win.setMenu(null)
  settings_win.loadFile('html/settings.html')
})

// Retrieve application settings,
// invokes 'got_settings' method with settings
ipcMain.on('get_settings', (event) => {
  event.reply('got_settings', settings)
})

// Set an application setting
ipcMain.on('set_setting', (event, setting) => { 
  Object.assign(settings, setting)
})

///

// Render confirm eth address generation window
ipcMain.on('confirm_generate_eth', (event) => {
  const generated_eth = new BrowserWindow({
    width: SIZES.generate_eth.width,
    height: SIZES.generate_eth.height,
    frame : false,
    parent : main_win,
    modal : true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false
    }
  })

  generated_eth.setMenu(null)
  generated_eth.loadFile('html/generate_eth.html')
})

// Set generated eth account
ipcMain.on('set_eth_account', (event, addr, priv) => {
  eth_account.persist = false;
  eth_account.address = addr;
  eth_account.secret  = priv;
})

// Retrieve generated ethereum account,
// invokes 'got_eth_account' method with account
ipcMain.on("get_eth_account", (event) => {
  event.reply("got_eth_account", eth_account)
})

// Render ethereum secret window
ipcMain.on('show_eth_secret', (event) => {
  const eth_secret = new BrowserWindow({
    width: SIZES.eth_secret.width,
    height: SIZES.eth_secret.height,
    frame : false,
    parent : main_win,
    modal : true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false
    }
  })

  // When window is closed, update eth address in main window (if persisting)
  eth_secret.on("closed", (event) => {
    if(eth_account.persist)
      main_win.webContents.send("update_eth_address", eth_account.address)
  });

  eth_secret.setMenu(null)
  eth_secret.loadFile('html/eth_secret.html')
})

// Mark eth account as to be persisted
ipcMain.on("persist_eth_account", (event) => {
  eth_account.persist = true;
})

///

// Render dialog indicating tx signing failed
ipcMain.on('sign_failed', (event, err) => {
  dialog.showMessageBox(main_win, {
    message : "Falure signing TX: " + err.message,
    buttons : ["OK"]
  }).then((result) => {
    app.quit()
  })
})

// Set signed transaction
ipcMain.on('set_signed_tx', (event, signed) => {
  signed_tx = signed;
})

// Retrieve signed transaction,
// invoked 'got_signed_tx' with signed tx
ipcMain.on('get_signed_tx', (event) => {
  event.reply('got_signed_tx', signed_tx)
})

// Render signed tx window
ipcMain.on('show_signed_tx', (event, signed) => {
  const signed_tx = new BrowserWindow({
    width: SIZES.signed_tx.width,
    height: SIZES.signed_tx.height,
    frame : false,
    parent : main_win,
    modal : true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false
    }
  })

  signed_tx.setMenu(null)
  signed_tx.loadFile('html/signed_tx.html')
})

// Signed transaction process complete
ipcMain.on("signed_tx_complete", (event) => {
  app.quit()
})

///

// Render dialog indicating tx submission succeeded
ipcMain.on("submit_success", (event) => {
  dialog.showMessageBox(main_win, {
    message : "Successfully submitted TX. You XRP account has been setup to receive Flare Spark tokens.",
    buttons : ["OK"]
  }).then((result) => {
    app.quit()
  })
})

// Render dialog indicating tx submission failed
ipcMain.on("submit_failed", (event, err) => {
  dialog.showMessageBox(main_win, {
    message : "Falure submitting TX: " + err.message,
    buttons : ["OK"]
  }).then((result) => {
    app.quit()
  })
})

///

// Create main window when application is ready
app.whenReady().then(createMain)
