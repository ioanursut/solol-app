'use client'

import { useEffect, useRef, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  CircleMarker,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'
import { Bar } from '../types/Bar'
import SunCalc from 'suncalc'

type MapProps = {
  bars: Bar[]
  radius: number
  sunFilter: string[]
  beerFilter: string[]
  sunNearby: boolean
  sunCitywide: boolean
  maxPrice: number // 👈 NY prop
}

const createIcon = (price: number) =>
  L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background:#fff;padding:4px 6px;border-radius:6px;border:1px solid #999;font-weight:bold;">${price} kr</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })

const createSunIcon = (price: number) =>
  L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background:#ffeaa7;padding:4px 6px;border-radius:6px;border:1px solid #f39c12;font-weight:bold;">🔆 ${price} kr</div>`,
    iconSize: [50, 40],
    iconAnchor: [25, 20],
  })

const directionToDegrees: Record<string, number> = {
  nord: 0,
  nordost: 45,
  ost: 90,
  sydost: 135,
  syd: 180,
  sydväst: 225,
  väst: 270,
  nordväst: 315,
}

const isDirectionInSun = (sunAzimuth: number, barDir?: string) => {
  if (!barDir) return false
  const barDeg = directionToDegrees[barDir.toLowerCase()]
  if (barDeg === undefined) return false
  const diff = Math.abs(barDeg - sunAzimuth)
  return diff < 45 || diff > 315
}

function Routing({ from, to }: { from: [number, number]; to: [number, number] }) {
  const map = useMap()
  const routingRef = useRef<L.Routing.Control | null>(null)

  useEffect(() => {
    if (!from || !to || !map) return

    if (routingRef.current) {
      map.removeControl(routingRef.current)
    }

    const control = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      lineOptions: {
        styles: [{ color: '#3498db', weight: 4 }],
      },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null,
      routeWhileDragging: false,
      showAlternatives: false,
      plan: L.Routing.plan([], {
        createMarker: () => null
      }),
    }).addTo(map)

    routingRef.current = control

    return () => {
      map.removeControl(control as unknown as L.control)
    }
  }, [from, to, map])

  return null
}

export default function Map({ bars, radius, sunFilter, beerFilter, sunNearby, sunCitywide, maxPrice }: MapProps) {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null)
  const [destination, setDestination] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPosition([pos.coords.latitude, pos.coords.longitude])
        },
        () => {
          setUserPosition([59.3293, 18.0686])
        }
      )
    } else {
      setUserPosition([59.3293, 18.0686])
    }
  }, [])

  if (!userPosition) return <p>🚀 Laddar karta...</p>

  const sunPos = SunCalc.getPosition(new Date(), userPosition[0], userPosition[1])
  const azimuthDeg = (sunPos.azimuth * 180) / Math.PI + 180

  const barsFiltered = bars.filter((bar) => {
    const dist = L.latLng(userPosition[0], userPosition[1]).distanceTo(
      L.latLng(bar.latitude, bar.longitude)
    )
    const matchesDistance = dist <= radius
    const matchesSun = sunFilter.length === 0 || sunFilter.includes(bar.sun?.toLowerCase())
    const matchesDirection = isDirectionInSun(azimuthDeg, bar.sun_direction)
    const matchesPrice = bar.price <= maxPrice

    if (sunNearby && sunCitywide) {
      return matchesDirection && matchesPrice
    } else if (sunNearby) {
      return matchesDirection && matchesDistance && matchesPrice
    } else if (sunCitywide) {
      return matchesDirection && matchesPrice
    } else {
      return matchesDistance && matchesSun && matchesPrice
    }
  })

  let filteredBars: Bar[] = []

  if (beerFilter.length === 0) {
    filteredBars = barsFiltered
  } else {
    beerFilter.forEach((beerType) => {
      const candidates = barsFiltered.filter(
        (bar) => bar.beer_type?.toLowerCase() === beerType.toLowerCase()
      )
      if (candidates.length > 0) {
        const cheapest = candidates.reduce((a, b) => (a.price < b.price ? a : b))
        filteredBars.push(cheapest)
      }
    })
  }

  return (
    <MapContainer
      center={userPosition}
      zoom={15}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
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

      {!sunCitywide && (
        <Circle
          center={userPosition}
          radius={radius}
          pathOptions={{ color: 'blue', fillOpacity: 0.1 }}
        />
      )}

      {filteredBars.map((bar) => {
        const hasSunNow = isDirectionInSun(azimuthDeg, bar.sun_direction)
        const icon = hasSunNow ? createSunIcon(bar.price) : createIcon(bar.price)

        const isActiveDestination =
          destination &&
          destination[0] === bar.latitude &&
          destination[1] === bar.longitude

        return (
          <Marker
            key={bar.id}
            position={[bar.latitude, bar.longitude]}
            icon={icon}
          >
            <Popup>
              <strong>{bar.name}</strong><br />
              {bar.address}<br />
              Pris: {bar.price} kr<br />
              {bar.beer_type && `Öl: ${bar.beer_type}`}<br />
              {bar.sun && `Solläge: ${bar.sun}`}<br />
              {bar.sun_direction && `Riktning: ${bar.sun_direction}`}<br />
              {hasSunNow && '🔆 Sol just nu'}<br />
              📏 Avstånd: {Math.round(
                L.latLng(userPosition[0], userPosition[1]).distanceTo(
                  L.latLng(bar.latitude, bar.longitude)
                )
              )} meter<br /><br />
              {!isActiveDestination ? (
                <button
                  onClick={() => setDestination([bar.latitude, bar.longitude])}
                  style={{
                    padding: '6px 12px',
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Hitta hit
                </button>
              ) : (
                <button
                  onClick={() => setDestination(null)}
                  style={{
                    padding: '6px 12px',
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Avbryt navigation
                </button>
              )}
            </Popup>
          </Marker>
        )
      })}

      {userPosition && destination && (
        <Routing from={userPosition} to={destination} />
      )}
    </MapContainer>
  )
}