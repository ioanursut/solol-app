'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '../lib/supabase'
import Menu from '../components/Menu'
import AddBarForm from '../components/AddBarForm'
import { Bar } from '../types/Bar'

const Map = dynamic(() => import('../components/Map'), {
  ssr: false
})

export default function Home() {
  const [bars, setBars] = useState<Bar[]>([])
  const [radius, setRadius] = useState(500)
  const [sunFilter, setSunFilter] = useState<string[]>([])
  const [beerFilter, setBeerFilter] = useState<string[]>([])
  const [sunNearby, setSunNearby] = useState(false)
  const [sunCitywide, setSunCitywide] = useState(false)
  const [maxPrice, setMaxPrice] = useState(100) // 👈 NY

  useEffect(() => {
    const fetchBars = async () => {
      const { data, error } = await supabase.from('bars').select('*')
      if (error) {
        console.error('Error fetching bars:', error)
      } else {
        setBars(data as Bar[])
      }
    }

    fetchBars()
  }, [])

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <Menu
        radius={radius}
        setRadius={setRadius}
        sunFilter={sunFilter}
        setSunFilter={setSunFilter}
        beerFilter={beerFilter}
        setBeerFilter={setBeerFilter}
        sunNearby={sunNearby}
        setSunNearby={setSunNearby}
        sunCitywide={sunCitywide}
        setSunCitywide={setSunCitywide}
        maxPrice={maxPrice}               // 👈 skickas till menyn
        setMaxPrice={setMaxPrice}         // 👈 skickas till menyn
      />

      <Map
        bars={bars}
        radius={radius}
        sunFilter={sunFilter}
        beerFilter={beerFilter}
        sunNearby={sunNearby}
        sunCitywide={sunCitywide}
        maxPrice={maxPrice}               // 👈 skickas till kartan
      />

      <AddBarForm />
    </div>
  )
}