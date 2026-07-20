/*
 * ─────────────────────────────────────────────────────────────
 *  ADMIN AUTH (client-side)
 *
 *  ⚠️ SECURITY: This is a front-end-only gate. The credentials ship
 *  in the JS bundle, so this only keeps casual users out — it is NOT
 *  real protection. For a secure admin, verify credentials on the
 *  server and issue a session token / httpOnly cookie instead.
 * ─────────────────────────────────────────────────────────────
 */

const ADMIN_USER = 'fayzrahmon'
const ADMIN_PASS = 'ravshfayzz'
const KEY = 'gab-admin-auth'

export function login(username, password) {
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    sessionStorage.setItem(KEY, '1')
    return true
  }
  return false
}

export function logout() {
  sessionStorage.removeItem(KEY)
}

export function isAuthed() {
  return sessionStorage.getItem(KEY) === '1'
}
