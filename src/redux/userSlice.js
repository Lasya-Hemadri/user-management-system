import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(
    "https://speedsoftware.site/administrator/InterviewApi/getUserList"
  );
  return response.data?.data || [];
});

export const updateUser = createAsyncThunk("users/updateUser", async (user) => {
  try {
    const response = await axios.put(
      `https://speedsoftware.site/administrator/InterviewApi/editUser/${user.userId}`,
      user
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update user!" };
  }
});

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (user) => user.userId === action.payload.userId
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default userSlice.reducer;
