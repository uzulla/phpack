'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const { spawn } = require('child_process');

const php = spawn('php', ["-S", "127.0.0.1:8088", "-t", path.resolve(__dirname) + "/public"]);
php.stdout.on('data', (data) => { console.log(`stdout: ${data}`); });
php.stderr.on('data', (data) => { console.log(`stderr: ${data}`); });
php.on('close', (code) => { console.log(`child process exited with code ${code}`); });

let mainWindow;

app.on('before-quit', function() {
  php.stdin.pause();
  php.kill();
//php.kill("SIGKILL"); // over kill...
});

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 1024, height: 800});

  setTimeout(function() {
    mainWindow.loadURL("http://127.0.0.1:8088/");
  }, 2000);

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
