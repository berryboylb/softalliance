import { Suspense } from "react";
import Spinner from "./components/Spinner/Spinner";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
import store from "./store";
function App() {
  const router = createBrowserRouter(routes);

  return (
    <Suspense fallback={<Spinner />}>
      <Toaster position={"top-right"} />
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </Suspense>
  );
}

export default App;
