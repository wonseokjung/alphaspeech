import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Assessment.css';
import * as faceapi from 'face-api.js';

const Assessment = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [emotion, setEmotion] = useState('');
  const [emotionStats, setEmotionStats] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysisTime, setAnalysisTime] = useState(0);
  const [isAnalysisReady, setIsAnalysisReady] = useState(false);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [dominantEmotion, setDominantEmotion] = useState(null);
  
  const MIN_ANALYSIS_TIME = 5; // 최소 5초 동안 분석
  const analysisTimer = useRef(null);

  const videoRef = useRef(null);
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  // face-api.js 모델 로드
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = process.env.PUBLIC_URL + '/weights';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        setModelLoaded(true);
      } catch (error) {
        console.error('모델 로드 중 에러 발생:', error);
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
      
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
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
    if (!cameraRef.current || !canvasRef.current || !modelLoaded || !cameraActive) return;

    const video = cameraRef.current;
    const canvas = canvasRef.current;
    
    if (video.videoWidth === 0 || video.videoHeight === 0) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detections && detections.length > 0) {
        setFaceDetected(true);
        const currentEmotions = detections[0].expressions;
        setEmotionStats(currentEmotions);
        
        // 현재 감정 상태에서 가장 강한 감정 찾기
        const strongestEmotion = Object.entries(currentEmotions).reduce((prev, current) => 
          prev[1] > current[1] ? prev : current
        )[0];
        
        setEmotion(strongestEmotion);
        
        // 음성 인식 중일 때만 감정 기록
        if (isListening) {
          setEmotionHistory(prev => [...prev, currentEmotions]);
        }
        
        // 얼굴 박스 그리기
        detections.forEach(detection => {
          if (detection.box) {
            const { box } = detection;
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2;
            ctx.strokeRect(box.x, box.y, box.width, box.height);
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
        setAnswer(transcript); // 음성 인식 결과를 답변에 반영
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      speechRecognitionRef.current = recognition;
    }
  }, []);

  // 음성 인식 시작/중지
  const toggleListening = () => {
    if (isListening) {
      speechRecognitionRef.current?.stop();
      setIsListening(false);
      clearInterval(analysisTimer.current);
      setIsAnalysisReady(true);
      
      // 감정 분석 완료 시 지배적인 감정 계산
      if (emotionHistory.length > 0) {
        calculateDominantEmotion();
      } else if (emotionStats && emotion) {
        // 현재 감정 상태를 사용
        setDominantEmotion({
          emotion: emotion,
          score: emotionStats[emotion]
        });
      }
    } else {
      speechRecognitionRef.current?.start();
      setIsListening(true);
      setAnalysisTime(0);
      setIsAnalysisReady(false);
      setEmotionHistory([]);
      
      // 분석 시간 타이머 시작
      analysisTimer.current = setInterval(() => {
        setAnalysisTime(prev => {
          if (prev >= MIN_ANALYSIS_TIME) {
            setIsAnalysisReady(true);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  // 지배적인 감정 계산
  const calculateDominantEmotion = () => {
    if (emotionHistory.length === 0) return;

    // 모든 감정 데이터 합산
    const totalEmotions = emotionHistory.reduce((acc, curr) => {
      Object.keys(curr).forEach(emotion => {
        acc[emotion] = (acc[emotion] || 0) + curr[emotion];
      });
      return acc;
    }, {});

    // 평균 계산
    Object.keys(totalEmotions).forEach(emotion => {
      totalEmotions[emotion] /= emotionHistory.length;
    });

    // 가장 강한 감정 찾기
    const dominant = Object.entries(totalEmotions).reduce((prev, current) => 
      prev[1] > current[1] ? prev : current
    );

    setDominantEmotion({
      emotion: dominant[0],
      score: dominant[1]
    });
  };

  // 감정 한글 변환
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
    return translations[emotion] || emotion;
  };

  // 비디오 및 카메라 초기화
  useEffect(() => {
    if (modelLoaded) {
      startCamera();
    }
    return () => stopCamera();
  }, [modelLoaded]);

  // 카메라 활성화 시 얼굴 감지 시작
  useEffect(() => {
    if (cameraRef.current && cameraActive && modelLoaded) {
      cameraRef.current.addEventListener('play', () => {
        detectFace();
      });
    }
  }, [cameraActive, modelLoaded]);

  // 결과 페이지로 이동
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!isAnalysisReady) {
      alert(`감정 분석을 위해 최소 ${MIN_ANALYSIS_TIME}초 이상 답변해 주세요.`);
      return;
    }

    if (!faceDetected) {
      alert('얼굴이 감지되지 않았습니다. 카메라를 확인해 주세요.');
      return;
    }

    if (!emotion || !emotionStats) {
      alert('감정 분석이 진행 중입니다. 잠시만 기다려 주세요.');
      return;
    }

    navigate('/results', {
      state: {
        answer: transcript || '',
        dominantEmotion: {
          type: emotion,
          name: translateEmotion(emotion),
          score: Math.round(emotionStats[emotion] * 100)
        }
      }
    });
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (analysisTimer.current) {
        clearInterval(analysisTimer.current);
      }
    };
  }, []);

  return (
    <div className="assessment-container">
      <div className="video-section">
        <video
          ref={videoRef}
          controls
          onEnded={() => setIsVideoEnded(true)}
          className="question-video"
        >
          <source src="/video/daniquestionandanswer.mp4" type="video/mp4" />
          브라우저가 비디오를 지원하지 않습니다.
        </video>
      </div>

      <div className="answer-section">
        <div className="voice-control">
          <button 
            className={`voice-control-btn ${isListening ? 'active' : ''}`}
            onClick={toggleListening}
          >
            {isListening ? (
              <>
                <span className="btn-icon">⏹</span>
                음성 인식 중지
                <span className="analysis-time">
                  {analysisTime < MIN_ANALYSIS_TIME 
                    ? `(${MIN_ANALYSIS_TIME - analysisTime}초 남음)` 
                    : '(분석 완료)'}
                </span>
              </>
            ) : (
              <>
                <span className="btn-icon">🎤</span>
                음성 인식 시작
              </>
            )}
          </button>
          
          {transcript && (
            <div className="transcript-display">
              <p className="transcript-text">{transcript}</p>
            </div>
          )}

          <button 
            className={`submit-button ${!isAnalysisReady ? 'disabled' : ''}`}
            onClick={handleSubmit}
            disabled={!isAnalysisReady}
          >
            결과 보기
          </button>
        </div>
      </div>

      <div className="analysis-section">
        <h3>실시간 분석</h3>
        <div className="analysis-grid">
          <div className="analysis-card face-detection-card">
            <div className="card-header">
              <h4>얼굴 감지 & 표정 분석</h4>
              <div className="status-badge">
                {faceDetected ? (
                  <>
                    <span className="status-detected">감지됨 ✓</span>
                    <span className="status-emotion">
                      {emotion ? `감정: ${translateEmotion(emotion)}` : '감정 분석 중...'}
                    </span>
                  </>
                ) : '대기 중...'}
              </div>
            </div>
            
            <div className="camera-container">
              <video
                ref={cameraRef}
                autoPlay
                playsInline
                muted
                className="camera-view"
              />
              <canvas
                ref={canvasRef}
                className="face-canvas"
              />
            </div>

            {emotionStats && (
              <div className="emotion-stats">
                <div className="stats-title">감정 수치:</div>
                {Object.entries(emotionStats).map(([emotion, value]) => (
                  <div key={emotion} className="stat-row">
                    <span>{translateEmotion(emotion)}:</span>
                    <span>{(value * 100).toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment; 