import { useEffect, useState } from "react";
import { client } from "./client";

export type UpdateAvailable = {
  name: string;
  applyUpdate: () => void;
} | null;

export function useUpdateApplication(): {
  updateAvailable: UpdateAvailable;
  checkingForUpdate: boolean;
  checkForUpdate: () => void;
} {
  const [updateAvailable, setUpdateAvailable] = useState<UpdateAvailable>(null);
  const [checkingForUpdate, setCheckingForUpdate] = useState(false);

  async function checkForUpdate() {
    await client<{ name: string } | null>(`/info/update`).then((r) => {
      setUpdateAvailable(
        r && {
          ...r,
          applyUpdate() {
            client(`/info/update/install`, { method: "post" });
          },
        }
      );
    });
  }

  useEffect(() => {
    const interval = setInterval(checkForUpdate, 10 * 1000);
    checkForUpdate();
    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    updateAvailable,
    checkingForUpdate,
    async checkForUpdate() {
      setCheckingForUpdate(true);
      await client<{ downloadedUpdate: boolean }>(`/info/update/check`, {
        method: "post",
      });
      await checkForUpdate();
      setCheckingForUpdate(false);
    },
  };
}
