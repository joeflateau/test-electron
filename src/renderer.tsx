import { ipcRenderer } from "electron";
import unhandled from "electron-unhandled";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

unhandled();

function App() {
  const [count, setCount] = useState(0);
  const [version, setVersion] = useState("");
  useEffect(() => {
    ipcRenderer.on("getVersion-reply", (ev, v) => setVersion(v));
    ipcRenderer.send("getVersion");
  }, []);
  return (
    <>
      <h1>💖 Hello World!</h1>
      <p>Welcome to your React Electron application.</p>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <p>{version}</p>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("appRoot"));
