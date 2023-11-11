import { RouteObject } from "react-router-dom";
import { DashBoard, Element } from "./pages";
import NotFound from "./components/NotFound/NotFound";
import { DashboardLayout } from "./layouts";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <DashboardLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <DashBoard />,
      },
      {
        path: "/elements",
        children: [
          { index: true, element: <h1>hello element</h1> },
          {
            path: "/elements/element",
            element: <Element />,
          },
          {
            path: "/elements/balances",
            element: <h1>hello element balances</h1>,
          },
        ],
      },
    ],
  },
];

export default routes;
