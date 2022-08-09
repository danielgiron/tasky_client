//import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { backendBaseURL } from "../Utils/UtilFunctions";
import axios from "axios";
// import './NotificationObj.css'

function NotificationObj(props) {
  const { parentProps } = props;
  const navigate = useNavigate();
  const { notification, userID } = props;
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteNotification(notif_ID) {
    const endpoint = `${backendBaseURL}/users/deleteNotification`;
    const body = { notif_ID, userID };
    axios
      .post(endpoint, body)
      .then((res) => {
        // console.log(res.data);
        setIsDeleting(true); // deleting animation "slideout" from Task.css re-used here
        setTimeout(() => {
          if (parentProps) {
            const updatedNotifications = parentProps.notifications.filter(
              (n) => {
                return n._id != notification._id;
              }
            );
            parentProps.setNotifications([...updatedNotifications]);
          }
        }, 1000);
      })
      .catch((e) => console.log("Error sending deleteNotification request"));
  }

  return (
    <div
      className={`Notification ${isDeleting ? "isDeleting" : ""}`}
      key={notification._id}
    >
      <div
        className="NotificationContent"
        // onClick={() => {
        //   navigate(`${notification.goTo}`);
        // }}
      >
        {notification.notificationMessage}
      </div>
      <div className="NotificationTime">
        {new Date(notification.date).toLocaleTimeString()} •{" "}
        {new Date(notification.date).toDateString()}
      </div>

      <button
        onClick={() => {
          deleteNotification(notification._id);
        }}
      >
        x
      </button>
    </div>
  );
}
export default NotificationObj;
