const Application = require('spectron').Application
const electronPath = require('electron');
const path = require('path');

describe("index", () => {
  var app;

  beforeEach(async function(){
    app = new Application({
      path: electronPath,
      args: [path.join(__dirname, '..')]
    })
    await app.start()
  })

  afterEach(async function () {
    if (app && app.isRunning())
      await app.stop()
  })


  describe("on startup", () => {
    test.todo("shows main window");//, () => {
      //app.client.getWindowCount().then(function (count) {
      //  expect(count).toEqual(2)
      //})
    //})
  })

  describe("ipc", () => {
    describe("quit_app", () => {
      test.todo("quits application")
    })
  })
})
