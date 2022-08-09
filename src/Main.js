//import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import Tasks from "./Tasks/Tasks";
import "./PageInfo.css";

import { useSelector } from "react-redux";

function Main(props) {
  const userData = useSelector((state) => state.tasks.userData);

  return (
    <div className="Main">
      <SearchBar />

      <div className="PageInfo">
        <div className="MainImg Img" alt="Image" />
        <div className="Body">
          <div className="Header">
            Welcome,{" "}
            <span>{userData && userData.name ? userData.name : ""}</span>
          </div>
          <div className="Text">
            With Tasky, you can create tasks or send them to others. To get
            started, create a task below or search for someone above to send
            them a message or a task.
          </div>
        </div>
      </div>

      <Tasks />
    </div>
  );
}
export default Main;
