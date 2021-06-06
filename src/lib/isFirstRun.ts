import { app } from "electron";
import { ensureFile, pathExists } from "fs-extra";
import { resolve as resolvePath } from "path";

export async function isFirstRun(): Promise<boolean> {
  const filePath = resolvePath(app.getPath("userData"), "first-run");
  const didExist = await pathExists(filePath);
  if (!didExist) {
    await ensureFile(filePath);
  }
  return !didExist;
}
