import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AddCsv from "./screen/AddCsv";
import { Toaster } from "./components/ui/toaster";
import ViewStock from "./screen/ViewStock";
import Home from "./screen/Home";
import { LSTM } from "./screen/LSTM";
import SIP_calculator from "./screen/SIP_calculator";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: HomeContainer,
      children: [
        { path: "/", Component: Home},
        {
          path: "add-csv",
          Component: AddCsv,
        },
        {
          path: "view-stock",
          Component: ViewStock,
        },
        {
          path: "lstm",
          Component: LSTM,
        },
        {
          path: "brownian",
          Component: () => <div>BROWNIAN</div>,
        },
        {
          path: "cnn",
          Component: () => <div>CNN</div>,
        },
        {
          path: "sip-calculator",
          Component: SIP_calculator,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

const HomeContainer = () => {
  return (
    <>
      <Navbar />
      <div className="flex h-screen">
        <Sidebar className="flex-[0.15] pt-20" />
        <div className="pt-20 h-full flex-[0.85] flex justify-center items-start">
          <Outlet />
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default App;
