
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { crearPublicacion } from '../services/publicacion'

function CrearPublicacion() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      setError('Título y contenido son obligatorios')
      return
    }

    try {
      setCargando(true)
      setError('')
      await crearPublicacion({ title, content })
      navigate('/posts')
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Nueva publicación</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2"
            placeholder="Ej: Hoy aprendimos React"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Contenido</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            className="w-full rounded-xl border border-neutral-300 px-3 py-2"
            placeholder="Escribe tu publicación..."
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="rounded-full bg-violet-600 px-5 py-2 text-white disabled:opacity-60"
        >
          {cargando ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  )
}

export default CrearPublicacion

