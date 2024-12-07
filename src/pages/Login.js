import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add login logic here
    console.log('Login submitted:', formData);
  };

  const handleSocialLogin = (provider) => {
    // TODO: Implement social login
    console.log(`Logging in with ${provider}`);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>로그인</h2>
          <p>Social IQ에 오신 것을 환영합니다</p>
        </div>
        <div className="social-login">
          <button 
            className="social-button google"
            onClick={() => handleSocialLogin('google')}
          >
            <img src="/images/google-icon.svg" alt="Google" className="social-icon" />
            Google로 계속하기
          </button>
          <button 
            className="social-button kakao"
            onClick={() => handleSocialLogin('kakao')}
          >
            <img src="/images/kakao-icon.svg" alt="Kakao" className="social-icon" />
            카카오로 계속하기
          </button>
        </div>
        <div className="divider">
          <span>또는</span>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> 로그인 상태 유지
            </label>
            <Link to="/forgot-password" className="forgot-password">
              비밀번호를 잊으셨나요?
            </Link>
          </div>
          <button type="submit" className="login-button">로그인</button>
        </form>
        <div className="login-footer">
          <p>아직 계정이 없으신가요? <Link to="/signup">회원가입</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login; 