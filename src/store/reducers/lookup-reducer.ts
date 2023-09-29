import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../constants";

type Lookup = {
  createdAt: Date;
  name: string;
  description: string;
  type: string;
  id: string;
};

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
  lookups: Lookup[] | null;
  singleLookup: Lookup | null;
  lookupValues: LookupValues[] | null;
  singleLookupValue: LookupValues | null;
  error: string[];
};

const initialState: InitialState = {
  loading: false,
  lookups: null,
  singleLookup: null,
  lookupValues: null,
  singleLookupValue: null,
  error: [],
};

export const getLoop = createAsyncThunk("lookups/get", async () => {
  try {
    const res = await axios.get(`${baseUrl}/lookups`);
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
  "lookups/getById",
  async (id: string) => {
    try {
      const res = await axios.get(`${baseUrl}/lookups/${id}`);
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

export const getLookupById = createAsyncThunk(
  "lookups/getLookupById",
  async (id: string) => {
    try {
      const res = await axios.get(`${baseUrl}/lookups/${id}/lookupvalues`);
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

export type Values = {
  lookupId: string;
  id: string;
};

export const getLookupValuesById = createAsyncThunk(
  "lookups/getLookupValuesById",
  async (values: Values) => {
    try {
      const res = await axios.get(
        `${baseUrl}/lookups/${values.lookupId}/lookupvalues/${values.id}`
      );
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

const LookupSlice = createSlice({
  name: "lookups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLookupById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getLookupById.fulfilled, (state, action: PayloadAction<LookupValues[]>) => {
        state.loading = false;
        state.lookupValues = action.payload;
    });
    builder.addCase(
      getLookupById.rejected,
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
    builder.addCase(getLoop.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getLoop.fulfilled,
      (state, action: PayloadAction<Lookup[]>) => {
        state.loading = false;
        state.lookups = action.payload;
      }
    );
    builder.addCase(
      getLoop.rejected,
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
    builder.addCase(getById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getById.fulfilled,
      (state, action: PayloadAction<Lookup>) => {
        state.loading = false;
        state.singleLookup = action.payload;
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
    builder.addCase(getLookupValuesById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getLookupValuesById.fulfilled,
      (state, action: PayloadAction<LookupValues>) => {
        state.loading = false;
        state.singleLookupValue = action.payload;
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
