const {
  app,
  ipcMain,
  BrowserWindow,
  dialog
} = require('electron')

const path = require('path')

///

// Default window sizes
const SIZES = {
  splash : {
    width  : 800,
    height : 600
  },

  main : {
    width  : 800,
    height : 600
  },

  security : {
    width  : 600,
    height : 800
  },

  generate_eth : {
    width : 314,
    height: 380
  },

  eth_secret : {
    width : 690,
    height: 380
  },

  signing_failed : {
    width : 700,
    height: 500
  },

  signed_tx : {
    width : 700,
    height: 500
  },

  submit_success : {
    width : 325,
    height: 400
  },

  submit_failed : {
    width : 425,
    height: 400
  }
}

// Window handles
var splash_win,
    security_win,
    main_win,
    generate_eth,
    signing_failed,
    submit_failed;

// Generated ethereum account
var eth_account = {
  persist : false,
  address : null,
  secret : null
};

// Operation result
var operation_result = {
  err : null,
  tx : null
};

///

// Create splash window
function createSplash(){
  splash_win = new BrowserWindow({
    width:  SIZES.splash.width,
    height: SIZES.splash.height,
    title: "FleXRP",
    icon: path.join(__dirname, '..', 'assets/app-icon.png'),
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false
    }
  })

  splash_win.setMenu(null)
  splash_win.loadFile('html/splash.html')
}

// Close splash window IPC command
ipcMain.on('close_splash', (event) => {
  splash_win.close()
})

// Quit application when all windows are closed
app.on('window-all-closed', () => {
  app.quit()
})

// Create main window on app activation
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createSplash()
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

///

// Render security window
ipcMain.on("show_security", (event) => {
  security_win = new BrowserWindow({
    width:  SIZES.security.width,
    height: SIZES.security.height,
    parent: splash_win,
    modal : true,
    title: "FleXRP Security",
    icon: path.join(__dirname, '..', 'assets/app-icon.png'),
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false
    }
  })

  security_win.setMenu(null)
  security_win.loadFile('html/security.html')
})

// Close security window IPC command
ipcMain.on('close_security', (event) => {
  security_win.close()
})

// Render main window
ipcMain.on("show_main", (event) => {
  main_win = new BrowserWindow({
    width:  SIZES.main.width,
    height: SIZES.main.height,
    title: "FleXRP",
    icon: path.join(__dirname, '..', 'assets/app-icon.png'),
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false
    }
  })

  main_win.setMenu(null)
  main_win.loadFile('html/main.html')
})

// Proxy settings_updated ipc call between windows
ipcMain.on('settings_updated', (event) => {
  main_win.webContents.send("settings_updated");
})

///

// Render confirm eth address generation window
ipcMain.on('show_generate_eth', (event) => {
  generate_eth = new BrowserWindow({
    width: SIZES.generate_eth.width,
    height: SIZES.generate_eth.height,
    frame : false,
    parent : main_win,
    modal : true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false
    }
  })

  generate_eth.setMenu(null)
  generate_eth.loadFile('html/generate_eth.html')
})

// Close security window IPC command
ipcMain.on('close_generate_eth', (event) => {
  generate_eth.close()
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
  eth_secret = new BrowserWindow({
    width: SIZES.eth_secret.width,
    height: SIZES.eth_secret.height,
    frame : false,
    parent : main_win,
    modal : true,
    resizable: false,
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

// Close eth_secret IPC command
ipcMain.on('close_eth_secret', (event) => {
  eth_secret.close()
})

// Mark eth account as to be persisted
ipcMain.on("persist_eth_account", (event) => {
  eth_account.persist = true;
})

///

// Set operation result
ipcMain.on('set_operation_result', (event, result) => {
  Object.assign(operation_result, result)
})

// Retrieve operation result
ipcMain.on('get_operation_result', (event) => {
  event.reply('got_operation_result', operation_result)
})

// Operation process complete, quit application
ipcMain.on("operation_complete", (event) => {
  app.quit()
})

///

// Render signing fialed window
ipcMain.on('show_signing_failed', (event, signed) => {
  signing_failed = new BrowserWindow({
    width: SIZES.signing_failed.width,
    height: SIZES.signing_failed.height,
    frame : false,
    parent : main_win,
    modal : true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false
    }
  })

  signing_failed.setMenu(null)
  signing_failed.loadFile('html/signing_failed.html')
})

// Close signing_failed window IPC command
ipcMain.on('close_signing_failed', (event) => {
  signing_failed.close()
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


///

// Render dialog indicating tx submission succeeded
ipcMain.on("show_submit_success", (event) => {
  const submit_success = new BrowserWindow({
    width: SIZES.submit_success.width,
    height: SIZES.submit_success.height,
    frame: false,
    parent: main_win,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false
    }
  })

  submit_success.setMenu(null)
  submit_success.loadFile('html/submit_success.html')
})

// Render dialog indicating tx submission failed
ipcMain.on("show_submit_failed", (event, err) => {
  submit_failed = new BrowserWindow({
    width: SIZES.submit_failed.width,
    height: SIZES.submit_failed.height,
    frame: false,
    parent: main_win,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false
    }
  })

  submit_failed.setMenu(null)
  submit_failed.loadFile('html/submit_failed.html')
})

// Close submit_failed window IPC command
ipcMain.on('close_submit_failed', (event) => {
  submit_failed.close()
})

///

// Create main window when application is ready
app.whenReady().then(createSplash)
