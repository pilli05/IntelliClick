import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ThemeContext } from "../../App";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [20, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const WeatherComponent = () => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const [cityDetails, setCityDetails] = useState([]);
  const [temperatureType, setTemeratureType] = useState("Celcius");
  const { state } = location;

  const { ascii_name, timezone, cou_name_en, coordinates } = state?.cityData;

  const getCityWeatherDetails = async () => {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${ascii_name}&appid=${apiKey}`;
    try {
      const response = await axios.get(weatherApiUrl);
      console.log(response);
      if (response.data) {
        setCityDetails(response.data);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    getCityWeatherDetails();
  }, []);

  const changeTemperature = (defaultTemperature) => {
    switch (temperatureType) {
      case "Celcius":
        return `${(defaultTemperature - 273.15).toFixed(2)} ° C`;
      case "Fahrenheit":
        return `${(((defaultTemperature - 273.15) * 9) / 5 + 32).toFixed(2)} F`;
      default:
        return `${defaultTemperature.toFixed(2)} K`;
    }
  };

  const time = moment().format("hh:mm:ss A");
  const date = moment().format("dddd, D MMMM YYYY");

  const position = [coordinates?.lon, coordinates?.lat];

  const handleImage = (weatherCondition) => {
    switch (weatherCondition) {
      case "Clouds":
        return (
          <img
            src="/assets/partly-cloudy.png"
            alt="clouds"
            className="w-[120px]"
          />
        );

      case "Clear":
        return (
          <img src="/assets/clear-sky.png" alt="sunny" className="w-[120px]" />
        );
      default:
        return <img src="/assets/haze.png" alt="sunny" className="w-[120px]" />;
    }
  };

  return (
    <div
      className={
        theme === "light-theme"
          ? "relative z-20 h-screen w-screen text-purple-500"
          : "relative z-20 h-screen w-screen text-white"
      }
    >
      <Header />
      <div className="flex justify-center items-center h-screen md:h-weather-conatiner">
        <div className="shadow-sm shadow-slate-50 px-4 mx-2 sm:mx-0 overflow-auto h-4/5  py-3 backdrop-blur-sm grid grid-cols-1 md:grid-cols-2 gap-3 w-full md:w-4/5 ">
          <div className="flex flex-col justify-between md:border-r-2 md:border-r-white pr-3 border-b-2 pb-2 md:pb-0 border-b-white md:border-b:none ">
            <div className="flex items-end flex-col">
              <p className=" font-bold text-xl">{ascii_name}</p>
              <p className="self-end ">{cityDetails?.sys?.country}</p>
            </div>

            <div className="flex justify-center my-5 md:my-0">
              <MapContainer
                center={position}
                zoom={10}
                scrollWheelZoom={false}
                style={{ height: "250px", width: "80%", borderRadius: "10px" }}
              >
                {/* <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              /> */}
                <Marker position={position} icon={customIcon}>
                  <Popup>{ascii_name}</Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="flex items-start justify-between  space-x-3">
              <div className="flex flex-col text-base font-semibold ">
                <span>{time}</span>
                <span>{date}</span>
              </div>
              <span className="text-[35px] font-bold  text-nowrap">
                {changeTemperature(cityDetails?.main?.temp)}
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-between items-center space-y-5 ">
            <div className="flex flex-col items-center">
              {handleImage(
                cityDetails?.weather && cityDetails.weather.length > 0
                  ? cityDetails.weather[0].main
                  : null
              )}

              <p className="my-1 text-center">
                {cityDetails?.weather && cityDetails.weather.length > 0
                  ? cityDetails.weather[0].main
                  : null}
              </p>
              <p className="my-1 text-center font-light">
                Feels like:{" "}
                <span className="font-bold">
                  {changeTemperature(cityDetails?.main?.feels_like)}
                </span>
              </p>
            </div>
            <select
              className="outline-none p-2 rounded-lg bg-transparent shadow shadow-black text-white w-full"
              onClick={(e) => setTemeratureType(e.target.value)}
            >
              <option value="Celcius" className="text-black">
                Celcius
              </option>
              <option value="Fahrenheit" className="text-black">
                Fahrenheit
              </option>
              <option value="Kelvin" className="text-black">
                Kelvin
              </option>
            </select>

            <div className="w-full">
              <p className="text-xl font-bold border-b border-b-white w-full text-center p-2 pb-3">
                {ascii_name}, {cityDetails?.sys?.country}
              </p>
              <div className="border-b border-b-white w-full p-2 flex justify-between items-center">
                <span>Temperature</span>{" "}
                <span>{changeTemperature(cityDetails?.main?.temp)}</span>
              </div>
              <div className="border-b border-b-white w-full p-2 flex justify-between items-center">
                <span>Humidity</span>{" "}
                <span>{cityDetails?.main?.humidity} %</span>
              </div>

              <div className=" w-full p-2 flex justify-between items-center">
                <span>Wind Speed</span>{" "}
                <span>{(cityDetails?.wind?.speed * 3.6).toFixed(2)} Km/hr</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherComponent;
