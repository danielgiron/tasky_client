import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./SearchBar.css";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "./features/TaskSlice";
import { openMessages, backendBaseURL } from "./Utils/UtilFunctions";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

function SearchBar(props) {
  // for tracking form input values (search bar query)
  const [query, setQuery] = useState("");
  // for updating search query response values
  const [resData, setResData] = useState([]);
  // for accessing/updating the redux store
  const userData = useSelector((state) => state.tasks.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
  }

  async function toggleContact(user) {
    const endpoint = `${backendBaseURL}/users/toggleContact`;
    const body = {
      userID: userData._id,
      contactID: user._id,
      contactName: user.name,
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

  function goToProfile(profileID) {
    navigate(`/profile/${profileID}`);
  }

  // used in live-updating response for search bar
  async function handleChange(e) {
    e.preventDefault();
    setQuery(e.target.value);
    const endpoint = `${backendBaseURL}/users/search`;
    const body = { name: e.target.value };
    await axios
      .post(endpoint, body)
      .then((res) => {
        setResData(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const searchResults = resData.map((user) => {
    // userData is the user currently logged in and stored in redux store
    // user is the user returned from the search query
    return (
      <div key={user._id} className="SearchResultEntry">
        <div
          onClick={() => {
            goToProfile(user._id);
          }}
          className="userInfo trailOff"
        >
          <span className="name">{user.name}</span>
          <span className="email">{user.email}</span>
        </div>
        <div className="actions">
          <button
            className="addContactBtn"
            onClick={() => {
              toggleContact(user);
            }}
          >
            {userData.contacts.find((obj) => {
              return obj.id === user._id;
            })
              ? "Remove "
              : "Add "}
            Contact
          </button>
          <button
            className="messagesButton"
            onClick={() => {
              // imported from UtilFunctions.js
              openMessages(userData._id, user._id, navigate);
            }}
          >
            Message
          </button>
        </div>
      </div>
    );
  });

  const SearchResultsContainer = (
    <div
      className="SearchResultsContainer"
      onMouseLeave={() => {
        setQuery("");
      }}
    >
      {searchResults.length === 0 ? (
        <span className="emptyResults">There's nothing there...</span>
      ) : (
        searchResults
      )}
    </div>
  );

  return (
    <div className="SearchContainer">
      <form className="SearchBar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search for a user..."
          value={query}
          onChange={handleChange}
        />
      </form>
      {query == "" ? null : SearchResultsContainer}
    </div>
  );
}
export default SearchBar;
