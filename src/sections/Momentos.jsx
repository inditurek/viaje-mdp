import { useState } from 'react'
import { useStorage } from '../hooks/useStorage'

const PAPELITO_COLORS = ['#FFF9C4', '#FFD6E0', '#C4E8FF', '#D4F8C4', '#FFE5C4', '#F3D4FF']

export default function Momentos() {
  const [momentos, setMomentos] = useStorage('momentos', [])
  const [showForm, setShowForm] = useState(false)
  const [texto, setTexto] = useState('')
  const [autor, setAutor] = useState('Indi')
  const [animando, setAnimando] = useState(false)

  function agregarMomento() {
    if (!texto.trim()) return
    setAnimando(true)
    setTimeout(() => {
      setMomentos(prev => [{
        id: Date.now(),
        texto,
        autor,
        fecha: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
        hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        color: PAPELITO_COLORS[Math.floor(Math.random() * PAPELITO_COLORS.length)],
        rotacion: (Math.random() * 8 - 4).toFixed(1),
      }, ...prev])
      setTexto('')
      setShowForm(false)
      setAnimando(false)
    }, 800)
  }

  function eliminar(id) {
    setMomentos(prev => prev.filter(m => m.id !== id))
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Frasco */}
      <div className="mx-4 mt-4 flex flex-col items-center">
        <div
          className="w-full rounded-3xl p-6 flex flex-col items-center"
          style={{ background: 'linear-gradient(135deg, #FF9ECD, #FFB6C1)' }}
        >
          <span className="text-6xl mb-2" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}>
            {animando ? '✨' : '💭'}
          </span>
          <h2 className="text-white text-xl font-bold" style={{ fontFamily: 'Comfortaa' }}>
            Frasco de momentos
          </h2>
          <p className="text-white/80 text-sm mt-1">
            {momentos.length === 0
              ? 'Guardá sus momentos favoritos acá'
              : `${momentos.length} momento${momentos.length !== 1 ? 's' : ''} guardado${momentos.length !== 1 ? 's' : ''} ♥`
            }
          </p>
        </div>
      </div>

      {/* Botón agregar */}
      <div className="mx-4">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-4 rounded-2xl text-white font-bold shadow-md transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #FF9ECD, #FF6B6B)' }}
          >
            💭 Guardar un momento
          </button>
        ) : (
          <div className="bg-white rounded-3xl p-4 flex flex-col gap-3 shadow-sm">
            <p className="text-sm font-medium text-gray-600">¿Cuál fue ese momento especial?</p>
            <textarea
              className="w-full border border-gray-200 rounded-2xl p-3 text-sm resize-none outline-none focus:border-pink-300"
              rows={3}
              placeholder="Ej: Cuando nos reímos de nada en la playa y no podíamos parar..."
              value={texto}
              onChange={e => setTexto(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-500">Escrito por:</span>
              <button
                onClick={() => setAutor('Indi')}
                className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: autor === 'Indi' ? '#FF9ECD' : '#F3F4F6', color: autor === 'Indi' ? 'white' : '#374151' }}
              >
                Indi
              </button>
              <button
                onClick={() => setAutor('Yo')}
                className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: autor === 'Yo' ? '#FF9ECD' : '#F3F4F6', color: autor === 'Yo' ? 'white' : '#374151' }}
              >
                Yo
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-2xl text-sm border border-gray-200 text-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={agregarMomento}
                disabled={animando}
                className="flex-1 py-3 rounded-2xl text-sm text-white font-bold transition-all"
                style={{ background: animando ? '#FFB6C1' : 'linear-gradient(135deg, #FF9ECD, #FF6B6B)' }}
              >
                {animando ? '✨ Guardando...' : 'Guardar ♥'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Papelitos */}
      {momentos.length === 0 ? (
        <div className="mx-4 text-center py-8 text-gray-400">
          <p className="text-sm">El frasco está vacío...<br />¡Empezá a llenarlo de momentos lindos!</p>
        </div>
      ) : (
        <div className="mx-4 grid grid-cols-2 gap-3">
          {momentos.map(m => (
            <div
              key={m.id}
              className="relative p-4 rounded-2xl shadow-sm group"
              style={{
                background: m.color,
                transform: `rotate(${m.rotacion}deg)`,
                minHeight: 120,
              }}
            >
              <button
                onClick={() => eliminar(m.id)}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-400 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
              <p className="text-gray-700 text-sm leading-snug">{m.texto}</p>
              <div className="mt-3 flex items-center gap-1">
                <span className="text-xs text-gray-400">{m.autor}</span>
                <span className="text-gray-300 text-xs">·</span>
                <span className="text-xs text-gray-400">{m.fecha}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
