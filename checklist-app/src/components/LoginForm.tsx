import { useState, useRef, type SubmitEvent } from 'react'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { supabase } from '../lib/supabase'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const captchaRef = useRef<TurnstileInstance>(null)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsSubmitting(true)
    setError(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { captchaToken: captchaToken ?? undefined },
      })

      if (signInError) {
        captchaRef.current?.reset()
        setError(signInError.message)
        setCaptchaToken(null)
        setPassword('')
      }
    } catch (err) {
      captchaRef.current?.reset()
      setCaptchaToken(null)
      console.error(err)
      setError('Could not sign in. Check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-sm-8 col-md-5 col-lg-4">
        <form className="d-grid gap-3" onSubmit={handleSubmit}>
          <div className="form-floating">
            <input
              id="login-email"
              name="email"
              type="email"
              className="form-control"
              placeholder="Email"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <label htmlFor="login-email">Email</label>
          </div>

          <div className="form-floating">
            <input
              id="login-password"
              name="password"
              type="password"
              className="form-control"
              placeholder="Password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <label htmlFor="login-password">Password</label>
          </div>

          {error && (
            <div className="alert alert-danger mb-0" role="alert">
              {error}
            </div>
          )}

          <div className="d-flex justify-content-center">
            <Turnstile
              ref={captchaRef}
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onSuccess={setCaptchaToken}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success"
            disabled={isSubmitting || !captchaToken}
          >
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
