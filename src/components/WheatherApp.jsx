import { useState } from 'react'

import sunny from '../assets/sunny.png'
import cloudy from '../assets/cloudy.png'
import rainy from '../assets/rainy.png'
import snowy from '../assets/snowy.png'
import loadingGif from '../assets/loading.gif'

import { getWeatherInfo } from '../utils/wheatherCode'
import { formatDate } from '../utils/formatDate'

import { getCoordinates, getCurrentWeather } from '../service/weatherService'

import SearchBar from './SearchBar'
import WeatherCard from './WeatherCard'
import WeatherDetails from './WeatherDetails'

const WheatherApp = () => {
  const [location, setLocation] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChanges = (e) => {
    setLocation(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search(location)
    }
  }

  const search = async (city) => {
    const normalizedCity = city.trim()

    if (!normalizedCity) {
      setError('Enter a city name')
      return
    }

    try {
      setLoading(true)
      setError('')

      const coordinates = await getCoordinates(normalizedCity)

      if (!coordinates) {
        setError('City not found')
        setData(null)
        return
      }

      const currentWeather = await getCurrentWeather(
        coordinates.latitude,
        coordinates.longitude
      )

      setData({
        city: coordinates.name,
        country: coordinates.country,
        temperature: currentWeather.temperature_2m,
        humidity: currentWeather.relative_humidity_2m,
        windSpeed: currentWeather.wind_speed_10m,
        weatherCode: currentWeather.weather_code,
        time: currentWeather.time
      })

      setLocation('')
    } catch (err) {
      console.error(err)
      setError('Unable to load weather data')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const weatherInfo = data
    ? getWeatherInfo(data.weatherCode)
    : null

  const weatherImages = {
    sunny,
    cloudy,
    rainy,
    snowy
  }

  const weatherImage = weatherInfo
    ? weatherImages[weatherInfo.type] || sunny
    : sunny

  return (
    <div className="container">

      <div className="weather-app">

        <SearchBar
          city={data ? data.city : 'London'}
          location={location}
          onChange={handleInputChanges}
          onKeyDown={handleKeyDown}
          onSearch={() => search(location)}
        />

        {loading ? (
          <div className="loading">
            <img
              className="loader"
              src={loadingGif}
              alt="Loading"
            />
          </div>
        ) : (
          <>
            <WeatherCard
              image={weatherImage}
              description={
                weatherInfo
                  ? weatherInfo.description
                  : 'Clear'
              }
              temperature={
                data
                  ? data.temperature
                  : 28
              }
            />

            <div className="weather-date">
              <p>
                {data
                  ? formatDate(data.time)
                  : 'Sat, 15 Ago'}
              </p>
            </div>

            <WeatherDetails
              humidity={
                data
                  ? data.humidity
                  : 35
              }
              windSpeed={
                data
                  ? data.windSpeed
                  : 3
              }
            />
          </>
        )}

      </div>

      {error && (
        <div className="not-found">
          {error}
        </div>
      )}

    </div>
  )
}

export default WheatherApp