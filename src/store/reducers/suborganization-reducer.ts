import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../constants";


type SubOrganization = {
  createdAt: Date;
  name: string;
  note: string;
  id: string;
};

type InitialState = {
  loading: boolean;
  suborganization: SubOrganization[] | null;
  singleSuborganization: SubOrganization | null;
  error: string[];
};

const initialState: InitialState = {
  loading: false,
  suborganization: null,
  singleSuborganization: null,
  error: [],
};

export const get = createAsyncThunk("suborganization/get", async () => {
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

export const getById = createAsyncThunk(
  "suborganization/getById",
  async (id: string) => {
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
  }
);

const SuborganizationSlice = createSlice({
  name: "elements",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(get.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      get.fulfilled,
      (state, action: PayloadAction<SubOrganization[]>) => {
        state.loading = false;
        state.suborganization = action.payload;
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
      (state, action: PayloadAction<SubOrganization>) => {
        state.loading = false;
        state.singleSuborganization = action.payload;
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

export default SuborganizationSlice.reducer;