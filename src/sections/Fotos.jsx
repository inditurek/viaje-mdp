import { useState, useRef } from 'react'
import { useStorage } from '../hooks/useStorage'

const POSTIT_COLORS = ['#FFF4B8', '#FFD6DC', '#C8E6FF', '#D4F5C8', '#F0D4FF']
const ROTATIONS     = [-3, -1.5, 0, 1.5, 2.5, -2, 1]
const LATO          = { fontFamily: 'Lato, sans-serif' }
const PLAYFAIR_I    = { fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }

function PostIt({ nota, onDelete }) {
  return (
    <div className="relative group"
      style={{
        background: nota.color,
        transform: `rotate(${nota.rot}deg)`,
        padding: '12px 14px',
        borderRadius: 4,
        minWidth: 100, maxWidth: 170,
        boxShadow: '2px 3px 10px rgba(61,43,31,0.18)',
      }}>
      <button onClick={onDelete}
        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-400 text-white text-xs items-center justify-center hidden group-hover:flex">
        ✕
      </button>
      <p style={{ ...LATO, color: '#3D2B1F', fontSize: 14, lineHeight: 1.4 }}>{nota.texto}</p>
      <p style={{ ...LATO, color: '#9B8B7A', fontSize: 12, marginTop: 6 }}>— {nota.autor}</p>
    </div>
  )
}

function PolaroidCard({ foto, onDelete, onAddPostit }) {
  const [showForm, setShowForm] = useState(false)
  const [texto, setTexto]       = useState('')
  const [autor, setAutor]       = useState('Indi')

  function submit() {
    if (!texto.trim()) return
    onAddPostit(foto.id, {
      id: Date.now(), texto, autor,
      color: POSTIT_COLORS[Math.floor(Math.random() * POSTIT_COLORS.length)],
      rot:   ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)],
    })
    setTexto(''); setShowForm(false)
  }

  return (
    <div style={{ transform: `rotate(${foto.rotacion}deg)`, transformOrigin: 'center', marginBottom: 8 }}>
      {/* Polaroid */}
      <div className="polaroid mx-auto relative" style={{ maxWidth: 340 }}>
        <button onClick={onDelete}
          className="absolute top-3 right-3 z-10 flex items-center justify-center"
          style={{ width: 28, height: 28, borderRadius: 14, background: 'rgba(61,43,31,0.1)', color: '#8B7355', fontSize: 14 }}>
          ✕
        </button>
        <img src={foto.url} alt={foto.descripcion}
          style={{ width: '100%', maxHeight: 300, objectFit: 'cover', display: 'block' }} />
        <div style={{ paddingTop: 10, textAlign: 'center' }}>
          <p style={{ ...PLAYFAIR_I, fontSize: 18, color: '#3D2B1F' }}>{foto.descripcion}</p>
          {foto.lugar && (
            <p style={{ ...LATO, color: '#9B8B7A', fontSize: 13, marginTop: 4 }}>📍 {foto.lugar}</p>
          )}
          <p style={{ ...LATO, color: '#D4C4B0', fontSize: 12, marginTop: 4 }}>{foto.fecha}</p>
        </div>
      </div>

      {/* Post-its */}
      {foto.postits?.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center mt-3 px-2">
          {foto.postits.map(n => (
            <PostIt key={n.id} nota={n} onDelete={() => onAddPostit(foto.id, null, n.id)} />
          ))}
        </div>
      )}

      {/* Botón post-it */}
      <div className="px-2 mt-3">
        <button onClick={() => setShowForm(v => !v)}
          className="w-full transition-all"
          style={{
            ...LATO, padding: '12px', borderRadius: 16, fontSize: 14,
            background: showForm ? '#FFF4B8' : '#FFFFFF',
            color: '#8B7355', border: '1.5px solid #D4C4B0',
          }}>
          📝 Agregar post-it
        </button>
      </div>

      {showForm && (
        <div className="mx-2 mt-2 rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: '#FFFFFF', border: '1.5px solid #D4C4B0' }}>
          <textarea
            className="w-full resize-none outline-none"
            style={{ ...LATO, background: '#FFF4B8', border: 'none', borderRadius: 12, padding: '12px', color: '#3D2B1F', fontSize: 15, minHeight: 70 }}
            placeholder="Escribí algo lindo..."
            value={texto}
            onChange={e => setTexto(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2 items-center">
            <span style={{ ...LATO, color: '#8B7355', fontSize: 14 }}>De:</span>
            {['Indi', 'Mati'].map(a => (
              <button key={a} onClick={() => setAutor(a)}
                style={{
                  ...LATO, padding: '8px 18px', borderRadius: 50, fontSize: 14,
                  background: autor === a ? '#C4785A' : '#FAF6EF',
                  color:      autor === a ? 'white'   : '#8B7355',
                  border:     '1.5px solid #D4C4B0',
                }}>
                {a}
              </button>
            ))}
            <button onClick={submit}
              className="ml-auto"
              style={{ ...LATO, padding: '8px 20px', borderRadius: 50, background: '#C4785A', color: 'white', fontSize: 14, fontWeight: 700 }}>
              Pegar ♥
            </button>
          </div>
        </div>
      )}

      {/* Separador */}
      <div className="flex justify-center mt-4 mb-2 opacity-20">
        <div style={{ width: 64, height: 2, borderRadius: 2, background: '#8B7355' }} />
      </div>
    </div>
  )
}

export default function Fotos() {
  const [fotos, setFotos] = useStorage('fotos', [])
  const [showForm, setShowForm] = useState(false)
  const [preview, setPreview]   = useState(null)
  const [form, setForm]         = useState({ descripcion: '', lugar: '' })
  const fileRef = useRef()

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  function agregar() {
    if (!preview) return
    setFotos(prev => [{
      id: Date.now(),
      url: preview,
      descripcion: form.descripcion || 'Un momento especial',
      lugar: form.lugar,
      fecha: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
      rotacion: ROTATIONS[prev.length % ROTATIONS.length],
      postits: [],
    }, ...prev])
    setPreview(null)
    setForm({ descripcion: '', lugar: '' })
    setShowForm(false)
  }

  function addPostit(fotoId, postit, deleteId) {
    setFotos(prev => prev.map(f => {
      if (f.id !== fotoId) return f
      if (deleteId) return { ...f, postits: f.postits.filter(n => n.id !== deleteId) }
      return { ...f, postits: [...(f.postits || []), postit] }
    }))
  }

  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="px-4 mb-2">
        <button onClick={() => setShowForm(true)}
          className="w-full transition-all active:scale-95"
          style={{
            ...{ fontFamily: 'Lato, sans-serif' },
            padding: '16px', borderRadius: 16, fontSize: 16, fontWeight: 700,
            background: '#FFFFFF', color: '#C4785A', border: '2px dashed #D4A0A0',
          }}>
          + Agregar foto 📸
        </button>
      </div>

      {fotos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <p style={{ fontSize: 56, marginBottom: 16 }}>📷</p>
          <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 20, color: '#8B7355' }}>
            El álbum está vacío
          </p>
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 15, color: '#9B8B7A', marginTop: 8 }}>
            ¡Agregá la primera foto del viaje!
          </p>
        </div>
      ) : (
        <div className="flex flex-col px-4">
          {fotos.map(f => (
            <PolaroidCard key={f.id} foto={f}
              onDelete={() => setFotos(prev => prev.filter(x => x.id !== f.id))}
              onAddPostit={addPostit}
            />
          ))}
        </div>
      )}

      {/* Modal nueva foto */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end"
          style={{ background: 'rgba(61,43,31,0.55)' }}
          onClick={e => { if (e.target === e.currentTarget) { setShowForm(false); setPreview(null) } }}>
          <div className="w-full rounded-t-3xl p-6 flex flex-col gap-5 overflow-y-auto"
            style={{ background: '#FFFFFF', maxHeight: '92dvh' }}>

            <div className="flex items-center justify-between">
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 22, color: '#3D2B1F' }}>
                Nueva foto
              </h2>
              <button onClick={() => { setShowForm(false); setPreview(null) }}
                style={{ color: '#9B8B7A', fontSize: 24, lineHeight: 1 }}>✕</button>
            </div>

            {/* Zona foto */}
            <div onClick={() => fileRef.current.click()}
              className="w-full flex items-center justify-center overflow-hidden cursor-pointer"
              style={{
                height: 220, borderRadius: 16,
                background: '#FAF6EF',
                border: preview ? 'none' : '2px dashed #D4C4B0',
              }}>
              {preview
                ? <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} alt="preview" />
                : <div className="text-center" style={{ color: '#9B8B7A' }}>
                    <p style={{ fontSize: 48, marginBottom: 8 }}>📸</p>
                    <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 15 }}>Tocá para elegir una foto</p>
                  </div>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

            {[
              { key: 'descripcion', ph: '¿Qué pasó acá?' },
              { key: 'lugar',       ph: 'Lugar (opcional)' },
            ].map(({ key, ph }) => (
              <input key={key}
                style={{ fontFamily: 'Lato, sans-serif', border: '1.5px solid #D4C4B0', background: '#FAF6EF', color: '#3D2B1F', fontSize: 16, borderRadius: 16, padding: '14px 20px', width: '100%', outline: 'none' }}
                placeholder={ph}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              />
            ))}

            <button onClick={agregar} disabled={!preview}
              className="w-full transition-all active:scale-95"
              style={{ fontFamily: 'Lato, sans-serif', padding: '18px', borderRadius: 16, background: '#C4785A', color: 'white', fontSize: 17, fontWeight: 700, opacity: preview ? 1 : 0.45, boxShadow: '0 4px 12px rgba(196,120,90,0.3)' }}>
              Guardar en el álbum 📸
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
