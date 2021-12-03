import { BrowserRouter as Router } from 'react-router-dom'
import Main from './Main'
import React from 'react'
import { MyContextProvider } from '../services/MyContext'


function App() {
  return (
    <Router>
      <div>
        <MyContextProvider><Main /></MyContextProvider>
      </div>
    </Router>
  )
}

export default App;
