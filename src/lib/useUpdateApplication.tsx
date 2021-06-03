import { useEffect, useState } from "react";
import { client } from "./client";

export type UpdateAvailable = {
  name: string;
  applyUpdate: () => void;
} | null;

export function useUpdateApplication(): { updateAvailable: UpdateAvailable } {
  const [updateAvailable, setUpdateAvailable] = useState<UpdateAvailable>(null);

  useEffect(() => {
    const interval = setInterval(checkForUpdate, 10 * 1000);
    checkForUpdate();

    function checkForUpdate() {
      client(`/info/update`)
        .then((r) => r.json())
        .then((r: { name: string } | null) => {
          if (r) {
            clearInterval(interval);
            setUpdateAvailable({
              ...r,
              applyUpdate() {
                client(`/info/update/install`, { method: "post" });
              },
            });
          }
        });
    }

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { updateAvailable };
}
