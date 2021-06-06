import { autoUpdater } from "electron";

export class UpdateChecker {
  downloadedVersion: { name: string } | null = null;

  constructor() {
    autoUpdater.on("update-downloaded", (_event, _notes, name) => {
      this.downloadedVersion = { name };
    });
  }

  checkUpdateAsync(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      function removeListeners() {
        autoUpdater.off("error", handleError);
        autoUpdater.off("update-downloaded", handleDownloadedEvent);
        autoUpdater.off("update-not-available", handleNotAvailableEvent);
      }

      function handleError(event: Error) {
        removeListeners();
        reject(event);
      }

      function handleDownloadedEvent() {
        removeListeners();
        resolve(true);
      }

      function handleNotAvailableEvent() {
        removeListeners();
        resolve(false);
      }

      if (this.downloadedVersion) {
        resolve(true);
      } else if (!autoUpdater.getFeedURL()) {
        resolve(false);
      } else {
        autoUpdater.on("error", handleError);
        autoUpdater.on("update-downloaded", handleDownloadedEvent);
        autoUpdater.on("update-not-available", handleNotAvailableEvent);

        autoUpdater.checkForUpdates();
      }
    });
  }
}
