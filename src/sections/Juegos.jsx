import { useState } from 'react'
import { VEINTIUN_PREGUNTAS, VERDAD_O_RETO, PREFERIRIAS } from '../data/juegos'

const MODOS = [
  { id: '21', label: '21 Preguntas', emoji: '💬', color: '#FF6B6B', preguntas: VEINTIUN_PREGUNTAS },
  { id: 'vor', label: 'Verdad o Reto', emoji: '🎭', color: '#FFB347', preguntas: VERDAD_O_RETO },
  { id: 'prefer', label: '¿Preferirías...?', emoji: '🤔', color: '#4ECDC4', preguntas: PREFERIRIAS },
]

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function Juegos() {
  const [modo, setModo] = useState(null)
  const [cola, setCola] = useState([])
  const [actual, setActual] = useState(null)
  const [flipped, setFlipped] = useState(false)

  function iniciarModo(m) {
    setModo(m)
    const shuffled = shuffle(m.preguntas)
    setCola(shuffled.slice(1))
    setActual(shuffled[0])
    setFlipped(false)
  }

  function siguiente() {
    if (cola.length === 0) {
      const shuffled = shuffle(modo.preguntas)
      setCola(shuffled.slice(1))
      setActual(shuffled[0])
    } else {
      setActual(cola[0])
      setCola(prev => prev.slice(1))
    }
    setFlipped(false)
  }

  if (!modo) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-4 pb-4">
        <div
          className="rounded-3xl p-5 text-white"
          style={{ background: 'linear-gradient(135deg, #FF6B6B, #FFB347)' }}
        >
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Comfortaa' }}>🎲 Juegos para dos</h2>
          <p className="text-white/80 text-sm mt-1">Elegí un modo para jugar</p>
        </div>

        {MODOS.map(m => (
          <button
            key={m.id}
            onClick={() => iniciarModo(m)}
            className="w-full bg-white rounded-3xl p-5 flex items-center gap-4 shadow-sm text-left transition-all active:scale-98"
          >
            <span className="text-4xl">{m.emoji}</span>
            <div>
              <p className="font-bold text-gray-800" style={{ fontFamily: 'Comfortaa' }}>{m.label}</p>
              <p className="text-sm text-gray-400">{m.preguntas.length} preguntas</p>
            </div>
          </button>
        ))}
      </div>
    )
  }

  const esVoR = modo.id === 'vor'
  const preguntaObj = esVoR ? actual : null
  const textoActual = esVoR ? actual?.texto : actual

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-4 min-h-[70vh]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setModo(null)}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#F3F4F6' }}
        >
          ←
        </button>
        <div>
          <h2 className="font-bold" style={{ fontFamily: 'Comfortaa', color: modo.color }}>{modo.emoji} {modo.label}</h2>
          <p className="text-xs text-gray-400">{cola.length + 1} preguntas restantes</p>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {esVoR && (
          <div
            className="px-5 py-2 rounded-full text-white font-bold text-sm"
            style={{ background: preguntaObj?.tipo === 'Verdad' ? '#4ECDC4' : '#FF6B6B' }}
          >
            {preguntaObj?.tipo}
          </div>
        )}

        <div
          className="w-full rounded-3xl p-8 shadow-xl flex items-center justify-center text-center cursor-pointer transition-all active:scale-98"
          style={{
            background: 'white',
            minHeight: 200,
            border: `3px solid ${modo.color}20`,
          }}
          onClick={() => setFlipped(true)}
        >
          {!flipped ? (
            <div className="flex flex-col items-center gap-3 text-gray-300">
              <span className="text-5xl">{modo.emoji}</span>
              <p className="text-sm">Tocá para revelar</p>
            </div>
          ) : (
            <p className="text-gray-800 text-lg font-medium leading-relaxed" style={{ fontFamily: 'Comfortaa' }}>
              {textoActual}
            </p>
          )}
        </div>

        <button
          onClick={siguiente}
          className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-md transition-all active:scale-95"
          style={{ background: `linear-gradient(135deg, ${modo.color}, ${modo.color}CC)` }}
        >
          Siguiente ➜
        </button>
      </div>
    </div>
  )
}
