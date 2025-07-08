'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('../components/Map'), {
  ssr: false
})
import { Bar } from '../types/Bar'

export default function Home() {
  const [bars, setBars] = useState<Bar[]>([])

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
    <div style={{ height: '100vh', width: '100%' }}>
      <Map bars={bars} />
    </div>
  )
}
