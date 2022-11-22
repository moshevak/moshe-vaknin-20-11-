import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from 'react'
import Menu from './Components/Menu'
import Home from './Components/Home'
import Favorites from './Components/Favorites'

function App() {
  const [selectedFavoriteCity, setSelectedFavoriteCity] = useState({})
  const [favoriteCities, setFavoriteCities] = useState([])
  return (
    <div>
      <BrowserRouter>
        <Menu />
        <Routes>
          <Route path="/" element={<Home
            selectedFavoriteCity={selectedFavoriteCity}
            favoriteCities={favoriteCities} setFavoriteCities={setFavoriteCities} />} />
          <Route path="/favorites" element={<Favorites
            setSelectedFavoriteCity={setSelectedFavoriteCity}
            favoriteCities={favoriteCities} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
