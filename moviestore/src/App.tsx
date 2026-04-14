import { Route, Routes } from 'react-router-dom'
import './App.css'
import Menu from './components/Menu'
import HomePage from './PagesComponents/HomePage'
import BrowsePage from './PagesComponents/BrowsePage'
import { useEffect, useState } from 'react'
import { GenreContext } from './img/context/GenreContext'


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
    <GenreContext.Provider value={genre}>
      <Menu>
        <Routes>
          <Route path="/" element={<HomePage/>}></Route>
          <Route path="/browse" element={<BrowsePage/>}></Route>
        </Routes>
      </Menu>
    </GenreContext.Provider>
  </>
)
}

export default App
