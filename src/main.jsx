import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GameMasterPage from "./pages/GameMaster/GameMasterPage";
import PlayerPage from "./pages/PlayerPage/PlayerPage";
import "./index.css";
// import EspsPage from "./pages/EspsPage/EspsPage";
import TabletPage from "./pages/TabletPage/TabletPage";

const router = createBrowserRouter([
  {
    path: "/gamemaster",
    element: <GameMasterPage />,
  },
  {
    path: "/player",
    element: <PlayerPage />,
  },
  {
    path: "/tablet",
    element: <TabletPage />,
  },
  //   {
  //     path: "/esps",
  //     element: <EspsPage />,
  //   },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
