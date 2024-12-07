import React from 'react';
import './Preview.css';

const Preview = () => {
  return (
    <div className="preview-container">
      <h1 className="preview-title">AI 감정분석 서비스 UI 플로우</h1>
      
      <div className="flow-container">
        {/* Home Page Preview */}
        <div className="page-preview">
          <div className="preview-header">
            <div className="preview-dot"></div>
            <div className="preview-dot"></div>
            <div className="preview-dot"></div>
          </div>
          <h2>메인 페이지</h2>
          <div className="mock-content home-mock">
            <div className="mock-nav">
              <div className="mock-logo">
                <img src="/images/logo.png" alt="로고" className="mock-logo-img" />
                AI Emotion
              </div>
              <div className="mock-menu"></div>
            </div>
            
            <div className="mock-hero">
              <div className="mock-title">AI 감정분석</div>
              <div className="mock-subtitle">당신의 감정을 분석해드립니다</div>
            </div>

            <div className="mock-realtime-section">
              <div className="mock-realtime-camera">
                <div className="mock-section-title">실시간 카메라</div>
                <div className="mock-camera-view">
                  <div className="mock-camera-frame">
                    <div className="mock-face-indicator"></div>
                  </div>
                  <button className="mock-start-btn">시작하기</button>
                </div>
              </div>
              
              <div className="mock-realtime-voice">
                <div className="mock-section-title">음성 인식</div>
                <div className="mock-voice-view">
                  <div className="mock-voice-visualizer">
                    <div className="mock-wave"></div>
                    <div className="mock-wave"></div>
                    <div className="mock-wave"></div>
                  </div>
                  <button className="mock-start-btn">시작하기</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flow-arrow">→</div>

        {/* Login/Signup Preview */}
        <div className="page-preview">
          <div className="preview-header">
            <div className="preview-dot"></div>
            <div className="preview-dot"></div>
            <div className="preview-dot"></div>
          </div>
          <h2>로그인/회원가입</h2>
          <div className="mock-content auth-mock">
            <div className="mock-tabs">
              <div className="mock-tab active">로그인</div>
              <div className="mock-tab">회원가입</div>
            </div>
            <div className="mock-form">
              <div className="mock-input-field">
                <img src="/images/email-icon.png" alt="이메일" />
                <span>이메일</span>
              </div>
              <div className="mock-input-field">
                <img src="/images/password-icon.png" alt="비밀번호" />
                <span>비밀번호</span>
              </div>
              <div className="mock-auth-button">로그인</div>
            </div>
            <div className="mock-social">
              <div className="mock-button google">
                <img src="/images/google-icon.svg" alt="Google" />
                Google
              </div>
              <div className="mock-button kakao">
                <img src="/images/kakao-icon.svg" alt="Kakao" />
                Kakao
              </div>
            </div>
          </div>
        </div>

        <div className="flow-arrow">→</div>

        {/* Camera Preview */}
        <div className="page-preview">
          <div className="preview-header">
            <div className="preview-dot"></div>
            <div className="preview-dot"></div>
            <div className="preview-dot"></div>
          </div>
          <h2>카메라 인식</h2>
          <div className="mock-content camera-mock">
            <div className="mock-camera-frame">
              <div className="mock-face-detection">
                <div className="mock-detection-points"></div>
              </div>
              <div className="mock-emotion-labels">
                <div className="mock-label">
                  <span>😊 행복</span>
                  <div className="mock-probability">85%</div>
                </div>
                <div className="mock-label">
                  <span>😐 중립</span>
                  <div className="mock-probability">15%</div>
                </div>
              </div>
            </div>
            <div className="mock-camera-controls">
              <div className="mock-switch-camera">
                <img src="/images/switch-camera.png" alt="카메라 전환" />
              </div>
              <div className="mock-capture-button">
                <div className="mock-capture-inner"></div>
              </div>
              <div className="mock-gallery">
                <img src="/images/gallery-icon.png" alt="갤러리" />
              </div>
            </div>
          </div>
        </div>

        <div className="flow-arrow">→</div>

        {/* Assessment Page Preview */}
        <div className="page-preview">
          <div className="preview-header">
            <div className="preview-dot"></div>
            <div className="preview-dot"></div>
            <div className="preview-dot"></div>
          </div>
          <h2>감정 평가</h2>
          <div className="mock-content assessment-mock">
            <div className="mock-progress">
              <div className="mock-progress-bar"></div>
            </div>
            <div className="mock-question">
              <div className="mock-text">지금 기분이 어떠신가요?</div>
            </div>
            <div className="mock-input">
              <div className="mock-textarea"></div>
              <div className="mock-controls">
                <div className="mock-record-button"></div>
                <div className="mock-camera-button">📷</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flow-arrow">→</div>

        {/* Results Page Preview */}
        <div className="page-preview">
          <div className="preview-header">
            <div className="preview-dot"></div>
            <div className="preview-dot"></div>
            <div className="preview-dot"></div>
          </div>
          <h2>분석 결과</h2>
          <div className="mock-content results-mock">
            <div className="mock-result-header">
              <div className="mock-result-title">감정 분석 리포트</div>
              <div className="mock-date">2024.03.14</div>
            </div>
            <div className="mock-charts">
              <div className="mock-chart circle">
                <div className="mock-chart-label">주요 감정</div>
              </div>
              <div className="mock-chart bar">
                <div className="mock-chart-label">감정 분포</div>
              </div>
            </div>
            <div className="mock-feedback">
              <div className="mock-feedback-title">AI 피드백</div>
              <div className="mock-bars">
                <div className="mock-bar"></div>
                <div className="mock-bar"></div>
                <div className="mock-bar"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="preview-legend">
        <div className="legend-item">
          <span className="legend-dot home"></span>
          <span>메인</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot auth"></span>
          <span>인증</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot camera"></span>
          <span>카메라</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot assessment"></span>
          <span>평가</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot results"></span>
          <span>결과</span>
        </div>
      </div>
    </div>
  );
};

export default Preview; 