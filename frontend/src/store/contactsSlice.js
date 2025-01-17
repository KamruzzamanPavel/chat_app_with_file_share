import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async action to fetch contacts
export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.map((contact) => ({
        ...contact,
        newMessage: false, // Initialize the newMessage flag
      }));
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Contact slice
const contactSlice = createSlice({
  name: "contacts",
  initialState: {
    contacts: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setNewMessageFlag: (state, action) => {
      const { contactId, hasNewMessage } = action.payload;
      const contact = state.contacts.find((c) => c._id === contactId);
      if (contact) {
        contact.newMessage = hasNewMessage;
      }
    },
    // eslint-disable-next-line no-unused-vars
    clearNewMessageFlags: (state, action) => {
      state.contacts.forEach((contact) => {
        contact.newMessage = false;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setNewMessageFlag, clearNewMessageFlags } = contactSlice.actions;

export default contactSlice.reducer;
