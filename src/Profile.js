import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "./features/TaskSlice";
import { openMessages, backendBaseURL } from "./Utils/UtilFunctions";
import NewTask from "./Tasks/NewTask";
import axios from "axios";
import TaskObj from "./Tasks/TaskObj";
import Loader from "./Utils/Loader";
import "./Profile.css";

function Profile(props) {
  const userData = useSelector((state) => state.tasks.userData);
  const dispatch = useDispatch();

  const { profileID } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [sentTasks, setSentTasks] = useState([]);
  const [receivedTasks, setReceivedTasks] = useState([]);

  const [isContact, setIsContact] = useState(false);

  useEffect(() => {
    async function getProfileData() {
      const endpoint = `${backendBaseURL}/users/profile`;
      const body = { userID: userData._id, profileID };
      axios
        .post(endpoint, body)
        .then((res) => {
          // console.log("data recieved back: ", res.data);
          setProfileData(res.data);
          setSentTasks(res.data.sentTasks);
          setReceivedTasks(res.data.receivedTasks);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    getProfileData();

    // if all data is present, check if profileID is in user contacts
    if (userData?.contacts && profileData && profileData.profile) {
      setIsContact(
        userData.contacts.find((obj) => {
          return obj.id === profileData.profile._id;
        })
      );
    }
  }, [userData, profileData]);

  async function toggleContact(profileID) {
    const endpoint = `${backendBaseURL}/users/toggleContact`;
    const body = {
      userID: userData._id,
      contactID: profileData.profile._id,
      contactName: profileData.profile.name,
      notificationMessage: `${userData.name} added you as a contact!`,
    };
    await axios
      .post(endpoint, body)
      .then((res) => {
        // console.log(res.data);
        dispatch(setUserData(res.data));
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div className="Profile">
      <div
        className="BackBtn"
        onClick={() => {
          navigate(-1);
        }}
      >
        Back
      </div>

      {profileData && profileData.profile ? (
        <>
          <div className="PageInfo">
            <div className="ProfileImg Img" alt="Profile" />
            <div className="Body">
              <div className="Header">
                <span>{profileData.profile.name}</span>
              </div>
              <div className="Text">{profileData.profile.bio}</div>
              <div className="ProfileActions">
                <button
                  onClick={() => {
                    // imported from UtilFunctions.js
                    openMessages(
                      userData._id,
                      profileData.profile._id,
                      navigate,
                      backendBaseURL
                    );
                  }}
                >
                  <i className="fa-solid fa-comments "></i> Messages
                </button>
                <button
                  className={`ContactBtn ${!isContact ? "" : "notContact"}`}
                  onClick={() => {
                    toggleContact(profileData.profile._id);
                  }}
                >
                  {isContact ? (
                    <i className="fa-solid fa-user-minus"></i>
                  ) : (
                    <i className="fa-solid fa-user-plus"></i>
                  )}
                  {isContact ? " Remove " : " Add "}
                  Contact
                </button>
              </div>
            </div>
          </div>

          <NewTask
            defaultProfile={{
              name: profileData.profile.name,
              id: profileData.profile._id,
            }}
            profileProps={{
              sentTasks: sentTasks,
              setSentTasks: setSentTasks,
              profileID: profileData.profile._id,
            }}
          />

          <div className="Container">
            <div className="SectionHeader trailOff">
              Tasks for {profileData.profile.name}
            </div>
            {sentTasks.length > 0 ? (
              sentTasks.map((task) => {
                return (
                  <TaskObj
                    task={task}
                    key={task._id}
                    profileProps={{
                      tasks: sentTasks,
                      setTasks: setSentTasks,
                      profileID: profileData.profile._id,
                    }}
                  />
                );
              })
            ) : (
              <div className="Placeholder">No tasks sent</div>
            )}
          </div>

          <div className="Container">
            <div className="SectionHeader trailOff">
              Tasks from {profileData.profile.name}
            </div>
            {receivedTasks.length > 0 ? (
              receivedTasks.map((task) => {
                return (
                  <TaskObj
                    task={task}
                    key={task._id}
                    profileProps={{
                      tasks: receivedTasks,
                      setTasks: setReceivedTasks,
                      profileID: profileData.profile._id,
                    }}
                  />
                );
              })
            ) : (
              <div className="Placeholder">No tasks recieved</div>
            )}
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}
export default Profile;
