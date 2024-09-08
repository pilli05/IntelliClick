import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import Header from "../../components/Header";
import { ThemeContext } from "../../App";

const HomeComponent = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [showSuggestionsBox, setShowSuggestionsBox] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loadMore, setLoadMore] = useState(true);
  const [page, setPage] = useState(1);
  const [citiesList, setCitiesList] = useState([]);
  const [filteredCitiesList, setFilteredCitiesList] = useState([]);

  const pageSize = 20;

  const getAllCitiesList = async (pageNum) => {
    const citiesListApiUrl = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=${pageSize}&start=${
      (pageNum - 1) * pageSize
    }`;

    try {
      setLoader(true);
      const response = await axios.get(citiesListApiUrl);
      if (response.data && response.data.results) {
        setLoader(false);
        setCitiesList((prevList) => [...prevList, ...response.data.results]);
        setFilteredCitiesList((prevList) => [
          ...prevList,
          ...response.data.results,
        ]);
        setPage(pageNum);
      }
    } catch (e) {
      setLoader(false);
      console.log(e);
    }
  };

  useEffect(() => {
    getAllCitiesList(page);
  }, []);

  const handleSearchInput = (e) => {
    const searchQuery = e.target.value.toLowerCase();

    if (searchQuery.length >= 2) {
      console.log(searchQuery);
      setShowSuggestionsBox(true);
      const filteredCities = citiesList.filter((city) =>
        city.name.toLowerCase().includes(searchQuery)
      );
      setFilteredCitiesList(filteredCities);
    } else {
      setFilteredCitiesList(citiesList);
      setShowSuggestionsBox(false);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight && !loader && loadMore) {
      getAllCitiesList(page + 1);
    }
  };

  const getParticularCityWeatherData = (cityData) => {
    navigate("/city-weather", {
      state: { cityData },
    });
  };

  const handleSearchCity = (selectedCity) => {
    const cityData = citiesList.filter(
      (city) => city.ascii_name === selectedCity.ascii_name
    );
    setFilteredCitiesList(cityData);
    setShowSuggestionsBox(false);
  };

  return (
    <div
      className={
        theme === "light-theme"
          ? "relative h w-screen z-20 text-black"
          : "relative h-screen w-screen z-20 text-white"
      }
    >
      <Header />
      <div className="flex flex-col items-center ">
        <div className="my-5 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full px-3">
          <span className=" text-xl font-bold ">CITIES LIST</span>
          <div className="relative flex justify-end">
            <input
              type="search"
              placeholder="Search City"
              autoFocus
              className="bg-transparent px-5 py-2 rounded outline-none border border-white w-full sm:w-2/3 md:w-1/3 text-white"
              onChange={handleSearchInput}
            />
            {showSuggestionsBox ? (
              <ul className="px-3 py-3  absolute  sm:w-2/3 md:w-1/3  w-full rounded-sm auto-search-suggestion-container z-10 top-12">
                {filteredCitiesList.map((eachCity, index) => (
                  <li
                    className="hover:bg-white rounded px-1 py-1 cursor-pointer transition duration-300 ease-in-out text-black"
                    key={index}
                    onClick={() => handleSearchCity(eachCity)}
                  >
                    {eachCity.ascii_name}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
        <div
          className="w-[95%] md:w-4/5 max-h-[500px] overflow-auto "
          onScroll={handleScroll}
        >
          <table className="min-w-full ">
            <thead className="sticky top-0 header-container ">
              <tr
                className={
                  theme === "light-theme" ? "text-white" : "text-black"
                }
              >
                <th className="border-2 border-white ">CITY</th>
                <th className="border-2 border-white p-2 ">COUNTRY</th>
                <th className="border-2 border-white p-2 ">TIME ZONE</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {filteredCitiesList && filteredCitiesList.length > 0 ? (
                filteredCitiesList.map((city, index) => (
                  <tr
                    key={index}
                    className={
                      theme === "light-theme"
                        ? "cursor-pointer hover:bg-white transition duration-300 ease-in-out"
                        : "cursor-pointer hover:bg-purple-500 transition duration-300 ease-in-out"
                    }
                    onClick={() => getParticularCityWeatherData(city)}
                  >
                    <td className="border border-white py-1 px-2 w-[35%]">
                      {city.ascii_name}
                    </td>
                    <td className="border border-white py-1 px-2 w-[35%]">
                      {city.cou_name_en}
                    </td>
                    <td className="border border-white py-1 px-2 w-[30%]">
                      {city.timezone}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-10">
                    🥹 No Results found... 🥹
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-center">
            {loader ? <BeatLoader color="white" /> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeComponent;
