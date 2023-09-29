import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../constants";

type Department = {
  createdAt: Date;
  name: string;
  note: string;
  id: string;
  suborganizationId: string;
};

type InitialState = {
  loading: boolean;
  department: Department[] | null;
  singleDepartment: Department | null;
  error: string[];
};

const initialState: InitialState = {
  loading: false,
  department: null,
  singleDepartment: null,
  error: [],
};

export const get = createAsyncThunk("department/get", async () => {
  try {
    const res = await axios.get(`${baseUrl}/suborganizations`);
    toast.success(res.data.message);
    return res.data.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error(err.message);
    } else if (axios.isAxiosError(err) && err.response?.data?.message) {
      err.response.data.message.map((err: string) => toast.error(err));
      return err.response.data.message;
    }
  }
});

export const getById = createAsyncThunk("department/getById", async (id: string) => {
  try {
    const res = await axios.get(`${baseUrl}/suborganizations/${id}`);
    toast.success(res.data.message);
    return res.data.data;
  } catch (err) {
    if (err instanceof Error) {
      toast.error(err.message);
    } else if (axios.isAxiosError(err) && err.response?.data?.message) {
      err.response.data.message.map((err: string) => toast.error(err));
      return err.response.data.message;
    }
  }
});

const DepartmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(get.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      get.fulfilled,
      (state, action: PayloadAction<Department[]>) => {
        state.loading = false;
        state.department = action.payload;
      }
    );
    builder.addCase(get.rejected, (state, action: PayloadAction<unknown>) => {
      state.loading = false;
      if (action?.payload) {
        const error = action.payload as { message?: string[] | undefined };
        state.error = error.message || ["Something went wrong"];
      } else {
        state.error = ["Something went wrong"];
      }
    });
    builder.addCase(getById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getById.fulfilled,
      (state, action: PayloadAction<Department>) => {
        state.loading = false;
        state.singleDepartment = action.payload;
      }
    );
    builder.addCase(
      getById.rejected,
      (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        if (action?.payload) {
          const error = action.payload as { message?: string[] | undefined };
          state.error = error.message || ["Something went wrong"];
        } else {
          state.error = ["Something went wrong"];
        }
      }
    );
  },
});

export default DepartmentSlice.reducer;
