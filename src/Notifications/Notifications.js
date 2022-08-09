//import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Notifications.css";
import NotificationObj from "./NotificationObj";

function Notifications(props) {
  const userData = props.userData;
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userData && userData._id) {
      const endpoint = "http://localhost:3001/users/getNotifications";
      const body = { userID: userData._id };

      async function getNotifications() {
        await axios
          .post(endpoint, body)
          .then((res) => {
            // console.log("Notifications: ", res.data);
            setNotifications(res.data);
          })
          .catch((e) => {
            console.log("Error retrieving user notifications");
          });
      }

      getNotifications();
      const intervalID = setInterval(() => {
        getNotifications();
      }, 2000);

      return () => {
        clearInterval(intervalID);
        // console.log("Unmounted Notifications, cleared interval");
      };
    }
  }, [userData]);

  return (
    <div className="aside notificationsContainer">
      {userData && notifications && notifications.length > 0 ? (
        notifications.map((notification) => {
          return (
            <NotificationObj
              key={notification._id}
              notification={notification}
              userID={userData._id}
              parentProps={{ notifications, setNotifications }}
            />
          );
        })
      ) : (
        <div className="Placeholder">No new notifications</div>
      )}
    </div>
  );
}
export default Notifications;
