import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Results.css';
import { Doughnut, Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement
} from 'chart.js';
import { analyzeResponses, formatAnalysis } from '../utils/openaiService';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement
);

const Results = () => {
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { responses } = location.state || { responses: [] };

  useEffect(() => {
    const getAIAnalysis = async () => {
      if (responses && responses.length > 0) {
        setIsLoading(true);
        try {
          const analysis = await analyzeResponses(responses);
          const formattedAnalysis = formatAnalysis(analysis);
          setAiAnalysis(formattedAnalysis);
        } catch (error) {
          console.error('AI 분석 중 오류 발생:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getAIAnalysis();
  }, [responses]);

  // AI 분석 결과 렌더링
  const renderAIAnalysis = () => {
    if (isLoading) {
      return (
        <section className="analysis-section ai-analysis">
          <h2>AI 분석 중...</h2>
          <div className="loading-spinner"></div>
        </section>
      );
    }

    if (!aiAnalysis) return null;

    return (
      <section className="analysis-section ai-analysis">
        <h2>AI 상세 분석 리포트</h2>
        <div className="final-grade">
          <h3>최종 등급</h3>
          <div className={`grade-badge grade-${aiAnalysis.finalGrade?.toLowerCase()}`}>
            {aiAnalysis.finalGrade || 'N/A'}
          </div>
        </div>
        <div className="ai-analysis-content">
          <div className="analysis-section">
            <h3>📝 문항별 평가</h3>
            <div className="analysis-text">{aiAnalysis.itemAnalysis}</div>
          </div>
          
          <div className="analysis-section">
            <h3>💡 종합 역량 평가</h3>
            <div className="analysis-text">{aiAnalysis.competencyAnalysis}</div>
          </div>
          
          <div className="analysis-section">
            <h3>🎯 개선을 위한 제안</h3>
            <div className="analysis-text">{aiAnalysis.improvements}</div>
          </div>
          
          <div className="analysis-section">
            <h3>✨ 종합 의견</h3>
            <div className="analysis-text">{aiAnalysis.conclusion}</div>
          </div>

          <div className="analysis-section special-advice">
            <h3>💌 선생님의 특별 조언</h3>
            <div className="advice-container">
              <div className="teacher-message">
                <div className="message-header">
                  <span className="teacher-icon">👩‍🏫</span>
                  <span className="message-title">선생님의 따뜻한 조언</span>
                </div>
                <div className="message-content">
                  {aiAnalysis.specialAdvice}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // 평가 항목별 점수 계산 (예시)
  const calculateScores = () => {
    // 5개 문항에 대한 점수 계산
    const questionScores = responses.map((response, index) => {
      // 각 문항별 평가 기준에 따라 점수 계산
      if (index === 0) { // 1번 문항: 아이폰 설득
        return {
          problemAnalysis: 85,
          problemSolving: 88,
          logicalThinking: 82,
          communication: 90
        };
      } else if (index === 1) { // 2번 문항: 다이어트 고민
        return {
          contentOrganization: 85,
          empathy: 92,
          communication: 88
        };
      } else if (index === 2) { // 3번 문항: 크리스마스 선물
        return {
          contentOrganization: 90,
          empathy: 95,
          communication: 87
        };
      } else if (index === 3) { // 4번 문항: 용돈 협상
        return {
          problemAnalysis: 88,
          problemSolving: 85,
          logicalThinking: 90,
          communication: 92
        };
      } else if (index === 4) { // 5번 문항: 생일파티 거절
        return {
          contentOrganization: 87,
          empathy: 93,
          communication: 89
        };
      }
      return {};
    });

    // 각 능력별 평균 점수 계산
    const totalScores = questionScores.reduce((acc, curr) => {
      Object.keys(curr).forEach(key => {
        if (!acc[key]) acc[key] = [];
        acc[key].push(curr[key]);
      });
      return acc;
    }, {});

    return {
      problemAnalysis: Math.round(totalScores.problemAnalysis?.reduce((a, b) => a + b, 0) / totalScores.problemAnalysis?.length) || 0,
      contentOrganization: Math.round(totalScores.contentOrganization?.reduce((a, b) => a + b, 0) / totalScores.contentOrganization?.length) || 0,
      problemSolving: Math.round(totalScores.problemSolving?.reduce((a, b) => a + b, 0) / totalScores.problemSolving?.length) || 0,
      logicalThinking: Math.round(totalScores.logicalThinking?.reduce((a, b) => a + b, 0) / totalScores.logicalThinking?.length) || 0,
      communication: Math.round(totalScores.communication?.reduce((a, b) => a + b, 0) / totalScores.communication?.length) || 0,
      empathy: Math.round(totalScores.empathy?.reduce((a, b) => a + b, 0) / totalScores.empathy?.length) || 0
    };
  };

  const scores = calculateScores();

  // 레이더 차트 데이터
  const radarData = {
    labels: [
      '문제파악능력',
      '내용구성력',
      '문제해결능력',
      '논리력',
      '전달력',
      '상호작용능력'
    ],
    datasets: [
      {
        label: '능력 평가 점수',
        data: [
          scores.problemAnalysis,
          scores.contentOrganization,
          scores.problemSolving,
          scores.logicalThinking,
          scores.communication,
          scores.empathy
        ],
        backgroundColor: 'rgba(44, 123, 229, 0.2)',
        borderColor: '#2c7be5',
        borderWidth: 2,
        pointBackgroundColor: '#2c7be5',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#2c7be5'
      }
    ]
  };

  // 평가 항목별 피드백
  const getFeedback = () => {
    return {
      communication: {
        title: '전달력',
        score: scores.communication,
        strength: '자신의 의견을 명확하고 설득력 있게 전달하는 능력이 뛰어납니다.',
        improvement: '청중의 반응을 더 적극적으로 살피고 반영하면 좋을 것 같아요.',
        tips: [
          '목소리의 톤과 속도를 상황에 맞게 조절하세요.',
          '적절한 제스처와 표정으로 메시지를 강화하세요.',
          '핵심 메시지를 강조하고 반복하는 전략을 활용하세요.'
        ]
      },
      empathy: {
        title: '상호작용능력',
        score: scores.empathy,
        strength: '타인의 감정을 이해하고 공감하는 능력이 우수합니다.',
        improvement: '더 다양한 공감 표현 방법을 활용하면 좋을 것 같아요.',
        tips: [
          '상대방의 말을 경청하고 적절한 반응을 보여주세요.',
          '상대방의 입장에서 생각해보는 습관을 기르세요.',
          '긍정적인 피드백과 격려의 말을 적극적으로 사용하세요.'
        ]
      }
    };
  };

  const feedback = getFeedback();

  // 종합 평가 점수 계산
  const calculateTotalScore = () => {
    const total = Object.values(scores).reduce((acc, curr) => acc + curr, 0);
    return Math.round(total / Object.keys(scores).length);
  };

  const totalScore = calculateTotalScore();

  // 종합 등급 결정
  const getGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="report-meta">
          <h1>알파세대 커뮤니케이션 능력평가 결과</h1>
          <div className="report-info">
            <span>평가 일시: {new Date().toLocaleDateString('ko-KR')}</span>
            <span>평가 ID: {Math.random().toString(36).substr(2, 9)}</span>
          </div>
        </div>
        <div className="report-summary">
          <div className="summary-box">
            <h3>종합 점수</h3>
            <p className="highlight">{totalScore}점</p>
          </div>
          <div className="summary-box">
            <h3>종합 등급</h3>
            <p className="highlight">{getGrade(totalScore)}</p>
          </div>
          <div className="summary-box">
            <h3>최고 역량</h3>
            <p className="highlight">
              {Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0] === 'problemAnalysis' ? '문제파악능력' :
               Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0] === 'contentOrganization' ? '내용구성력' :
               Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0] === 'problemSolving' ? '문제해결능력' :
               Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0] === 'logicalThinking' ? '논리력' :
               Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0] === 'communication' ? '전달력' : '상호작용능력'}
            </p>
          </div>
        </div>
      </div>

      <div className="results-content">
        <section className="analysis-section">
          <h2>1. 종합 능력 분석</h2>
          <div className="radar-chart-container">
            <Radar data={radarData} />
          </div>
        </section>

        <section className="analysis-section">
          <h2>2. 항목별 상세 분석</h2>
          <div className="detailed-analysis">
            {Object.values(feedback).map((item, index) => (
              <div key={index} className="analysis-item">
                <div className="analysis-header">
                  <h3>{item.title}</h3>
                  <div className="score-badge">{item.score}점</div>
                </div>
                <div className="analysis-content">
                  <div className="strength">
                    <h4>💪 강점</h4>
                    <p>{item.strength}</p>
                  </div>
                  <div className="improvement">
                    <h4>💡 개선점</h4>
                    <p>{item.improvement}</p>
                  </div>
                  <div className="tips">
                    <h4>✨ 실천 방안</h4>
                    <ul>
                      {item.tips.map((tip, tipIndex) => (
                        <li key={tipIndex}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="analysis-section">
          <h2>3. 답변 분석</h2>
          <div className="answer-analysis">
            {responses?.slice(0, 5).map((response, index) => (
              <div key={index} className="response-item">
                <h4>문항 {index + 1} 답변</h4>
                <div className="answer-box">
                  <p>{response.transcript || '답변이 기록되지 않았습니다.'}</p>
                </div>
                <div className="evaluation-items">
                  <h5>평가 항목</h5>
                  <p>{index === 0 ? 
                      '문제파악능력/문제해결능력/논리력/전달력' : 
                      index === 1 ?
                      '내용구성력/상호작용능력/전달력' :
                      index === 2 ?
                      '내용구성력/상호작용능력/전달력' :
                      index === 3 ?
                      '문제파악능력/문제해결능력/논리력/전달력' :
                      '내용구성력/상호작용능력/전달력'
                    }</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="analysis-section recommended-program">
          <h2>4. 맞춤형 학습 제안</h2>
          <div className="program-content">
            <div className="program-header">
              <span className="program-icon">🎯</span>
              <h3>역량 강화를 위한 추천 학습</h3>
            </div>
            <div className="recommended-courses">
              <div className="course-item">
                <h4>🗣️ 효과적인 커뮤니케이션 기술</h4>
                <p>상황에 맞는 의사소통 방법과 설득력 있는 표현 기술을 배워봅니다.</p>
              </div>
              <div className="course-item">
                <h4>🤝 공감능력 향상 워크샵</h4>
                <p>다양한 상황에서의 공감 표현과 적절한 반응 방법을 연습합니다.</p>
              </div>
              <div className="course-item">
                <h4>🧠 논리적 사고력 트레이닝</h4>
                <p>체계적인 사고와 명확한 논리 전개 방법을 학습합니다.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {renderAIAnalysis()}

      <div className="action-buttons">
        <button 
          className="report-button"
          onClick={() => window.print()}
        >
          평가서 저장하기
        </button>
        <button 
          className="retry-button"
          onClick={() => navigate('/assessment')}
        >
          다시 평가하기
        </button>
        <button 
          className="home-button"
          onClick={() => navigate('/')}
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
};

export default Results; 