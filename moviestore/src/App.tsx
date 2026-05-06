import { Route, Routes } from 'react-router-dom'
import './App.css'
import Menu from './components/Menu/Menu'
import HomePage from './PagesComponents/HomePage'
import BrowsePage from './PagesComponents/BrowsePage'
import { useEffect, useState } from 'react'
import { GenreContext } from './context/GenreContext'
import { UserProvider }  from './context/UserContext'
import SpecificGenre from './PagesComponents/SpecificGenre'
import Login from './PagesComponents/ProfileComponents/Login'
import Register from './PagesComponents/ProfileComponents/Register'


function App() {
  const [genre, setGenre] = useState(null);
  // const [loading, setLoading] = useState(true);


  // Fetching data for movies genres and saving it in context 
  useEffect(() =>{
    fetch("/api/movie/genres")
    .then(r => r.json())
    .then(data => {
      setGenre(data)
      // setLoading(false)
    })
  },[])

  // bg-[#141414] TŁO
  // bg-gray-700 PANELE
  return (
  <>
    <UserProvider>
      <GenreContext.Provider value={genre}>
        <Routes>
          <Route element={<Menu />}>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/browse" element={<BrowsePage />}></Route>
            <Route path='/movie/genre/:id_genre/:name_genre' element={<SpecificGenre />}></Route>
          </Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
        </Routes>
      </GenreContext.Provider>
    </UserProvider>
  </>
)
}

export default App
