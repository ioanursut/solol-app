'use client'

import { useState } from 'react'

type MenuProps = {
  radius: number
  setRadius: (value: number) => void
  sunFilter: string[]
  setSunFilter: (value: string[]) => void
  beerFilter: string[]
  setBeerFilter: (value: string[]) => void
  sunNearby: boolean
  setSunNearby: (value: boolean) => void
  sunCitywide: boolean
  setSunCitywide: (value: boolean) => void
  maxPrice: number
  setMaxPrice: (value: number) => void
}

const allSunOptions = ['sydläge', 'kvällssol', 'sol hela dagen']
const allBeerOptions = ['stor stark', 'IPA', 'stout', 'lager', 'pilsner', 'wheat beer']

export default function Menu({
  radius,
  setRadius,
  sunFilter,
  setSunFilter,
  beerFilter,
  setBeerFilter,
  sunNearby,
  setSunNearby,
  sunCitywide,
  setSunCitywide,
  maxPrice,
  setMaxPrice,
}: MenuProps) {
  const [open, setOpen] = useState(false)

  const toggleCheckbox = (value: string, current: string[], setter: (v: string[]) => void) => {
    if (current.includes(value)) {
      setter(current.filter((v) => v !== value))
    } else {
      setter([...current, value])
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1100,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '6px',
          padding: '6px 10px',
          fontSize: '20px',
          cursor: 'pointer',
        }}
      >
        ☰
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 50,
          left: 10,
          zIndex: 1000,
          backgroundColor: 'white',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          width: '240px',
          fontFamily: 'sans-serif'
        }}>
          {/* Sökavstånd */}
          <label style={{ fontWeight: 'bold' }}>🔍 Sökavstånd: {radius} meter</label>
          <input
            type="range"
            min={100}
            max={2000}
            step={100}
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            style={{ width: '100%', marginBottom: '12px' }}
          />

          {/* Maxpris */}
          <label style={{ fontWeight: 'bold' }}>💸 Maxpris: {maxPrice} kr</label>
          <input
            type="range"
            min={30}
            max={120}
            step={1}
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            style={{ width: '100%', marginBottom: '12px' }}
          />

          {/* Solläge */}
          <label style={{ fontWeight: 'bold' }}>☀️ Solläge</label>
          <div style={{ marginBottom: '12px' }}>
            {allSunOptions.map((option) => (
              <label key={option} style={{ display: 'block' }}>
                <input
                  type="checkbox"
                  checked={sunFilter.includes(option)}
                  onChange={() => toggleCheckbox(option, sunFilter, setSunFilter)}
                />
                {' '}{option}
              </label>
            ))}
          </div>

          {/* Ölsort */}
          <label style={{ fontWeight: 'bold' }}>🍺 Ölsort</label>
          <div style={{ marginBottom: '12px' }}>
            {allBeerOptions.map((option) => (
              <label key={option} style={{ display: 'block' }}>
                <input
                  type="checkbox"
                  checked={beerFilter.includes(option)}
                  onChange={() => toggleCheckbox(option, beerFilter, setBeerFilter)}
                />
                {' '}{option}
              </label>
            ))}
          </div>

          {/* Sol just nu */}
          <label style={{ fontWeight: 'bold' }}>🔆 Sol just nu</label>
          <div>
            <label>
              <input
                type="checkbox"
                checked={sunNearby}
                onChange={(e) => setSunNearby(e.target.checked)}
              />
              {' '}Sol i närheten
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={sunCitywide}
                onChange={(e) => setSunCitywide(e.target.checked)}
              />
              {' '}Sol i hela stan
            </label>
          </div>
        </div>
      )}
    </>
  )
}