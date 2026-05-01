import { useState, useRef } from 'react'
import { useStorage } from '../hooks/useStorage'

const SETS_INICIALES = [
  { id: 1, nombre: '¿Dónde comemos?', opciones: ['Pizza', 'Empanadas', 'Mariscos', 'Milanesas', 'Sushi', 'Lo que haya'] },
  { id: 2, nombre: '¿Qué hacemos?', opciones: ['Playa', 'Paseo', 'Siesta', 'Tour', 'Compras', 'Comer algo rico'] },
]

const DADOS_EMOJIS = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

export default function Dado() {
  const [sets, setSets] = useStorage('dadoSets', SETS_INICIALES)
  const [setActivo, setSetActivo] = useState(0)
  const [resultado, setResultado] = useState(null)
  const [girando, setGirando] = useState(false)
  const [dadoEmoji, setDadoEmoji] = useState('🎲')
  const [nuevaOpcion, setNuevaOpcion] = useState('')
  const [nuevoSetNombre, setNuevoSetNombre] = useState('')
  const [showNuevoSet, setShowNuevoSet] = useState(false)
  const [historial, setHistorial] = useStorage('dadoHistorial', [])
  const intervalRef = useRef(null)

  const set = sets[setActivo]

  function tirar() {
    if (girando || !set?.opciones?.length) return
    setGirando(true)
    setResultado(null)

    let i = 0
    intervalRef.current = setInterval(() => {
      setDadoEmoji(DADOS_EMOJIS[Math.floor(Math.random() * 6)])
      i++
      if (i >= 12) {
        clearInterval(intervalRef.current)
        const elegido = set.opciones[Math.floor(Math.random() * set.opciones.length)]
        setResultado(elegido)
        setDadoEmoji('🎲')
        setGirando(false)
        setHistorial(prev => [{
          id: Date.now(),
          set: set.nombre,
          resultado: elegido,
          fecha: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        }, ...prev.slice(0, 9)])
      }
    }, 80)
  }

  function agregarOpcion() {
    if (!nuevaOpcion.trim()) return
    setSets(prev => prev.map((s, i) =>
      i === setActivo ? { ...s, opciones: [...s.opciones, nuevaOpcion.trim()] } : s
    ))
    setNuevaOpcion('')
  }

  function eliminarOpcion(opcion) {
    setSets(prev => prev.map((s, i) =>
      i === setActivo ? { ...s, opciones: s.opciones.filter(o => o !== opcion) } : s
    ))
  }

  function crearSet() {
    if (!nuevoSetNombre.trim()) return
    const nuevo = { id: Date.now(), nombre: nuevoSetNombre, opciones: [] }
    setSets(prev => [...prev, nuevo])
    setSetActivo(sets.length)
    setNuevoSetNombre('')
    setShowNuevoSet(false)
    setResultado(null)
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-4">
      {/* Header */}
      <div
        className="rounded-3xl p-5 text-white"
        style={{ background: 'linear-gradient(135deg, #FFB347, #FF6B6B)' }}
      >
        <h2 className="text-xl font-bold" style={{ fontFamily: 'Comfortaa' }}>🎲 Dado de decisiones</h2>
        <p className="text-white/80 text-sm mt-1">¿No se ponen de acuerdo? Que decida el azar</p>
      </div>

      {/* Selector de sets */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {sets.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setSetActivo(i); setResultado(null) }}
            className="px-4 py-2 rounded-2xl text-sm whitespace-nowrap font-medium transition-all"
            style={{
              background: setActivo === i ? '#FFB347' : '#F3F4F6',
              color: setActivo === i ? 'white' : '#374151',
            }}
          >
            {s.nombre}
          </button>
        ))}
        <button
          onClick={() => setShowNuevoSet(true)}
          className="px-4 py-2 rounded-2xl text-sm whitespace-nowrap font-medium border border-dashed"
          style={{ borderColor: '#FFB347', color: '#FFB347' }}
        >
          + Nuevo
        </button>
      </div>

      {showNuevoSet && (
        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-200 rounded-2xl px-4 py-2 text-sm outline-none"
            placeholder="Nombre del set (ej: ¿Qué película?)"
            value={nuevoSetNombre}
            onChange={e => setNuevoSetNombre(e.target.value)}
            autoFocus
          />
          <button onClick={crearSet} className="px-4 py-2 rounded-2xl text-white text-sm" style={{ background: '#FFB347' }}>+</button>
          <button onClick={() => setShowNuevoSet(false)} className="px-3 py-2 rounded-2xl text-gray-400 text-sm border border-gray-200">✕</button>
        </div>
      )}

      {/* Dado central */}
      {set && (
        <div className="flex flex-col items-center gap-6">
          <div
            className="w-40 h-40 rounded-3xl flex items-center justify-center shadow-xl cursor-pointer transition-all active:scale-95"
            style={{
              background: 'white',
              border: '3px solid #FFB347',
              transform: girando ? `rotate(${Math.random() * 20 - 10}deg)` : 'rotate(0)',
            }}
            onClick={tirar}
          >
            <span style={{ fontSize: 72 }}>{dadoEmoji}</span>
          </div>

          {resultado && !girando && (
            <div
              className="px-8 py-4 rounded-2xl text-center shadow-lg"
              style={{ background: 'white', border: '2px solid #FFB347' }}
            >
              <p className="text-xs text-gray-400 mb-1">El dado dice...</p>
              <p className="text-2xl font-bold" style={{ fontFamily: 'Comfortaa', color: '#FF6B6B' }}>
                {resultado} 🎉
              </p>
            </div>
          )}

          <button
            onClick={tirar}
            disabled={girando || !set.opciones.length}
            className="px-10 py-4 rounded-2xl text-white font-bold text-base shadow-lg transition-all active:scale-95 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #FFB347, #FF6B6B)' }}
          >
            {girando ? '🎲 Tirando...' : '🎲 Tirar dado'}
          </button>
        </div>
      )}

      {/* Opciones del set */}
      {set && (
        <div className="bg-white rounded-3xl p-4">
          <p className="text-sm font-semibold text-gray-600 mb-3">Opciones de "{set.nombre}"</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {set.opciones.map(op => (
              <div
                key={op}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
                style={{ background: '#FFB34720', color: '#E8960A' }}
              >
                <span>{op}</span>
                <button onClick={() => eliminarOpcion(op)} className="text-xs opacity-60">✕</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 border border-gray-200 rounded-2xl px-3 py-2 text-sm outline-none"
              placeholder="Agregar opción..."
              value={nuevaOpcion}
              onChange={e => setNuevaOpcion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && agregarOpcion()}
            />
            <button onClick={agregarOpcion} className="px-4 py-2 rounded-2xl text-white text-sm" style={{ background: '#FFB347' }}>+</button>
          </div>
        </div>
      )}

      {/* Historial */}
      {historial.length > 0 && (
        <div className="bg-white rounded-3xl p-4">
          <p className="text-sm font-semibold text-gray-600 mb-3">Últimas decisiones</p>
          <div className="flex flex-col gap-2">
            {historial.map(h => (
              <div key={h.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{h.set}</span>
                <span className="font-medium" style={{ color: '#FF6B6B' }}>{h.resultado}</span>
                <span className="text-gray-300 text-xs">{h.fecha}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
