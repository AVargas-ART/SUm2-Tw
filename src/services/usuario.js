const API_URL =
  import.meta.env.VITE_API_URL ??
  'https://backend-react-fcsl.onrender.com/api-backend'

async function leerRespuesta(respuesta) {
  const texto = await respuesta.text()

  if (!texto) return {}

  try {
    return JSON.parse(texto)
  } catch {
    throw new Error('La API respondió con un formato inesperado.')
  }
}

// GET /users
export async function obtenerUsuarios() {
  const respuesta = await fetch(`${API_URL}/users`)
  const datos = await leerRespuesta(respuesta)

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No se pudieron obtener los usuarios')
  }

  return datos.users
}

// POST /auth/register
export async function registrarUsuario(usuario) {
  const respuesta = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  })
  const datos = await leerRespuesta(respuesta)

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No se pudo registrar el usuario')
  }

  return datos
}

// GET /posts
export async function obtenerPublicaciones() {
  const respuesta = await fetch(`${API_URL}/posts`)
  const datos = await leerRespuesta(respuesta)

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No se pudieron cargar las publicaciones')
  }

  return datos.posts
}

// POST /posts
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
    body: JSON.stringify({ title, content }),
  })
  const datos = await leerRespuesta(respuesta)

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No se pudo crear la publicación')
  }

  return datos
}

// POST /posts/:postId/reactions
export async function reaccionarPublicacion(postId, type, userId) {
  const body = { type }

  if (userId) {
    body.userId = userId
  }

  const respuesta = await fetch(`${API_URL}/posts/${postId}/reactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const datos = await leerRespuesta(respuesta)

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No se pudo registrar la reacción')
  }

  return datos
}

