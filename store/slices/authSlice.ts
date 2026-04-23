import axios from "axios";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api, setAuthToken } from "@/lib/api/client";
import type { User } from "@/types/user";

const TOKEN_KEY = "natours_token";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    payload: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.post<{
        status: string;
        token: string;
        data: { user: User };
      }>("/users/login", payload);
      return { token: data.token, user: data.data.user };
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const msg = e.response?.data?.message;
        return rejectWithValue(
          typeof msg === "string" ? msg : "Login failed",
        );
      }
      return rejectWithValue("Login failed");
    }
  },
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (
    payload: {
      name: string;
      email: string;
      password: string;
      passwordConfirm: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.post<{
        status: string;
        token: string;
        data: { user: User };
      }>("/users/signup", payload);
      return { token: data.token, user: data.data.user };
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const msg = e.response?.data?.message;
        return rejectWithValue(
          typeof msg === "string" ? msg : "Could not create account",
        );
      }
      return rejectWithValue("Could not create account");
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<{ status: string; data: { data: User } }>(
        "/users/me",
      );
      return data.data.data;
    } catch {
      return rejectWithValue(null);
    }
  },
);

function readStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

type AuthState = {
  token: string | null;
  user: User | null;
  status: "idle" | "loading" | "authenticated" | "guest";
  error: string | null;
};

const initialState: AuthState = {
  token: null,
  user: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateToken(state) {
      const t = readStoredToken();
      state.token = t;
      setAuthToken(t);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = "guest";
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
      }
      setAuthToken(null);
    },
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user: User }>,
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.status = "authenticated";
      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, action.payload.token);
      }
      setAuthToken(action.payload.token);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.status = "authenticated";
        state.error = null;
        if (typeof window !== "undefined") {
          localStorage.setItem(TOKEN_KEY, action.payload.token);
        }
        setAuthToken(action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "guest";
        state.error = (action.payload as string) ?? "Login failed";
      })
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.status = "authenticated";
        state.error = null;
        if (typeof window !== "undefined") {
          localStorage.setItem(TOKEN_KEY, action.payload.token);
        }
        setAuthToken(action.payload.token);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "guest";
        state.error = (action.payload as string) ?? "Signup failed";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        if (!state.token) state.status = "guest";
      });
  },
});

export const { hydrateToken, logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
