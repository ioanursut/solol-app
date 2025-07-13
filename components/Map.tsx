'use client'

import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  Circle,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Bar } from '../types/Bar'

type MapProps = {
  bars: Bar[]
  radius: number
  sunFilter: string[]
  beerFilter: string[]
  sunNearby: boolean
  sunCitywide: boolean
}

const createIcon = (price: number) =>
  L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background:#fff;padding:4px 6px;border-radius:6px;border:1px solid #999;font-weight:bold;">${price} kr</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })

export default function Map({ bars, radius }: MapProps) {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
        () => setUserPosition([59.3293, 18.0686]) // fallback Stockholm
      )
    } else {
      setUserPosition([59.3293, 18.0686])
    }
  }, [])

  if (!userPosition) return <p>⏳ Laddar karta...</p>

  const [lat, lng] = userPosition

  const barsFiltered = bars.filter((bar) => {
    if (!bar.lat || !bar.lng) return false
    const dist = L.latLng(lat, lng).distanceTo(L.latLng(bar.lat, bar.lng))
    return dist <= radius
  })

  return (
    <MapContainer
      center={userPosition}
      zoom={15}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <CircleMarker
        center={userPosition}
        radius={8}
        pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.7 }}
      />

      <Circle
        center={userPosition}
        radius={radius}
        pathOptions={{ color: 'blue', fillOpacity: 0.1 }}
      />

      {barsFiltered.map((bar) => (
        <Marker
          key={bar.id}
          position={[bar.lat, bar.lng]}
          icon={createIcon(bar.price)}
        >
          <Popup>
            <strong>{bar.name}</strong><br />
            {bar.address}<br />
            Pris: {bar.price} kr
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}