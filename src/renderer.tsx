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
    client(`/info/version`)
      .then((r) => r.text())
      .then((r) => setVersion(r));
  }, []);

  const { updateAvailable, checkForUpdate } = useUpdateApplication();

  return (
    <div className="h-100 d-flex flex-column">
      <div className="flex-grow-1 p-3">
        <h1 className="mt-1 mb-3">💖 Hello World!</h1>
        <p>Welcome to your React Electron application.</p>
        <button onClick={() => setCount(count + 1)}>{count}</button>
        <p>{version}</p>
      </div>
      <div className="update-available d-flex flex-align-center p-3">
        {updateAvailable ? (
          <>
            <div>An update ({updateAvailable.name}) is available</div>
            <button
              className="ml-auto"
              onClick={() => updateAvailable.applyUpdate()}
            >
              Update Now
            </button>
          </>
        ) : (
          <>
            <div>No updates available</div>
            <button className="ml-auto" onClick={() => checkForUpdate()}>
              Check Now
            </button>
          </>
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("appRoot"));
