import React from 'react'
import NavBar from '../components/NavBar'
import Latest from '../components/Latest'
import SearchArea from '../components/SearchArea'

export default function Home() {
  return (
    <div>
        <NavBar/>
        <br />
        <br />
        <br />
        <SearchArea/>
        <Latest/>
    </div>
  )
}
