import { useEffect, useState } from 'react'
import axios from 'axios'
const Filter = ({ value, onChange }) => (
  <div>
    find countries <input value={value} onChange={onChange} />
  </div>
)

const CountryDetails = ({ country }) => (
  <div>
    <h1>{country.name.common}</h1>
    <p>capital {country.capital?.[0]}</p>
    <p>area {country.area}</p>

    <h2>languages</h2>
    <ul>
      {Object.values(country.languages || {}).map(language => (
        <li key={language}>{language}</li>
      ))}
    </ul>

    <img
      src={country.flags.png}
      alt={`flag of ${country.name.common}`}
      width="150"
    />

    <Weather
      capital={country.capital?.[0]}
      lat={country.capitalInfo?.latlng?.[0]}
      lon={country.capitalInfo?.latlng?.[1]}
    />
  </div>
)

const CountriesList = ({ countries, onShow }) => (
  <div>
    {countries.map(country => (
      <div key={country.cca3}>
        {country.name.common}
        <button onClick={() => onShow(country.name.common)}>show</button>
      </div>
    ))}
  </div>
)

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleShowCountry = (name) => {
    setFilter(name)
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <Filter value={filter} onChange={handleFilterChange} />

      {filter === '' ? null : filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length > 1 ? (
        <CountriesList
          countries={filteredCountries}
          onShow={handleShowCountry}
        />
      ) : filteredCountries.length === 1 ? (
        <CountryDetails country={filteredCountries[0]} />
      ) : (
        <p>No matches</p>
      )}
    </div>
  )
}

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
      <p>temperature {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt="weather icon"
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

export default App