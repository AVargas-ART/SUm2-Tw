const API_URL = import.meta.env.VITE_API_URL ?? 'https://backend-react-fcsl.onrender.com/api-backend'

async function parsearJSON(respuesta) {
  const texto = await respuesta.text()
  if (!texto) return {}

  try {
    return JSON.parse(texto)
  } catch {
    throw new Error('La API respondió con un formato inesperado')
  }
}

export async function obtenerPublicaciones() {
  const respuesta = await fetch(`${API_URL}/posts`)
  const datos = await parsearJSON(respuesta)

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No se pudieron cargar las publicaciones')
  }

  return Array.isArray(datos.posts) ? datos.posts : []
}

export async function crearPublicacion({ title, content }) {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('Debes iniciar sesión para crear una publicación')
  }

  const respuesta = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      content,
    }),
  })

  const datos = await parsearJSON(respuesta)

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No se pudo crear la publicación')
  }

  return datos
}

export async function reaccionarPublicacion(postId, type) {
  const respuesta = await fetch(`${API_URL}/posts/${postId}/reactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type,
      // userId: usuario?.id, // opcional, si el usuario inició sesión
    }),
  })

  const datos = await parsearJSON(respuesta)

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No se pudo registrar la reacción')
  }

  return datos
}

