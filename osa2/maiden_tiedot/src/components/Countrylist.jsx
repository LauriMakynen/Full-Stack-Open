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

export default CountriesList