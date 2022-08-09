import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  userData: {},
};

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    /////////////////////////////////////////// task reducers
    setTasks: (state, action) => {
      state.tasks = action.payload;
      // console.log(state.tasks);
    },
    addTask: (state, action) => {
      const task = action.payload;
      if (task.recipients.length == 0) {
        state.tasks.selfTasks.push(action.payload);
      } else {
        state.tasks.sentTasks.push(action.payload);
      }
    },
    removeTask: (state, action) => {
      const newTasks = {
        selfTasks: state.tasks.selfTasks.filter((task) => {
          return task._id !== action.payload._id;
        }),
        recievedTasks: state.tasks.recievedTasks.filter((task) => {
          return task._id !== action.payload._id;
        }),
        sentTasks: state.tasks.sentTasks.filter((task) => {
          return task._id !== action.payload._id;
        }),
      };

      state.tasks = newTasks;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { setTasks, addTask, removeTask, setUserData } =
  tasksSlice.actions;

export default tasksSlice.reducer;
