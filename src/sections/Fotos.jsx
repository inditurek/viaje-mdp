import { useState, useRef } from 'react'
import { useStorage } from '../hooks/useStorage'

const STICKERS = ['❤️', '⭐', '🌊', '🌸', '✨', '🦀', '🌅', '🎉', '💫', '🏖️', '🌺', '📍']
const POST_IT_COLORS = ['#FFF9C4', '#FFD6E0', '#C4E8FF', '#D4F8C4', '#FFE5C4']

function PostIt({ nota, onDelete }) {
  return (
    <div
      className="px-3 py-2 rounded-xl text-sm shadow-sm relative group max-w-[160px]"
      style={{ background: nota.color, transform: `rotate(${nota.rotacion}deg)` }}
    >
      <button
        onClick={onDelete}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-400 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
      <p className="text-gray-700 leading-snug">{nota.texto}</p>
      <p className="text-gray-400 text-xs mt-1">{nota.autor}</p>
    </div>
  )
}

function FotoCard({ foto, onDelete, onAddNota, onAddSticker }) {
  const [showNotaForm, setShowNotaForm] = useState(false)
  const [notaTexto, setNotaTexto] = useState('')
  const [notaAutor, setNotaAutor] = useState('Indi')
  const [showStickers, setShowStickers] = useState(false)

  function submitNota() {
    if (!notaTexto.trim()) return
    onAddNota(foto.id, {
      id: Date.now(),
      texto: notaTexto,
      autor: notaAutor,
      color: POST_IT_COLORS[Math.floor(Math.random() * POST_IT_COLORS.length)],
      rotacion: (Math.random() * 6 - 3).toFixed(1),
    })
    setNotaTexto('')
    setShowNotaForm(false)
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <div className="relative">
        <img
          src={foto.url}
          alt={foto.descripcion}
          className="w-full object-cover"
          style={{ maxHeight: 280 }}
        />
        {/* Stickers sobre la foto */}
        {foto.stickers?.map((s, i) => (
          <span key={i} className="absolute text-2xl pointer-events-none" style={{ top: s.y + '%', left: s.x + '%' }}>
            {s.emoji}
          </span>
        ))}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-800">{foto.descripcion}</p>
            <p className="text-xs text-gray-400 mt-0.5">{foto.fecha} {foto.lugar && `· ${foto.lugar}`}</p>
          </div>
          <button onClick={onDelete} className="text-gray-300 text-sm flex-shrink-0">✕</button>
        </div>

        {/* Notas post-it */}
        {foto.notas?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {foto.notas.map(n => (
              <PostIt
                key={n.id}
                nota={n}
                onDelete={() => onAddNota(foto.id, null, n.id)}
              />
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setShowNotaForm(v => !v)}
            className="flex-1 py-2 rounded-xl text-sm border flex items-center justify-center gap-1.5 transition-all"
            style={{ borderColor: '#FFB6C1', color: '#FF6B6B' }}
          >
            📝 Nota
          </button>
          <button
            onClick={() => setShowStickers(v => !v)}
            className="flex-1 py-2 rounded-xl text-sm border flex items-center justify-center gap-1.5 transition-all"
            style={{ borderColor: '#4ECDC4', color: '#4ECDC4' }}
          >
            ✨ Sticker
          </button>
        </div>

        {showStickers && (
          <div className="flex flex-wrap gap-2 mt-3 p-3 rounded-2xl" style={{ background: '#F7F3E9' }}>
            {STICKERS.map(s => (
              <button
                key={s}
                onClick={() => {
                  onAddSticker(foto.id, s)
                  setShowStickers(false)
                }}
                className="text-2xl"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {showNotaForm && (
          <div className="mt-3 flex flex-col gap-2">
            <textarea
              className="w-full border border-gray-200 rounded-2xl p-3 text-sm resize-none outline-none focus:border-pink-300"
              rows={2}
              placeholder="Escribí algo lindo sobre este momento..."
              value={notaTexto}
              onChange={e => setNotaTexto(e.target.value)}
            />
            <div className="flex gap-2">
              <select
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white"
                value={notaAutor}
                onChange={e => setNotaAutor(e.target.value)}
              >
                <option value="Indi">Indi</option>
                <option value="Yo">Yo</option>
              </select>
              <button
                onClick={submitNota}
                className="flex-1 py-2 rounded-xl text-sm text-white font-medium"
                style={{ background: '#FF6B6B' }}
              >
                Agregar ♥
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Fotos() {
  const [fotos, setFotos] = useStorage('fotos', [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ descripcion: '', lugar: '' })
  const [preview, setPreview] = useState(null)
  const fileRef = useRef()

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  function agregarFoto() {
    if (!preview) return
    setFotos(prev => [{
      id: Date.now(),
      url: preview,
      descripcion: form.descripcion || 'Un momento especial',
      lugar: form.lugar,
      fecha: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long' }),
      notas: [],
      stickers: [],
    }, ...prev])
    setPreview(null)
    setForm({ descripcion: '', lugar: '' })
    setShowForm(false)
  }

  function handleAddNota(fotoId, nota, deleteId) {
    setFotos(prev => prev.map(f => {
      if (f.id !== fotoId) return f
      if (deleteId) return { ...f, notas: f.notas.filter(n => n.id !== deleteId) }
      return { ...f, notas: [...(f.notas || []), nota] }
    }))
  }

  function handleAddSticker(fotoId, emoji) {
    setFotos(prev => prev.map(f => {
      if (f.id !== fotoId) return f
      const sticker = {
        emoji,
        x: 10 + Math.random() * 70,
        y: 10 + Math.random() * 70,
      }
      return { ...f, stickers: [...(f.stickers || []), sticker] }
    }))
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="mx-4 mt-4 flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: '#FF6B6B' }}>📸 Fototeca</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-2xl text-sm text-white font-medium shadow-sm"
          style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF9ECD)' }}
        >
          + Foto
        </button>
      </div>

      {fotos.length === 0 ? (
        <div className="mx-4 flex flex-col items-center justify-center py-16 text-gray-400">
          <span className="text-5xl mb-4">📷</span>
          <p className="text-center">Todavía no hay fotos.<br />¡Capturá el primer momento!</p>
        </div>
      ) : (
        <div className="mx-4 flex flex-col gap-4">
          {fotos.map(f => (
            <FotoCard
              key={f.id}
              foto={f}
              onDelete={() => setFotos(prev => prev.filter(x => x.id !== f.id))}
              onAddNota={handleAddNota}
              onAddSticker={handleAddSticker}
            />
          ))}
        </div>
      )}

      {/* Modal agregar foto */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full bg-white rounded-t-3xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold" style={{ fontFamily: 'Comfortaa', color: '#FF6B6B' }}>
                Nueva foto
              </h3>
              <button onClick={() => { setShowForm(false); setPreview(null) }} className="text-gray-400 text-xl">✕</button>
            </div>

            <div
              className="w-full h-48 rounded-2xl flex items-center justify-center border-2 border-dashed overflow-hidden cursor-pointer"
              style={{ borderColor: preview ? 'transparent' : '#FFB6C1' }}
              onClick={() => fileRef.current.click()}
            >
              {preview
                ? <img src={preview} className="w-full h-full object-cover rounded-2xl" alt="preview" />
                : <div className="text-center text-gray-400">
                    <p className="text-4xl mb-2">📸</p>
                    <p className="text-sm">Tocá para elegir foto</p>
                  </div>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

            <input
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-base outline-none focus:border-pink-300"
              placeholder="¿Qué pasó acá? (opcional)"
              value={form.descripcion}
              onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
            />
            <input
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-base outline-none focus:border-pink-300"
              placeholder="Lugar (opcional)"
              value={form.lugar}
              onChange={e => setForm(f => ({ ...f, lugar: e.target.value }))}
            />

            <button
              onClick={agregarFoto}
              disabled={!preview}
              className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF9ECD)' }}
            >
              Guardar foto 📸
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
