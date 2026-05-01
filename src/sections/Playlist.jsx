import { useState } from 'react'
import { useStorage } from '../hooks/useStorage'

const CANCIONES_INICIALES = [
  { id: 1, titulo: 'La Leva', artista: 'Los Tipitos', link: '', nota: 'Para el viaje en auto' },
  { id: 2, titulo: 'Soy Tuyo', artista: 'Airbag', link: '', nota: '' },
]

export default function Playlist() {
  const [canciones, setCanciones] = useStorage('playlist', CANCIONES_INICIALES)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ titulo: '', artista: '', link: '', nota: '' })

  function agregar() {
    if (!form.titulo) return
    setCanciones(prev => [...prev, { id: Date.now(), ...form }])
    setForm({ titulo: '', artista: '', link: '', nota: '' })
    setShowForm(false)
  }

  function eliminar(id) {
    setCanciones(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div
        className="mx-4 mt-4 rounded-3xl p-5 text-white"
        style={{ background: 'linear-gradient(135deg, #4ECDC4, #45B7D1)' }}
      >
        <h2 className="text-xl font-bold" style={{ fontFamily: 'Comfortaa' }}>🎵 Playlist del viaje</h2>
        <p className="text-white/80 text-sm mt-1">{canciones.length} canciones</p>
      </div>

      <div className="mx-4 flex flex-col gap-3">
        {canciones.map((c, i) => (
          <div key={c.id} className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #4ECDC4, #45B7D1)' }}
            >
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{c.titulo}</p>
              <p className="text-xs text-gray-400 truncate">{c.artista}</p>
              {c.nota && <p className="text-xs text-gray-400 italic mt-0.5">{c.nota}</p>}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {c.link && (
                <a
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: '#4ECDC420', color: '#4ECDC4' }}
                >
                  ▶
                </a>
              )}
              <button onClick={() => eliminar(c.id)} className="text-gray-300 text-sm">✕</button>
            </div>
          </div>
        ))}

        {canciones.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">🎵</p>
            <p>Todavía no hay canciones en la playlist</p>
          </div>
        )}
      </div>

      {showForm ? (
        <div className="mx-4 bg-white rounded-3xl p-4 flex flex-col gap-3 shadow-sm">
          <input
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none"
            placeholder="Nombre de la canción *"
            value={form.titulo}
            onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
          />
          <input
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none"
            placeholder="Artista"
            value={form.artista}
            onChange={e => setForm(f => ({ ...f, artista: e.target.value }))}
          />
          <input
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none"
            placeholder="Link (Spotify, YouTube, etc.)"
            value={form.link}
            onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
          />
          <input
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none"
            placeholder="¿Por qué representa el viaje? (opcional)"
            value={form.nota}
            onChange={e => setForm(f => ({ ...f, nota: e.target.value }))}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-3 rounded-2xl text-sm border border-gray-200 text-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={agregar}
              className="flex-1 py-3 rounded-2xl text-sm text-white font-medium"
              style={{ background: '#4ECDC4' }}
            >
              Agregar 🎵
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mx-4 py-3 rounded-2xl text-sm font-medium border-2 border-dashed"
          style={{ borderColor: '#4ECDC4', color: '#4ECDC4' }}
        >
          + Agregar canción
        </button>
      )}
    </div>
  )
}
