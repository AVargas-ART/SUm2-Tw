import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerPublicaciones, reaccionarPublicacion } from '../services/publicacion'

const tiposReaccion = [
  { type: 'like', icono: '👍' },
  { type: 'love', icono: '❤' },
  { type: 'haha', icono: '😂' },
  { type: 'wow', icono: '😮' },
  { type: 'sad', icono: '😢' },
  { type: 'angry', icono: '😡' },
]

function formatFecha(fecha) {
  if (!fecha) return 'Fecha desconocida'
  return new Date(fecha).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function Publicaciones() {
  const [posts, setPosts] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const cargarPosts = async () => {
    try {
      setCargando(true)
      setError(null)
      const data = await obtenerPublicaciones()
      setPosts(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    let cancelado = false

    async function cargarPublicacionesIniciales() {
      try {
        const data = await obtenerPublicaciones()
        if (!cancelado) setPosts(data)
      } catch (e) {
        if (!cancelado) setError(e.message)
      } finally {
        if (!cancelado) setCargando(false)
      }
    }

    cargarPublicacionesIniciales()

    return () => {
      cancelado = true
    }
  }, [])

  const manejarReaccion = async (postId, type) => {
    try {
      const data = await reaccionarPublicacion(postId, type)
      // la respuesta trae counts actualizados
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              reactions: data.counts || post.reactions,
            }
          }
          return post
        }),
      )
    } catch (e) {
      alert(e.message)
    }
  }

  if (cargando) {
    return <p>Cargando publicaciones...</p>
  }

  if (error) {
    return (
      <div>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={cargarPosts}>Reintentar</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Publicaciones</h1>
        <Link
          to="/crear-post"
          className="rounded-full bg-violet-600 px-4 py-2 text-white"
        >
          Nueva publicación
        </Link>
      </div>

      {posts.length === 0 && (
        <p>No hay publicaciones aún.</p>
      )}

      {posts.map((post) => (
        <article
          key={post.id}
          className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
        >
          <h2 className="text-xl font-bold">{post.title}</h2>

          <p className="mt-3 text-neutral-700">{post.content}</p>

          <div className="mt-4 flex items-center justify-between text-sm text-neutral-500">
            <span>Por {post.author?.name || 'Anónimo'}</span>
            <span>{formatFecha(post.createdAt)}</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {tiposReaccion.map(({ type, icono }) => (
              <button
                key={type}
                type="button"
                onClick={() => manejarReaccion(post.id, type)}
                className="rounded-full border border-neutral-200 px-3 py-1 text-sm hover:bg-violet-50"
              >
                {icono} {post.reactions?.[type] ?? 0}
              </button>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}

export default Publicaciones

