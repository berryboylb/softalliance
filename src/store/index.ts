import { configureStore } from "@reduxjs/toolkit";
import cakeReducer from "./reducers/cake-reducer";
import elementsReducer from "./reducers/elements-reducer";
import elementslinkReducer from "./reducers/elementslink-reducer";
import departmentReducer from "./reducers/department-reducer";
import lookupReducer from "./reducers/lookup-reducer";
import gradesReducer from "./reducers/grades-reducer";
import suborganizationReducer from "./reducers/suborganization-reducer";
import payrun from "./reducers/payrun";
import category from "./reducers/category";
import classification from "./reducers/classification";
import employeeCategory from "./reducers/employeeCategory";
import subOrganization from "./reducers/subOrganization";

const store = configureStore({
  reducer: {
    cake: cakeReducer,
    elements: elementsReducer,
    elementsLink: elementslinkReducer,
    department: departmentReducer,
    lookup: lookupReducer,
    grades: gradesReducer,
    suborganization: suborganizationReducer,
    payrun,
    category,
    classification,
    employeeCategory,
    subOrganization,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
