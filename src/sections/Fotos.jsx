import { useState, useRef } from 'react'
import { useStorage } from '../hooks/useStorage'

const POSTIT_COLORS = ['#FFF4B8', '#FFD6DC', '#C8E6FF', '#D4F5C8', '#F0D4FF']
const ROTATIONS   = [-3, -1.5, 0, 1.5, 2.5, -2, 1]

function PostIt({ nota, onDelete }) {
  return (
    <div
      className="relative px-4 py-3 rounded shadow-md group"
      style={{
        background: nota.color,
        transform: `rotate(${nota.rot}deg)`,
        fontFamily: 'Caveat, cursive',
        fontSize: 16,
        minWidth: 100,
        maxWidth: 160,
        boxShadow: '2px 3px 8px rgba(61,43,31,0.18)',
      }}
    >
      <button
        onClick={onDelete}
        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-400 text-white text-xs items-center justify-center hidden group-hover:flex group-focus-within:flex"
      >
        ✕
      </button>
      <p style={{ color: '#3D2B1F', lineHeight: 1.3 }}>{nota.texto}</p>
      <p className="mt-1 text-xs" style={{ color: '#9B8B7A' }}>{nota.autor}</p>
    </div>
  )
}

function PolaroidCard({ foto, onDelete, onAddPostit }) {
  const [showPostitForm, setShowPostitForm] = useState(false)
  const [postitTexto, setPostitTexto] = useState('')
  const [postitAutor, setPostitAutor] = useState('Indi')

  function submitPostit() {
    if (!postitTexto.trim()) return
    onAddPostit(foto.id, {
      id: Date.now(),
      texto: postitTexto,
      autor: postitAutor,
      color: POSTIT_COLORS[Math.floor(Math.random() * POSTIT_COLORS.length)],
      rot: ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)],
    })
    setPostitTexto('')
    setShowPostitForm(false)
  }

  return (
    <div
      className="flex flex-col gap-3"
      style={{ transform: `rotate(${foto.rotacion}deg)`, transformOrigin: 'center' }}
    >
      {/* Polaroid */}
      <div
        className="polaroid mx-auto w-full"
        style={{ maxWidth: 320, background: 'white', position: 'relative' }}
      >
        <button
          onClick={onDelete}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center z-10 text-sm"
          style={{ background: 'rgba(61,43,31,0.12)', color: '#8B7355' }}
        >
          ✕
        </button>
        <img
          src={foto.url}
          alt={foto.descripcion}
          className="w-full object-cover"
          style={{ maxHeight: 280, display: 'block' }}
        />
        <div className="pt-3 pb-1 px-1 text-center">
          <p
            className="font-hand"
            style={{ fontFamily: 'Caveat, cursive', fontSize: 20, color: '#3D2B1F' }}
          >
            {foto.descripcion}
          </p>
          {foto.lugar && (
            <p className="font-hand text-sm" style={{ color: '#9B8B7A', fontSize: 14 }}>
              📍 {foto.lugar}
            </p>
          )}
          <p className="font-hand text-xs mt-1" style={{ color: '#D4C4B0', fontSize: 12 }}>
            {foto.fecha}
          </p>
        </div>
      </div>

      {/* Post-its */}
      {foto.postits?.length > 0 && (
        <div className="flex flex-wrap gap-3 px-2 justify-center">
          {foto.postits.map(n => (
            <PostIt
              key={n.id}
              nota={n}
              onDelete={() => onAddPostit(foto.id, null, n.id)}
            />
          ))}
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-2 px-2">
        <button
          onClick={() => setShowPostitForm(v => !v)}
          className="flex-1 py-3 rounded-2xl font-hand text-base transition-all"
          style={{
            fontSize: 16,
            background: showPostitForm ? '#FFF4B8' : '#F2E8D9',
            color: '#8B7355',
            border: '1.5px solid #D4C4B0',
          }}
        >
          📝 Post-it
        </button>
      </div>

      {showPostitForm && (
        <div
          className="mx-2 rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: '#FFFDF5', border: '1.5px solid #D4C4B0' }}
        >
          <textarea
            className="w-full rounded-xl p-3 resize-none outline-none font-hand text-base"
            style={{ background: '#FFF4B8', border: 'none', color: '#3D2B1F', fontSize: 16, fontFamily: 'Caveat, cursive' }}
            rows={2}
            placeholder="Escribí algo lindo..."
            value={postitTexto}
            onChange={e => setPostitTexto(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2 items-center">
            <span className="font-hand text-sm" style={{ color: '#8B7355' }}>de:</span>
            {['Indi', 'Mati'].map(a => (
              <button
                key={a}
                onClick={() => setPostitAutor(a)}
                className="px-4 py-2 rounded-xl font-hand text-base transition-all"
                style={{
                  fontSize: 15,
                  background: postitAutor === a ? '#C4785A' : '#F2E8D9',
                  color:      postitAutor === a ? 'white'   : '#8B7355',
                  border:     '1.5px solid #D4C4B0',
                }}
              >
                {a}
              </button>
            ))}
            <button
              onClick={submitPostit}
              className="ml-auto px-5 py-2 rounded-xl font-hand text-base text-white transition-all"
              style={{ fontSize: 15, background: '#C4785A' }}
            >
              Pegar ♥
            </button>
          </div>
        </div>
      )}

      {/* Separador estilo cinta adhesiva */}
      <div className="flex justify-center opacity-30 mt-1 mb-2">
        <div className="w-16 h-1 rounded-full" style={{ background: '#8B7355' }} />
      </div>
    </div>
  )
}

export default function Fotos() {
  const [fotos, setFotos] = useStorage('fotos', [])
  const [showForm, setShowForm] = useState(false)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({ descripcion: '', lugar: '' })
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
    const idx = fotos.length
    setFotos(prev => [{
      id: Date.now(),
      url: preview,
      descripcion: form.descripcion || 'Un momento especial',
      lugar: form.lugar,
      fecha: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
      rotacion: ROTATIONS[idx % ROTATIONS.length],
      postits: [],
    }, ...prev])
    setPreview(null)
    setForm({ descripcion: '', lugar: '' })
    setShowForm(false)
  }

  function handleAddPostit(fotoId, postit, deleteId) {
    setFotos(prev => prev.map(f => {
      if (f.id !== fotoId) return f
      if (deleteId) return { ...f, postits: f.postits.filter(n => n.id !== deleteId) }
      return { ...f, postits: [...(f.postits || []), postit] }
    }))
  }

  return (
    <div className="flex flex-col gap-1 py-4">
      {/* Botón agregar */}
      <div className="px-4 mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-4 rounded-2xl font-hand text-lg font-bold transition-all active:scale-95"
          style={{
            fontSize: 18,
            background: '#FFFDF5',
            color: '#C4785A',
            border: '2px dashed #D4A0A0',
          }}
        >
          + Agregar foto 📸
        </button>
      </div>

      {fotos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center" style={{ color: '#9B8B7A' }}>
          <p className="text-6xl mb-5">📷</p>
          <p className="font-hand text-xl" style={{ color: '#8B7355' }}>El álbum está vacío</p>
          <p className="font-hand text-base mt-2">¡Agregá la primera foto del viaje!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 px-4">
          {fotos.map(f => (
            <PolaroidCard
              key={f.id}
              foto={f}
              onDelete={() => setFotos(prev => prev.filter(x => x.id !== f.id))}
              onAddPostit={handleAddPostit}
            />
          ))}
        </div>
      )}

      {/* Modal nueva foto */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: 'rgba(61,43,31,0.55)' }}
          onClick={e => { if (e.target === e.currentTarget) { setShowForm(false); setPreview(null) } }}
        >
          <div
            className="w-full rounded-t-3xl p-6 flex flex-col gap-5"
            style={{ background: '#FFFDF5', maxHeight: '92dvh', overflowY: 'auto' }}
          >
            <div className="flex items-center justify-between">
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#3D2B1F', fontStyle: 'italic', fontSize: 20 }}>
                Nueva foto
              </h2>
              <button onClick={() => { setShowForm(false); setPreview(null) }} style={{ color: '#9B8B7A', fontSize: 22 }}>✕</button>
            </div>

            {/* Zona foto */}
            <div
              className="w-full rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer transition-all"
              style={{
                height: 220,
                background: '#F2E8D9',
                border: preview ? 'none' : '2px dashed #D4C4B0',
              }}
              onClick={() => fileRef.current.click()}
            >
              {preview
                ? <img src={preview} className="w-full h-full object-cover" alt="preview" />
                : <div className="text-center" style={{ color: '#9B8B7A' }}>
                    <p className="text-5xl mb-2">📸</p>
                    <p className="font-hand text-lg">Tocá para elegir una foto</p>
                  </div>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

            <input
              className="w-full rounded-2xl px-5 py-4 outline-none font-hand text-lg"
              style={{ background: '#F2E8D9', border: '1.5px solid #D4C4B0', color: '#3D2B1F', fontFamily: 'Caveat, cursive', fontSize: 18 }}
              placeholder="¿Qué pasó acá?"
              value={form.descripcion}
              onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
            />
            <input
              className="w-full rounded-2xl px-5 py-4 outline-none font-hand text-lg"
              style={{ background: '#F2E8D9', border: '1.5px solid #D4C4B0', color: '#3D2B1F', fontFamily: 'Caveat, cursive', fontSize: 18 }}
              placeholder="Lugar (opcional)"
              value={form.lugar}
              onChange={e => setForm(f => ({ ...f, lugar: e.target.value }))}
            />

            <button
              onClick={agregarFoto}
              disabled={!preview}
              className="w-full py-5 rounded-2xl font-hand text-lg font-bold text-white transition-all active:scale-95 disabled:opacity-40"
              style={{ fontSize: 18, background: '#C4785A', boxShadow: '0 4px 12px rgba(196,120,90,0.3)' }}
            >
              Guardar en el álbum 📸
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
