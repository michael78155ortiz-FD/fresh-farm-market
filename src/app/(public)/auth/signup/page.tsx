'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [created, setCreated] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreated(true);
  }

  return (
    <main style={{ padding: 40, maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 12 }}>Create account</h1>

      {!created ? (
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10, borderRadius: 8 }}
          />
          <button type="submit">Create account</button>
        </form>
      ) : (
        <p>Account created. Check your email to confirm.</p>
      )}

      <div style={{ marginTop: 16 }}>
        <Link href="/auth/login">Already have an account? Log in</Link>
      </div>
      <div style={{ marginTop: 8 }}>
        <Link href="/auth/guest">Continue as guest</Link>
      </div>
    </main>
  );
}
