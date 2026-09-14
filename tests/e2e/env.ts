export const PORT = Number(process.env.E2E_PORT ?? 4180)
export const BASE_URL = `http://localhost:${PORT}`
export const ADMIN = { email: 'e2e-admin@example.com', password: 'e2e-password-2026' }
export const ADMIN_STATE = 'test-results/.auth/admin.json'
