import React from 'react';
import { motion } from 'framer-motion';

function Contact() {
  return (
    <div className="page-container contact-container">
      <motion.div 
        className="content-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>문의하기</h1>

        <div className="contact-info">
          <h2>연락처 정보</h2>
          <div className="info-item">
            <h3>주소</h3>
            <p>서울특별시 동작구 흑석로 84 중앙대학교</p>
          </div>
          <div className="info-item">
            <h3>이메일</h3>
            <p>contact@noit.edu</p>
          </div>
          <div className="info-item">
            <h3>전화번호</h3>
            <p>02-XXX-XXXX</p>
          </div>
        </div>

        <div className="contact-form">
          <h2>문의하기</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">이름</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="이름을 입력해주세요"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="이메일을 입력해주세요"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">문의 유형</label>
              <select id="subject" name="subject">
                <option value="">문의 유형을 선택해주세요</option>
                <option value="program">프로그램 문의</option>
                <option value="technical">기술 지원</option>
                <option value="partnership">제휴 문의</option>
                <option value="other">기타 문의</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">문의 내용</label>
              <textarea 
                id="message" 
                name="message" 
                rows="5" 
                placeholder="문의하실 내용을 입력해주세요"
              ></textarea>
            </div>

            <button type="submit" className="submit-button">
              문의하기
            </button>
          </form>
        </div>

        <div className="faq-section">
          <h2>자주 묻는 질문</h2>
          <div className="faq-item">
            <h3>Q: 프로그램은 어떤 연령대가 이용할 수 있나요?</h3>
            <p>A: 초등학교 3학년부터 6학년까지의 학생들을 위해 설계되었습니다.</p>
          </div>
          <div className="faq-item">
            <h3>Q: 프로그램 이용 시간에 제한이 있나요?</h3>
            <p>A: 24시간 언제든지 이용 가능합니다.</p>
          </div>
          <div className="faq-item">
            <h3>Q: 모바일에서도 이용할 수 있나요?</h3>
            <p>A: 현재는 PC 웹 브라우저에서만 이용 가능합니다.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Contact; 