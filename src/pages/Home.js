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
      {/* 1. 히어로 섹션 */}
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
        <motion.button 
          className="quick-start-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
        >
          무료 평가 시작하기
          <span className="arrow">→</span>
        </motion.button>
      </motion.div>

      {/* 2. 평가 프로세스 섹션 */}
      <motion.div 
        className="process-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <h2>평가 진행 과정</h2>
        <p className="section-description">
          5단계의 체계적인 과정을 통해 정확한 평가 결과를 제공합니다
        </p>
        <div className="process-timeline">
          {[
            { icon: '👤', title: '기본 정보 입력', desc: '연령과 발달 단계 확인', color: '#F096AA' },
            { icon: '🎯', title: '맞춤형 평가', desc: '연령별 최적화된 평가 진행', color: '#F8B5C1' },
            { icon: '🔍', title: 'AI 분석', desc: '실시간 음성 및 표정 분석', color: '#FFD1DC' },
            { icon: '📊', title: '결과 도출', desc: '종합적인 발달 상태 평가', color: '#FFC0CB' },
            { icon: '📋', title: '맞춤 가이드', desc: '개인화된 발달 지원 방안 제시', color: '#FFB6C1' }
          ].map((step, index) => (
            <motion.div 
              key={index}
              className="process-step"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.2 }}
              style={{
                background: `linear-gradient(135deg, ${step.color}15, ${step.color}05)`,
                border: `1px solid ${step.color}30`
              }}
            >
              <div className="step-icon" style={{ 
                background: `${step.color}15`,
                border: `2px solid ${step.color}`
              }}>
                {step.icon}
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {index < 4 && (
                <div 
                  className="step-connector" 
                  style={{ 
                    background: `linear-gradient(to right, ${step.color}, ${step.color}50)`
                  }} 
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 3. AI 기반 특징 섹션 */}
      <motion.div 
        className="features-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <h2>AI 기반 평가의 특징</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>실시간 감정 분석</h3>
            <p>얼굴 표정과 음성 패턴을 분석하여 실시간으로 감정 태를 파악합니다.</p>
            <div className="tech-badges-container">
              <div className="tech-badge">Face API</div>
              <div className="tech-badge">Voice Analysis</div>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>데이터 기반 평가</h3>
            <p>1만 건 이상의 데이터를 기반으로 정확하고 객관적인 평가를 제공합니다.</p>
            <div className="tech-badges-container">
              <div className="tech-badge">Big Data</div>
              <div className="tech-badge">ML Models</div>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>맞춤형 발달 리포트</h3>
            <p>연령별 표준화된 지표를 바탕으로 개인 맞춤형 발달 보고서를 제공합니다.</p>
            <div className="tech-badges-container">
              <div className="tech-badge">Personalized</div>
              <div className="tech-badge">Age-Specific</div>
            </div>
          </div>
        </div>
        {/* 레이더 그래프 */}
        <div className="feature-visualization">
          <div className="radar-graph" style={{ 
            background: 'rgba(0, 0, 0, 0.2)', 
            padding: '2rem', 
            borderRadius: '20px', 
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            marginTop: '2rem'
          }}>
            <motion.div
              className="graph-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3>AI 평가 영역</h3>
            </motion.div>
            <svg viewBox="0 0 200 200">
              {/* 배경 그리드 애니메이션 */}
              {[0.2, 0.4, 0.6, 0.8, 1].map((scale, index) => (
                <motion.polygon
                  key={index}
                  points="100,20 180,60 180,140 100,180 20,140 20,60"
                  className="radar-background"
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'center',
                    opacity: 0.1,
                    stroke: 'rgba(255, 255, 255, 0.1)',
                    fill: 'none'
                  }}
                  animate={{ 
                    rotate: [0, 360],
                    scale: [scale, scale * 1.1, scale]
                  }}
                  transition={{ 
                    duration: 10 + index * 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              ))}
              
              {/* 데이터 폴리곤 */}
              <motion.polygon
                points={calculateRadarPoints()}
                className="radar-data"
                animate={{ 
                  opacity: [0.8, 1, 0.8],
                  scale: [1, 1.02, 1],
                  filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  fill: 'rgba(240, 150, 170, 0.2)',
                  stroke: '#F096AA',
                  strokeWidth: '2',
                  filter: 'blur(0px)'
                }}
              />
              
              {/* 축 라벨 애니메이션 */}
              {[
                { x: 100, y: 10, text: "언어표현" },
                { x: 190, y: 60, text: "감정교류" },
                { x: 190, y: 150, text: "의사소통" },
                { x: 100, y: 190, text: "상호작용" },
                { x: 10, y: 150, text: "공감능력" },
                { x: 10, y: 60, text: "관계형성" }
              ].map((label, index) => (
                <motion.text
                  key={index}
                  x={label.x}
                  y={label.y}
                  className="radar-label"
                  style={{ fill: '#F096AA', fontSize: '8px' }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {label.text}
                </motion.text>
              ))}
            </svg>
          </div>
        </div>
      </motion.div>

      {/* 4. 발달 영역 분석 섹션 */}
      <motion.div 
        className="analysis-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <h2>발달 영역 분석</h2>
        <p className="section-description">
          각 발달 영역별 세부적인 분석을 통해 아이의 성장을 지원합니다
        </p>
        <div className="circular-progress" style={{ 
          background: 'rgba(0, 0, 0, 0.2)', 
          padding: '2rem', 
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div className="circles-container">
            {[
              { label: "언어발달", value: 85, color: "#F096AA", desc: "어휘력, 문장 구성, 발음" },
              { label: "인지발달", value: 78, color: "#F8B5C1", desc: "기억력, 추론, 문제해결" },
              { label: "사회성", value: 92, color: "#FFD1DC", desc: "대인관계, 감정조절, 협동" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="circle-progress"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.2 }}
              >
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="12"
                  />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={2 * Math.PI * 54 * (1 - item.value / 100)}
                    initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - item.value / 100) }}
                    transition={{ duration: 1.5, delay: 0.5 + index * 0.2 }}
                  />
                  <motion.text
                    x="60"
                    y="45"
                    textAnchor="middle"
                    fill="#F096AA"
                    fontSize="24"
                    fontWeight="bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + index * 0.2 }}
                  >
                    {item.value}%
                  </motion.text>
                  <motion.text
                    x="60"
                    y="70"
                    textAnchor="middle"
                    fill="#F096AA"
                    fontSize="16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 + index * 0.2 }}
                  >
                    {item.label}
                  </motion.text>
                </svg>
                <motion.p
                  className="progress-description"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 + index * 0.2 }}
                >
                  {item.desc}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 5. 연구 기반 신뢰도 섹션 */}
      <motion.div 
        className="research-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <h2>연구 기반 평가 시스템</h2>
        <div className="research-content">
          <div className="research-text">
            <h3>과학적 근거</h3>
            <ul>
              <li>국내외 아동 발달 연구 데이터 활용</li>
              <li>검증된 평가 지표 시스템 적용</li>
              <li>지속적인 데이터 업데이트 및 모델 개선</li>
            </ul>
            <div className="stats-grid">
              <div className="stat-item">
                <h4>98.5%</h4>
                <p>평가 정확도</p>
              </div>
              <div className="stat-item">
                <h4>10,000+</h4>
                <p>분석 데이터</p>
              </div>
              <div className="stat-item">
                <h4>95%</h4>
                <p>신뢰도</p>
              </div>
            </div>
          </div>
          {/* 물결 애니메이션 그래프 */}
          <motion.div 
            className="wave-graph"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h3>발달 추이 분석</h3>
            <div style={{ position: 'relative', height: '200px', marginTop: '1rem' }}>
              {[1, 2, 3].map((wave, waveIndex) => (
                <motion.svg
                  key={waveIndex}
                  viewBox="0 0 1000 200"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.3 - waveIndex * 0.1
                  }}
                >
                  <motion.path
                    d="M0 100 C250 50, 350 150, 500 100 C650 50, 750 150, 1000 100"
                    fill="none"
                    stroke={`rgba(240, 150, 170, ${0.8 - waveIndex * 0.2})`}
                    strokeWidth="3"
                    initial={{ pathLength: 0, pathOffset: 1 }}
                    animate={{
                      pathLength: 1,
                      pathOffset: 0,
                      y: [0, 10, 0],
                    }}
                    transition={{
                      pathLength: { duration: 2, delay: waveIndex * 0.5 },
                      pathOffset: { duration: 2, delay: waveIndex * 0.5 },
                      y: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: waveIndex * 0.5
                      }
                    }}
                  />
                </motion.svg>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 6. 평가의 장점 섹션 */}
      <motion.div 
        className="benefits-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <h2>평가의 장점</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <motion.div 
              className="benefit-circle"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <span>95%</span>
            </motion.div>
            <h3>정확도</h3>
          </div>
          <div className="benefit-card">
            <motion.div 
              className="benefit-circle"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 4,
                delay: 0.5,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <span>실시간</span>
            </motion.div>
            <h3>분석 속도</h3>
          </div>
          <div className="benefit-card">
            <motion.div 
              className="benefit-circle"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 4,
                delay: 1,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <span>AI</span>
            </motion.div>
            <h3>객관성</h3>
          </div>
        </div>
      </motion.div>

      {/* 7. 메인 CTA 섹션 */}
      <motion.section 
        className="cta-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="cta-content">
          <h2 className="cta-title">지금 바로 시작하세요</h2>
          <p className="cta-description">
            AI 기반 사회성 평가를 통해 당신의 소셜 지능을 발견하고 향상시켜보세요.
          </p>
          <motion.button 
            className="cta-button"
            onClick={handleStart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            무료로 시작하기
            <span className="button-icon">→</span>
          </motion.button>
        </div>
        <div className="cta-background"></div>
      </motion.section>
    </div>
  );
}

export default Home; 