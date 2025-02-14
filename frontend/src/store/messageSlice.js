import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const serverIP = `${window.location.protocol}//${window.location.hostname}:5001`;
import axios from "axios";

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (_, { getState }) => {
    const { auth } = getState();
    const response = await axios.get(`${serverIP}/messages`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Receiver: auth.contact._id,
      },
    });
    return response.data;
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    list: [],
    status: "idle", // Adding status to track fetch status
    error: null, // Adding error to track fetch errors
  },
  reducers: {
    addMessage: (state, action) => {
      state.list.push(action.payload);
    },
    removeMessage: (state, action) => {
      state.list = state.list.filter(
        (message) => message.id !== action.payload
      );
    },
    clearMessage: (state) => {
      state.list = [];
    },
    updateMessage: (state, action) => {
      const { id, newContent } = action.payload;
      const message = state.list.find((msg) => msg._id === id);
      if (message) {
        message.content = newContent; // Update the specific field(s)
        message.edited = true;
      }
    },
    deleteMessage: (state, action) => {
      const { id, newContent } = action.payload;
      const message = state.list.find((msg) => msg._id === id);
      if (message) {
        message.content = newContent; // Update the specific field(s)
        message.filePath = "";
        message.deleted = true;
        message.edited = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  addMessage,
  removeMessage,
  clearMessage,
  deleteMessage,
  updateMessage,
} = messagesSlice.actions;

export default messagesSlice.reducer;
