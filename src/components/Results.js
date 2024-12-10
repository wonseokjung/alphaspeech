import React, { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { analyzeResponses } from '../utils/openaiService';
import './Results.css';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const Results = ({ responses }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAIAnalysis = async () => {
      try {
        const result = await analyzeResponses(responses);
        setAnalysis(result);
      } catch (error) {
        console.error('AI 분석 중 오류 발생:', error);
        setError('분석 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (responses && responses.length > 0) {
      getAIAnalysis();
    }
  }, [responses]);

  // 레이더 차트 데이터
  const radarData = {
    labels: ['문제파악능력', '내용구성력', '문제해결능력', '논리력', '전달력', '상호작용능력'],
    datasets: [
      {
        label: '역량 점수',
        data: [87, 88, 87, 86, 89, 94],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
      }
    ]
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  if (loading) return <div className="loading">분석 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="results-container">
      <h1 className="results-title">알파세대 커뮤니케이션 능력평가 결과</h1>
      
      <div className="results-header">
        <div className="results-info">
          <p>평가 일시: {new Date().toLocaleDateString()}</p>
          <p>평가 ID: {Math.random().toString(36).substring(2, 11)}</p>
        </div>
        <div className="results-summary">
          <div className="summary-item">
            <h3>종합 점수</h3>
            <p className="score">89점</p>
          </div>
          <div className="summary-item">
            <h3>종합 등급</h3>
            <p className="grade">A</p>
          </div>
          <div className="summary-item">
            <h3>최고 역량</h3>
            <p>상호작용능력</p>
          </div>
        </div>
      </div>

      <div className="results-content">
        <div className="radar-chart">
          <h2>역량 프로파일</h2>
          <Radar data={radarData} options={radarOptions} />
        </div>

        <div className="competency-analysis">
          <h2>역량별 상세 분석</h2>
          
          <div className="competency-item">
            <h3>상호작용능력 <span className="score">94점</span></h3>
            <p className="strength">💪 타인의 감정을 이해하고 공감하는 능력이 우수합니다.</p>
            <p className="improvement">💡 더 다양한 공감 표현 방법을 활용하면 좋을 것 같아요.</p>
          </div>

          <div className="competency-item">
            <h3>전달력 <span className="score">89점</span></h3>
            <p className="strength">💪 자신의 의견을 명확하고 설득력 있게 전달하는 능력이 뛰어납니다.</p>
            <p className="improvement">💡 청중의 반응을 더 적극적으로 살피고 반영하면 좋을 것 같아요.</p>
          </div>

          <div className="competency-item">
            <h3>내용구성력 <span className="score">88점</span></h3>
            <p className="strength">💪 생각을 체계적으로 정리하고 표현하는 능력이 좋습니다.</p>
            <p className="improvement">💡 더 풍부한 예시와 구체적인 설명을 추가하면 좋을 것 같아요.</p>
          </div>

          <div className="competency-item">
            <h3>문제해결능력 <span className="score">87점</span></h3>
            <p className="strength">💪 창의적이고 실용적인 해결방안을 제시하는 능력이 돋보입니다.</p>
            <p className="improvement">💡 다양한 대안을 비교 분석하는 과정을 더 보여주면 좋을 것 같아요.</p>
          </div>

          <div className="competency-item">
            <h3>문제파악능력 <span className="score">87점</span></h3>
            <p className="strength">💪 상황을 정확하게 인식하고 핵심 문제를 파악하는 능력이 뛰어납니다.</p>
            <p className="improvement">💡 다양한 관점에서 문제를 바라보는 연습을 하면 더욱 좋을 것 같아요.</p>
          </div>

          <div className="competency-item">
            <h3>논리력 <span className="score">86점</span></h3>
            <p className="strength">💪 주장과 근거를 명확하게 연결하여 설명하는 능력이 우수합니다.</p>
            <p className="improvement">💡 더 다양한 관점에서의 논리적 분석을 추가하면 좋을 것 같아요.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results; 