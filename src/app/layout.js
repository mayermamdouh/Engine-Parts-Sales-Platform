"use client";
import { usePathname } from "next/navigation";
import React, { Suspense, lazy } from "react";
import "./globals.css";
import { Provider } from "react-redux";
import AuthInitializer from "../app/components/AuthInitializer";
import store from "../app/store/store";
// Dynamically import Appbar and Footer with React.lazy
const Appbar = lazy(() => import("./components/AppBar"));
const Footer = lazy(() => import("./components/Footer"));
// import Appbar from "./components/AppBar";
// import Footer from "./components/Footer";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideLayout =
    ["/404", "/500"].includes(pathname) || pathname.includes("/admin");

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Provider store={store}>
          <AuthInitializer />
          {/* Suspense is used to show a fallback UI while the component is loading */}
          {/* <Suspense fallback={<div>Loading...</div>}> */}
            {!hideLayout && <Appbar />}
          {/* </Suspense> */}
          <main className="flex-grow">{children}</main>
          {/* <Suspense fallback={<div>Loading Footer...</div>}> */}
            {!hideLayout && <Footer />}
          {/* </Suspense> */}
        </Provider>
      </body>
    </html>
  );
}
