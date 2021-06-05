import { faArrowToBottom } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import unhandled from "electron-unhandled";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "../index.scss";
import { client } from "../lib/client";
import { useUpdateApplication } from "../lib/useUpdateApplication";

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
      <div className="flex-grow-1">
        <div className="navbar navbar-dark bg-dark text-white px-3 py-1">
          <h1 className="m-0 navbar-brand">💖 Hello World!</h1>
        </div>
        <div className="p-3">
          <p>Welcome to your React Electron application.</p>
          <button
            className="btn btn-primary"
            onClick={() => setCount(count + 1)}
          >
            {count}
          </button>
        </div>
      </div>
      <div className="d-flex align-items-center px-3 py-2 bg-dark text-white">
        {updateAvailable ? (
          <>
            <div>
              <div className="small text-muted font-italic">{version}</div>
              <div>An update ({updateAvailable.name}) is available</div>
            </div>
            <button
              className="ml-auto btn btn-sm btn-info text-nowrap"
              onClick={() => updateAvailable.applyUpdate()}
            >
              <Icon icon={faArrowToBottom} />
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
              className="ml-auto btn btn-sm btn-secondary text-nowrap"
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
              <Icon icon={faArrowToBottom} />
              Check Now
            </button>
          </>
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("appRoot"));
