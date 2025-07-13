'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

type BarInput = {
  name: string
  address: string
  price: number
  beer_type: string
  sun: string
}

export default function AddBarForm() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<BarInput>({
    name: '',
    address: '',
    price: 0,
    beer_type: '',
    sun: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const geocodeAddress = async (address: string) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    )
    const data = await response.json()
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      }
    } else {
      throw new Error('Kunde inte hitta platsen.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const coords = await geocodeAddress(form.address)
      const { error } = await supabase.from('bars').insert({
        name: form.name,
        address: form.address,
        price: form.price,
        beer_type: form.beer_type,
        sun: form.sun,
        latitude: coords.lat,
        longitude: coords.lng,
      })
      if (error) throw error
      setMessage('✅ Baren har lagts till!')
      setForm({ name: '', address: '', price: 0, beer_type: '', sun: '' })
    } catch (err: any) {
      setMessage(`❌ Fel: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ➕ knapp */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1100,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '6px',
          padding: '6px 10px',
          fontSize: '20px',
          cursor: 'pointer',
        }}
      >
        ➕
      </button>

      {/* Formuläret */}
      {open && (
        <form
          onSubmit={handleSubmit}
          style={{
            position: 'absolute',
            top: 50,
            right: 10,
            zIndex: 1000,
            backgroundColor: 'white',
            padding: '14px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            width: '240px',
            fontFamily: 'sans-serif'
          }}
        >
          <label>🏷️ Namn</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={{ width: '100%', marginBottom: '8px' }}
          />

          <label>🏠 Adress</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
            style={{ width: '100%', marginBottom: '8px' }}
          />

          <label>💰 Pris (kr)</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) })}
            required
            style={{ width: '100%', marginBottom: '8px' }}
          />

          <label>🍺 Ölsort</label>
          <select
            value={form.beer_type}
            onChange={(e) => setForm({ ...form, beer_type: e.target.value })}
            required
            style={{ width: '100%', marginBottom: '8px' }}
          >
            <option value="">Välj</option>
            <option value="stor stark">Stor Stark</option>
            <option value="IPA">IPA</option>
            <option value="stout">Stout</option>
            <option value="lager">Lager</option>
            <option value="pilsner">Pilsner</option>
            <option value="wheat beer">Wheat Beer</option>
          </select>

          <label>☀️ Solläge</label>
          <select
            value={form.sun}
            onChange={(e) => setForm({ ...form, sun: e.target.value })}
            required
            style={{ width: '100%', marginBottom: '10px' }}
          >
            <option value="">Välj</option>
            <option value="sydläge">Sydläge</option>
            <option value="kvällssol">Kvällssol</option>
            <option value="sol hela dagen">Sol hela dagen</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '6px',
              backgroundColor: '#2c7',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Lägger till...' : 'Lägg till bar'}
          </button>

          {message && <p style={{ marginTop: '8px' }}>{message}</p>}
        </form>
      )}
    </>
  )
}