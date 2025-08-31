const path = require('path');
const os = require('os');
const fs = require('fs');
const {app, BrowserWindow, Menu, ipcMain, shell} = require('electron');
const ResizeImg = require('resize-img');

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

// Create the Main Menu
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Image Resizer',
        width: isDev ? 1000: 500,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        }
    });

    // Open devtools if in dev env
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

// Menu template
const menu = [
    ...(isMac ? 
        [
            {
                label: app.name,
                submenu: [
                    {
                        label: 'about',
                        click: createAboutWindow
                    }
                ]
            }
        ]
        : []),
    {
        role: 'fileMenu'
    },
    ...(!isMac 
        ? [
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'about',
                        click: createAboutWindow
                    },
                ]
            }
    ] 
    : [])
]

// Create about window
function createAboutWindow(){
    const aboutWindow = new BrowserWindow({
        title: 'About Image Resizer',
        width: 300,
        height: 300
    });

    aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
}

// App is ready
app.whenReady().then( () => {
    createMainWindow();

    // Implement Menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    // remove mainWindow from memory
    mainWindow.on('closed', () => (mainWindow));

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

ipcMain.on('image:resize', async (e, { filename, bytes, width, height }) => {
  try {
    const dest = path.join(os.homedir(), 'imageresizer'); // () needed!
    await resizeImage({
      // turn Uint8Array into Buffer here
      buffer: Buffer.from(bytes),
      filename,
      width: Number(width),
      height: Number(height),
      dest,
      browserEvent: e, // so we can reply to this window
    });
  } catch (err) {
    const win = BrowserWindow.getFocusedWindow();
    win?.webContents.send('image:error', String(err?.message || err));
    console.error('[image:resize]', err);
  }
});

async function resizeImage({ buffer, filename, width, height, dest, browserEvent }) {
  try {
    const { default: resizeImg } = await import('resize-img'); // ESM
    const resizedBuffer = await resizeImg(buffer, { width, height });

    fs.mkdirSync(dest, { recursive: true });
    const outPath = path.join(dest, filename);
    fs.writeFileSync(outPath, resizedBuffer);

    // Notify renderer
    (browserEvent?.sender ?? BrowserWindow.getFocusedWindow()?.webContents)
      ?.send('image:done', { outPath, width, height });

    // Open folder (best effort)
    await shell.openPath(dest);
  } catch (error) {
    (browserEvent?.sender ?? BrowserWindow.getFocusedWindow()?.webContents)
      ?.send('image:error', String(error?.message || error));
    console.error('[resizeImage]', error);
  }
}

app.on('window-all-closed', () => {
    if (isMac) {
        app.quit();
    }
});