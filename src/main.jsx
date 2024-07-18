import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRoutes.jsx";
import { NextUIProvider } from "@nextui-org/react";
import "./styles/global.scss";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { DirectionProvider } from './context/DirectionContext.jsx';
import { PusherProvider } from './context/PusherContext.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <DirectionProvider>
      <PusherProvider>
        <NextUIProvider>
          <RouterProvider router={router} />
        </NextUIProvider>
      </PusherProvider>
    </DirectionProvider>
  </Provider>
);
