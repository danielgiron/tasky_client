import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

// used in MessageConsole.js to create elements for messages
export const generateMsgDiv = (msg, userID, thread) => {
  const isSender = msg.sender == userID;
  const date = new Date(msg.date);
  const hour = date.getHours();
  const min = date.getMinutes();
  const formattedHour = hour < 12 ? hour : hour - 12;
  const formattedMins = min < 10 ? `0${min}` : min;
  const formattedTime = `${
    formattedHour == 0 ? "12" : formattedHour
  }:${formattedMins} ${hour < 12 ? "AM" : "PM"}`;
  const sender = thread.parties.find((party) => {
    return party._id == msg.sender;
  });
  return (
    <div
      key={msg._id || msg.date}
      className={isSender ? "Message Sent" : "Message Recieved"}
    >
      <div className="Sender">{sender.name}</div>
      <div className="Content">{msg.content}</div>
      <div className="Time">{formattedTime}</div>
    </div>
  );
};

// used in NewTask.js to generate due date 7 days from today
export function getDefaultDate() {
  const date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (month < 10) {
    month = `0${month}`;
  }

  if (day < 10) {
    day = `0${day}`;
  }

  return `${year}-${month}-${day}`;
}

// used in Profile.js and SearchBar.js to open a new or existing thread
export async function openMessages(userID, profileID, navigate, endpoint) {
  // const endpoint = `http://localhost:3001/threads/findByProfileID`;
  const body = { userID, profileID };
  axios
    .post(endpoint, body)
    .then((res) => {
      // console.log(res.data);
      navigate(`/messages/${res.data._id}`);
    })
    .catch((e) => {
      console.log(e);
    });
}

export const backendBaseURL = "https://tasky-social-network.herokuapp.com";
// export const backendBaseURL = "http://localhost:3001";
