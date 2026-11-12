import { useState } from 'react'

/** Formik-like state as on live: errors show once a field is touched (blur) or after a submit attempt. */
export function useForm<V extends Record<string, unknown>>(initial: V, validate: (v: V) => Partial<Record<keyof V, string>>) {
  const [values, setValues] = useState(initial)
  const [touched, setTouched] = useState<Partial<Record<keyof V, boolean>>>({})
  const errors = validate(values)
  const fill = (v: V) => setValues(v)
  const set = <K extends keyof V>(k: K, v: V[K]) => setValues((s) => ({ ...s, [k]: v }))
  const touch = (k: keyof V) => setTouched((t) => (t[k] ? t : { ...t, [k]: true }))
  const err = (k: keyof V) => (touched[k] ? errors[k] : undefined)
  const dirty = JSON.stringify(values) !== JSON.stringify(initial)
  /** Touches every field; returns true when valid. */
  const attempt = () => {
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])) as Partial<Record<keyof V, boolean>>)
    return Object.values(errors).every((e) => !e)
  }
  return { values, fill, set, touch, err, dirty, attempt }
}

export const MAX_NAME = 50
export const NAME_RE = /^[\p{L}\s]+$/u

/** Tiny placeholder image so sample-filled forms satisfy their upload fields. */
export const SAMPLE_FILE = (name: string) => ({
  name,
  url: `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="320" height="200" fill="#e7e5e4"/><text x="160" y="105" font-size="16" text-anchor="middle" fill="#78716c" font-family="sans-serif">Sample</text></svg>')}`,
})
