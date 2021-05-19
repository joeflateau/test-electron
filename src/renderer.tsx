import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <h1>💖 Hello World!</h1>
      <p>Welcome to your React Electron application.</p>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("appRoot"));
