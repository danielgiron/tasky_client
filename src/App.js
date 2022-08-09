import { Route, Routes, useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./App.css";

import Login from "./Login";
import Main from "./Main";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Messages from "./Messages/Messages";
import Settings from "./Settings";
import PageNotFound from "./PageInfo";

import { blob1, blob2 } from "./Blobs";
import MessageConsole from "./Messages/MessageConsole";

function App() {
  const [userID, setUser] = useState(
    JSON.parse(localStorage.getItem("userID"))
  );

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("userID")));
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            userID ? (
              <Dashboard user={userID} setUser={setUser} />
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
