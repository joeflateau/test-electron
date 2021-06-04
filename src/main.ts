import cors from "cors";
import { app, autoUpdater, Menu, Tray } from "electron";
import unhandled from "electron-unhandled";
import express, { Router } from "express";
import getPort from "get-port";
import { menubar as Menubar } from "menubar";
import NodeMediaServer from "node-media-server";
import updateElectronApp from "update-electron-app";

unhandled();

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const isFirstInstance = app.requestSingleInstanceLock();

if (!isFirstInstance) {
  app.quit();
}

if (process.env.UPDATE_ELECTRON_APP !== "0") {
  updateElectronApp({
    notifyUser: false,
  });
}

const server = express();

server.use(cors());

server.get("/info/version", (_req, res) => {
  res.send(app.getVersion());
});

const updateRouter = UpdateRouter();
server.use("/info/update", updateRouter);

app.whenReady().then(async () => {
  const port = await getPort();

  await new Promise<void>((resolve, reject) => {
    server.on("error", (err) => reject(err)).listen(port, () => resolve());
  });

  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true,
  });
  const trayIconPath = __dirname + "/assets/img/IconTemplate.png";
  const tray = new Tray(trayIconPath);

  const menu = Menu.buildFromTemplate([
    { label: "Quit", click: () => app.quit() },
  ]);
  tray.on("right-click", () => {
    tray.popUpContextMenu(menu);
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const menubar = Menubar({
    tray,
    index: MAIN_WINDOW_WEBPACK_ENTRY,
    browserWindow: {
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        additionalArguments: [`--port`, String(port)],
      },
    },
  });
  menubar.on("ready", () => {
    if (!app.getLoginItemSettings().wasOpenedAsHidden) {
      setTimeout(() => {
        menubar.showWindow();
      }, 1250);
    }
  });
  app.on("second-instance", () => {
    menubar.showWindow();
  });
  menubar.on("after-create-window", async () => {
    app.dock?.hide();
    menubar.showWindow();
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const nms = new NodeMediaServer({
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
});

nms.run();

nms.on("preConnect", (id, args) => {
  console.log(
    "[NodeEvent on preConnect]",
    `id=${id} args=${JSON.stringify(args)}`
  );
});

nms.on("postConnect", (id, args) => {
  console.log(
    "[NodeEvent on postConnect]",
    `id=${id} args=${JSON.stringify(args)}`
  );
});

nms.on("doneConnect", (id, args) => {
  console.log(
    "[NodeEvent on doneConnect]",
    `id=${id} args=${JSON.stringify(args)}`
  );
});

nms.on("prePublish", (id, streamPath, args) => {
  console.log(
    "[NodeEvent on prePublish]",
    `id=${id} StreamPath=${streamPath} args=${JSON.stringify(args)}`
  );
  // if (args.key !== "mysecretstreamkey") {
  //   const session = nms.getSession(id);
  //   session.reject();
  // }
});

nms.on("postPublish", (id, streamPath, args) => {
  console.log(
    "[NodeEvent on postPublish]",
    `id=${id} StreamPath=${streamPath} args=${JSON.stringify(args)}`
  );
});

nms.on("donePublish", (id, streamPath, args) => {
  console.log(
    "[NodeEvent on donePublish]",
    `id=${id} StreamPath=${streamPath} args=${JSON.stringify(args)}`
  );
});

function UpdateRouter() {
  let versionDownloaded: { name: string } | null = null;

  autoUpdater.on("update-downloaded", (_event, _notes, name) => {
    versionDownloaded = { name };
  });

  const updateRouter = Router();
  updateRouter.route("/").get((_req, res) => {
    res.json(versionDownloaded);
  });
  updateRouter.route("/check").post((_req, res) => {
    new Promise<boolean>((resolve, reject) => {
      function removeListeners() {
        autoUpdater.off("error", handleError);
        autoUpdater.off("update-downloaded", handleEvent);
        autoUpdater.off("update-not-available", handleEvent);
      }

      function handleError(event: Error) {
        removeListeners();
        reject(event);
      }

      function handleEvent(event: Electron.Event) {
        removeListeners();
        resolve(event.type === "update-downloaded");
      }

      if (versionDownloaded) {
        resolve(true);
      } else if (!autoUpdater.getFeedURL()) {
        resolve(false);
      } else {
        autoUpdater.on("error", handleError);
        autoUpdater.on("update-downloaded", handleEvent);
        autoUpdater.on("update-not-available", handleEvent);
        autoUpdater.checkForUpdates();
      }
    }).then(
      (downloadedUpdate) => res.json({ downloadedUpdate }),
      (err) => res.status(400).json({ err })
    );
  });
  updateRouter.route("/install").post((_req, res) => {
    autoUpdater.quitAndInstall();
    res.send();
  });

  return updateRouter;
}
