import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomeComponent from "./pages/HomeComponent/HomeComponent";
import WeatherComponent from "./pages/WetherComponent/WeatherComponent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createContext, useState } from "react";

export const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState("dark-theme");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="h-screen w-screen  relative overflow-hidden">
        <div
          className={
            theme === "light-theme"
              ? "dark-theme-banner-container"
              : "light-theme-banner-container"
          }
        ></div>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeComponent />} />
            <Route path="/city-weather" element={<WeatherComponent />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
