import sunny from '../assets/sunny.png'
import { useState } from 'react'
import { getWeatherInfo } from '../utils/wheatherCode'

const WheatherApp = () => {
  const [location, setLocation] = useState('')
  const [data, setData] = useState(null)

  // console.log(getWeatherInfo(0))
  // console.log(getWeatherInfo(63))
  // console.log(getWeatherInfo(75))

  // console.log(data)

  const handleInputChanges = (e) => {
    setLocation(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search(location)
    }
  }

  //const search = (city) => {
  //  console.log('Searching for:', city)
  //}

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

  const getWeather = async ({ latitude, longitude }) => {
    const params = new URLSearchParams({
      latitude,
      longitude,
      current:
        'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
      timezone: 'auto'
    })

    const url = `https://api.open-meteo.com/v1/forecast?${params}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const result = await response.json()

    return result.current
  }

  // TESTE TEMPORÁRIO DA TASK 11
  //getWeather({
  //  latitude: -23.5475,
  //  longitude: -46.63611
  //}).then(console.log)

  const search = async (city) => {
  const normalizedCity = city.trim()

  if (!normalizedCity) {
    return
  }

  try {
    const coordinates = await getCoordinates(normalizedCity)

    if (!coordinates) {
      console.log('City not found')
      return
    }

    const currentWeather = await getWeather(coordinates)

    setData({
      city: coordinates.name,
      country: coordinates.country,
      temperature: currentWeather.temperature_2m,
      humidity: currentWeather.relative_humidity_2m,
      windSpeed: currentWeather.wind_speed_10m,
      weatherCode: currentWeather.weather_code,
      time: currentWeather.time
    })
  } catch (error) {
    console.error(error)
  }
}

console.log(data)

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