import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { ThemeContext } from "../App";
import { WiHumidity } from "react-icons/wi";
import { CiTempHigh } from "react-icons/ci";

const WeatherForeCast = ({
  latitute,
  longitude,
  changeTemperature,
  handleImage,
}) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const { theme } = useContext(ThemeContext);

  const [foreCastWeatherList, setForeCastWeatherList] = useState([]);

  const getWeatherForeCast = async () => {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

    const foreCastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitute}&lon=${longitude}&appid=${apiKey}`;

    try {
      const response = await axios.get(foreCastUrl);
      if (response.data) {
        setForeCastWeatherList(response.data.list.slice(0, 10));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getWeatherForeCast();
  }, []);

  console.log(foreCastWeatherList);

  return (
    <div className={theme === "light-theme" ? "text-black" : "text-white"}>
      <h1 className="text-center text-xl font-bold mb-2 italic">
        Hourly Forecast
      </h1>
      <Slider {...settings}>
        {foreCastWeatherList && foreCastWeatherList.length > 0
          ? foreCastWeatherList.map((eachData, index) => (
              <div>
                <div
                  className={
                    theme === "light-theme"
                      ? " bg-transparent shadow shadow-black m-2 flex flex-col items-center p-2 rounded"
                      : " bg-transparent shadow shadow-white m-2 flex flex-col items-center p-2 rounded"
                  }
                >
                  <p className="font-semibold">
                    {moment(eachData?.dt_txt?.split(" ")[1], "HH:mm:ss").format(
                      "hh:mm A"
                    )}
                  </p>
                  {handleImage(eachData?.weather[0].main)}

                  <p className="font-bold flex items-center">
                    <CiTempHigh size={22} />
                    {changeTemperature(eachData?.main?.temp)}
                  </p>
                  <p className="font-medium flex items-center">
                    <WiHumidity size={22} />
                    {eachData?.main?.humidity} %
                  </p>
                </div>
              </div>
            ))
          : null}
      </Slider>
    </div>
  );
};

export default WeatherForeCast;
