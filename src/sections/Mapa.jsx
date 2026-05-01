import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useStorage } from '../hooks/useStorage'
import { LUGARES_INICIALES } from '../data/lugares'

const LATO     = { fontFamily: 'Lato, sans-serif' }
const PLAYFAIR = { fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }

function crearIconoCorazon(visitado) {
  const fill   = visitado ? '#F4A0B5' : 'white'
  const stroke = visitado ? '#7B2D3E' : '#6B6B6B'
  const svg = `<svg width="34" height="32" viewBox="0 0 34 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 27 C17 27 4 17 4 10 C4 6 7 3 11 3 C13.5 3 15.5 4.5 17 6.5 C18.5 4.5 20.5 3 23 3 C27 3 30 6 30 10 C30 17 17 27 17 27Z"
      fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
  </svg>`
  return L.divIcon({
    className: '',
    html: `<div style="filter:drop-shadow(0 2px 5px rgba(0,0,0,0.22))">${svg}</div>`,
    iconSize: [34, 32],
    iconAnchor: [17, 30],
    popupAnchor: [0, -32],
  })
}

const CAT_COLORS = {
  'Café':        '#8B7355',
  'Restaurante': '#C4785A',
  'Bar':         '#7B2D3E',
  'Lugar':       '#7A9E7E',
  'Heladería':   '#D4A0A0',
  'Paseo':       '#9B8B7A',
}

function FlyTo({ center }) {
  const map = useMap()
  useEffect(() => { if (center) map.flyTo(center, 15, { duration: 1 }) }, [center, map])
  return null
}

export default function Mapa() {
  const [lugares, setLugares] = useStorage('lugares', LUGARES_INICIALES)
  const [showLista, setShowLista]   = useState(false)
  const [flyTo, setFlyTo]           = useState(null)
  const [showAgregar, setShowAgregar] = useState(false)
  const [nuevo, setNuevo] = useState({ nombre: '', descripcion: '', categoria: 'Café' })

  const visitados = lugares.filter(l => l.visitado).length
  const total     = lugares.length

  function toggle(id) {
    setLugares(prev => prev.map(l => l.id === id ? { ...l, visitado: !l.visitado } : l))
  }

  function agregar() {
    if (!nuevo.nombre) return
    setLugares(prev => [...prev, { id: Date.now(), ...nuevo, lat: -38.0024, lng: -57.5447, emoji: '📍', visitado: false }])
    setNuevo({ nombre: '', descripcion: '', categoria: 'Café' })
    setShowAgregar(false)
  }

  const inputStyle = { ...LATO, border: '1.5px solid #D4C4B0', background: '#FAF6EF', color: '#3D2B1F', fontSize: 16, borderRadius: 16, padding: '14px 20px', width: '100%', outline: 'none' }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 60px)' }}>
      {/* Barra */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ background: '#FFFFFF', borderBottom: '1.5px solid #D4C4B0', zIndex: 20 }}>
        <div>
          <h2 style={{ ...PLAYFAIR, fontSize: 18, color: '#3D2B1F' }}>Mar del Plata</h2>
          <p style={{ ...LATO, color: '#9B8B7A', fontSize: 13 }}>{visitados} de {total} lugares visitados</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowLista(v => !v)}
            style={{ ...LATO, padding: '10px 16px', borderRadius: 12, background: '#FAF6EF', color: '#8B7355', border: '1.5px solid #D4C4B0', fontSize: 14 }}>
            Lista
          </button>
          <button onClick={() => setShowAgregar(true)}
            style={{ ...LATO, padding: '10px 16px', borderRadius: 12, background: '#C4785A', color: 'white', fontSize: 14, fontWeight: 700 }}>
            + Lugar
          </button>
        </div>
      </div>

      {/* Mapa */}
      <div className="flex-1 relative">
        <MapContainer center={[-38.008, -57.545]} zoom={13} className="w-full h-full" zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {flyTo && <FlyTo center={flyTo} />}
          {lugares.map(l => (
            <Marker key={l.id} position={[l.lat, l.lng]} icon={crearIconoCorazon(l.visitado)}>
              <Popup>
                <div style={{ minWidth: 200, ...LATO }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{l.emoji}</span>
                    <strong style={{ color: '#3D2B1F', fontSize: 15 }}>{l.nombre}</strong>
                  </div>
                  <span style={{
                    display: 'inline-block', padding: '2px 10px', borderRadius: 50, fontSize: 12, fontWeight: 700, marginBottom: 8,
                    background: (CAT_COLORS[l.categoria] || '#9B8B7A') + '20',
                    color: CAT_COLORS[l.categoria] || '#9B8B7A',
                  }}>{l.categoria}</span>
                  <p style={{ fontSize: 13, color: '#8B7355', marginBottom: 10, lineHeight: 1.5 }}>{l.descripcion}</p>
                  <button onClick={() => toggle(l.id)} style={{
                    width: '100%', padding: '10px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: l.visitado ? '#7A9E7E' : '#C4785A', color: 'white',
                    fontFamily: 'Lato, sans-serif', fontSize: 14, fontWeight: 700,
                  }}>
                    {l.visitado ? '✓ Visitado' : '♥ Marcar como visitado'}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Leyenda */}
        <div className="absolute bottom-4 left-4 z-10 flex gap-3 px-4 py-2.5 rounded-2xl"
          style={{ background: '#FFFFFF', border: '1.5px solid #D4C4B0', boxShadow: '0 2px 8px rgba(61,43,31,0.1)', ...LATO, fontSize: 13 }}>
          <span style={{ color: '#6B6B6B' }}>🤍 Pendiente</span>
          <span style={{ color: '#D4C4B0' }}>·</span>
          <span style={{ color: '#7B2D3E' }}>❤️ Visitado</span>
        </div>

        {/* Progreso */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-2 rounded-full"
          style={{ background: '#FFFFFF', border: '1.5px solid #D4C4B0', boxShadow: '0 2px 8px rgba(61,43,31,0.08)' }}>
          <div style={{ width: 112, height: 8, borderRadius: 8, background: '#FAF6EF', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 8, background: '#D4A0A0', width: `${(visitados / total) * 100}%`, transition: 'width 0.5s' }} />
          </div>
          <span style={{ ...LATO, color: '#8B7355', fontSize: 13 }}>{visitados}/{total}</span>
        </div>
      </div>

      {/* Lista */}
      {showLista && (
        <div className="absolute inset-0 z-30 flex flex-col"
          style={{ background: 'rgba(61,43,31,0.45)', top: 56 + 60 }}
          onClick={() => setShowLista(false)}>
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl flex flex-col overflow-hidden"
            style={{ background: '#FFFFFF', maxHeight: '72%' }}
            onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 px-5 pt-5 pb-3 flex items-center justify-between"
              style={{ background: '#FFFFFF', borderBottom: '1.5px solid #FAF6EF' }}>
              <h3 style={{ ...PLAYFAIR, fontSize: 18, color: '#3D2B1F' }}>Todos los lugares</h3>
              <button onClick={() => setShowLista(false)} style={{ color: '#9B8B7A', fontSize: 22 }}>✕</button>
            </div>
            <div className="overflow-y-auto p-4 flex flex-col gap-2">
              {lugares.map(l => (
                <div key={l.id} className="flex items-center gap-3 p-4 rounded-2xl cursor-pointer"
                  style={{ background: l.visitado ? '#F0F8F0' : '#FAF6EF' }}
                  onClick={() => { setFlyTo([l.lat, l.lng]); setShowLista(false) }}>
                  <span style={{ fontSize: 22 }}>{l.visitado ? '❤️' : '🤍'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-bold" style={{ color: '#3D2B1F', fontSize: 14, ...LATO }}>{l.nombre}</p>
                    <p style={{ color: '#9B8B7A', fontSize: 12, ...LATO }}>{l.categoria}</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); toggle(l.id) }}
                    style={{
                      ...LATO, padding: '8px 12px', borderRadius: 10, fontSize: 13,
                      background: l.visitado ? '#7A9E7E20' : '#C4785A20',
                      color:      l.visitado ? '#7A9E7E'   : '#C4785A',
                      border:     `1.5px solid ${l.visitado ? '#7A9E7E40' : '#C4785A40'}`,
                    }}>
                    {l.visitado ? '✓' : '♥'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal agregar */}
      {showAgregar && (
        <div className="fixed inset-0 z-50 flex items-end"
          style={{ background: 'rgba(61,43,31,0.55)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowAgregar(false) }}>
          <div className="w-full rounded-t-3xl p-6 flex flex-col gap-5"
            style={{ background: '#FFFFFF' }}>
            <div className="flex items-center justify-between">
              <h3 style={{ ...PLAYFAIR, fontSize: 20, color: '#3D2B1F' }}>Nuevo lugar</h3>
              <button onClick={() => setShowAgregar(false)} style={{ color: '#9B8B7A', fontSize: 24, lineHeight: 1 }}>✕</button>
            </div>
            <input style={inputStyle} placeholder="Nombre del lugar"
              value={nuevo.nombre} onChange={e => setNuevo(n => ({ ...n, nombre: e.target.value }))} />
            <textarea style={{ ...inputStyle, resize: 'none' }} placeholder="¿Qué se puede hacer ahí?" rows={2}
              value={nuevo.descripcion} onChange={e => setNuevo(n => ({ ...n, descripcion: e.target.value }))} />
            <select style={{ ...inputStyle }}
              value={nuevo.categoria} onChange={e => setNuevo(n => ({ ...n, categoria: e.target.value }))}>
              {Object.keys(CAT_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={agregar} className="w-full active:scale-95"
              style={{ ...LATO, padding: '18px', borderRadius: 16, background: '#C4785A', color: 'white', fontSize: 17, fontWeight: 700 }}>
              Agregar lugar 📍
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
