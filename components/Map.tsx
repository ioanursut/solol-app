'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Bar } from '../types/Bar'

type Props = {
  bars: Bar[]
}

const customIcon = (price: number) =>
  L.divIcon({
    className: 'custom-icon',
    html: `<div style="
      background:#fff;
      border-radius:5px;
      padding:4px 8px;
      border:1px solid #333;
      font-size:14px;
      font-weight:bold;
      box-shadow:0 0 5px rgba(0,0,0,0.3);
    ">${price} kr</div>`
  })

export default function Map({ bars }: Props) {
  // ✅ Logga all bar-data vi får in
  console.log('bars:', bars)

  return (
    <MapContainer
      center={[59.3293, 18.0686]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {bars.map((bar) => {
        const lat = parseFloat(bar.lat)
        const lng = parseFloat(bar.lng)

        if (isNaN(lat) || isNaN(lng)) {
          console.warn('Hoppar över bar pga ogiltiga koordinater:', bar)
          return null
        }

        return (
          <Marker
            key={bar.id}
            position={[lat, lng]}
            icon={customIcon(bar.price)}
          >
            <Popup>
              <strong>{bar.name}</strong><br />
              {bar.address}<br />
              🍺 {bar.price} kr
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}