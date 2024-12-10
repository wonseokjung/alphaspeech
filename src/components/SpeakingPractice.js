import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import './SpeakingPractice.css';

function SpeakingPractice({ onComplete }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [emotion, setEmotion] = useState('');
  const [emotions, setEmotions] = useState([]);
  const [loadingError, setLoadingError] = useState(null);
  const [supportSpeechRecognition, setSupportSpeechRecognition] = useState(true);
  const [error, setError] = useState(null);

  const userVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // 모델 로드
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = process.env.PUBLIC_URL + '/weights';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        setModelLoaded(true);
      } catch (error) {
        console.error('모델 로드 중 에러 발생:', error);
        setLoadingError('모델을 불러오는 중 문제가 발생했습니다.');
      }
    };
    loadModels();
  }, []);

  // 카메라 시작
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("카메라를 시작할 수 없습니다:", err);
      setLoadingError('카메라 접근 권한이 없거나 사용할 수 없습니다.');
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
    if (!userVideoRef.current || !canvasRef.current || !modelLoaded || !cameraActive) return;
    const video = userVideoRef.current;
    const canvas = canvasRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      requestAnimationFrame(detectFace);
      return;
    }
    
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
        const { expressions, box } = detections[0];
        if (box) {
          ctx.strokeStyle = '#00ff88';
          ctx.lineWidth = 2;
          ctx.strokeRect(box.x, box.y, box.width, box.height);
        }

        if (expressions) {
          const dominantEmotion = Object.entries(expressions)
            .reduce((prev, current) => prev[1] > current[1] ? prev : current)[0];
          setEmotion(dominantEmotion);

          if (isListening) {
            setEmotions(prev => [...prev, expressions]);
          }
        }
      } else {
        setFaceDetected(false);
        setEmotion('');
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

  // 비디오 play 시 얼굴 감지 시작
  useEffect(() => {
    if (userVideoRef.current && cameraActive && modelLoaded) {
      userVideoRef.current.addEventListener('play', () => {
        detectFace();
      });
    }
  }, [cameraActive, modelLoaded]);

  // 모델 로딩 완료 시 카메라 시작
  useEffect(() => {
    if (modelLoaded) startCamera();
    return () => stopCamera();
  }, [modelLoaded]);

  // 음성 인식 설정
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const sr = new window.webkitSpeechRecognition();
      sr.continuous = true;
      sr.interimResults = true;
      sr.lang = 'ko-KR';

      sr.onresult = (event) => {
        const result = Array.from(event.results)
          .map(r => r[0].transcript)
          .join('');
        setTranscript(result);
      };

      sr.onend = () => {
        setIsListening(false);
      };

      setRecognition(sr);
    } else {
      setSupportSpeechRecognition(false);
    }
  }, []);

  const toggleListening = () => {
    if (!supportSpeechRecognition) return;
    if (isListening) {
      recognition?.stop();
      onComplete && onComplete({ transcript, emotions });
    } else {
      recognition?.start();
      setEmotions([]);
      setTranscript('');
    }
    setIsListening(!isListening);
  };

  // 오류 발생 시 사용자에게 알림
  useEffect(() => {
    if (error) {
      console.error('오류 발생:', error);
      // 사용자 친화적인 오류 메시지 표시
    }
  }, [error]);

  return (
    <div className="speaking-practice">
      {!modelLoaded && !loadingError && <div className="loading">모델 로딩 중...</div>}
      {loadingError && <div className="error-message">{loadingError}</div>}
      
      {modelLoaded && !loadingError && (
        <>
          <video
            ref={userVideoRef}
            autoPlay
            playsInline
            muted
            width="400"
            height="300"
            aria-label="User Video"
          />
          <canvas ref={canvasRef} className="face-canvas" aria-hidden="true" />
          <div className="video-status">
            {faceDetected ? (
              <>
                <span className="status-detected">감지됨 ✓</span>
                <span className="status-emotion">
                  {emotion ? `감정: ${translateEmotion(emotion)}` : '감정 분석 중...'}
                </span>
              </>
            ) : '얼굴을 카메라에 비춰주세요...'}
          </div>
          
          <div className="controls">
            {!supportSpeechRecognition && (
              <div className="error-message">
                현재 브라우저에서는 음성 인식 기능을 지원하지 않습니다.
              </div>
            )}
            
            <button 
              onClick={toggleListening}
              className={`record-button ${isListening ? 'recording' : ''}`}
              disabled={!supportSpeechRecognition}
              aria-label={isListening ? '녹음 중지' : '녹음 시작'}
            >
              {isListening ? '녹음 중지' : '녹음 시작'}
            </button>
            {isListening && <div className="recording-indicator" aria-live="assertive">녹음중...</div>}
          </div>
          
          {transcript && (
            <div className="transcript" aria-label="음성 인식 결과">
              <h3>실시간 음성 인식 중</h3>
              <p>
                {transcript.split(' ').map((word, index) => (
                  <span key={index}>{word} </span>
                ))}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SpeakingPractice;
