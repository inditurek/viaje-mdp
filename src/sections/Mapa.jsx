import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useStorage } from '../hooks/useStorage'
import { LUGARES_INICIALES } from '../data/lugares'

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
    iconSize: [34, 32], iconAnchor: [17, 30], popupAnchor: [0, -32],
  })
}

const CAT_COLORS = {
  'Café': '#8B7355', 'Restaurante': '#C4785A', 'Bar': '#7B2D3E',
  'Lugar': '#7A9E7E', 'Heladería': '#D4A0A0', 'Paseo': '#9B8B7A',
}

function FlyTo({ center }) {
  const map = useMap()
  useEffect(() => { if (center) map.flyTo(center, 15, { duration: 1 }) }, [center, map])
  return null
}

const LATO     = { fontFamily: 'Lato, sans-serif' }
const PLAYFAIR = { fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }

const inputStyle = {
  ...LATO, border: '1.5px solid #D4C4B0', background: '#FAF6EF',
  color: '#3D2B1F', borderRadius: 14, padding: '13px 18px',
  width: '100%', outline: 'none', display: 'block',
}

export default function Mapa() {
  const [lugares, setLugares]         = useStorage('lugares', LUGARES_INICIALES)
  const [showLista, setShowLista]     = useState(false)
  const [flyTo, setFlyTo]             = useState(null)
  const [showAgregar, setShowAgregar] = useState(false)
  const [nuevo, setNuevo]             = useState({ nombre: '', descripcion: '', categoria: 'Café' })

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

  // Altura = viewport - bottom nav - safe area
  const mapaH = 'calc(100dvh - 60px - env(safe-area-inset-bottom, 0px))'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: mapaH }}>

      {/* Barra superior del mapa */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', background: '#FFFFFF', borderBottom: '1.5px solid #D4C4B0',
        flexShrink: 0, zIndex: 20,
      }}>
        <div>
          <h2 style={{ ...PLAYFAIR, fontSize: 17, color: '#3D2B1F' }}>Mar del Plata</h2>
          <p style={{ ...LATO, color: '#9B8B7A', fontSize: 12 }}>{visitados} de {total} visitados</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowLista(v => !v)}
            style={{ ...LATO, padding: '9px 14px', borderRadius: 12, background: '#FAF6EF', color: '#8B7355', border: '1.5px solid #D4C4B0', fontSize: 14, cursor: 'pointer' }}>
            Lista
          </button>
          <button onClick={() => setShowAgregar(true)}
            style={{ ...LATO, padding: '9px 14px', borderRadius: 12, background: '#C4785A', color: 'white', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            + Lugar
          </button>
        </div>
      </div>

      {/* Mapa */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <MapContainer center={[-38.008, -57.545]} zoom={13}
          style={{ width: '100%', height: '100%' }} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {flyTo && <FlyTo center={flyTo} />}
          {lugares.map(l => (
            <Marker key={l.id} position={[l.lat, l.lng]} icon={crearIconoCorazon(l.visitado)}>
              <Popup>
                <div style={{ minWidth: 190, maxWidth: 240, ...LATO }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>{l.emoji}</span>
                    <strong style={{ color: '#3D2B1F', fontSize: 14 }}>{l.nombre}</strong>
                  </div>
                  <span style={{
                    display: 'inline-block', padding: '2px 10px', borderRadius: 50, fontSize: 11, fontWeight: 700, marginBottom: 8,
                    background: (CAT_COLORS[l.categoria] || '#9B8B7A') + '20',
                    color: CAT_COLORS[l.categoria] || '#9B8B7A',
                  }}>{l.categoria}</span>
                  <p style={{ fontSize: 12, color: '#8B7355', marginBottom: 10, lineHeight: 1.5 }}>{l.descripcion}</p>
                  <button onClick={() => toggle(l.id)} style={{
                    width: '100%', padding: '10px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: l.visitado ? '#7A9E7E' : '#C4785A', color: 'white',
                    ...LATO, fontSize: 13, fontWeight: 700,
                  }}>
                    {l.visitado ? '✓ Visitado' : '♥ Marcar como visitado'}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Leyenda */}
        <div style={{
          position: 'absolute', bottom: 16, left: 16, zIndex: 10,
          display: 'flex', gap: 10, padding: '8px 16px', borderRadius: 20,
          background: '#FFFFFF', border: '1.5px solid #D4C4B0',
          boxShadow: '0 2px 8px rgba(61,43,31,0.1)', ...LATO, fontSize: 12,
        }}>
          <span style={{ color: '#6B6B6B' }}>🤍 Pendiente</span>
          <span style={{ color: '#D4C4B0' }}>·</span>
          <span style={{ color: '#7B2D3E' }}>❤️ Visitado</span>
        </div>

        {/* Barra de progreso */}
        <div style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 10,
          display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px', borderRadius: 50,
          background: '#FFFFFF', border: '1.5px solid #D4C4B0',
          boxShadow: '0 2px 8px rgba(61,43,31,0.08)',
        }}>
          <div style={{ width: 100, height: 7, borderRadius: 8, background: '#FAF6EF', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 8, background: '#D4A0A0',
              width: `${(visitados / total) * 100}%`, transition: 'width 0.5s',
            }} />
          </div>
          <span style={{ ...LATO, color: '#8B7355', fontSize: 12 }}>{visitados}/{total}</span>
        </div>

        {/* Panel lista */}
        {showLista && (
          <div
            style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(61,43,31,0.45)', display: 'flex', flexDirection: 'column' }}
            onClick={() => setShowLista(false)}
          >
            <div
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: '#FFFFFF', borderRadius: '24px 24px 0 0',
                maxHeight: '70%', display: 'flex', flexDirection: 'column',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ padding: '18px 20px 12px', borderBottom: '1.5px solid #FAF6EF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <h3 style={{ ...PLAYFAIR, fontSize: 18, color: '#3D2B1F' }}>Todos los lugares</h3>
                <button onClick={() => setShowLista(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9B8B7A', fontSize: 22, lineHeight: 1 }}>✕</button>
              </div>
              <div style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {lugares.map(l => (
                  <div key={l.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                      borderRadius: 16, cursor: 'pointer',
                      background: l.visitado ? '#F0F8F0' : '#FAF6EF',
                    }}
                    onClick={() => { setFlyTo([l.lat, l.lng]); setShowLista(false) }}
                  >
                    <span style={{ fontSize: 20 }}>{l.visitado ? '❤️' : '🤍'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ ...LATO, fontWeight: 700, fontSize: 14, color: '#3D2B1F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.nombre}</p>
                      <p style={{ ...LATO, color: '#9B8B7A', fontSize: 12 }}>{l.categoria}</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); toggle(l.id) }}
                      style={{
                        ...LATO, padding: '7px 12px', borderRadius: 10, fontSize: 13, cursor: 'pointer',
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
      </div>

      {/* Modal agregar lugar */}
      {showAgregar && (
        <div className="fixed inset-0 z-50 flex items-end"
          style={{ background: 'rgba(61,43,31,0.55)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowAgregar(false) }}>
          <div className="w-full" style={{
            background: '#FFFFFF', borderRadius: '24px 24px 0 0',
            padding: '24px 20px',
            paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ ...PLAYFAIR, fontSize: 20, color: '#3D2B1F' }}>Nuevo lugar</h3>
              <button onClick={() => setShowAgregar(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9B8B7A', fontSize: 24, lineHeight: 1 }}>✕</button>
            </div>
            <input style={inputStyle} placeholder="Nombre del lugar"
              value={nuevo.nombre} onChange={e => setNuevo(n => ({ ...n, nombre: e.target.value }))} />
            <textarea style={{ ...inputStyle, resize: 'none' }} placeholder="¿Qué se puede hacer ahí?" rows={2}
              value={nuevo.descripcion} onChange={e => setNuevo(n => ({ ...n, descripcion: e.target.value }))} />
            <select style={{ ...inputStyle }}
              value={nuevo.categoria} onChange={e => setNuevo(n => ({ ...n, categoria: e.target.value }))}>
              {Object.keys(CAT_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={agregar}
              style={{ ...LATO, padding: '17px', borderRadius: 16, background: '#C4785A', color: 'white', fontSize: 17, fontWeight: 700, border: 'none', cursor: 'pointer', width: '100%' }}>
              Agregar lugar 📍
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
