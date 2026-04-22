import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAllTasks = createAsyncThunk(
  "tasks/fetchAllTasks",
  async (_, { rejectWithValue }) => {
    try {
      let taskData = [];
      const data = await fetch("https://dummyjson.com/todos").then(res => res.json()).then(res => res.todos);
      for (let i of data.slice(0, 10)) {
        if (i.completed) {
          taskData.push({ id: i.id, title: i.todo, status: "done" })
        } else {
          taskData.push({ id: i.id, title: i.todo, status: "todo" })
        }
      }
      return taskData
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.message);
    }
  }
)

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addNewTask: (state, action) => {
      state.tasks.push(action.payload)
    },

    deleteTask: (state, action) => {
      let updatedTasks = state.tasks.filter(t => t.id !== action.payload)
      state.tasks = updatedTasks
    },

    updateTask: (state, action) => {
      let { id, updatedTask } = action.payload;
      let updatedTaskData = state.tasks.map(t => {
        if (t.id === id) {
          t.title = updatedTask;
        }
        return t
      })
      state.tasks = updatedTaskData;
    },

    updateStatus : (state,action)=>{
      let { id, updatedStatus } = action.payload;
        let updatedTaskData = state.tasks.map(t => {
          if (t.id === id) {
            t.status = updatedStatus;
          }
          return t
        })
        state.tasks = updatedTaskData;
    },

    setTasks: (state, action) => {
      state.tasks = action.payload;
    }
  },
  extraReducers: (builder) => {
    //---------------fetch tasks
    builder
      .addCase(fetchAllTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});

export const { addNewTask, setTasks, deleteTask, updateStatus, updateTask } = taskSlice.actions;
export default taskSlice.reducer;