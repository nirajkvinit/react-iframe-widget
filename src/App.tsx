import React, { useContext, useState } from "react";
import { Context } from "./context/context";
import Active from "./components/Active";

const App: React.FC = (props) => {
  const userData = JSON.parse(useContext(Context));
  const { courseName, studentName, studentId, headerColor } = userData;
  const [isMinimized, setIsMinimized] = useState(true);

  console.log("nirajkvinit", "iframeside in app", userData);

  const closeIframe = () => {
    window.parent.postMessage(
      JSON.stringify({
        identifier: "triviaquiz",
        data: { action: "closeIframe" },
      }),
      "*"
    );
  };

  const minimizeIframe = () => {
    setIsMinimized(true);
    window.parent.postMessage(
      JSON.stringify({
        identifier: "triviaquiz",
        data: { action: "minimizeIframe" },
      }),
      "*"
    );
  };

  const maximizeIframe = () => {
    setIsMinimized(false);
    window.parent.postMessage(
      JSON.stringify({
        identifier: "triviaquiz",
        data: { action: "maximizeIframe" },
      }),
      "*"
    );
  };

  const renderHeader = () => {
    return (
      <div
        className={`d-flex flex-row  p-1 pt-1 m-0 text-white ${headerColor}`}
      >
        <h3
          className={`text-white flex-grow-1 ${isMinimized ? "blink_me" : ""}`}
        >
          {studentName && studentName} - Did you know?
        </h3>
        <div className="justify-content-end">
          {isMinimized ? (
            <button
              type="button"
              className="btn text-white"
              onClick={maximizeIframe}
            >
              <span className="material-icons-round">open_in_full</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn text-white"
              onClick={minimizeIframe}
            >
              <span className="material-icons-round">close_fullscreen</span>
            </button>
          )}
          <button
            type="button"
            className="btn text-white"
            onClick={closeIframe}
          >
            <span className="material-icons-round">close</span>
          </button>
        </div>
      </div>
    );
  };

  const renderComponent = () => {
    return <Active config={{ email: "nirajkvinit" }} />;
  };

  const renderUi = () => {
    if (isMinimized) {
      return <div className="h-100 w-100 border rounded">{renderHeader()}</div>;
    } else {
      return (
        <div className="h-100 w-100 border rounded">
          {renderHeader()}
          {renderComponent()}
        </div>
      );
    }
  };

  return renderUi();
};

export default App;
