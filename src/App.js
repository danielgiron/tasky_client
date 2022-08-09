import { Route, Routes, useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { setUserData } from "./features/TaskSlice";
import { useSelector, useDispatch } from "react-redux";

import "./App.css";
import { blob1, blob2 } from "./Blobs";
import { backendBaseURL } from "./Utils/UtilFunctions";

import Login from "./Login";
import Main from "./Main";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Messages from "./Messages/Messages";
import Settings from "./Settings";
import PageNotFound from "./PageInfo";
import MessageConsole from "./Messages/MessageConsole";

function App() {
  const userData = useSelector((state) => state.tasks.userData); // for saving in redux store
  const dispatch = useDispatch();

  const [userID, setUser] = useState(
    JSON.parse(localStorage.getItem("userID")) || ""
  );
  const [sessionID, setSessionID] = useState(
    JSON.parse(localStorage.getItem("sessionID")) || ""
  );

  useEffect(() => {
    const getUserData = async () => {
      await axios
        .post(`${backendBaseURL}/users/poll`, {
          userID: userID, // user and sessionID are passed in as props
          session: sessionID,
        })
        .then((res) => {
          dispatch(setUserData(res.data));
          localStorage.setItem("userID", res.data._id);
          localStorage.setItem("sessionID", res.data.session);
          // console.log("userData:", res.data);
        })
        .catch((e) => {
          console.log("User data not found:", e);
        });
    };

    if (userID && sessionID) {
      getUserData();
    }
  }, []);

  useEffect(() => {
    // setUser(JSON.parse(localStorage.getItem("userID")));
    // setSessionID(JSON.parse(localStorage.getItem("sessionID")));

    setUser(userData._id);
    setSessionID(userData.session);
    if (!userData?._id || !userData?.session) {
      localStorage.setItem("userID", "");
      localStorage.setItem("sessionID", "");
    } else {
      localStorage.setItem("userID", userData._id);
      localStorage.setItem("sessionID", userData.session);
    }
  }, [userData]);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            userID ? (
              <Dashboard
                user={userID}
                setUser={setUser}
                sessionID={sessionID}
                setSessionID={setSessionID}
              />
            ) : (
              <Navigate to={"/login"} />
            )
          }
        >
          <Route path="/" element={<Main />} />
          <Route path="/profile/:profileID" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:threadID" element={<MessageConsole />} />
          <Route path="/settings" element={<Settings setUser={setUser} />} />
        </Route>

        {/* If user is already logged in, redirect to root */}
        <Route
          path="/login"
          element={
            userID ? (
              <Navigate to="/" />
            ) : (
              <Login user={userID} setUser={setUser} />
            )
          }
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <div className="background">
        {/* {userID ? ( */}
        <div className="blobsContainer">
          <div className="blob1">{blob1}</div>
          <div className="blob2">{blob2}</div>
        </div>
        {/* ) : null}*/}
      </div>
    </div>
  );
}

export default App;
