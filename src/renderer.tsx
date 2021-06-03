import unhandled from "electron-unhandled";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { client } from "./lib/client";

unhandled();

function App() {
  const [count, setCount] = useState(0);
  const [version, setVersion] = useState("");

  useEffect(() => {
    client(`/info/version`)
      .then((r) => r.text())
      .then((r) => setVersion(r));
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
