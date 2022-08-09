import React, { useEffect, useState } from "react";
import "./NewTask.css";

import { useSelector, useDispatch } from "react-redux";
import { addTask } from "../features/TaskSlice";
import { getDefaultDate, backendBaseURL } from "../Utils/UtilFunctions";

import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

function NewTask(props) {
  const { profileProps } = props;
  const userData = useSelector((state) => state.tasks.userData);
  const dispatch = useDispatch();
  const [contacts, setContacts] = useState(
    userData && userData.contacts ? userData.contacts : []
  );
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  // if <New Task /> has a defaultProfile prop, then set the Task default "For" to the defaultProfile
  // i.e. when <NewTask /> is rendered within Profile.js
  const { defaultProfile } = props;
  const [due, setDue] = useState(getDefaultDate());
  let contactOptions = [];

  useEffect(() => {
    if (userData && userData.contacts) {
      setContacts(userData.contacts);
    }
  }, [userData]);

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post(`${backendBaseURL}/tasks`, {
        taskDescription: description,
        recipients: e.target.for.value == "me" ? [] : [e.target.for.value],
        owner: JSON.parse(localStorage.getItem("userID")),
        dateDue: due,
        message,
        notificationMessage: `${userData.name} sent you a task!`,
      })
      .then((res) => {
        ////////////////////////////////////////////////////////////////////////
        // if task sent from profile page (where profileProps would be defined),
        // then update tasks display using parent hooks, otherwise update tasks
        // display using redux which is used for the user's tasks page
        if (profileProps) {
          if (e.target.for.value == profileProps.profileID) {
            profileProps.setSentTasks([...profileProps.sentTasks, res.data]);
          }
        } else {
          dispatch(addTask(res.data));
        }
        ////////////////////////////////////////////////////////////////////////
        setDescription("");
        setMessage("");
        setDue(getDefaultDate());
      })
      .catch((err) => {
        console.log("Error submitting new task");
      });
  }

  // reformats names to be capitalized, returns option elements for contacts
  contactOptions = contacts.map((contact) => {
    return (
      <option key={contact.id} value={contact.id}>
        {contact.name
          .trim()
          .toLowerCase()
          .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))}
      </option>
    );
  });

  return (
    <>
      <form onSubmit={handleSubmit} className="NewTask Container">
        <div className="SectionHeader">
          <span>New Task</span>
          <button>+ Add Task</button>
        </div>

        <input
          className="descInput formItem"
          type={"text"}
          placeholder={"Enter new task description here!"}
          maxLength={80}
          name="description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required={true}
        />

        <div className="forInput formItem">
          <label htmlFor="for">Assign To</label>
          <select
            id="for"
            name="for"
            defaultValue={defaultProfile ? defaultProfile.id : "me"}
          >
            <option value="me">me</option>
            {
              // if rendered in Profile.js with parent defaultProfile props,
              // add an option in NewTask "Assign to" select for the profile
              // being visited if not already in user's contacts
              defaultProfile &&
              !userData.contacts.find(
                (contact) => contact.id === defaultProfile.id
              ) ? (
                <option value={defaultProfile.id}>
                  {defaultProfile.name
                    .trim()
                    .toLowerCase()
                    .replace(/\w\S*/g, (w) =>
                      w.replace(/^\w/, (c) => c.toUpperCase())
                    )}
                </option>
              ) : null
            }
            {contactOptions}
          </select>
        </div>

        <div className="dueInput formItem">
          <label htmlFor="due">Due Date</label>
          <input
            name="due"
            id="due"
            type={"date"}
            value={due}
            onChange={(e) => {
              setDue(e.target.value);
            }}
          />
        </div>

        <input
          className="messageInput formItem"
          type={"text"}
          placeholder={"Add optional message here"}
          maxLength={100}
          name="message"
          id="message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            // console.log(message);
          }}
        />
      </form>
    </>
  );
}
export default NewTask;
