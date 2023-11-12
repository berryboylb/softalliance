import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../constants";

type LookupValues = {
  id: string;
  name: string;
  description: string;
  status: string;
  lookupId: string;
  lookupName: string;
  createdAt: Date;
};

type InitialState = {
  loading: boolean;
  classification: LookupValues[] | null;
  singleClassification: LookupValues | null;
  error: string[];
};

const initialState: InitialState = {
  loading: false,
  classification: null,
  singleClassification: null,
  error: [],
};

export const getClassification = createAsyncThunk(
  "classification/getLookupById",
  async (id: number) => {
    try {
      const res = await axios.get(`${baseUrl}/lookups/${id}/lookupvalues`);
      return res.data;
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

export const getLookupValuesById = createAsyncThunk(
  "classification/getLookupValuesById",
  async (values: Values) => {
    try {
      const res = await axios.get(
        `${baseUrl}/lookups/${values.lookupId}/lookupvalues/${values.id}`
      );
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
  name: "classification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getClassification.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getClassification.fulfilled,
      (state, action: PayloadAction<LookupValues[]>) => {
        state.loading = false;
        state.classification = action.payload;
      }
    );
    builder.addCase(
      getClassification.rejected,
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
    builder.addCase(getLookupValuesById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getLookupValuesById.fulfilled,
      (state, action: PayloadAction<LookupValues>) => {
        state.loading = false;
        state.singleClassification = action.payload;
      }
    );
    builder.addCase(
      getLookupValuesById.rejected,
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
