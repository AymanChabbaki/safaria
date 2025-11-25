/**
 * ============================================================
 * SAFARIA Platform - 404 Not Found Page
 * ============================================================
 */

import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';

const NotFoundPage = () => {
  return (
    <PageContainer>
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '6rem', margin: '0', color: '#667eea' }}>404</h1>
        <h2 style={{ fontSize: '2rem', marginTop: '1rem', color: '#2c3e50' }}>
          Page non trouvée
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#7f8c8d', marginTop: '1rem' }}>
          La page que vous recherchez n'existe pas.
        </p>
        <Link 
          to="/" 
          style={{
            marginTop: '2rem',
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            transition: 'transform 0.3s ease'
          }}
        >
          Retour à l'accueil
        </Link>
      </div>
    </PageContainer>
  );
};

export default NotFoundPage;
