import {app, BrowserWindow} from 'electron';
import path from 'path';
import { isDev } from './util.js';


app.on("ready", ()=>{
  const mainWindow = new BrowserWindow({ });    

  if (isDev()) {
    // Development mode
    mainWindow.loadURL('http://localhost:5173');
  } else {
    // Production mode
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'))
  }
})

