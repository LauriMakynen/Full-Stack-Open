import { useEffect, useState } from 'react'
import axios from 'axios'
import Weather from './Weather' 

//Komponentti, joka näyttää yksittäisen maan tiedot. Näytä maan nimi, pääkaupunki, pinta-ala, kielet ja lipun kuva. Lisäksi näytä maan pääkaupungin sää.

const CountryDetails = ({ country }) => (
  <div>
    <h1>{country.name.common}</h1>
    <p>Capital {country.capital?.[0]}</p>
    <p>Area {country.area}</p>

    <h2>Languages</h2>
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

export default CountryDetails