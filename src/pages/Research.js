import React from 'react';
import { motion } from 'framer-motion';

function Research() {
  return (
    <div className="page-container research-container">
      <motion.div 
        className="content-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>연구자료</h1>

        <div className="research-section">
          <h2>AI 리터러시 교육의 중요성</h2>
          <p>
            4차 산업혁명 시대에서 AI 리터러시는 필수적인 역량으로 자리잡고 있습니다.
            특히 초등학생 시기의 AI 교육은 미래 사회를 준비하는 데 매우 중요한 역할을 합니다.
          </p>
        </div>

        <div className="methodology">
          <h2>교육 방법론</h2>
          <p>
            놀잇의 AI 리터러시 프로그램은 게이미피케이션(Gamification)을 통한 
            학습 동기 부여와 실제 AI 기술 체험을 결합한 혁신적인 교육 방식을 
            채택하고 있습니다.
          </p>
          <h3>주요 교육 영역</h3>
          <ul>
            <li>AI 기초 개념 이해</li>
            <li>AI 윤리와 책임</li>
            <li>AI 활용 능력</li>
            <li>AI 기술 체험</li>
            <li>AI 미래 이해</li>
          </ul>
        </div>

        <div className="research-results">
          <h2>연구 결과</h2>
          <div className="result-item">
            <h3>학습 효과</h3>
            <p>
              게임형 학습 방식 적용 시 전통적인 교육 방식 대비 
              학습 이해도가 평균 32% 향상되었으며, 
              학습 지속성이 45% 증가했습니다.
            </p>
          </div>
          <div className="result-item">
            <h3>흥미도</h3>
            <p>
              프로그램 참여 학생들의 93%가 AI에 대한 
              관심과 흥미가 증가했다고 응답했습니다.
            </p>
          </div>
        </div>

        <div className="future-research">
          <h2>향후 연구 방향</h2>
          <ul>
            <li>개인화된 학습 경로 개발</li>
            <li>AI 교육의 장기적 효과 연구</li>
            <li>연령별 최적화된 커리큘럼 개발</li>
            <li>AI 교육과 창의성 발달 관계 연구</li>
          </ul>
        </div>

        <div className="publications">
          <h2>관련 논문</h2>
          <ul>
            <li>초등학생 대상 AI 교육의 효과성 연구 (2023)</li>
            <li>게이미피케이션을 활용한 AI 교육 방법론 (2023)</li>
            <li>AI 리터러시와 미래 역량 상관관계 분석 (2022)</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default Research; 