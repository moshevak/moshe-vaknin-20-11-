import { useState, useEffect, useRef } from 'react'

const HOST = `http://dataservice.accuweather.com`;
const TOKEN = `iDkEIIGrrrHNMUwXkqRCAMQnls1KUhja`;

const isDev = true;

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


function Home(props) {

    const isInitialLocation = useRef(true);
    const [location, setLocation] = useState(props.selectedFavoriteCity.location || 'tel aviv');
    const [filteredCities, setfilteredCities] = useState([]);
    const [currentCityKey, setCurrentCityKey] = useState(props.selectedFavoriteCity.id || '215854');
    const [selectedCity, setSelectedCity] = useState(props.selectedFavoriteCity.location || 'tel aviv')
    const [selectedCityInfo, setSelectedCityInfo] = useState({})
    const [selectedCityInfoDays, setSelectedCityInfoDays] = useState([])

    useEffect(() => {
        (async () => {

            if (isInitialLocation.current) {
                isInitialLocation.current = false;
                const currentWeather = await getCurrentWeather(currentCityKey)
                setSelectedCityInfo({ ...currentWeather })
                setSelectedCity(location)
                const daysWeather = await getDaysWeather(currentCityKey)
                setSelectedCityInfoDays([...daysWeather.DailyForecasts])

            } else {
                if (location) {
                    const autoCompleteCities = await getAutocomplete(location)
                    setfilteredCities(autoCompleteCities)
                }
            }
        })()

    }, [location])

    const autoCompleteOptions = () => {
        return filteredCities.map((city, i) => {
            return <p key={i} style={{ display: 'block', border: '1px solid black', margin: 0 }}
                onClick={async () => {
                    setLocation(city.LocalizedName);
                    setCurrentCityKey(city.Key);
                    // fetch current weather
                    const currentWeather = await getCurrentWeather(city.Key)
                    setSelectedCityInfo({ ...currentWeather })
                    setSelectedCity(city.LocalizedName)

                    // fetch 5 days weather
                    const daysWeather = await getDaysWeather(city.Key)
                    setSelectedCityInfoDays([...daysWeather.DailyForecasts])

                    // end
                    setfilteredCities([])
                }}>{city.LocalizedName}</p>
        })
    }

    const getCurrentWeather = async (key) => {
        const response = await fetch(`${HOST}/currentconditions/v1/${key}?apikey=${TOKEN}`)
        const body = await response.json();
        return body[0]
    }

    const getDaysWeather = async (key) => {
        const response = await fetch(`${HOST}/forecasts/v1/daily/5day/${key}?apikey=${TOKEN}`)
        const body = await response.json();
        return body

    }

    const getAutocomplete = async (input) => {
        const response = await fetch(`${HOST}/locations/v1/cities/autocomplete?apikey=${TOKEN}&q=${input}`)
        const body = await response.json();
        return body

    }


    const addFavorite = () => {
        props.setFavoriteCities([...props.favoriteCities,
        {
            location: selectedCity,
            id: currentCityKey,
            temp: selectedCityInfo.Temperature.Metric.Value
        }])
    }

    const removeFavorite = () => {
        const cities = props.favoriteCities.filter((city) => {
            return city.location !== selectedCity
        })
        props.setFavoriteCities([...cities])
    }


    return (
        <div>
            <input onChange={(e) => {
                setLocation(e.target.value)
            }} value={location} />
            {autoCompleteOptions()}

            <p>{selectedCity} {selectedCityInfo?.Temperature?.Metric?.Value}</p>
            <h1>{selectedCityInfo?.WeatherText}</h1>

            {
                (props.favoriteCities.filter((city) =>
                    city.location === location
                )).length ? <button onClick={removeFavorite}>remove from favorite</button> : <button onClick={addFavorite}>add to favorite</button>
            }

            {
                selectedCityInfoDays.map((day, index) => {
                    return (<div style={{ display: 'inline', margin: '2px', border: '1px solid black' }} key={index}>
                        <p style={{ display: 'inline', margin: '5px' }}>{days[new Date(day.Date).getDay()]}</p>
                        <p style={{ display: 'inline' }}>{((Number(day.Temperature.Minimum.Value) - 32) / 1.8).toFixed(0)}</p>

                    </div>)
                })
            }
        </div >
    );
}

export default Home;
