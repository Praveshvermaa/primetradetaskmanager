import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center pt-20 pb-10 px-4 animate-fade-in text-center" style={{ flexGrow: 1 }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Welcome to PrimeTrade AI
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '2.5rem' }}>
          A scalable, secure Task Management system built with Next.js, MongoDB, and secure JWT Authentication.
        </p>

        <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '800px', width: '100%' }}>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/login" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Login to Account
            </Link>
            <Link href="/register" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Create an Account
            </Link>
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', textAlign: 'left' }}>
            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Core Features Showcase</h3>
            <div className="flex" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ flex: '1 1 200px', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '8px' }}>
                <h4 style={{ color: '#60a5fa' }}>🔒 Secure Auth</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Custom JWT implementation with HTTP-only cookies and bcrypt hashing.</p>
              </div>
              <div style={{ flex: '1 1 200px', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '8px' }}>
                <h4 style={{ color: '#a78bfa' }}>🛡️ Role-Based Access</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Granular controls. Admins can see all tasks; users see only theirs.</p>
              </div>
              <div style={{ flex: '1 1 200px', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '8px' }}>
                <h4 style={{ color: '#34d399' }}>📚 API Docs</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Interactive Swagger JSON documentation generated via next-swagger-doc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
