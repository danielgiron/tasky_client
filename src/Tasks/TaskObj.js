//import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import React, { useState } from "react";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { removeTask } from "../features/TaskSlice";
import { backendBaseURL } from "../Utils/UtilFunctions";

import Loader from "../Utils/Loader";

function TaskObj(props) {
  const { task, profileProps } = props;
  const userData = useSelector((state) => state.tasks.userData);

  const [completed, setCompleted] = useState(task.completed);
  const [deleting, setDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const dispatch = useDispatch();

  const today = new Date().getTime();
  const taskDueDate = new Date(task.dateDue).getTime();
  const [alert, setAlert] = useState(
    taskDueDate - today < 86400000 && !completed
  ); // used to show alert when task is nearing due date

  async function toggleComplete() {
    try {
      setIsLoading(true);
      await axios
        .put(`${backendBaseURL}/tasks/${task._id}`, {
          completed: !completed,
        })
        .then((res) => {
          setIsLoading(false);
          setCompleted(!completed);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  }

  function toggleInfo() {
    setShowInfo(!showInfo);
    // console.log(task);
  }

  async function deleteTask() {
    try {
      await axios
        .delete(`${backendBaseURL}/tasks/${task._id}`)
        .then((res) => {
          setDeleting(true);
          setTimeout(() => {
            // if task deleted from profile page (where profileProps would be defined),
            // then update tasks display using parent hooks, otherwise update tasks
            // display using redux which is used for the user's tasks page
            if (profileProps) {
              const updatedTasks = profileProps.tasks.filter(
                (oldTask) => oldTask._id != task._id
              );
              profileProps.setTasks([...updatedTasks]);
            } else {
              dispatch(removeTask({ _id: task._id }));
            }
          }, 1000); //timeout delay so delete animation has time to play out
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div
      className={`TaskObj ${completed ? "completed" : ""} ${
        deleting ? "isDeleting" : ""
      } ${isLoading ? "isLoading" : ""} ${alert && !completed ? "alert" : ""}`}
      disabled={isLoading}
    >
      {userData && userData.contacts && userData._id ? (
        <>
          <div className="TaskUI">
            <button onClick={toggleInfo} className="infoBtn">
              {showInfo ? (
                <i className="fa-solid fa-circle-chevron-up fa-xl"></i>
              ) : (
                <i className="fa-solid fa-circle-chevron-down fa-xl"></i>
              )}
            </button>
            <span className="taskDescription trailOff">
              {alert && !completed ? (
                <span className="alertIcon">
                  <i className="fa-solid fa-triangle-exclamation fa-lg"></i>{" "}
                </span>
              ) : null}
              {task.taskDescription.trim()}
            </span>

            <div className="taskActions">
              <button className="completeBtn" onClick={toggleComplete}>
                {completed ? (
                  <i className="fa-solid fa-circle-check fa-xl"></i> // Incomplete
                ) : (
                  <i className="fa-regular fa-circle-check fa-xl"></i> // Completed
                )}
              </button>
              {task.owner._id == userData._id && task && userData ? (
                <button className="deleteBtn" onClick={deleteTask}>
                  <i className="fa-regular fa-trash-can fa-xl"></i>
                </button>
              ) : (
                ""
              )}
            </div>
          </div>

          {task.message && task.message.length > 0 ? (
            <div className={`MessagePanel ${showInfo ? "" : "isHidden"}`}>
              "{task.message.trim()}"<span className="whitespace"></span>
              {`—${task.owner.name}`}
            </div>
          ) : null}

          <div className={`InfoPanel ${showInfo ? "" : "isHidden"} `}>
            Assigned to
            <span>
              {task.recipients[0] && task.recipients[0].name != userData.name
                ? task.recipients[0].name
                : "You"}
            </span>
            by
            <span>
              {task.owner.name == userData.name ? "You" : task.owner.name}
            </span>
            on
            <span>{new Date(task.dateCreated).toDateString()}.</span> This task
            is due on
            <span className={`${alert && !completed ? "alert" : ""}`}>
              {new Date(task.dateDue).toDateString()}
            </span>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
export default TaskObj;
