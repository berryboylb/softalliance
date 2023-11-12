import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../constants";


export type LookupValues = {
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
  category: LookupValues[] | null;
  singleCategory: LookupValues | null;
  error: string[];
};

const initialState: InitialState = {
  loading: false,
  category: null,
  singleCategory: null,
  error: [],
};



export const getCategory= createAsyncThunk(
  "category/getLookupById",
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
  "category/getLookupValuesById",
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

const LookupSlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getCategory.fulfilled,
      (state, action: PayloadAction<LookupValues[]>) => {
        state.loading = false;
        state.category = action.payload;
      }
    );
    builder.addCase(
      getCategory.rejected,
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
        state.singleCategory = action.payload;
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

export default LookupSlice.reducer;
