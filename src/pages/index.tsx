import { lazy } from "react";
const DashBoard = lazy(() => import("./dashboard"));
const Element = lazy(() => import("./dashboard/elementSetup/element"));
const SingleElement = lazy(() => import("./dashboard/elementSetup/single-element"));
export { DashBoard, Element, SingleElement };
