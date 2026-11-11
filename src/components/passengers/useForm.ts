import { useState } from 'react'

/** Formik-like state as on live: errors show once a field is touched (blur) or after a submit attempt. */
export function useForm<V extends Record<string, unknown>>(initial: V, validate: (v: V) => Partial<Record<keyof V, string>>) {
  const [values, setValues] = useState(initial)
  const [touched, setTouched] = useState<Partial<Record<keyof V, boolean>>>({})
  const errors = validate(values)
  const set = <K extends keyof V>(k: K, v: V[K]) => setValues((s) => ({ ...s, [k]: v }))
  const touch = (k: keyof V) => setTouched((t) => (t[k] ? t : { ...t, [k]: true }))
  const err = (k: keyof V) => (touched[k] ? errors[k] : undefined)
  const dirty = JSON.stringify(values) !== JSON.stringify(initial)
  /** Touches every field; returns true when valid. */
  const attempt = () => {
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])) as Partial<Record<keyof V, boolean>>)
    return Object.values(errors).every((e) => !e)
  }
  return { values, set, touch, err, dirty, attempt }
}

export const MAX_NAME = 50
export const NAME_RE = /^[\p{L}\s]+$/u
