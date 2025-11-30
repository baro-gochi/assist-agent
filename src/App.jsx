/**
 * @fileoverview 메인 App 라우터 컴포넌트
 *
 * @description
 * React Router를 사용하여 페이지 라우팅을 관리합니다.
 * 비밀번호 인증을 통해 애플리케이션 접근을 제어합니다.
 *
 * 라우트:
 * - / : AssistantMain (AI 상담 어시스턴트 대시보드)
 * - /stt-compare : STTComparison (Google STT vs ElevenLabs STT 비교)
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AssistantMain from './AssistantMain';
import STTComparison from './STTComparison';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * 비밀번호 입력 화면 컴포넌트
 */
function PasswordScreen({ onAuthenticated }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `password=${encodeURIComponent(password)}`,
      });

      if (response.ok) {
        sessionStorage.setItem('auth_token', password);
        onAuthenticated(password);
      } else {
        const data = await response.json();
        setError(data.detail || '인증 실패');
      }
    } catch (err) {
      setError('서버 연결 실패. 백엔드가 실행 중인지 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'sans-serif',
      background: 'linear-gradient(135deg, #6B8E7D 0%, #5A7A6A 100%)',
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px',
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '10px', color: '#333' }}>
          🔐 실시간 상담 어시스턴트
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          접근하려면 비밀번호를 입력하세요
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            autoComplete="new-password"
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '16px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              marginBottom: '16px',
              boxSizing: 'border-box',
            }}
            autoFocus
          />
          {error && (
            <p style={{ color: '#e53935', fontSize: '14px', marginBottom: '16px' }}>
              ❌ {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              background: loading ? '#ccc' : '#6B8E7D',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [authToken, setAuthToken] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // sessionStorage에서 저장된 토큰 확인 (브라우저 닫으면 삭제됨)
    const savedToken = sessionStorage.getItem('auth_token');
    if (savedToken) {
      // 저장된 토큰으로 서버에서 반드시 인증 확인
      fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `password=${encodeURIComponent(savedToken)}`,
      })
        .then((res) => {
          if (res.ok) {
            setAuthToken(savedToken);
          } else {
            sessionStorage.removeItem('auth_token');
          }
          setCheckingAuth(false);
        })
        .catch(() => {
          // 서버 연결 실패 시 재로그인 필요
          sessionStorage.removeItem('auth_token');
          setCheckingAuth(false);
        });
    } else {
      setCheckingAuth(false);
    }
  }, []);

  if (checkingAuth) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}>
        <p>인증 확인 중...</p>
      </div>
    );
  }

  if (!authToken) {
    return <PasswordScreen onAuthenticated={setAuthToken} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Main Route: AI Assistant Dashboard */}
        <Route path="/" element={<AssistantMain />} />

        {/* STT Comparison Route: Google vs ElevenLabs */}
        <Route path="/stt-compare" element={<STTComparison />} />

        {/* 404 Not Found */}
        <Route path="*" element={
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'sans-serif'
          }}>
            <h1>실시간 상담 어시스턴트 에이전트</h1>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/" style={{
                padding: '10px 20px',
                background: '#6B8E7D',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px'
              }}>
                AI 어시스턴트 대시보드
              </Link>
              <Link to="/stt-compare" style={{
                padding: '10px 20px',
                background: '#6B9E7D',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px'
              }}>
                STT 엔진 비교
              </Link>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
