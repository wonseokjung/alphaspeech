import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Results.css';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { answer, dominantEmotion } = location.state || {};

  // 감정에 따른 피드백 생성
  const getFeedback = (emotion) => {
    const feedbacks = {
      happy: {
        title: '긍정적인 감정 표현이 돋보여요! 👏',
        description: '행복한 감정을 잘 표현하고 있어요. 이런 긍정적인 태도는 소통에 매우 도움이 됩니다.',
        tips: [
          '긍정적인 감정은 다른 사람에게도 좋은 영향을 줄 수 있어요.',
          '행복한 감정을 나누는 것은 관계를 더 돈독하게 만들어요.',
          '즐거운 마음으로 대화하면 더 좋은 결과를 얻을 수 있어요.'
        ]
      },
      sad: {
        title: '감정을 잘 표현하고 있어요 💙',
        description: '슬픈 감정도 자연스러운 감정이에요. 이런 감정을 인식하고 표현하는 것은 매우 중요해요.',
        tips: [
          '슬픈 감정을 기지 않고 표현하는 것은 건강한 방법이에요.',
          '필요할 때는 주변 사람들에게 도움을 요청해보세요.',
          '감정을 표현하면서 해결책을 찾아보는 것도 좋아요.'
        ]
      },
      angry: {
        title: '감정을 잘 인식하고 있어요 💪',
        description: '화난 감정을 인식하는 것은 중요해요. 이제 이 감정을 건강하게 표현하는 방법을 찾아보아요.',
        tips: [
          '깊게 숨을 쉬면서 감정을 진정시켜보세요.',
          '화가 난 이유를 차분히 설명해보세요.',
          '긍정적인 방법으로 감정을 표현하는 연습을 해보세요.'
        ]
      },
      neutral: {
        title: '차분한 태도로 잘 표현했어요 ✨',
        description: '감정을 안정적으로 유지하며 대화하고 있어요. 이런 태도는 효과적인 소통에 도움이 됩니다.',
        tips: [
          '침착한 태도로 대화하면 더 명확하게 의사전달할 수 있어요.',
          '상대방의 감정도 잘 인식할 수 있어요.',
          '안정적인 감정 상태를 유지하면서도 공감을 표현해보세요.'
        ]
      },
      fearful: {
        title: '용기있게 감정을 표현했어요 🌟',
        description: '두려운 감정을 인식하고 표현하는 것은 매우 용감한 행동이에요.',
        tips: [
          '두려움을 느끼는 것은 자연스러운 일이에요.',
          '작은 용기로도 큰 변화를 만들 수 있어요.',
          '차근차근 도전하면서 자신감을 키워보세요.'
        ]
      },
      disgusted: {
        title: '솔직하게 감정을 표현했어요 💫',
        description: '불쾌한 감정도 인식하고 표현할 줄 아는 것은 중요해요.',
        tips: [
          '부정적인 감정도 건강하게 표현하는 방법이 있어요.',
          '상황을 객관적으로 바라보려고 노력해보세요.',
          '불편한 감정을 적절하게 전달하는 연습을 해보세요.'
        ]
      },
      surprised: {
        title: '감정을 생생하게 표현했어요 ⭐',
        description: '놀람의 감정을 잘 표현하고 있어요. 이런 자연스러운 반응은 진정성 있는 소통을 만들어요.',
        tips: [
          '새로운 상황에 대한 반응을 자연스럽게 표현하는 것은 좋아요.',
          '예상치 못한 상황에서도 침착함을 유지하려고 노력해보세요.',
          '다양한 상황에 대처하는 능력을 기를 수 있어요.'
        ]
      }
    };

    return feedbacks[emotion?.type] || feedbacks.neutral;
  };

  const feedback = getFeedback(dominantEmotion);

  // 도넛 차트 데이터
  const doughnutData = {
    labels: ['주요 감정', '기타'],
    datasets: [{
      data: [dominantEmotion?.score || 0, 100 - (dominantEmotion?.score || 0)],
      backgroundColor: ['#00ff88', 'rgba(0, 255, 136, 0.1)'],
      borderColor: ['#00ff88', 'rgba(0, 255, 136, 0.1)'],
      borderWidth: 1
    }]
  };

  // 바 차트 데이터
  const barData = {
    labels: ['행복', '슬픔', '분노', '중립', '두려움', '혐오', '놀람'],
    datasets: [{
      label: '감정 분포',
      data: [65, 45, 30, 25, 20, 15, 10], // 실제 데이터로 교체 필요
      backgroundColor: [
        'rgba(0, 255, 136, 0.8)',
        'rgba(0, 225, 255, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(75, 192, 192, 0.8)'
      ],
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#fff'
        }
      }
    },
    scales: {
      y: {
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="report-meta">
          <h1>AI 감정 분석 리포트</h1>
          <div className="report-info">
            <span>분석 일시: {new Date().toLocaleDateString('ko-KR')}</span>
            <span>리포트 ID: {Math.random().toString(36).substr(2, 9)}</span>
          </div>
        </div>
        <div className="report-summary">
          <div className="summary-box">
            <h3>주요 감정</h3>
            <p className="highlight">{dominantEmotion?.name || '중립'}</p>
          </div>
          <div className="summary-box">
            <h3>감정 강도</h3>
            <p className="highlight">{dominantEmotion?.score || 0}%</p>
          </div>
          <div className="summary-box">
            <h3>전반적 평가</h3>
            <p className="highlight">{dominantEmotion?.score > 70 ? '매우 명확' : '보통'}</p>
          </div>
        </div>
      </div>

      <div className="results-content">
        <section className="analysis-section">
          <h2>1. 감정 분석 상세</h2>
          <div className="emotion-analysis">
            <div className="charts-container">
              <div className="chart-box">
                <h3>주요 감정 점수</h3>
                <div className="doughnut-chart">
                  <Doughnut data={doughnutData} options={{
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: '#fff'
                        }
                      }
                    }
                  }} />
                </div>
              </div>
              <div className="chart-box">
                <h3>감정 분포도</h3>
                <div className="bar-chart">
                  <Bar data={barData} options={chartOptions} />
                </div>
              </div>
            </div>
            <div className="emotion-score">
              <div className="emotion-label">
                {dominantEmotion?.name || '중립'}
              </div>
              <div className="score-bar">
                <div 
                  className="score-fill"
                  style={{ width: `${dominantEmotion?.score || 0}%` }}
                />
              </div>
              <div className="score-value">{dominantEmotion?.score || 0}%</div>
            </div>
          </div>
        </section>

        <section className="analysis-section">
          <h2>2. 전문가 피드백</h2>
          <div className="feedback-content">
            <div className="feedback-header">
              <span className="feedback-icon">💡</span>
              <h3>{feedback.title}</h3>
            </div>
            <p className="feedback-description">{feedback.description}</p>
            <div className="tips-section">
              <h4>개선을 위한 실천 방안</h4>
              <ul className="tips-list">
                {feedback.tips.map((tip, index) => (
                  <li key={index}>
                    <span className="tip-number">{index + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="analysis-section">
          <h2>3. 답변 분석</h2>
          <div className="answer-analysis">
            <h4>원문</h4>
            <div className="answer-box">
              <p>{answer || '답변이 기록되지 않았습니다.'}</p>
            </div>
          </div>
        </section>

        <section className="analysis-section recommended-program">
          <h2>4. 추천 교육 프로그램</h2>
          <div className="program-content">
            <div className="program-header">
              <span className="program-icon">🎓</span>
              <h3>감정 지능 향상을 위한 추천 콘텐츠</h3>
            </div>
            <div className="video-container">
              <iframe
                src="https://www.youtube.com/embed/Yzob_aL2Gbo"
                title="추천 교육 프로그램"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="program-video"
              ></iframe>
            </div>
            <div className="program-description">
              <h4>프로그램 설명</h4>
              <p>이 교육 프로그램은 당신의 감정 분석 결과를 바탕으로 맞춤 추천된 콘텐츠입니다. 
                 영상을 통해 감정 지능을 향상시키고 더 나은 소통 방법을 배워보세요.</p>
            </div>
          </div>
        </section>
      </div>

      <div className="action-buttons">
        <button 
          className="report-button"
          onClick={() => window.print()}
        >
          리포트 저장하기
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