import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';
import { motion } from 'framer-motion';
import * as faceapi from 'face-api.js';

function Home() {
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState({
    year: '2024',
    month: '1',
    day: '1'
  });
  const [gender, setGender] = useState('');
  const [radarPoints, setRadarPoints] = useState([0, 0, 0, 0, 0, 0]);
  const [barHeights, setBarHeights] = useState([0, 0, 0]);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [emotion, setEmotion] = useState('');
  const [emotionStats, setEmotionStats] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  // face-api.js 모델 로드
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('모델 로딩 시작...');
        const MODEL_URL = process.env.PUBLIC_URL + '/weights';
        
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        
        console.log('모델 로딩 완료');
        setModelLoaded(true);
      } catch (error) {
        console.error('모델 로드 중 에러 발생:', error);
        console.error('에러 상세:', {
          message: error.message,
          stack: error.stack,
          modelUrl: process.env.PUBLIC_URL + '/weights'
        });
      }
    };

    loadModels();
  }, []);

  // 카메라 시작
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("카메라를 시작할 수 없습니다:", err);
    }
  };

  // 카메라 중지
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  // 얼굴 감지
  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current || !modelLoaded || !cameraActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video.videoWidth === 0 || video.videoHeight === 0) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      console.log('감지된 얼굴:', detections);

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detections && detections.length > 0) {
        setFaceDetected(true);
        setEmotionStats(detections[0].expressions);
        
        detections.forEach(detection => {
          if (detection && detection.box) {
            const { box, expressions } = detection;
            
            // 얼굴 박스 그리기
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2;
            ctx.strokeRect(box.x, box.y, box.width, box.height);

            // 가장 강한 감정 찾기
            if (expressions) {
              console.log('감정 데이터:', expressions);
              
              const emotion = Object.entries(expressions).reduce((prev, current) => 
                prev[1] > current[1] ? prev : current
              )[0];

              console.log('감지된 감정:', emotion);
              setEmotion(emotion);
            }
          }
        });
      } else {
        setFaceDetected(false);
        setEmotion('');
        setEmotionStats(null);
      }

      if (cameraActive) {
        requestAnimationFrame(detectFace);
      }
    } catch (error) {
      console.error('얼굴 감지 중 에러 발생:', error);
      if (cameraActive) {
        requestAnimationFrame(detectFace);
      }
    }
  };

  // 감정 한글 변환 함수
  const translateEmotion = (emotion) => {
    const translations = {
      neutral: '무표정',
      happy: '행복',
      sad: '슬픔',
      angry: '화남',
      fearful: '두려움',
      disgusted: '싫음',
      surprised: '놀람'
    };
    console.log('감정 변환:', emotion, '->', translations[emotion]);
    return translations[emotion] || emotion;
  };

  // 비디오 로드 시 얼굴 감지 시작
  useEffect(() => {
    if (videoRef.current && cameraActive && modelLoaded) {
      videoRef.current.addEventListener('play', () => {
        detectFace();
      });
    }
  }, [cameraActive, modelLoaded]);

  // 컴포넌트 마운트 시 자동으로 카메라 시작
  useEffect(() => {
    if (modelLoaded) {
      startCamera();
    }
  }, [modelLoaded]);

  // cleanup
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // 레이더 그래프 지속적 애니메이션
  useEffect(() => {
    const animateRadar = () => {
      const baseValues = [85, 75, 90, 80, 70, 85];
      const newPoints = baseValues.map(value => 
        value + Math.random() * 10 - 5
      );
      setRadarPoints(newPoints);
    };

    const initialTimer = setTimeout(() => {
      animateRadar();
    }, 500);

    const interval = setInterval(animateRadar, 3000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  // 바 그래프 지속적 애니메이션
  useEffect(() => {
    const animateBars = () => {
      const baseValues = [70, 85, 90];
      const newHeights = baseValues.map(value => 
        value + Math.random() * 10 - 5
      );
      setBarHeights(newHeights);
    };

    const initialTimer = setTimeout(() => {
      animateBars();
    }, 1000);

    const interval = setInterval(animateBars, 3000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  // 음성 인식 초기화
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ko-KR';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setTranscript(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      speechRecognitionRef.current = recognition;
    }
  }, []);

  const handleDateChange = (field, value) => {
    setBirthDate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
  };

  const handleStart = () => {
    if (gender) {
      navigate('/assessment');
    } else {
      alert('성별을 선택해주세요!');
    }
  };

  const calculateRadarPoints = () => {
    const points = [];
    const centerX = 100;
    const centerY = 100;
    const radius = 80;

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const value = radarPoints[i] / 100;
      const x = centerX + radius * value * Math.cos(angle);
      const y = centerY + radius * value * Math.sin(angle);
      points.push(`${x},${y}`);
    }

    return points.join(' ');
  };

  // 음성 인식 시작/중지
  const toggleListening = () => {
    if (isListening) {
      speechRecognitionRef.current?.stop();
      setIsListening(false);
    } else {
      speechRecognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="home-container">
      <motion.div 
        className="hero-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="ai-badge">AI-Powered Assessment</div>
        <h1 className="main-title">AI 기반 알파세대 사회화 능력 평가</h1>
        <p className="subtitle">
          <span className="highlight">음성 인식</span>으로 알아보는 우리 아이의 사회화 능력<br />
          <span className="korean-text">AI 기술로 분석하는 맞춤형 사회성 발달 평가</span>
        </p>
      </motion.div>

      <motion.div 
        className="basic-info-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <h2>기본 정보 입력</h2>
        <p className="section-description">
          알파세대 맞춤형 사회화 능력 평가를 시작하기 전에 기본 정보를 입력해주세요.
          입력하신 정보는 연령대별 맞춤형 분석에 활용됩니다.
        </p>
        <div className="info-grid">
          <div className="birth-date">
            <label>Birth Date</label>
            <div className="date-inputs">
              <select value={birthDate.year} onChange={(e) => handleDateChange('year', e.target.value)}>
                {Array.from({ length: 20 }, (_, i) => 2024 - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select value={birthDate.month} onChange={(e) => handleDateChange('month', e.target.value)}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select value={birthDate.day} onChange={(e) => handleDateChange('day', e.target.value)}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="gender-selection">
            <label>Gender</label>
            <div className="gender-buttons">
              <button
                className={gender === 'male' ? 'active' : ''}
                onClick={() => handleGenderSelect('male')}
              >
                Male
              </button>
              <button
                className={gender === 'female' ? 'active' : ''}
                onClick={() => handleGenderSelect('female')}
              >
                Female
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="visualization-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <h2>사회화 능력 분석</h2>
        <p className="section-description">
          6가지 핵심 영역의 사회화 능력을 측정하고 분석합니다.
          대화 패턴, 감정 표현, 의사소통 방식 등을 종합적으로 평가합니다.
        </p>
        <div className="graph-section">
          {/* 레이더 그래프 */}
          <div className="radar-graph" style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <svg viewBox="0 0 200 200">
              <motion.polygon
                points="100,20 180,60 180,140 100,180 20,140 20,60"
                className="radar-background"
                animate={{ 
                  opacity: [0.1, 0.2, 0.1],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.polygon
                points={calculateRadarPoints()}
                className="radar-data"
                animate={{ 
                  opacity: [0.8, 1, 0.8],
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <text x="100" y="10" className="radar-label">언어표현</text>
              <text x="190" y="60" className="radar-label">감정교류</text>
              <text x="190" y="150" className="radar-label">의사소통</text>
              <text x="100" y="190" className="radar-label">상호작용</text>
              <text x="10" y="150" className="radar-label">공감능력</text>
              <text x="10" y="60" className="radar-label">관계형성</text>
            </svg>
          </div>

          {/* 바 그래프 */}
          <div className="bar-graph" style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            {barHeights.map((height, index) => (
              <motion.div
                key={index}
                className="bar"
                animate={{ 
                  height: `${height}%`,
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  height: `${height}%`
                }}
              >
                <motion.span 
                  className="bar-label"
                  animate={{ 
                    y: [-2, 2, -2],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {Math.round(height)}%
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="analysis-section">
        <h3>실시간 분석</h3>
        <div className="analysis-grid">
          <motion.div 
            className="analysis-card face-detection-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-header">
              <h4>얼굴 감지 & 표정 분석</h4>
              <div className="status-badge" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {faceDetected ? (
                  <>
                    <span style={{ color: '#00ff88' }}>감지됨 ✓</span>
                    <span style={{ color: '#ffb700' }}>
                      {emotion ? `감정: ${translateEmotion(emotion)}` : '감정 분석 중...'}
                    </span>
                  </>
                ) : '대기 중...'}
              </div>
            </div>
            
            <div className="camera-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-view"
                onLoadedMetadata={() => {
                  if (cameraActive && modelLoaded) {
                    detectFace();
                  }
                }}
              />
              <canvas
                ref={canvasRef}
                className="face-canvas"
              />
            </div>
            {emotionStats && (
              <div className="emotion-stats" style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '10px',
                fontSize: '0.9rem'
              }}>
                <div style={{ marginBottom: '0.5rem', color: '#00ff88' }}>감정 수치:</div>
                {Object.entries(emotionStats).map(([emotion, value]) => (
                  <div key={emotion} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.3rem',
                    color: '#fff'
                  }}>
                    <span>{translateEmotion(emotion)}:</span>
                    <span>{(value * 100).toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
          
          <motion.div 
            className="analysis-card voice-analysis-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card-header">
              <h4>음성 분석</h4>
              <div className="status-badge">
                {isListening ? '듣는 중...' : '대기 중...'}
              </div>
            </div>
            
            <motion.button 
              className={`voice-control-btn ${isListening ? 'active' : ''}`}
              onClick={toggleListening}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isListening ? (
                <>
                  <span className="btn-icon">⏹</span>
                  음성 인식 중지
                </>
              ) : (
                <>
                  <span className="btn-icon">🎤</span>
                  음성 인식 시작
                </>
              )}
            </motion.button>
            
            {transcript && (
              <motion.div 
                className="transcript-display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="transcript-text">{transcript}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">지금 바로 시작하세요</h2>
          <p className="cta-description">
            AI 기반 사회성 평가를 통해 당신의 소셜 지능을 발견하고 향상시켜보세요.
          </p>
          <button 
            className="cta-button"
            onClick={handleStart}
          >
            평가 시작하기
            <span className="button-icon">→</span>
          </button>
        </div>
        <div className="cta-background"></div>
      </section>
    </div>
  );
}

export default Home; 