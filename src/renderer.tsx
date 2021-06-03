import unhandled from "electron-unhandled";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { client } from "./lib/client";

unhandled();

function App() {
  const [count, setCount] = useState(0);
  const [version, setVersion] = useState("");
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    client(`/info/version`)
      .then((r) => r.text())
      .then((r) => setVersion(r));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      client(`/info/update-downloaded`)
        .then((r) => r.json())
        .then((r) => setUpdateAvailable(r?.name));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function applyUpdate() {
    client(`/info/update-downloaded/install`, { method: "post" });
  }

  return (
    <>
      <h1>💖 Hello World!</h1>
      <p>Welcome to your React Electron application.</p>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <p>{version}</p>
      {updateAvailable ? (
        <div>
          <div>An update ({updateAvailable}) is available</div>
          <button onClick={() => applyUpdate()}>Update Now</button>
        </div>
      ) : null}
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("appRoot"));
