import React, {useEffect, useRef, useState} from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_sky_day_icon from '../assets/clear_sky_day.png'
import clear_sky_night_icon from '../assets/clear_sky_night.png'
import few_clouds_day_icon from '../assets/few_clouds_day.png'
import few_clouds_night_icon from '../assets/few_clouds_night.png'
import scattered_clouds_icon from '../assets/scattered_clouds.png'
import broken_clouds_icon from '../assets/broken_clouds.png'
import shower_rain_icon from '../assets/shower_rain.png'
import rain_day_icon from '../assets/rain_day.png'
import rain_night_icon from '../assets/rain_night.png'
import thunderstorm_icon from '../assets/thunderstorm.png'
import snow_icon from '../assets/snow.png'
import mist_icon from '../assets/mist.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'
import dew_point_icon from '../assets/dew_point.png'

const Weather = () => {

    const inputRef = useRef()
    const [weatherData, setWeatherData] = useState(false);

    const allIcons = {
        "01d": clear_sky_day_icon,
        "01n": clear_sky_night_icon,
        "02d": few_clouds_day_icon,
        "02n": few_clouds_night_icon,
        "03d": scattered_clouds_icon,
        "03n": scattered_clouds_icon,
        "04d": broken_clouds_icon,
        "04n": broken_clouds_icon,
        "09d": shower_rain_icon,
        "09n": shower_rain_icon,
        "10d": rain_day_icon,
        "10n": rain_night_icon,
        "11d": thunderstorm_icon,
        "11n": thunderstorm_icon,
        "13d": snow_icon,
        "13n": snow_icon,
        "50d": mist_icon,
        "50n": mist_icon,
    }

    const calculateDewPoint = (temperature, humidity) => {
        const a = 17.27;
        const b = 237.7;
        const alpha = (a * temperature) / (b + temperature) + Math.log(humidity / 100);
        return (b * alpha) / (a - alpha);
    };

    const search = async(city)=>{ 
        if(city === "") {
            alert("Enter City Name");
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_APP_ID}`;

            const response = await fetch(url);
            const data = await response.json();

            if(!response.ok) {
                alert(data.message);
                return;
            }

            console.log(data);
            const icon = allIcons[data.weather[0].icon] || clear_sky_icon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp - 273.15),
                fahrenheit: Math.floor(((data.main.temp - 273.15)*(9/5))+32),
                location: data.name,
                icon: icon,
                dewPoint: calculateDewPoint(
                    Math.floor(data.main.temp - 273.15),
                    data.main.humidity
                ).toFixed(1),
            })
        } catch (error) {
            setWeatherData(false);
            console.error("Error in fetching weather data");
        }
    } 
    useEffect(()=>{
        search("Llanfairpwllgwyngyll");
    },[])

  return (
    <div className = 'weather'>
        <div className = "search-bar">
            <input ref = {inputRef} type = "text" placeholder='Search'/>
            <img src = {search_icon} alt = "" onClick={()=>search(inputRef.current.value)}/>
        </div>

        {weatherData?<>
        <img src = {weatherData.icon} alt = "" className = 'weather-icon' />
        <p className="temperature">{weatherData.temperature}°C / {weatherData.fahrenheit}°F </p> <br/>
        <p className = 'location'> {weatherData.location} </p>
        <div className = "weather-data">
            <div className = "col" style={{ marginRight: '10px' }}>
                <img src = {humidity_icon} alt = "" />
                <div>
                    <p> {weatherData.humidity} % </p>
                    <span> Humidity </span>
                </div>
            </div>
            <div className = "col" style={{ marginRight: '10px' }}>
                <img src = {wind_icon} alt = "" />
                <div>
                    <p> {weatherData.windSpeed} kph / {(weatherData.windSpeed * 0.621371).toPrecision(3)} mph </p>
                    <span> Wind Speed </span>
                </div>
            </div>
            <div className="col" style={{ marginRight: '10px' }}>
                <img src = {dew_point_icon} alt = "" />
                <div>
                    <p> {weatherData.dewPoint}°C </p>
                    <span> Dew Point </span>
                </div>
            </div>
        </div>
        </>:<></>}
    </div>
  )
}

export default Weather