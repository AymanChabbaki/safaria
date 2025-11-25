/**
 * ============================================================
 * SAFARIA Platform - Page Container Component
 * ============================================================
 * Reusable wrapper for consistent page layout
 * ============================================================
 */

import './PageContainer.css';

const PageContainer = ({ 
  children, 
  className = '', 
  maxWidth = '1400px',
  padding = '2rem' 
}) => {
  return (
    <div 
      className={`page-container ${className}`}
      style={{ 
        maxWidth, 
        padding 
      }}
    >
      {children}
    </div>
  );
};

export default PageContainer;
