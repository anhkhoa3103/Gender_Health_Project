import React from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceList from '../components/InvoicesList';

export default function Invoices() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '80vh', // fix height to viewport portion
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: 'auto', // scroll only invoice list if overflow
          paddingRight: '10px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          background: '#fff',
        }}
      >
        <InvoiceList />
      </div>

      <button
        style={{
          marginTop: '20px',
          padding: '10px 28px',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '1rem',
          alignSelf: 'center',
        }}
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>
    </div>
  );
}
