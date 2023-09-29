import { lazy } from "react";
const DashBoard = lazy(() => import("./dashboard"));
const Element = lazy(() => import("./dashboard/elementSetup/element"));
export { DashBoard, Element };
