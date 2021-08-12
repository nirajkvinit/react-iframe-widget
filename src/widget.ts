const defaultStyles: any = {
  border: "none",
  "z-index": 2147483647,
  height: "7vh",
  width: "25vw",
  display: "block !important",
  visibility: "visible",
  background: "none transparent",
  opacity: 1,
  "pointer-events": "auto",
  "touch-action": "auto",
  position: "fixed",
  right: "40vw",
  bottom: "0.5vh",
};
interface IWidget {
  iframe: HTMLIFrameElement | null;
  init: () => void;
  setupListeners: () => void;
  createIframe: () => void;
  getStudentData: () => void;
  handleMessage: (event: MessageEvent) => void;
}

const Widget: IWidget = {
  iframe: null,
  init: function () {
    if (shouldTriviaQuizOpen()) {
      this.createIframe();
      this.getStudentData();
    }
  },
  createIframe: function () {
    this.iframe = document.createElement("iframe");
    let styles = "";
    for (let key in defaultStyles) {
      styles += key + ": " + defaultStyles[key] + ";";
    }
    this.iframe.setAttribute("style", styles);
    this.iframe.id = "trivia-quiz-iframe";
    this.iframe.src = "http://localhost:9000";
    this.iframe.referrerPolicy = "origin";
    document.body.appendChild(this.iframe);
    this.setupListeners();
  },
  setupListeners: function () {
    window.addEventListener("message", this.handleMessage.bind(this));
  },
  getStudentData: function () {
    let webpagelocation = window.location;

    if (webpagelocation.pathname.indexOf("/s/dashboard") >= 0) {
      let intervalVal = setInterval(() => {
        // let userData = getUserData();
      }, 5000);
    }
  },
  handleMessage: function (e) {
    e.preventDefault();
    if (!e.data || typeof e.data !== "string") return;
    let data = JSON.parse(e.data);

    if (data.identifier === "triviaquiz")
      switch (data.data.action) {
        case "init": {
          if (this.iframe) {
            const userData = getUserData();
            console.log("nirajkvinit", "clientside", userData);
            this.iframe.contentWindow.postMessage(
              JSON.stringify({
                identifier: "triviaquiz",
                data: { action: "sendUserData", userData },
              }),
              "*"
            );
          }
          break;
        }
        case "closeIframe": {
          if (this.iframe) {
            closeTriviaQuizIframe();
          }
          break;
        }
        case "minimizeIframe": {
          if (this.iframe) {
            document.getElementById("trivia-quiz-iframe").style.height = "7vh";
          }
          break;
        }
        case "maximizeIframe": {
          if (this.iframe) {
            document.getElementById("trivia-quiz-iframe").style.height = "65vh";
          }
          break;
        }
        default:
          break;
      }
  },
};

function shouldTriviaQuizOpen() {
  let returnVal = false;
  const userData: any = getUserData();
  const { role } = userData;

  if (userData && role === "student") {
    const data = window.localStorage.getItem("triviaQuizIframeStatus");
    if (!data) {
      returnVal = true;
    } else {
      const parsedData = JSON.parse(data);
      const now = new Date();

      if (now.getTime() > parsedData.expiry) {
        localStorage.removeItem("triviaQuizIframeStatus");
        returnVal = true;
      }
    }
  }

  return returnVal;
}

function closeTriviaQuizIframe() {
  document.getElementById("trivia-quiz-iframe").remove();
  const now = new Date();
  const data = { isClosed: true, expiry: now.getTime() + 1000 * 60 * 60 * 4 };
  window.localStorage.setItem("triviaQuizIframeStatus", JSON.stringify(data));
}

function getUserData() {
  let userData = null;

  let wzrk_pr_data = window.localStorage.getItem("WZRK_PR");
  let userTraits = window.localStorage.getItem("ajs_user_traits");

  if (wzrk_pr_data && userTraits) {
    try {
      const {
        Name: studentName,
        Identity: studentId,
        Role: role,
      } = JSON.parse(decodeURIComponent(wzrk_pr_data));
      const { course: courseName } = JSON.parse(userTraits);

      if (role === "student") {
        userData = {
          courseName,
          role,
          studentName,
          studentId,
        };
      }
    } catch (error) {
      console.error("arts_trivia_quiz", "error fetching/parsing user data");
    }
  }

  return userData;
}

export default Widget;
