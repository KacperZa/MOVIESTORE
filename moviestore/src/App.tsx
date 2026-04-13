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


  useEffect(() =>{
    fetch("/api/movie/genres")
    .then(r => r.json())
    .then(data => {
      setGenre(data)
      // setLoading(false)
    })
  },[])

  return (
  <>
    <Menu>
      <GenreContext.Provider value={genre}>
        <Routes>
          <Route path="/" element={<HomePage/>}></Route>
          <Route path="/browse" element={<BrowsePage/>}></Route>
        </Routes>
      </GenreContext.Provider>
    </Menu>
  </>
)
}

export default App
