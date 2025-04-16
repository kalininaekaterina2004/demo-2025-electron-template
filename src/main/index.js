import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import connectDB from './db';

async function foo(event, data) {
  try {
    console.log(data)
    dialog.showMessageBox({ message: 'message back' })
  } catch (e) {
    dialog.showErrorBox('Ошибка', e)
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  global.dbclient = await connectDB();

  ipcMain.handle('sendSignal', foo)

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
const primaryBackground = '#FFFFFF';
const secondaryBackground = '#F4E8D3';
const accentColor = '#67BA80';

// Example usage:  Setting the background color of an element

const myElement = document.getElementById('myElement');

if (myElement) {
  myElement.style.backgroundColor = primaryBackground;
  console.log("Primary background color applied");

  //Example of changing color on a specific event (click):
  myElement.addEventListener('click', function() {
      myElement.style.backgroundColor = accentColor;
      console.log("Accent background color applied on click");
  });

} else {
  console.error("Element with ID 'myElement' not found.");
}

// Function to set text color on a specific element
function setTextColor(elementId, color) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.color = color;
    } else {
        console.error(`Element with ID ${elementId} not found.`);
    }
}

//Example of using the function
setTextColor('myTextElement', '#000000'); //Black text, for example.  Replace 'myTextElement' with the ID of your text element.

// Example function to create a themed button:
function createThemedButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.backgroundColor = secondaryBackground;
    button.style.color = '#000'; //Or any color that contrasts with the secondary background.
    button.style.border = 'none';
    button.style.padding = '10px 20px';
    button.style.cursor = 'pointer';

    button.addEventListener('click', onClick);

    button.addEventListener('mouseover', function() {
        button.style.backgroundColor = accentColor; //Use accent color on hover
        button.style.color = '#fff'; //White text on accent color
    });

    button.addEventListener('mouseout', function() {
        button.style.backgroundColor = secondaryBackground; //Back to secondary background
        button.style.color = '#000'; //Back to black text
    });


    return button;
}


// Example of using the button creation function:
const myButton = createThemedButton("Click Me!", function() {
    alert("Button clicked!");
});

// Append the button to the document body, or any other element.
document.body.appendChild(myButton);


//Helper function for getting the specific colors
function getColors(){
    return {
        primaryBackground : primaryBackground,
        secondaryBackground : secondaryBackground,
        accentColor: accentColor,
    };
}

//Can be useful for example to print the colors to the console
console.log(getColors());
