import unhandled from "electron-unhandled";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { client } from "./lib/client";
import { useUpdateApplication } from "./lib/useUpdateApplication";

unhandled();

function App() {
  const [count, setCount] = useState(0);
  const [version, setVersion] = useState("");

  useEffect(() => {
    client<{ name: string }>(`/info/version`).then((r) => setVersion(r.name));
  }, []);

  const { updateAvailable, checkingForUpdate, checkForUpdate } =
    useUpdateApplication();

  return (
    <div className="h-100 d-flex flex-column">
      <div className="flex-grow-1 p-3">
        <h1 className="mt-1 mb-3">💖 Hello World!</h1>
        <p>Welcome to your React Electron application.</p>
        <button className="btn btn-primary" onClick={() => setCount(count + 1)}>
          {count}
        </button>
      </div>
      <div className="update-available d-flex align-items-center p-3">
        {updateAvailable ? (
          <>
            <div>
              <div className="small text-muted font-italic">{version}</div>
              <div>An update ({updateAvailable.name}) is available</div>
            </div>
            <button
              className="ml-auto btn btn-sm btn-info"
              onClick={() => updateAvailable.applyUpdate()}
            >
              Update Now
            </button>
          </>
        ) : (
          <>
            <div>
              <div className="small text-muted font-italic">{version}</div>
              <div>No updates available</div>
            </div>
            <button
              className="ml-auto btn btn-sm btn-secondary"
              onClick={() => checkForUpdate()}
              disabled={checkingForUpdate}
            >
              {checkingForUpdate ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : null}
              Check Now
            </button>
          </>
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("appRoot"));
