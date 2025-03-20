export {}

// Create a type for the roles
export type Roles = 'admin' | 'clerk' | 'principal' | 'teacher' | 'student'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}