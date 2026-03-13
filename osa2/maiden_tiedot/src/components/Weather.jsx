import { useEffect, useState } from 'react'
import axios from 'axios'

//Tämä komponentti hakee ja näyttää pääkaupungin säätilan. Se hakee säätiedot OpenWeatherMap API:sta, joka vaatii API-avaimen.

const Weather = ({ capital, lat, lon }) => {
  const [weather, setWeather] = useState(null)
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY
  console.log(apiKey)
  
  useEffect(() => {
    if (!lat || !lon) return

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      )
      .then(response => {
        setWeather(response.data)
      })
  }, [lat, lon, apiKey])

  if (!weather) {
    return <p>Loading weather...</p>
  }

  const icon = weather.weather[0].icon

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>Temperature {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt="weather icon"
      />
      <p>Wind {weather.wind.speed} m/s</p>
    </div>
  )
}

export default Weather