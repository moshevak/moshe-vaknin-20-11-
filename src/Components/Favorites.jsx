import { useNavigate } from "react-router-dom";


function Favorites(props) {
    const nav = useNavigate();

    return (
        <div>
            {props.favoriteCities.map((city, index) => {
                return (<div
                    onClick={() => {
                        props.setSelectedFavoriteCity({
                            location: city.location,
                            temp: city.temp,
                            id: city.id
                        })
                        nav('/')
                    }}
                    style={{ display: 'inline', margin: '2px', border: '1px solid black' }} key={index}>
                    <p style={{ display: 'inline', margin: '5px' }}>{city.location}</p>
                    <p style={{ display: 'inline' }}>{city.temp}</p>

                </div>)
            })}
        </div>
    );
}

export default Favorites;
