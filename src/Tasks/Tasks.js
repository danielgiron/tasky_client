//import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskObj from "./TaskObj";
import "./Tasks.css";
import NewTask from "./NewTask";
import { backendBaseURL } from "../Utils/UtilFunctions";

import { useSelector, useDispatch } from "react-redux";
import { setTasks } from "../features/TaskSlice";
import Loader from "../Utils/Loader";

function Tasks(props) {
  const taskStore = useSelector((state) => state.tasks.tasks);
  const userData = useSelector((state) => state.tasks.userData);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getTasks() {
      await axios
        .post(`${backendBaseURL}/tasks/userTasks`, {
          userID: userData._id,
        })
        .then((res) => {
          dispatch(setTasks(res.data));
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    try {
      if (userData && userData._id) {
        getTasks();
      }
    } catch (e) {
      console.log(e);
    }
  }, [userData]);

  return (
    <div className="Tasks">
      <NewTask />
      <div className="Container">
        <div className="SectionHeader">My Tasks</div>
        {taskStore && taskStore.selfTasks && taskStore.selfTasks.length > 0 ? (
          taskStore.selfTasks.map((task) => {
            return <TaskObj key={task._id} task={task} />;
          })
        ) : (
          <div className="Placeholder">No tasks yet</div>
        )}
      </div>

      <div className="Container">
        <div className="SectionHeader">Recieved Tasks</div>
        {taskStore &&
        taskStore.recievedTasks &&
        taskStore.recievedTasks.length > 0 ? (
          taskStore.recievedTasks.map((task) => {
            return <TaskObj key={task._id} task={task} />;
          })
        ) : (
          <div className="Placeholder">No tasks recieved</div>
        )}
      </div>

      <div className="Container">
        <div className="SectionHeader">Sent Tasks</div>
        {taskStore && taskStore.sentTasks && taskStore.sentTasks.length > 0 ? (
          taskStore.sentTasks.map((task) => {
            return <TaskObj key={task._id} task={task} />;
          })
        ) : (
          <div className="Placeholder">No tasks sent</div>
        )}
      </div>
    </div>
  );
}
export default Tasks;
