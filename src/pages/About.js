import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const qualifications = [
    { icon: "👩‍🏫", title: "유치원 정교사 2급" },
    { icon: "👶", title: "보육교사 자격증 2급" },
    { icon: "💭", title: "교류분석(TACA) 상담사" },
    { icon: "👨‍👩‍👧‍👦", title: "교류분석(TACA) 부모교육 전문가" },
    { icon: "🎮", title: "놀이치료/상담사 2급" },
    { icon: "❤️", title: "아동인권옹호가" },
    { icon: "👩‍🍳", title: "아동 요리사" }
  ];

  const education = [
    {
      school: "서울 중앙대학교 대학원",
      degree: "일반대학원 유아교육교육학 석사",
      icon: "🎓"
    },
    {
      school: "서울 중앙대학교",
      degree: "사범대학 유아교육 교육학 학사",
      icon: "🏫"
    }
  ];

  const research = [
    {
      title: "정서표현에 기반한 인성교육활동이 유아의 자아존중감과 마음이론 발달에 미치는 영향",
      year: "2017"
    },
    {
      title: "유아의 창의성과 지적능력 공감능력 및 그리기 표상능력 간의 관계분석",
      year: "2017"
    }
  ];

  const productions = [
    { title: "다니유치원 '다니'", icon: "🌟" },
    { title: "유라야놀자 '유라'", icon: "🎯" },
    { title: "KBS TV 유치원 어푸어푸대모험", icon: "📺" },
    { title: "더 키즈 책 읽어주는 TV", icon: "📚" },
    { title: "웅진스마트올키즈 기본생활습관", icon: "✏️" }
  ];

  const experience = [
    { title: "서울시 영리더 라운드테이블 정책자문위원", icon: "🏛️" },
    { title: "국가보훈부 '히어로즈 패밀리' 멘토", icon: "🦸‍♀️" },
    { title: "경기도 미디어소통 TF팀 자문위원", icon: "📱" }
  ];

  return (
    <div className="about-page">
      <motion.div 
        className="about-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>About Us</h1>
        <p className="company-intro">
          놀잇은 아이들의 건강한 성장과 발달을 위한 혁신적인 교육 솔루션을 제공합니다.
        </p>
      </motion.div>

      <motion.div 
        className="video-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="video-container">
          <iframe
            width="853"
            height="480"
            src="https://www.youtube.com/embed/gDM8CdxCj3I"
            title="놀잇 소개 영상"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </motion.div>

      <div className="about-content">
        <motion.section 
          className="education-section"
          {...fadeIn}
        >
          <h2>📚 학력</h2>
          <div className="education-grid">
            {education.map((edu, index) => (
              <motion.div 
                key={index}
                className="education-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <span className="edu-icon">{edu.icon}</span>
                <div className="edu-details">
                  <h3>{edu.school}</h3>
                  <p>{edu.degree}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          className="qualifications-section"
          {...fadeIn}
        >
          <h2>📜 자격사항</h2>
          <div className="qualifications-grid">
            {qualifications.map((qual, index) => (
              <motion.div 
                key={index}
                className="qualification-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="qual-icon">{qual.icon}</span>
                <p>{qual.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          className="research-section"
          {...fadeIn}
        >
          <h2>📑 연구 논문</h2>
          <div className="research-list">
            {research.map((paper, index) => (
              <motion.div 
                key={index}
                className="research-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3 }}
              >
                <h3>{paper.title}</h3>
                <p className="year">{paper.year}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          className="productions-section"
          {...fadeIn}
        >
          <h2>🎬 제작/출연</h2>
          <div className="productions-grid">
            {productions.map((prod, index) => (
              <motion.div 
                key={index}
                className="production-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <span className="prod-icon">{prod.icon}</span>
                <p>{prod.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          className="experience-section"
          {...fadeIn}
        >
          <h2>💫 주요 이력</h2>
          <div className="experience-grid">
            {experience.map((exp, index) => (
              <motion.div 
                key={index}
                className="experience-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <span className="exp-icon">{exp.icon}</span>
                <p>{exp.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.footer 
          className="company-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="company-info">
            <h3>주식회사 놀잇</h3>
            <p>대표자: 최다은</p>
            <p>주소: 서울특별시 강남구 선릉로93길 40, 4층</p>
            <p>이메일: norit@norit.io</p>
          </div>
          <p className="copyright">©Norit Co.,Ltd 2024 All Rights Reserved</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default About; 