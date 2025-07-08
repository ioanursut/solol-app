'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Bar } from './Bar'

type Props = {
  bars: Bar[]
}

// Skapa en prisikon (t.ex. "49 kr")
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
  return (
    <MapContainer
      center={[59.3293, 18.0686]} // Stockholm
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {bars.map((bar) => (
        <Marker
          key={bar.id}
          position={[bar.lat, bar.lng]}
          icon={customIcon(bar.price)}
        >
          <Popup>
