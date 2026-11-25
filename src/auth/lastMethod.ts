// Login page "Last used": the sign-in method and email used last in this session (in memory, like the rest of the prototype),
// so a signed-out user sees which account they used before.
export type SignInMethod = 'google' | 'apple' | 'facebook' | 'email'
export type LastSignIn = { method: SignInMethod; email: string }
let last: LastSignIn | null = null
export const lastSignIn = () => last
export const setLastSignIn = (v: LastSignIn | null) => void (last = v)
