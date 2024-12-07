import React from 'react';
import { motion } from 'framer-motion';

function About() {
  return (
    <div className="page-container about-container">
      <motion.div 
        className="content-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>놀잇(Noit) AI 리터러시</h1>
        
        <div className="video-section">
          <h2>프로그램 소개 영상</h2>
          <div className="video-container">
            <iframe
              width="100%"
              height="500"
              src="https://www.youtube.com/embed/gDM8CdxCj3I"
              title="AI 리터러시 프로그램 소개"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="company-intro">
          <h2>회사 소개</h2>
          <p>
            놀잇(Noit)은 중앙대학교 학사, 석사 출신의 최다은 대표가 설립한 
            교육 혁신 기업입니다. 우리는 아이들이 미래 사회의 주역으로 성장할 수 있도록
            혁신적인 교육 솔루션을 제공합니다.
          </p>
          <div className="founder-info">
            <h3>대표 소개</h3>
            <ul>
              <li>최다은 대표</li>
              <li>중앙대학교 컴퓨터공학 학사</li>
              <li>중앙대학교 인공지능 석사</li>
              <li>전) 삼성전자 소프트웨어 엔지니어</li>
              <li>현) 한국교육학회 AI교육분과 위원</li>
              <li>교육부 AI교육 자문위원</li>
            </ul>
          </div>
        </div>

        <div className="program-intro">
          <h2>프로그램 소개</h2>
          <p>
            AI 리터러시는 초등학생들을 위한 특별한 인공지능 교육 프로그램입니다. 
            게임과 같은 재미있는 상호작용을 통해 아이들이 자연스럽게 
            인공지능의 개념과 원리를 이해할 수 있도록 설계되었습니다.
          </p>
          <div className="program-details">
            <h3>교육 내용</h3>
            <ul>
              <li>
                <strong>AI 기초 이해:</strong> 인공지능의 기본 개념과 작동 원리
              </li>
              <li>
                <strong>AI 윤리:</strong> 인공지능 사용에 있어서의 윤리적 고려사항
              </li>
              <li>
                <strong>AI 활용:</strong> 실생활에서의 인공지능 활용 사례
              </li>
              <li>
                <strong>AI 체험:</strong> 직접 체험해보는 인공지능 기술
              </li>
              <li>
                <strong>AI 미래:</strong> 인공지능이 가져올 미래 사회의 변화
              </li>
            </ul>
          </div>
        </div>

        <div className="features">
          <h2>주요 특징</h2>
          <div className="feature-grid">
            <div className="feature-item">
              <h3>게임형 학습 시스템</h3>
              <p>재미있는 게임 요소를 통해 자연스러운 학습 유도</p>
            </div>
            <div className="feature-item">
              <h3>맞춤형 AI 교육</h3>
              <p>학습자의 수준과 진도에 맞춘 개별화된 커리큘럼</p>
            </div>
            <div className="feature-item">
              <h3>실시간 피드백</h3>
              <p>AI가 제공하는 즉각적인 학습 피드백</p>
            </div>
            <div className="feature-item">
              <h3>진도 관리</h3>
              <p>체계적인 학습 진도 관리 및 성취도 분석</p>
            </div>
          </div>
        </div>

        <div className="education-method">
          <h2>교육 방식</h2>
          <ul>
            <li>
              <strong>체험 중심:</strong> 직접 체험하며 배우는 실습 위주의 교육
            </li>
            <li>
              <strong>프로젝트 기반:</strong> 실제 문제 해결을 통한 학습
            </li>
            <li>
              <strong>단계별 학습:</strong> 기초부터 심화까지 체계적인 커리큘럼
            </li>
            <li>
              <strong>상호작용:</strong> AI와의 실시간 상호작용을 통한 학습
            </li>
          </ul>
        </div>

        <div className="vision">
          <h2>비전</h2>
          <p>
            모든 아이들이 인공지능을 쉽고 재미있게 이해하고, 
            미래 사회의 주역으로 성장할 수 있도록 돕는 것이 우리의 목표입니다.
            놀잇은 단순한 교육을 넘어, 아이들이 AI 시대를 이끌어갈 수 있는 
            창의적이고 혁신적인 인재로 성장할 수 있도록 지원합니다.
          </p>
          <div className="vision-points">
            <h3>우리가 꿈꾸는 미래</h3>
            <ul>
              <li>AI 리터러시 교육의 표준을 제시하는 선도 기업</li>
              <li>모든 아이들에게 평등한 AI 교육 기회 제공</li>
              <li>재미있고 효과적인 교육 방법의 혁신</li>
              <li>글로벌 AI 교육 플랫폼으로의 성장</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default About; 