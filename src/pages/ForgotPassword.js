import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement password reset logic
    setIsSubmitted(true);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h2>비밀번호 찾기</h2>
          <p>가입하신 이메일을 입력해 주세요</p>
        </div>
        {!isSubmitted ? (
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              비밀번호 재설정 링크 받기
            </button>
          </form>
        ) : (
          <div className="success-message">
            <span className="success-icon">✉️</span>
            <h3>이메일을 확인해주세요</h3>
            <p>
              비밀번호 재설정 링크를 보내드렸습니다.<br />
              이메일이 도착하지 않았다면 스팸함을 확인해주세요.
            </p>
          </div>
        )}
        <div className="forgot-password-footer">
          <Link to="/login" className="back-to-login">
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 