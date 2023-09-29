import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../constants";

type Elements = {
  name: string;
  description: string;
  payRunId: number;
  payRunValueId: number;
  classificationId: number;
  classificationValueId: number;
  categoryId: number;
  categoryValueId: number;
  reportingName: string;
  processingType: string;
  status: string;
  prorate: string;
  effectiveStartDate: string;
  effectiveEndDate: string;
  selectedMonths: [string];
  payFrequency: string;
};



type InitialState = {
  loading: boolean;
  elements: Elements[] | null;
  singleElement: Elements | null;
  error: string[];
};

const initialState: InitialState = {
  loading: false,
  elements: null,
  singleElement: null,
  error: [],
};

export const get = createAsyncThunk(
  "elements/get",
  async () => {
    try {
      const res = await axios.get(`${baseUrl}/elements`);
      toast.success(res.data.message);
      // console.log("res", res.data.data.content);
      return res.data.data.content;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else if (axios.isAxiosError(err) && err.response?.data?.message) {
        err.response.data.message.map((err: string) => toast.error(err));
        return err.response.data.message;
      }
    }
  }
);

type IElement = {
  name: string;
};

export const add = createAsyncThunk(
  "elements/add",
  async (values: IElement) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const body = JSON.stringify(values);
    try {
      const res = await axios.post(`${baseUrl}/elements`, body, config);
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

export const getById = createAsyncThunk(
  "elements/getById",
  async (id: string) => {
    try {
      const res = await axios.get(`${baseUrl}/elements/${id}`);
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

type Update = {
  id: string;
};
export const update = createAsyncThunk(
  "elements/update",
  async (values: Update) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const body = JSON.stringify(values);
    try {
      const res = await axios.put(
        `${baseUrl}/elements/${values.id}`,
        body,
        config
      );
      toast.success(res.data.message);
      // return res.data;
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

export const deleteOne = createAsyncThunk(
  "elements/delete",
  async (id: string) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    try {
      const res = await axios.delete(
        `${baseUrl}/elements/${id}`,
        config
      );
      toast.success(res.data.message);
      return id;
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

const ElementsSlice = createSlice({
  name: "elements",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(add.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(add.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(
      add.rejected,
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
    builder.addCase(get.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      get.fulfilled,
      (state, action: PayloadAction<Elements[]>) => {
        state.loading = false;
        state.elements = action.payload;
      }
    );
    builder.addCase(
      get.rejected,
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
      (state, action: PayloadAction<Elements>) => {
        state.loading = false;
        state.singleElement = action.payload;
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
    builder.addCase(update.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      update.fulfilled,
      (state, action: PayloadAction<Elements>) => {
        state.loading = false;
        state.singleElement = action.payload;
      }
    );
    builder.addCase(
      update.rejected,
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
    builder.addCase(deleteOne.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteOne.fulfilled,
      (state, action: PayloadAction<Elements>) => {
        state.loading = false;
        state.elements = state.elements?.filter(
          (item) => item.categoryId !== Number(action.payload)
        ) || [];
      }
    );
    builder.addCase(
      deleteOne.rejected,
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

export default ElementsSlice.reducer;
