import { RouteObject } from "react-router-dom";
import { DashBoard, Element, SingleElement } from "./pages";
import NotFound from "./components/NotFound/NotFound";
import { DashboardLayout } from "./layouts";
import LinkComp from "./components/Link/Link";

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
          { index: true, element: <LinkComp /> },
          {
            path: "/elements/element",
            element: <Element />,
          },
          {
            path: "/elements/element/element-details/:id",
            element: <SingleElement />,
          },
          {
            path: "/elements/balances",
            element: <LinkComp />,
          },
        ],
      },
    ],
  },
];

export default routes;
