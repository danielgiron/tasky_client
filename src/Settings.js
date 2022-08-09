//import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "./features/TaskSlice";
import { backendBaseURL } from "./Utils/UtilFunctions";
import "./Settings.css";

import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";
// import PageInfo from "./PageInfo";

function Settings(props) {
  const userData = useSelector((state) => state.tasks.userData); // for saving in redux store
  const dispatch = useDispatch();

  // Profile Preferences
  const [name, setName] = useState(userData?.name || "");
  const [bio, setBio] = useState(userData?.bio || "");

  // Notification Preferences
  const [messageNotifications, setMessageNotifications] = useState(
    userData?.settings?.messageNotifications || false
  );
  const [taskNotifications, setTaskNotifications] = useState(
    userData?.settings?.taskNotifications || false
  );
  const [contactNotifications, setContactNotifications] = useState(
    userData?.settings?.contactNotifications || false
  );

  // Change/Update Detectors
  const [profilePreferences, setProfilePreferences] = useState(
    userData ? { bio: userData.bio, name: userData.name } : {}
  );
  const [notificationPreferences, setNotificationsPreferences] = useState(
    userData?.settings || {}
  );

  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  // console.log(userData);

  async function updateSettings(e) {
    e.preventDefault();
    const userID = userData._id;
    const endpoint = `${backendBaseURL}/users/settings`;
    const body = {
      userID,
      name,
      bio,
      messageNotifications,
      taskNotifications,
      contactNotifications,
    };

    await axios
      .post(endpoint, body)
      .then((res) => {
        // console.log(res.data);
        dispatch(setUserData(res.data));
        setNotificationsPreferences(res.data.settings);
        setProfilePreferences({ bio: res.data.bio, name: res.data.name });
      })
      .catch((err) => {
        console.log("Error updating bio", err);
      });
  }

  async function confirmedDelete() {
    if (deleteConfirmation === userData.name) {
      const userID = userData._id;
      const endpoint = `${backendBaseURL}/users/deleteUser`;
      const body = { userID };

      await axios
        .post(endpoint, body)
        .then((res) => {
          localStorage.removeItem("userID");
          dispatch(setUserData(null));
          props.setUser(null); //passed in from App.js, used to set user to null App wide
        })
        .catch((err) => {
          console.log("Error deleting user", err);
        });
    }
  }

  const notificationPref_isChanged =
    notificationPreferences.taskNotifications !== taskNotifications ||
    notificationPreferences.contactNotifications !== contactNotifications ||
    notificationPreferences.messageNotifications !== messageNotifications;
  const profilePref_isChanged =
    profilePreferences.bio !== bio || profilePreferences.name !== name;

  return (
    <>
      {userData && userData.bio ? (
        <>
          <div className="Settings">
            <div className="PageInfo">
              <div className="Img SettingsImg" alt="Settings" />
              <div className="Body">
                <div className="Header">Settings</div>
                <div className="Text">Edit your settings here</div>
              </div>
            </div>

            <div className="Container">
              <form onSubmit={updateSettings}>
                <div
                  className={`SettingsGroup ${
                    profilePref_isChanged ? "Updated" : ""
                  }`}
                >
                  <div className="Header">
                    Profile Preferences{" "}
                    {`${profilePref_isChanged ? "(unsaved)" : ""}`}
                  </div>

                  <div className="setting">
                    <label className="leftPanel" htmlFor="name">
                      Name
                    </label>
                    <div className="rightPanel">
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="setting">
                    <label className="leftPanel" htmlFor="bio">
                      Profile Bio
                    </label>
                    <div className="rightPanel">
                      <input
                        type="text"
                        id="bio"
                        value={bio}
                        maxLength="250"
                        onChange={(e) => {
                          setBio(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={`SettingsGroup ${
                    notificationPref_isChanged ? "Updated" : ""
                  }`}
                >
                  <div className="Header">
                    Notification Preferences{" "}
                    {`${notificationPref_isChanged ? "(unsaved)" : ""}`}
                  </div>
                  <div className="setting">
                    <label className="leftPanel" htmlFor="newMessages">
                      New Messages
                    </label>
                    <input
                      className="rightPanel"
                      type="checkbox"
                      id="newMessages"
                      checked={messageNotifications}
                      onChange={(e) => {
                        setMessageNotifications(e.target.checked);
                      }}
                    />
                  </div>
                  <div className="setting">
                    <label className="leftPanel" htmlFor="newTasks">
                      New Tasks
                    </label>
                    <input
                      className="rightPanel"
                      type="checkbox"
                      id="newTasks"
                      checked={taskNotifications}
                      onChange={(e) => {
                        setTaskNotifications(e.target.checked);
                      }}
                    />
                  </div>
                  <div className="setting">
                    <label className="leftPanel" htmlFor="newContacts">
                      New Contacts
                    </label>
                    <input
                      className="rightPanel"
                      type="checkbox"
                      id="newContacts"
                      checked={contactNotifications}
                      onChange={(e) => {
                        setContactNotifications(e.target.checked);
                      }}
                    />
                  </div>
                </div>
                <button
                  className={`UpdateBtn ${
                    notificationPref_isChanged || profilePref_isChanged
                      ? "Alert"
                      : ""
                  }`}
                >
                  Save Preferences
                </button>
              </form>

              <div className="SettingsGroup">
                <div className="Header">Account Preferences</div>
                <div className="deleteAccount">
                  <div className="deleteAccount_header">Delete Account</div>
                  <div className="deleteAccount_body">
                    To delete your account, enter your name below and click the
                    'Delete Account' button. WARNING: This action cannot be
                    undone and all tasks and messages related to your account
                    will be permenantly deleted.
                  </div>
                  <div className="deleteConfirmation">
                    <input
                      type="text"
                      className="deleteAccount_input"
                      placeholder="Enter name to Delete Account"
                      value={deleteConfirmation}
                      onChange={(e) => {
                        setDeleteConfirmation(e.target.value);
                      }}
                    />
                    <button
                      className={`deleteUserBtn ${
                        deleteConfirmation === userData.name ? "Active" : ""
                      }`}
                      onClick={confirmedDelete}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}
export default Settings;
