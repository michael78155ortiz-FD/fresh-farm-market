'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <main style={{ padding: 40, maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 12 }}>Log in</h1>

      {!sent ? (
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10, borderRadius: 8 }}
          />
          <button type="submit">Send magic link</button>
        </form>
      ) : (
        <p>Check your email for a magic link.</p>
      )}

      <div style={{ marginTop: 16 }}>
        <Link href="/auth/signup">Create account</Link>
      </div>
      <div style={{ marginTop: 8 }}>
        <Link href="/auth/guest">Continue as guest</Link>
      </div>
    </main>
  );
}
