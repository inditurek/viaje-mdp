import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useStorage } from '../hooks/useStorage'
import { LUGARES_INICIALES } from '../data/lugares'

// Íconos personalizados con corazoncitos
function crearIcono(visitado) {
  return L.divIcon({
    className: '',
    html: `<div style="
      font-size: 28px;
      line-height: 1;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      transform: translateY(-50%);
    ">${visitado ? '❤️' : '🤍'}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -36],
  })
}

const CATEGORIAS_COLORES = {
  'Playa': '#4ECDC4',
  'Gastronomía': '#FF6B6B',
  'Naturaleza': '#6BCB77',
  'Actividad': '#FFB347',
  'Paseo': '#FF9ECD',
}

function FlyToMapa({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 1 })
  }, [center, map])
  return null
}

export default function Mapa() {
  const [lugares, setLugares] = useStorage('lugares', LUGARES_INICIALES)
  const [seleccionado, setSeleccionado] = useState(null)
  const [showLista, setShowLista] = useState(false)
  const [showAgregar, setShowAgregar] = useState(false)
  const [flyTo, setFlyTo] = useState(null)
  const [nuevoLugar, setNuevoLugar] = useState({ nombre: '', descripcion: '', categoria: 'Paseo' })

  function toggleVisitado(id) {
    setLugares(prev => prev.map(l => l.id === id ? { ...l, visitado: !l.visitado } : l))
  }

  function agregarLugar() {
    if (!nuevoLugar.nombre) return
    setLugares(prev => [...prev, {
      id: Date.now(),
      ...nuevoLugar,
      lat: -38.0024,
      lng: -57.5447,
      emoji: '📍',
      visitado: false,
    }])
    setNuevoLugar({ nombre: '', descripcion: '', categoria: 'Paseo' })
    setShowAgregar(false)
  }

  const visitados = lugares.filter(l => l.visitado).length
  const total = lugares.length

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 56px)' }}>
      {/* Barra superior */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b" style={{ borderColor: '#FFB6C1' }}>
        <div>
          <h2 className="font-bold text-base" style={{ fontFamily: 'Comfortaa', color: '#FF6B6B' }}>
            🗺️ Mar del Plata
          </h2>
          <p className="text-xs text-gray-400">{visitados}/{total} lugares visitados</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowLista(v => !v)}
            className="px-3 py-1.5 rounded-xl text-sm border font-medium"
            style={{ borderColor: '#4ECDC4', color: '#4ECDC4' }}
          >
            Lista
          </button>
          <button
            onClick={() => setShowAgregar(true)}
            className="px-3 py-1.5 rounded-xl text-sm text-white font-medium"
            style={{ background: '#FF6B6B' }}
          >
            + Lugar
          </button>
        </div>
      </div>

      {/* Mapa */}
      <div className="flex-1 relative">
        <MapContainer
          center={[-38.002, -57.544]}
          zoom={13}
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {flyTo && <FlyToMapa center={flyTo} />}
          {lugares.map(lugar => (
            <Marker
              key={lugar.id}
              position={[lugar.lat, lugar.lng]}
              icon={crearIcono(lugar.visitado)}
              eventHandlers={{ click: () => setSeleccionado(lugar) }}
            >
              <Popup>
                <div style={{ minWidth: 200, fontFamily: 'Inter, sans-serif' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{lugar.emoji}</span>
                    <strong style={{ color: '#FF6B6B' }}>{lugar.nombre}</strong>
                  </div>
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2"
                    style={{
                      background: (CATEGORIAS_COLORES[lugar.categoria] || '#9CA3AF') + '20',
                      color: CATEGORIAS_COLORES[lugar.categoria] || '#9CA3AF',
                    }}
                  >
                    {lugar.categoria}
                  </span>
                  <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 8, lineHeight: 1.4 }}>
                    {lugar.descripcion}
                  </p>
                  <button
                    onClick={() => toggleVisitado(lugar.id)}
                    style={{
                      background: lugar.visitado ? '#4ECDC4' : '#FF6B6B',
                      color: 'white',
                      border: 'none',
                      borderRadius: 12,
                      padding: '6px 16px',
                      fontSize: 13,
                      cursor: 'pointer',
                      width: '100%',
                      fontWeight: 600,
                    }}
                  >
                    {lugar.visitado ? '✓ Visitado' : '❤️ Marcar visitado'}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Leyenda */}
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-2xl px-3 py-2 shadow-lg flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span>🤍</span><span className="text-gray-500">Pendiente</span>
          </div>
          <div className="flex items-center gap-1">
            <span>❤️</span><span className="text-gray-500">Visitado</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-white rounded-full px-3 py-1.5 shadow-md flex items-center gap-2">
          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(visitados / total) * 100}%`, background: 'linear-gradient(90deg, #FF6B6B, #FF9ECD)' }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600">{visitados}/{total}</span>
        </div>
      </div>

      {/* Lista panel */}
      {showLista && (
        <div
          className="absolute inset-0 z-20 flex flex-col"
          style={{ background: 'rgba(0,0,0,0.5)', top: 56 }}
          onClick={() => setShowLista(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl overflow-y-auto"
            style={{ maxHeight: '70%' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white px-4 pt-4 pb-2 border-b" style={{ borderColor: '#F3F4F6' }}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold" style={{ fontFamily: 'Comfortaa', color: '#FF6B6B' }}>Todos los lugares</h3>
                <button onClick={() => setShowLista(false)} className="text-gray-400">✕</button>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {lugares.map(l => (
                <div
                  key={l.id}
                  className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all"
                  style={{ background: l.visitado ? '#F0FFF8' : '#FAFAFA' }}
                  onClick={() => {
                    setFlyTo([l.lat, l.lng])
                    setShowLista(false)
                  }}
                >
                  <span className="text-2xl">{l.visitado ? '❤️' : '🤍'}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{l.nombre}</p>
                    <p className="text-xs text-gray-400">{l.categoria}</p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); toggleVisitado(l.id) }}
                    className="text-xs px-3 py-1.5 rounded-xl font-medium"
                    style={{
                      background: l.visitado ? '#4ECDC420' : '#FF6B6B20',
                      color: l.visitado ? '#4ECDC4' : '#FF6B6B',
                    }}
                  >
                    {l.visitado ? 'Visitado' : 'Pendiente'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal agregar lugar */}
      {showAgregar && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full bg-white rounded-t-3xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg" style={{ fontFamily: 'Comfortaa', color: '#FF6B6B' }}>Nuevo lugar</h3>
              <button onClick={() => setShowAgregar(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <input
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-base outline-none focus:border-pink-300"
              placeholder="Nombre del lugar"
              value={nuevoLugar.nombre}
              onChange={e => setNuevoLugar(n => ({ ...n, nombre: e.target.value }))}
            />
            <textarea
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-base outline-none resize-none focus:border-pink-300"
              placeholder="¿Qué se puede hacer ahí?"
              rows={2}
              value={nuevoLugar.descripcion}
              onChange={e => setNuevoLugar(n => ({ ...n, descripcion: e.target.value }))}
            />
            <select
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 bg-white"
              value={nuevoLugar.categoria}
              onChange={e => setNuevoLugar(n => ({ ...n, categoria: e.target.value }))}
            >
              {Object.keys(CATEGORIAS_COLORES).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <p className="text-xs text-gray-400 text-center">El marcador se colocará en el centro del mapa. Podés moverlo después.</p>
            <button
              onClick={agregarLugar}
              className="w-full py-4 rounded-2xl text-white font-bold text-base active:scale-95"
              style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF9ECD)' }}
            >
              Agregar lugar 📍
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
