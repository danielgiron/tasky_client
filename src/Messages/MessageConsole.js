import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./MessageConsole.css";
import { generateMsgDiv, backendBaseURL } from "../Utils/UtilFunctions";
import { useSelector } from "react-redux";

function MessageConsole(props) {
  const userData = useSelector((state) => state.tasks.userData);
  const { threadID } = useParams();

  const [content, setContent] = useState("");
  const [thread, setThread] = useState(null);
  const [messages, setMessages] = useState(null);
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  function handleContentChange(e) {
    setContent(e.target.value);
  }

  useEffect(() => {
    const endpoint = `${backendBaseURL}/threads/findByThreadID`;
    const body = { userID: userData._id, threadID: threadID };

    function getMessages() {
      axios
        .post(endpoint, body)
        .then((res) => {
          setThread(res.data);
          setMessages(res.data.messages);

          // console.log("Sent request to /thread/findThread");
        })
        .catch((e) => {
          console.log("Error retrieving messages");
        });
    }

    getMessages();
    const intervalID = setInterval(() => {
      getMessages();
    }, 500);

    return () => {
      clearInterval(intervalID);
      // console.log("Unmounted MessageConsole, cleared interval");
    };
  }, [userData]);

  async function sendMessage(e) {
    e.preventDefault();
    const endpoint = `${backendBaseURL}/threads/newMessage`;
    const messageObj = {
      sender: userData._id,
      content: content,
      date: Date.now(),
      status: "sent",
    };
    const body = {
      userID: userData._id,
      threadID,
      messageObj,
      notificationMessage: `${userData.name} sent you a message!`,
    };
    await axios
      .post(endpoint, body)
      .then((res) => {
        setMessages([...messages, messageObj]);
        setContent("");
        setTimeout(scrollToBottom, 100);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function deleteThread() {
    const endpoint = `${backendBaseURL}/threads/delete`;
    const body = { userID: userData._id, threadID };
    axios
      .post(endpoint, body)
      .then((res) => {
        navigate("/messages");
      })
      .catch((e) => {
        // console.log(e);
        console.log("Error deleting conversation");
      });
  }

  return (
    <>
      <div className="MessageConsole">
        <div className="ConsoleHeader">
          <button
            onClick={() => {
              navigate(-1);
            }}
            className="BackBtn"
          >
            Back
          </button>
          <div className="Meta">
            {thread && thread.parties
              ? thread.parties.map((party) => {
                  if (party._id !== userData._id) {
                    return <div key={party._id}>{party.name}</div>;
                  }
                })
              : ""}
          </div>
          <button className="ScrollBtn" onClick={scrollToBottom}>
            Scroll to Bottom
          </button>
        </div>

        <div className="MessagesContainer">
          {messages
            ? messages.map((msg) => generateMsgDiv(msg, userData._id, thread))
            : null}
          <div ref={messagesEndRef} />
        </div>

        <form className="MessageInput" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            name="content"
            value={content}
            onChange={handleContentChange}
            required
          />
          <button>Send</button>
        </form>
      </div>
      <div className="DeleteThread">
        Delete Conversation? <span onClick={deleteThread}>Click here</span>
      </div>
    </>
  );
}
export default MessageConsole;
