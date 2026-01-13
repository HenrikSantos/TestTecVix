import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { appRoutes } from "./routes/_index";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer theme="colored" />
      <RouterProvider
        router={appRoutes}
        future={{ v7_startTransition: true }}
      />
    </QueryClientProvider>
  );
};

export default App;
