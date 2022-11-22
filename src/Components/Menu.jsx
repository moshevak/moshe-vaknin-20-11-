import { useNavigate } from "react-router-dom";


function Menu() {
    const nav = useNavigate();

    return (
        <header>
            <button onClick={() => {
                nav('/')
            }}>Home</button>
            <button onClick={() => {
                nav('/favorites')
            }}>Favorite</button>
            <hr></hr>
        </header>
    );
}

export default Menu;
