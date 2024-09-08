import React, { useContext, useEffect, useState } from "react";
import { CiLight } from "react-icons/ci";
import { FaMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";
import { Link } from "react-router-dom";
import Switch from "react-switch";
import { ThemeContext } from "../App";

const Header = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };

  useEffect(() => {
    if (!checked) {
      setTheme("dark-theme");
    } else {
      setTheme("light-theme");
    }
  }, [checked, setTheme]);

  console.log(theme);

  return (
    <div
      className={
        theme === "light-theme"
          ? "z-20 relative shadow shadow-black flex justify-between items-center "
          : "z-20 relative shadow shadow-slate-50 flex justify-between items-center "
      }
    >
      <Link to="/">
        <div className="flex items-center cursor-pointer">
          <img
            src="/assets/weather.png"
            alt="logo"
            className="w-[80px] h-[70px] "
          />

          <span
            className={
              theme === "light-theme"
                ? "font-bold text-base text-black"
                : "font-bold text-base text-white"
            }
          >
            SHOW MY WEATHER
          </span>
        </div>
      </Link>
      <div className="mr-5">
        <label>
          <Switch
            onChange={handleChange}
            checked={checked}
            checkedIcon={
              <FaMoon size={23} color="white" className="pt-1 pl-2" />
            }
            uncheckedIcon={
              <IoSunny size={25} color="yellow" className="pt-[1px] pl-1" />
            }
          />
        </label>
      </div>
    </div>
  );
};

export default Header;
