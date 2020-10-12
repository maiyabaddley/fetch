import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [assets, setAssets] = useState([])
  const fetchAssets = async () => {
    const response = await fetch(
      'https://fetch-hiring.s3.amazonaws.com/hiring.json',
    ).then((response) => response.json())
    setAssets(response)
  }

  fetchAssets()

  return (
    <div className="App">
      <pre>{JSON.stringify(assets, null, '')}</pre>
    </div>
  )
}

export default App
