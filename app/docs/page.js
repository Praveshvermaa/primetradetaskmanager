'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  return (
    <div className="container" style={{ padding: '2rem 0', background: 'white', borderRadius: '8px', marginTop: '2rem' }}>
      <SwaggerUI url="/api/docs" />
    </div>
  );
}
