//import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { backendBaseURL } from "../Utils/UtilFunctions";
import SearchBar from "../SearchBar";
import axios from "axios";
import "./Messages.css";

function Messages(props) {
  const userData = useSelector((state) => state.tasks.userData);
  const [threads, setThreads] = useState(null);
  const navigate = useNavigate();

  // Query backend for all user's message threads
  useEffect(() => {
    const endpoint = `${backendBaseURL}/threads`;
    const body = { userID: userData._id };
    axios
      .post(endpoint, body)
      .then((res) => {
        setThreads(res.data);
      })
      .catch((e) => {
        console.log("Error retrieving message threads");
      });
  }, [userData]);

  // If threads exist and successfully received,
  // generate HTML elements for each thread to be displayed
  // in render function within .Threads container
  const threadDivs = [];
  if (threads) {
    threads.map((thread) => {
      // Extract parties in users  thread to display info in HTML element.
      // Include preview of thread using last pushed message in thread
      // On button click, navigate to Message Console using thread id.
      const parties = thread.parties;

      threadDivs.push(
        <div className="Thread" key={thread._id}>
          <div className="Parties trailOff">
            {parties.map((party) => {
              if (party._id !== userData._id) {
                return (
                  <span className="Party" key={party._id}>
                    {party.name}
                  </span>
                );
              } else {
                return null;
              }
            })}
          </div>

          <span className="Preview trailOff">
            {thread.messages && thread.messages[thread.messages.length - 1]
              ? thread.messages[thread.messages.length - 1].content
              : "[ No messages ]"}
          </span>

          <button
            onClick={() => {
              navigate(`/messages/${thread._id}`);
            }}
          >
            Open
          </button>
        </div>
      );
    });
  }

  return (
    <>
      <SearchBar />

      <div className="PageInfo">
        <div className="Img MessagesImg" alt="Messages" />
        <div className="Body">
          <div className="Header">Messages</div>
          <div className="Text">
            Here are your existing conversations. Have any questions about a
            task? To start a new conversation, search for someone you want to
            message using the search bar above.
          </div>
        </div>
      </div>
      <div className="Container ThreadsContainer">
        <div className="SectionHeader">Messages</div>
        <div className="Threads">
          {threadDivs.length === 0 ? (
            <div className="Placeholder">No Conversations Started</div>
          ) : (
            threadDivs
          )}
        </div>
      </div>
    </>
  );
}
export default Messages;
