import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SpeakingPractice from '../components/SpeakingPractice';
import './Speaking.css';
import { videoQuestions } from '../data/videoQuestions';

function Speaking() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [direction, setDirection] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supportSpeechRecognition, setSupportSpeechRecognition] = useState(true);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const [recognition, setRecognition] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: ''
  });

  // 년/월/일 옵션 생성
  const years = Array.from({length: 100}, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({length: 12}, (_, i) => i + 1);
  const days = Array.from({length: 31}, (_, i) => i + 1);

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
        if (isRecording) {
          try {
            sr.start();
          } catch (error) {
            console.log('Failed to restart recording:', error);
            setIsRecording(false);
          }
        }
      };

      sr.onerror = (event) => {
        console.log('Speech Recognition Error:', event.error);
        if (event.error === 'not-allowed') {
          alert('마이크 권한을 허용해주세요.');
          setIsRecording(false);
        }
      };

      setRecognition(sr);

      return () => {
        sr.abort();
        setIsRecording(false);
        setTranscript('');
      };
    } else {
      setSupportSpeechRecognition(false);
    }
  }, []);

  useEffect(() => {
    if (videoRef.current && isStarted) {
      const handleTimeUpdate = () => {
        if (videoRef.current) {
          const video = videoRef.current;
          if (video.currentTime >= videoQuestions[currentStep].endTime) {
            video.pause();
            video.currentTime = videoQuestions[currentStep].startTime;
          }
        }
      };

      const handleMetadata = () => {
        if (videoRef.current) {
          videoRef.current.currentTime = videoQuestions[currentStep].startTime;
          videoRef.current.play().catch(error => {
            console.log("자동 재생 실패:", error);
          });
        }
      };

      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      videoRef.current.addEventListener('loadedmetadata', handleMetadata);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          videoRef.current.removeEventListener('loadedmetadata', handleMetadata);
        }
      };
    }
  }, [currentStep, isStarted]);

  useEffect(() => {
    if (videoRef.current) {
      try {
        videoRef.current.play().catch(error => {
          console.error("비디오 재생 오류:", error);
          // 사용자에게 오류 메시지 표시
        });
      } catch (error) {
        console.error("비디오 로딩 오류:", error);
      }
    }
  }, [currentStep, isStarted]);

  const handleResponseComplete = useCallback((response) => {
    setResponses(prev => [...prev, response]);
    if (currentStep < videoQuestions.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    } else {
      navigate('/results', { state: { responses } });
    }
  }, [currentStep, responses, navigate]);

  const handleStart = () => {
    setIsStarted(true);
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("재생 시작 실패:", error);
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
      setTranscript('');
    }
  };

  const toggleRecording = useCallback(() => {
    if (!recognition) return;

    try {
      if (isRecording) {
        recognition.stop();
        handleResponseComplete({ transcript });
        setIsRecording(false);
        setTranscript('');
      } else {
        recognition.abort();
        recognition.start();
        setIsRecording(true);
      }
    } catch (error) {
      console.log('Speech Recognition Error:', error);
      setIsRecording(false);
      setTranscript('');
    }
  }, [isRecording, recognition, transcript, handleResponseComplete]);

  const slideVariants = useMemo(() => ({
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const birthDate = `${userInfo.birthYear}-${String(userInfo.birthMonth).padStart(2, '0')}-${String(userInfo.birthDay).padStart(2, '0')}`;
    setIsStarted(true);
  };

  return (
    <div className="speaking-page">
      
      {!isStarted && (
        <div className="start-container">
          <h2>준비가 되셨나요?</h2>
          <form onSubmit={handleSubmit} className="user-info-form">
            <div className="form-group">
              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                value={userInfo.name}
                onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group birth-date-group">
              <label>생년월일</label>
              <div className="birth-date-selects">
                <select
                  value={userInfo.birthYear}
                  onChange={(e) => setUserInfo({...userInfo, birthYear: e.target.value})}
                  required
                >
                  <option value="">년도</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}년</option>
                  ))}
                </select>
                <select
                  value={userInfo.birthMonth}
                  onChange={(e) => setUserInfo({...userInfo, birthMonth: e.target.value})}
                  required
                >
                  <option value="">월</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}월</option>
                  ))}
                </select>
                <select
                  value={userInfo.birthDay}
                  onChange={(e) => setUserInfo({...userInfo, birthDay: e.target.value})}
                  required
                >
                  <option value="">일</option>
                  {days.map(day => (
                    <option key={day} value={day}>{day}일</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">성별</label>
              <select
                id="gender"
                value={userInfo.gender}
                onChange={(e) => setUserInfo({...userInfo, gender: e.target.value})}
                required
              >
                <option value="">선택하세요</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
            <button type="submit" className="start-button">
              시작하기
            </button>
          </form>
        </div>
      )}

      {isStarted && (
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="question-container"
          >
            <h2>질문 {currentStep + 1}</h2>
            <p>{videoQuestions[currentStep].question}</p>
          </motion.div>
        </AnimatePresence>
      )}
      
      {isStarted && (
        <div className="practice-container">
          <div className="videos-section">
            <div className="video-wrapper dani-video">
              <video 
                ref={videoRef}
                src={videoQuestions[currentStep].videoUrl} 
                width="400"
                height="300"
                controls
                playsInline
                aria-label="강의 비디오"
              >
                <track 
                  kind="captions" 
                  src={`/captions/${currentStep + 1}.vtt`} 
                  srcLang="ko" 
                  label="한국어" 
                />
              </video>
            </div>
            <div className="video-wrapper user-video">
              <SpeakingPractice 
                isRecording={isRecording}
                onTranscriptChange={setTranscript}
              />
            </div>
          </div>

          <div className="controls-section">
            <div className={`navigation-controls ${isRecording ? 'recording' : ''}`}>
              {!isRecording && (
                <button 
                  className={`nav-button ${currentStep === 0 ? 'disabled' : ''}`}
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  이전 질문
                </button>
              )}
              <button
                className={`nav-button ${isRecording ? 'recording' : ''}`}
                onClick={toggleRecording}
                disabled={!supportSpeechRecognition}
              >
                {isRecording ? '말하기 멈추기' : '말하기 시작'}
              </button>
            </div>

            {isRecording && transcript && (
              <div className="realtime-transcript">
                <h3>실시간 음성 인식 중...</h3>
                <p>{transcript}</p>
              </div>
            )}

            <div className="progress-indicator">
              <div className="progress-text">
                {currentStep + 1} / {videoQuestions.length}
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((currentStep + 1) / videoQuestions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Speaking; 