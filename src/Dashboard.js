import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "./features/TaskSlice";
import { useState } from "react";
import { backendBaseURL } from "./Utils/UtilFunctions";
import axios from "axios";
import Notifications from "./Notifications/Notifications";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

function Dashboard(props) {
  const { user, setUser, sessionID, setSessionID } = props; // for saving in local storage
  const userData = useSelector((state) => state.tasks.userData); // for saving in redux store
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileMenuIsActive, setMobileMenuIsActive] = useState(false);

  const handleLogout = async (e) => {
    await axios
      .post(`${backendBaseURL}/users/logout`, { userID: userData._id })
      .then((res) => {
        // console.log("user logged out");
        localStorage.removeItem("userID");
        localStorage.removeItem("sessionID");
        dispatch(setUserData(null));
        setUser(null);
        setSessionID(null);
      })
      .catch((e) => {
        // console.log("error logging out");
        alert("Error logging out");
      });
  };

  return (
    <div className="layoutContainer">
      <div className={`mobileMenu ${mobileMenuIsActive ? "active" : ""}`}>
        <div className="menuContainer">
          <button
            className="mobileMenu-item"
            onClick={() => {
              navigate("/");
              setMobileMenuIsActive(!mobileMenuIsActive);
            }}
          >
            <i className="fa-solid fa-list-check"></i>
            <span>Tasks</span>
          </button>
          <button
            className="mobileMenu-item"
            onClick={() => {
              navigate("/messages");
              setMobileMenuIsActive(!mobileMenuIsActive);
            }}
          >
            <i className="fa-solid fa-comments"></i>
            <span>Messages</span>
          </button>
          <button
            className="mobileMenu-item"
            onClick={() => {
              navigate("/settings");
              setMobileMenuIsActive(!mobileMenuIsActive);
            }}
          >
            <i className="fa-solid fa-gear"></i>
            <span>Settings</span>
          </button>
          <button
            className="closeMobileMenu"
            onClick={() => {
              setMobileMenuIsActive(!mobileMenuIsActive);
            }}
          >
            <i className="fa-solid fa-circle-xmark fa-2xl"></i>
          </button>
        </div>
      </div>

      <div className="header">
        <div className="brand">TASKY</div>
        <nav className="topNav">
          <div className="mobile">
            <button
              className="menuBtn topNav-item"
              onClick={() => {
                setMobileMenuIsActive(!mobileMenuIsActive);
              }}
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <button onClick={handleLogout} className="logoutBtn topNav-item">
              <i className="fa-solid fa-power-off"></i>
            </button>
          </div>
          <div className="desktop">
            <button onClick={handleLogout} className="topNav-item">
              Log Out
            </button>
          </div>
        </nav>
      </div>

      <nav className="sideNav">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="sideNav-item"
        >
          Tasks
        </button>

        <button
          onClick={() => {
            navigate("/messages");
          }}
          className="sideNav-item"
        >
          Messages
        </button>

        <button
          onClick={() => {
            navigate("/settings");
          }}
          className="sideNav-item"
        >
          Settings
        </button>
      </nav>

      {/* where page content is displayed */}
      <div className="content">
        <Outlet />
      </div>

      {/* assigned className: "aside" */}
      <Notifications userData={userData} />

      <footer>© Baldwin Giron</footer>
    </div>
  );
}
export default Dashboard;
