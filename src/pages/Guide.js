import React from 'react';
import { motion } from 'framer-motion';

function Guide() {
  return (
    <div className="page-container guide-container">
      <motion.div 
        className="content-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>이용가이드</h1>
        
        <div className="guide-section">
          <h2>시작하기</h2>
          <div className="step">
            <h3>1. 기본 정보 입력</h3>
            <p>
              자녀의 생년월일과 성별을 입력하여 맞춤형 평가를 제공받으세요.
              입력하신 정보는 연령대별 사회성 발달 수준 분석에만 활용됩니다.
            </p>
          </div>

          <div className="step">
            <h3>2. 동작 인식</h3>
            <p>
              카메라를 통해 자녀의 표정과 동작을 인식하여 초기 사회성을 평가합니다.
              화면에 보이는 지시에 따라 간단한 동작을 수행해보세요.
            </p>
          </div>

          <div className="step">
            <h3>3. 평가 진행</h3>
            <p>
              다양한 상황에서의 사회적 행동과 반응을 평가하는 문항들에 답변해주세요.
              자녀의 평소 행동과 가장 비슷한 답변을 선택하시면 됩니다.
            </p>
          </div>

          <div className="step">
            <h3>4. 결과 확인</h3>
            <p>
              평가가 끝나면 자녀의 사회성 발달 수준에 대한 상세한 분석 결과를 제공해드립니다.
              각 영역별 발달 수준과 개선을 위한 맞춤형 조언을 확인하실 수 있습니다.
            </p>
          </div>
        </div>

        <div className="tips-section">
          <h2>평가 팁</h2>
          <ul>
            <li>자녀가 편안한 환경에서 평가를 진행하세요.</li>
            <li>카메라 사용 시 밝은 조명이 필요합니다.</li>
            <li>각 문항을 천천히 읽고 신중하게 답변하세요.</li>
            <li>결과를 바탕으로 자녀의 사회성 발달을 지원하세요.</li>
            <li>정기적인 평가로 발달 과정을 모니터링하세요.</li>
          </ul>
        </div>

        <div className="requirements">
          <h2>시스템 요구사항</h2>
          <ul>
            <li>웹캠이 있는 PC 또는 노트북</li>
            <li>크롬, 사파리, 파이어폭스 등 최신 웹 브라우저</li>
            <li>안정적인 인터넷 연결</li>
            <li>권장 해상도: 1280 x 720 이상</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default Guide; 