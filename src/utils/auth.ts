const USERS_STORAGE_KEY = 'inversion360-users'
const SESSION_STORAGE_KEY = 'inversion360-session'
const SESSION_TTL_MS = 60 * 60 * 1000

export interface AuthUser {
  id: string
  fullName: string
  email: string
  createdAt: string
}

interface StoredUser extends AuthUser {
  passwordHash: string
}

interface SessionPayload {
  user: AuthUser
  issuedAt: number
  expiresAt: number
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function validateEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email)
}

export function validatePassword(password: string) {
  if (password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.'
  }

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
    return 'La contraseña debe incluir mayúsculas y minúsculas.'
  }

  if (!/\d/.test(password)) {
    return 'La contraseña debe incluir al menos un número.'
  }

  return null
}

function readUsers(): StoredUser[] {
  if (typeof window === 'undefined') {
    return []
  }

  const raw = window.localStorage.getItem(USERS_STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

async function hashPassword(password: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const digest = await crypto.subtle.digest('SHA-256', data)

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export function saveSession(user: AuthUser) {
  if (typeof window === 'undefined') {
    return
  }

  const payload: SessionPayload = {
    user,
    issuedAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  }

  window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload))
}

export function getSessionUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as SessionPayload
    if (parsed.expiresAt <= Date.now()) {
      clearSession()
      return null
    }

    return parsed.user
  } catch {
    clearSession()
    return null
  }
}

export function clearSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.removeItem(SESSION_STORAGE_KEY)
}

export async function registerUser(input: {
  fullName: string
  email: string
  password: string
}) {
  const fullName = input.fullName.trim()
  const email = normalizeEmail(input.email)
  const password = input.password

  if (!fullName || fullName.length < 2) {
    return { success: false as const, error: 'El nombre debe tener al menos 2 caracteres.' }
  }

  if (!validateEmail(email)) {
    return { success: false as const, error: 'Introduce un correo electrónico válido.' }
  }

  const passwordError = validatePassword(password)
  if (passwordError) {
    return { success: false as const, error: passwordError }
  }

  const users = readUsers()
  const existingUser = users.some((user) => user.email === email)
  if (existingUser) {
    return { success: false as const, error: 'Ya existe una cuenta con ese correo.' }
  }

  const passwordHash = await hashPassword(password)
  const newUser: StoredUser = {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
    fullName,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  }

  writeUsers([...users, newUser])

  return {
    success: true as const,
    user: {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      createdAt: newUser.createdAt,
    },
  }
}

export async function loginUser(input: { email: string; password: string }) {
  const email = normalizeEmail(input.email)
  const password = input.password

  if (!validateEmail(email)) {
    return { success: false as const, error: 'Introduce un correo electrónico válido.' }
  }

  const users = readUsers()
  const existingUser = users.find((user) => user.email === email)
  if (!existingUser) {
    return { success: false as const, error: 'No existe una cuenta con ese correo.' }
  }

  const passwordHash = await hashPassword(password)
  if (existingUser.passwordHash !== passwordHash) {
    return { success: false as const, error: 'Correo o contraseña incorrectos.' }
  }

  return {
    success: true as const,
    user: {
      id: existingUser.id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      createdAt: existingUser.createdAt,
    },
  }
}
