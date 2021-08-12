import React from "react";
import { render } from "react-dom";
import App from "./App";
import { Context } from "./context/context";
import "./stylesheets/index.css";

window.addEventListener("DOMContentLoaded", (event) => {
  window.parent.postMessage(
    JSON.stringify({
      identifier: "triviaquiz",
      data: { action: "init" },
    }),
    "*"
  );
  window.removeEventListener("DOMContentLoaded", () => null);
});

window.addEventListener("message", (event) => {
  event.preventDefault();
  if (!event.data || typeof event.data !== "string") return;
  const postData = JSON.parse(event.data);
  console.log("nirajkvinit", "iframeside", postData);
  const {
    identifier,
    data: { action, userData },
  } = postData;

  if (identifier !== "triviaquiz" && action !== "sendUserData") return;

  const headerColor = getHeaderColor();

  return render(
    <Context.Provider value={JSON.stringify({ ...userData, headerColor })}>
      <App />
    </Context.Provider>,
    document.body
  );
});

const getHeaderColor = () => {
  const colors = [
    "triviaQuizIframeHeader1",
    "triviaQuizIframeHeader2",
    "triviaQuizIframeHeader3",
    "triviaQuizIframeHeader4",
    "triviaQuizIframeHeader5",
    "triviaQuizIframeHeader6",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};
