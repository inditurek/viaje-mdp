import { useState, useRef } from 'react'
import { useStorage } from '../hooks/useStorage'

const POSTIT_COLORS = ['#FFF4B8', '#FFD6DC', '#C8E6FF', '#D4F5C8', '#F0D4FF']
const ROTATIONS     = [-3, -1.5, 0, 1.5, 2.5, -2, 1]

const modalBase = {
  background: '#FFFFFF',
  borderRadius: '24px 24px 0 0',
  maxHeight: '92dvh',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  padding: '24px 20px',
  paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
}

function PostIt({ nota, onDelete }) {
  return (
    <div className="relative group" style={{
      background: nota.color,
      transform: `rotate(${nota.rot}deg)`,
      padding: '10px 12px',
      borderRadius: 4,
      minWidth: 90, maxWidth: 160,
      boxShadow: '2px 3px 10px rgba(61,43,31,0.16)',
      flexShrink: 0,
    }}>
      <button onClick={onDelete}
        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-400 text-white text-xs items-center justify-center hidden group-hover:flex">
        ✕
      </button>
      <p style={{ fontFamily: 'Lato, sans-serif', color: '#3D2B1F', fontSize: 14, lineHeight: 1.4 }}>{nota.texto}</p>
      <p style={{ fontFamily: 'Lato, sans-serif', color: '#9B8B7A', fontSize: 11, marginTop: 5 }}>— {nota.autor}</p>
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
    <div style={{ marginBottom: 12, width: '100%' }}>
      {/* Polaroid */}
      <div className="polaroid" style={{ position: 'relative', width: '100%' }}>
        <button onClick={onDelete}
          style={{
            position: 'absolute', top: 10, right: 10, zIndex: 1,
            width: 28, height: 28, borderRadius: 14,
            background: 'rgba(61,43,31,0.12)', border: 'none', cursor: 'pointer',
            color: '#8B7355', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        <img src={foto.url} alt={foto.descripcion}
          style={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' }} />
        <div style={{ paddingTop: 10, textAlign: 'center' }}>
          <p style={{
            fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 17, color: '#3D2B1F',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{foto.descripcion}</p>
          {foto.lugar && (
            <p style={{ fontFamily: 'Lato, sans-serif', color: '#9B8B7A', fontSize: 12, marginTop: 3 }}>📍 {foto.lugar}</p>
          )}
          <p style={{ fontFamily: 'Lato, sans-serif', color: '#D4C4B0', fontSize: 11, marginTop: 3 }}>{foto.fecha}</p>
        </div>
      </div>

      {/* Post-its */}
      {foto.postits?.length > 0 && (
        <div className="no-scrollbar"
          style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '10px 2px', justifyContent: 'flex-start' }}>
          {foto.postits.map(n => (
            <PostIt key={n.id} nota={n} onDelete={() => onAddPostit(foto.id, null, n.id)} />
          ))}
        </div>
      )}

      {/* Botón post-it */}
      <button onClick={() => setShowForm(v => !v)}
        style={{
          width: '100%', marginTop: 8, fontFamily: 'Lato, sans-serif', fontSize: 14,
          padding: '11px', borderRadius: 14, border: '1.5px solid #D4C4B0', cursor: 'pointer',
          background: showForm ? '#FFF4B8' : '#FFFFFF', color: '#8B7355',
        }}>
        📝 Agregar post-it
      </button>

      {showForm && (
        <div style={{
          marginTop: 8, borderRadius: 16, padding: 16,
          background: '#FFFFFF', border: '1.5px solid #D4C4B0',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <textarea
            style={{
              fontFamily: 'Lato, sans-serif', background: '#FFF4B8',
              border: 'none', borderRadius: 12, padding: 12,
              color: '#3D2B1F', fontSize: 15, resize: 'none',
              minHeight: 70, width: '100%', outline: 'none', display: 'block',
            }}
            placeholder="Escribí algo lindo..."
            value={texto}
            onChange={e => setTexto(e.target.value)}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Lato, sans-serif', color: '#8B7355', fontSize: 14 }}>De:</span>
            {['Indi', 'Mati'].map(a => (
              <button key={a} onClick={() => setAutor(a)}
                style={{
                  fontFamily: 'Lato, sans-serif', padding: '8px 18px', borderRadius: 50,
                  fontSize: 14, border: '1.5px solid #D4C4B0', cursor: 'pointer',
                  background: autor === a ? '#C4785A' : '#FAF6EF',
                  color:      autor === a ? 'white'   : '#8B7355',
                }}>
                {a}
              </button>
            ))}
            <button onClick={submit}
              style={{
                marginLeft: 'auto', fontFamily: 'Lato, sans-serif', padding: '8px 18px',
                borderRadius: 50, background: '#C4785A', color: 'white',
                border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700,
              }}>
              Pegar ♥
            </button>
          </div>
        </div>
      )}

      {/* Separador */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, marginBottom: 4, opacity: 0.18 }}>
        <div style={{ width: 56, height: 2, borderRadius: 2, background: '#8B7355' }} />
      </div>
    </div>
  )
}

export default function Fotos() {
  const [fotos, setFotos]       = useStorage('fotos', [])
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
      id: Date.now(), url: preview,
      descripcion: form.descripcion || 'Un momento especial',
      lugar: form.lugar,
      fecha: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
      rotacion: ROTATIONS[prev.length % ROTATIONS.length],
      postits: [],
    }, ...prev])
    setPreview(null); setForm({ descripcion: '', lugar: '' }); setShowForm(false)
  }

  function addPostit(fotoId, postit, deleteId) {
    setFotos(prev => prev.map(f => {
      if (f.id !== fotoId) return f
      if (deleteId) return { ...f, postits: f.postits.filter(n => n.id !== deleteId) }
      return { ...f, postits: [...(f.postits || []), postit] }
    }))
  }

  const inputStyle = {
    fontFamily: 'Lato, sans-serif', border: '1.5px solid #D4C4B0',
    background: '#FAF6EF', color: '#3D2B1F', borderRadius: 14,
    padding: '13px 18px', width: '100%', outline: 'none', display: 'block',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 16 }}>
      {/* Botón agregar */}
      <div style={{ padding: '0 16px 16px' }}>
        <button onClick={() => setShowForm(true)}
          style={{
            width: '100%', fontFamily: 'Lato, sans-serif', fontSize: 16, fontWeight: 700,
            padding: '15px', borderRadius: 16, background: '#FFFFFF', color: '#C4785A',
            border: '2px dashed #D4A0A0', cursor: 'pointer',
          }}>
          + Agregar foto 📸
        </button>
      </div>

      {fotos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#9B8B7A' }}>
          <p style={{ fontSize: 52, marginBottom: 14 }}>📷</p>
          <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 20, color: '#8B7355' }}>
            El álbum está vacío
          </p>
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 14, color: '#9B8B7A', marginTop: 8 }}>
            ¡Agregá la primera foto del viaje!
          </p>
        </div>
      ) : (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column' }}>
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
          <div style={modalBase} className="w-full">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 22, color: '#3D2B1F' }}>
                Nueva foto
              </h2>
              <button onClick={() => { setShowForm(false); setPreview(null) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: '#9B8B7A', lineHeight: 1, padding: 4 }}>
                ✕
              </button>
            </div>

            {/* Zona foto */}
            <div onClick={() => fileRef.current.click()}
              style={{
                height: 200, borderRadius: 16, background: '#FAF6EF',
                border: preview ? 'none' : '2px dashed #D4C4B0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', overflow: 'hidden', flexShrink: 0,
              }}>
              {preview
                ? <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
                : <div style={{ textAlign: 'center', color: '#9B8B7A' }}>
                    <p style={{ fontSize: 44, marginBottom: 8 }}>📸</p>
                    <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 15 }}>Tocá para elegir una foto</p>
                  </div>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />

            <input style={inputStyle} placeholder="¿Qué pasó acá?"
              value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
            <input style={inputStyle} placeholder="Lugar (opcional)"
              value={form.lugar} onChange={e => setForm(f => ({ ...f, lugar: e.target.value }))} />

            <button onClick={agregar} disabled={!preview}
              style={{
                fontFamily: 'Lato, sans-serif', fontSize: 17, fontWeight: 700,
                padding: '17px', borderRadius: 16, background: '#C4785A', color: 'white',
                border: 'none', cursor: 'pointer', width: '100%',
                opacity: preview ? 1 : 0.4, boxShadow: '0 4px 12px rgba(196,120,90,0.3)',
              }}>
              Guardar en el álbum 📸
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
