import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../constants";

export type SubOrganization = {
  createdAt: string;
  name: string;
  note: string;
  id: string;
};

type InitialState = {
  loading: boolean;
  subOrganization: SubOrganization[] | null;
  singleSubOrganization: SubOrganization | null;
  error: string[];
};

const initialState: InitialState = {
  loading: false,
  subOrganization: null,
  singleSubOrganization: null,
  error: [],
};

export const getSubs = createAsyncThunk(
  "subOrganization/getLookupById",
  async () => {
    try {
      const res = await axios.get(`${baseUrl}/suborganizations`);
      return res.data.data;
    } catch (err) {
       if (err instanceof Error) {
         console.log(err.message);
         toast.error(err.message);
       } else if (axios.isAxiosError(err) && err.response?.data?.message) {
         console.log(err.response.data);
         return err.response.data.message;
       }
    }
  }
);

export type Values = {
  lookupId: string;
  id: string;
};

export const getSubsById = createAsyncThunk(
  "subOrganization/getLookupValuesById",
  async (id: string) => {
    try {
      const res = await axios.get(`${baseUrl}/suborganizations/${id}`);
      toast.success(res.data.message);
      return res.data.data;
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        toast.error(err.message);
      } else if (axios.isAxiosError(err) && err.response?.data?.message) {
        console.log(err.response.data);
        return err.response.data.message;
      }
    }
  }
);

const Slice = createSlice({
  name: "subOrganization",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSubs.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getSubs.fulfilled,
      (state, action: PayloadAction<SubOrganization[]>) => {
        state.loading = false;
        state.subOrganization = action.payload;
      }
    );
    builder.addCase(
      getSubs.rejected,
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
    builder.addCase(getSubsById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getSubsById.fulfilled,
      (state, action: PayloadAction<SubOrganization>) => {
        state.loading = false;
        state.singleSubOrganization = action.payload;
      }
    );
    builder.addCase(
      getSubsById.rejected,
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

export default Slice.reducer;
