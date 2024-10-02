import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GameMasterPage from "./pages/GameMaster/GameMasterPage";
import PlayerPage from "./pages/PlayerPage/PlayerPage";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/gamemaster",
    element: <GameMasterPage />,
  },
  {
    path: "/player",
    element: <PlayerPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
