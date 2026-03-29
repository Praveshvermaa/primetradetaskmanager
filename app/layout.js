import './globals.css';

export const metadata = {
  title: 'PrimeTrade AI | Task Manager',
  description: 'Scalable REST API with Authentication & Role-Based Access built with Next.js and MongoDB.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="container flex-col" style={{ minHeight: '100vh', display: 'flex' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
