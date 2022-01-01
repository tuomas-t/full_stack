import React, { useState, useEffect  } from 'react'
import axios from 'axios'

const ShowCountries = ({countries, displayCountry}) => {
  if (countries.length === 0) {
    return (
      <div></div>
    )
  } else if (countries.length > 10) {
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  } else if (countries.length === 1) {
    const kielet = []
    const languagesJSON = countries[0].languages
    for (let i in languagesJSON) {
      kielet.push(languagesJSON[i])
    }
    
    return (
      <div>
        <h2>{countries[0].name.common}</h2>
        <p>capital {countries[0].capital}</p>
        <p>population {countries[0].population}</p>
        <h3>languages</h3>
        <ul>
          {kielet.map(language => 
            <li key={language}>{language}</li>)}
        </ul>
        <img src={countries[0].flags.png} alt='flag' />
      </div>
    )
  } else {
    return (
      <div>
        {countries.map(country =>
        <p key={country.name.common}> {country.name.common} <button onClick={() => displayCountry(country.name.common)}>Show</button></p>
        )}
      </div>
    )
  }
}

const SearchCountries = ({characters, handleCharacters}) => {
  return (
    <div>
      <p>
        find countries: 
        <input 
          value={characters} 
          onChange={handleCharacters}
        />
      </p>
    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [characters, setCharacters] = useState('')
  const [weather, setWeather] = useState('')
  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all').then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(characters.toLowerCase()))
    if (filteredCountries.length === 1) {
      axios.get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${filteredCountries[0].capital[0]}`)
        .then(response => (setWeather(response.data)))}
  }, [characters])

  const handleSetCharacters = (event)  => {
    setCharacters(event.target.value)
  }

  const filteredOnChars = (characters.length === 0)
  ? countries
  : countries.filter(country => country.name.common.toLowerCase().includes(characters.toLowerCase()))

  return (
    <>
      <div>
        <SearchCountries characters={characters} handleCharacters={handleSetCharacters} />
      </div>
      <div>
        <ShowCountries countries={filteredOnChars} displayCountry={setCharacters} />
        <Weather weather={weather} countries={filteredOnChars} />
      </div>
    </>
  )
}

const Weather = ({ weather, countries }) => {
  if (weather != '' && countries.length === 1) {
    return (
      <div>
        <h2>Weather in {weather.location.name}</h2>
        <p>temperature: {weather.current.temperature}</p>
        <img src={weather.current.weather_icons[0]} alt='icon' />
        <p>wind: {weather.current.wind_speed}</p>
      </div>
    )
  } else {
    return (<div></div>)
  }
}

export default App;
