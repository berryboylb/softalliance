import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../constants";

type ElementsLink = {
  name: string;
  elementId: number;
  suborganizationId: number;
  locationId: number;
  departmentId: number;
  employeeCategoryId: number;
  employeeCategoryValueId: number;
  employeeTypeId: number;
  employeeTypeValueId: number;
  jobTitleId: number;
  grade: number;
  gradeStep: number;
  unionId: number;
  amountType: string;
  amount: number;
  rate: number;
  effectiveStartDate: string;
  effectiveEndDate: string;
  status: string;
  automate: string;
  additionalInfo: [
    {
      lookupId: number;
      lookupValueId: number;
    }
  ];
};



type InitialState = {
  loading: boolean;
  singleElementLink: ElementsLink | null;
  elementsLink: ElementsLink[] | null;
  error: string[];
};

const initialState: InitialState = {
  loading: false,
  singleElementLink: null,
  elementsLink: null,
  error: [],
};

export const get = createAsyncThunk(
  "elementLink/get",
  async (id:string) => {
    try {
      const res = await axios.get(`${baseUrl}/elements/${id}/elementlinks`);
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
  }
);

type IElement = {
  name: string;
  id: string;
};

export const add = createAsyncThunk("elementLink/add", async (values: IElement) => {
  const config = {
    headers: { "Content-Type": "application/json" },
  };
  const body = JSON.stringify(values);
  try {
    const res = await axios.post(
      `${baseUrl}/elements/${values.id}/elementlinks`,
      body,
      config
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
});

type ElementLink = {
    id: string;
    elementId: string
};

export const getById = createAsyncThunk(
  "elementLink/getById",
  async (values: ElementLink) => {
    try {
      const res = await axios.get(
        `${baseUrl}/elements/${values.id}/elementlinks/${values.elementId}`
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

type Update = {
  id: string;
  elementId: string;
};
export const update = createAsyncThunk(
  "elementLink/update",
  async (values: Update) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const body = JSON.stringify(values);
    try {
      const res = await axios.put(
        `${baseUrl}/elements/${values.id}/elementlinks/${values.elementId}`,
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
  "elementLink/delete",
  async (values: ElementLink) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    try {
      const res = await axios.delete( `${baseUrl}/elements/${values.id}/elementlinks/${values.elementId}`, config);
      toast.success(res.data.message);
      return values.id;
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

const ElementLinkSlice = createSlice({
  name: "elementLink",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(add.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(add.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(add.rejected, (state, action: PayloadAction<unknown>) => {
      state.loading = false;
      if (action?.payload) {
        const error = action.payload as { message?: string[] | undefined };
        state.error = error.message || ["Something went wrong"];
      } else {
        state.error = ["Something went wrong"];
      }
    });
    builder.addCase(get.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      get.fulfilled,
      (state, action: PayloadAction<ElementsLink[]>) => {
        state.loading = false;
        state.elementsLink = action.payload;
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
      (state, action: PayloadAction<ElementsLink>) => {
        state.loading = false;
        state.singleElementLink = action.payload;
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
      (state, action: PayloadAction<ElementsLink>) => {
        state.loading = false;
        state.singleElementLink = action.payload;
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
      (state, action: PayloadAction<ElementsLink>) => {
        state.loading = false;
        state.elementsLink =
          state.elementsLink?.filter(
            (item) => item.elementId !== Number(action.payload)
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

export default ElementLinkSlice.reducer;