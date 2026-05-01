import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useStorage } from '../hooks/useStorage'
import { LUGARES_INICIALES } from '../data/lugares'

function crearIconoCorazon(visitado) {
  const fill   = visitado ? '#F4A0B5' : 'white'
  const stroke = visitado ? '#7B2D3E' : '#5A5A5A'
  const svg = `<svg width="34" height="32" viewBox="0 0 34 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 28 C17 28 3 17 3 9.5 C3 5.5 6.2 2.5 10.5 2.5 C13.2 2.5 15.5 4 17 6 C18.5 4 20.8 2.5 23.5 2.5 C27.8 2.5 31 5.5 31 9.5 C31 17 17 28 17 28Z"
      fill="${fill}" stroke="${stroke}" stroke-width="2.8" stroke-linejoin="round"/>
  </svg>`
  return L.divIcon({
    className: '',
    html: `<div style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.25))">${svg}</div>`,
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
  const [showLista, setShowLista] = useState(false)
  const [flyTo, setFlyTo]         = useState(null)
  const [showAgregar, setShowAgregar] = useState(false)
  const [nuevo, setNuevo] = useState({ nombre: '', descripcion: '', categoria: 'Café' })

  const visitados = lugares.filter(l => l.visitado).length
  const total     = lugares.length

  function toggle(id) {
    setLugares(prev => prev.map(l => l.id === id ? { ...l, visitado: !l.visitado } : l))
  }

  function agregar() {
    if (!nuevo.nombre) return
    setLugares(prev => [...prev, {
      id: Date.now(), ...nuevo,
      lat: -38.0024, lng: -57.5447,
      emoji: '📍', visitado: false,
    }])
    setNuevo({ nombre: '', descripcion: '', categoria: 'Café' })
    setShowAgregar(false)
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 56px)' }}>
      {/* Barra superior */}
      <div
        className="flex items-center justify-between px-4 py-3 z-20"
        style={{ background: '#FFFDF5', borderBottom: '2px solid #D4C4B0' }}
      >
        <div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#3D2B1F', fontStyle: 'italic', fontSize: 18 }}>
            Mar del Plata
          </h2>
          <p className="font-hand text-sm" style={{ color: '#9B8B7A', fontSize: 13 }}>
            {visitados} de {total} lugares visitados
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowLista(v => !v)}
            className="px-4 py-2.5 rounded-xl font-hand text-base transition-all"
            style={{ fontSize: 15, background: '#F2E8D9', color: '#8B7355', border: '1.5px solid #D4C4B0' }}
          >
            Lista
          </button>
          <button
            onClick={() => setShowAgregar(true)}
            className="px-4 py-2.5 rounded-xl font-hand text-base text-white transition-all"
            style={{ fontSize: 15, background: '#C4785A' }}
          >
            + Lugar
          </button>
        </div>
      </div>

      {/* Mapa */}
      <div className="flex-1 relative">
        <MapContainer
          center={[-38.008, -57.545]}
          zoom={13}
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {flyTo && <FlyTo center={flyTo} />}
          {lugares.map(l => (
            <Marker key={l.id} position={[l.lat, l.lng]} icon={crearIconoCorazon(l.visitado)}>
              <Popup>
                <div style={{ minWidth: 200, fontFamily: 'Lato, sans-serif' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ fontSize: 20 }}>{l.emoji}</span>
                    <strong style={{ color: '#3D2B1F', fontSize: 15 }}>{l.nombre}</strong>
                  </div>
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-2"
                    style={{
                      background: (CAT_COLORS[l.categoria] || '#9B8B7A') + '20',
                      color: CAT_COLORS[l.categoria] || '#9B8B7A',
                    }}
                  >
                    {l.categoria}
                  </span>
                  <p style={{ fontSize: 13, color: '#8B7355', marginBottom: 10, lineHeight: 1.4 }}>
                    {l.descripcion}
                  </p>
                  <button
                    onClick={() => toggle(l.id)}
                    style={{
                      width: '100%', padding: '8px 0', borderRadius: 12,
                      background: l.visitado ? '#7A9E7E' : '#C4785A',
                      color: 'white', border: 'none', cursor: 'pointer',
                      fontFamily: 'Caveat, cursive', fontSize: 16, fontWeight: 700,
                    }}
                  >
                    {l.visitado ? '✓ Visitado' : '♥ Marcar como visitado'}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Leyenda */}
        <div
          className="absolute bottom-4 left-4 z-10 flex gap-3 px-4 py-2.5 rounded-2xl font-hand text-sm"
          style={{ background: '#FFFDF5', border: '1.5px solid #D4C4B0', boxShadow: '0 2px 8px rgba(61,43,31,0.1)', fontSize: 14 }}
        >
          <span style={{ color: '#5A5A5A' }}>🤍 Pendiente</span>
          <span style={{ color: '#D4C4B0' }}>·</span>
          <span style={{ color: '#7B2D3E' }}>❤️ Visitado</span>
        </div>

        {/* Progreso */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-2 rounded-full"
          style={{ background: '#FFFDF5', border: '1.5px solid #D4C4B0', boxShadow: '0 2px 8px rgba(61,43,31,0.08)' }}
        >
          <div className="w-28 h-2 rounded-full overflow-hidden" style={{ background: '#F2E8D9' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(visitados / total) * 100}%`, background: '#D4A0A0' }}
            />
          </div>
          <span className="font-hand text-sm" style={{ color: '#8B7355', fontSize: 14 }}>
            {visitados}/{total}
          </span>
        </div>
      </div>

      {/* Panel lista */}
      {showLista && (
        <div
          className="absolute inset-0 z-30 flex flex-col"
          style={{ background: 'rgba(61,43,31,0.45)', top: 56 + 57 }}
          onClick={() => setShowLista(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl flex flex-col overflow-hidden"
            style={{ background: '#FFFDF5', maxHeight: '72%' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 px-5 pt-5 pb-3" style={{ background: '#FFFDF5', borderBottom: '1.5px solid #F2E8D9' }}>
              <div className="flex items-center justify-between">
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#3D2B1F', fontStyle: 'italic', fontSize: 18 }}>
                  Todos los lugares
                </h3>
                <button onClick={() => setShowLista(false)} style={{ color: '#9B8B7A', fontSize: 22 }}>✕</button>
              </div>
            </div>
            <div className="overflow-y-auto p-4 flex flex-col gap-2">
              {lugares.map(l => (
                <div
                  key={l.id}
                  className="flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all"
                  style={{ background: l.visitado ? '#F0F8F0' : '#F2E8D9' }}
                  onClick={() => { setFlyTo([l.lat, l.lng]); setShowLista(false) }}
                >
                  <span style={{ fontSize: 22 }}>{l.visitado ? '❤️' : '🤍'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate" style={{ color: '#3D2B1F', fontSize: 15 }}>{l.nombre}</p>
                    <p className="font-hand text-sm" style={{ color: '#9B8B7A', fontSize: 13 }}>{l.categoria}</p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); toggle(l.id) }}
                    className="px-3 py-2 rounded-xl font-hand text-sm transition-all"
                    style={{
                      fontSize: 14,
                      background: l.visitado ? '#7A9E7E20' : '#C4785A20',
                      color:      l.visitado ? '#7A9E7E'   : '#C4785A',
                      border:     `1.5px solid ${l.visitado ? '#7A9E7E40' : '#C4785A40'}`,
                    }}
                  >
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
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: 'rgba(61,43,31,0.55)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowAgregar(false) }}
        >
          <div className="w-full rounded-t-3xl p-6 flex flex-col gap-5" style={{ background: '#FFFDF5' }}>
            <div className="flex items-center justify-between">
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#3D2B1F', fontStyle: 'italic', fontSize: 20 }}>
                Nuevo lugar
              </h3>
              <button onClick={() => setShowAgregar(false)} style={{ color: '#9B8B7A', fontSize: 22 }}>✕</button>
            </div>
            <input
              className="w-full rounded-2xl px-5 py-4 outline-none text-base"
              style={{ background: '#F2E8D9', border: '1.5px solid #D4C4B0', color: '#3D2B1F', fontSize: 16 }}
              placeholder="Nombre del lugar"
              value={nuevo.nombre}
              onChange={e => setNuevo(n => ({ ...n, nombre: e.target.value }))}
            />
            <textarea
              className="w-full rounded-2xl px-5 py-4 outline-none text-base resize-none"
              style={{ background: '#F2E8D9', border: '1.5px solid #D4C4B0', color: '#3D2B1F', fontSize: 16 }}
              placeholder="¿Qué se puede hacer ahí?"
              rows={2}
              value={nuevo.descripcion}
              onChange={e => setNuevo(n => ({ ...n, descripcion: e.target.value }))}
            />
            <select
              className="w-full rounded-2xl px-5 py-4 text-base"
              style={{ background: '#F2E8D9', border: '1.5px solid #D4C4B0', color: '#3D2B1F', fontSize: 16 }}
              value={nuevo.categoria}
              onChange={e => setNuevo(n => ({ ...n, categoria: e.target.value }))}
            >
              {Object.keys(CAT_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              onClick={agregar}
              className="w-full py-5 rounded-2xl font-hand text-lg font-bold text-white transition-all active:scale-95"
              style={{ fontSize: 18, background: '#C4785A', boxShadow: '0 4px 12px rgba(196,120,90,0.3)' }}
            >
              Agregar lugar 📍
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
