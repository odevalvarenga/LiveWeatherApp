import sunny from '../assets/sunny.png'
import { useState } from 'react'
import { getWeatherInfo } from '../utils/wheatherCode'  

const WheatherApp = () => {
  const [location, setLocation] = useState('')
  const [data, setData] = useState(null)

//console.log(getWeatherInfo(0))
//console.log(getWeatherInfo(63))
//console.log(getWeatherInfo(75))

 // console.log(data)

  const handleInputChanges = (e) => {
  setLocation(e.target.value)
}

const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    search(location)
  }
}
 const search =(city) => {
  console.log('Searching for:' , city)
 }
 const getCoordinates = async (city) => {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch coordinates')
  }

  const result = await response.json()

  if (!result.results || result.results.length === 0) {
    return null
  }

  const place = result.results[0]

  return {
    name: place.name,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude
  }
}
  getCoordinates('cidade-que-nao-existe-xyz').then(console.log)
  //getCoordinates('São Paulo').then(console.log)
  return (
    <div className="container">
      <div className="weather-app">
        <div className="search">
          <div className="search-top">
            <i className="fa-solid fa-location-dot"></i>
            <div className="location">London</div>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter Location"
              value={location}
              onChange={handleInputChanges}
              onKeyDown={handleKeyDown}
            />
          
            <i
              className="fa-solid fa-magnifying-glass"
              onClick={() => search(location)}
            ></i>
          </div>
        </div>

        <div className="weather">
          <img src={sunny} alt="Clear sky" />
          <div className="weather-type">Clear</div>
          <div className="temp">28°</div>
        </div>

        <div className="weather-date">
          <p>Sat, 15 Ago</p>
        </div>

        <div className="weather-data">
          <div className="humidity">
            <div className="data-name">Humidity</div>
            <i className="fa-solid fa-droplet"></i>
            <div className="data">35%</div>
          </div>

          <div className="wind">
            <div className="data-name">Wind</div>
            <i className="fa-solid fa-wind"></i>
            <div className="data">3 km/h</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WheatherApp