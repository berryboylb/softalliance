import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../constants";

type Grades = {
  createdAt: Date;
  name: string;
  description: string;
  id: string;
};

type GradeSteps = {
  createdAt: Date;
  name: string;
  amount: string;
  description: string;
  id: string;
  gradeId: string;
};

type InitialState = {
  loading: boolean;
  grades: Grades[] | null;
  singleGrade: Grades | null;
  steps: GradeSteps[] | null;
  singleStep: GradeSteps | null;
  error: string[];
};

const initialState: InitialState = {
  loading: false,
  grades: null,
  singleGrade: null,
  steps: null,
  singleStep: null,
  error: [],
};

export const get = createAsyncThunk("grade/get", async () => {
  try {
    const res = await axios.get(`${baseUrl}/grade`);
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

export const getById = createAsyncThunk("grade/getById", async (id: string) => {
  try {
    const res = await axios.get(`${baseUrl}/grade/${id}`);
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

export const getGradeSteps = createAsyncThunk(
  "grade/gradesteps",
  async (id: string) => {
    try {
      const res = await axios.get(`${baseUrl}/grade/${id}/gradesteps`);
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
  gradeId: string;
  id: string;
};
export const getSingleGradeSteps = createAsyncThunk(
  "grade/gradesinglesteps",
  async (values: Values) => {
    try {
      const res = await axios.get(
        `${baseUrl}/grade/${values.gradeId}/gradesteps/${values.id}`
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

const GradeSlice = createSlice({
  name: "grade",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(get.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(get.fulfilled, (state, action: PayloadAction<Grades[]>) => {
      state.loading = false;
      state.grades = action.payload;
    });
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
      (state, action: PayloadAction<Grades>) => {
        state.loading = false;
        state.singleGrade = action.payload;
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
    builder.addCase(getGradeSteps.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getGradeSteps.fulfilled,
      (state, action: PayloadAction<GradeSteps[]>) => {
        state.loading = false;
        state.steps = action.payload;
      }
    );
    builder.addCase(
      getGradeSteps.rejected,
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
      builder.addCase(getSingleGradeSteps.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(
        getSingleGradeSteps.fulfilled,
        (state, action: PayloadAction<GradeSteps>) => {
          state.loading = false;
          state.singleStep = action.payload;
        }
      );
      builder.addCase(
        getSingleGradeSteps.rejected,
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

export default GradeSlice.reducer;
