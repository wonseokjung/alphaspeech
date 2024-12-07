export const questions = [
  // 1️⃣ 대인관계 능력 영역
  {
    id: 1,
    category: '대인관계 능력 👥',
    question: '새로운 친구를 만났을 때 나는?',
    options: [
      { id: 1, text: '먼저 다가가서 반갑게 인사한다' },
      { id: 2, text: '친구가 먼저 말을 걸어주길 기다린다' },
      { id: 3, text: '부끄러워서 피한다' },
      { id: 4, text: '관심을 보이지 않는다' }
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    category: '대인관계 능력 👥',
    question: '친구가 도움이 필요해 보일 때 나는?',
    options: [
      { id: 1, text: '먼저 다가가서 도와준다' },
      { id: 2, text: '누군가 도와주길 기다린다' },
      { id: 3, text: '모른척 지나간다' },
      { id: 4, text: '귀찮아서 피한다' }
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    category: '대인관계 능력 👥',
    question: '친구들이 놀이를 하고 있을 때 나는?',
    options: [
      { id: 1, text: '예의 바르게 같이 놀자고 한다' },
      { id: 2, text: '멀리서 구경만 한다' },
      { id: 3, text: '강제로 끼어든다' },
      { id: 4, text: '혼자 논다' }
    ],
    correctAnswer: 1
  },

  // 2️⃣ 감정 이해와 조절 영역
  {
    id: 4,
    category: '감정 이해와 조절 💝',
    question: '게임에서 졌을 때 나는?',
    options: [
      { id: 1, text: '화를 내거나 짜증을 낸다' },
      { id: 2, text: '다음에 더 잘하면 된다고 생각한다' },
      { id: 3, text: '게임을 그만둔다' },
      { id: 4, text: '상대방을 탓한다' }
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    category: '감정 이해와 조절 💝',
    question: '내가 원하는 장난감을 다른 친구가 가지고 놀 때 나는?',
    options: [
      { id: 1, text: '강제로 뺏는다' },
      { id: 2, text: '차례를 기다렸다가 함께 논다' },
      { id: 3, text: '울면서 떼를 쓴다' },
      { id: 4, text: '선생님께 일러준다' }
    ],
    correctAnswer: 2
  },
  {
    id: 6,
    category: '감정 이해와 조절 💝',
    question: '친구가 실수로 나를 밀었을 때 나는?',
    options: [
      { id: 1, text: '바로 밀어버린다' },
      { id: 2, text: '괜찮다고 이야기한다' },
      { id: 3, text: '울어버린다' },
      { id: 4, text: '선생님께 말한다' }
    ],
    correctAnswer: 2
  },

  // 3️⃣ 의사소통 능력 영역
  {
    id: 7,
    category: '의사소통 능력 🗣️',
    question: '친구와 이야기할 때 나는?',
    options: [
      { id: 1, text: '친구 말을 끝까지 듣지 않는다' },
      { id: 2, text: '친구 말을 잘 듣고 대답한다' },
      { id: 3, text: '계속 내 얘기만 한다' },
      { id: 4, text: '관심없는 척 한다' }
    ],
    correctAnswer: 2
  },
  {
    id: 8,
    category: '의사소통 능력 🗣️',
    question: '친구가 내 의견과 다르게 생각할 때 나는?',
    options: [
      { id: 1, text: '화를 내며 싸운다' },
      { id: 2, text: '서로의 생각을 이야기하고 이해하려 노력한다' },
      { id: 3, text: '무조건 내 의견을 고집한다' },
      { id: 4, text: '더 이상 말하지 않는다' }
    ],
    correctAnswer: 2
  },

  // 4️⃣ 협동과 팀워크 영역
  {
    id: 9,
    category: '협동과 팀워크 🤝',
    question: '모둠 활동을 할 때 나는?',
    options: [
      { id: 1, text: '혼자서만 하려고 한다' },
      { id: 2, text: '친구들과 역할을 나누어 함께한다' },
      { id: 3, text: '다른 친구들에게 다 미룬다' },
      { id: 4, text: '참여하지 않는다' }
    ],
    correctAnswer: 2
  },
  {
    id: 10,
    category: '협동과 팀워크 🤝',
    question: '친구들과 함께 무언가를 만들 때 나는?',
    options: [
      { id: 1, text: '내 마음대로만 한다' },
      { id: 2, text: '서로 의견을 나누며 만든다' },
      { id: 3, text: '구경만 한다' },
      { id: 4, text: '방해한다' }
    ],
    correctAnswer: 2
  },

  // 5️⃣ 갈등 해결 능력 영역
  {
    id: 11,
    category: '갈등 해결 능력 ⚖️',
    question: '친구와 장난감을 가지고 다툴 때 나는?',
    options: [
      { id: 1, text: '소리를 지르거나 싸운다' },
      { id: 2, text: '서로 양보하고 차례대로 한다' },
      { id: 3, text: '울면서 떼를 쓴다' },
      { id: 4, text: '포기하고 다른 곳으로 간다' }
    ],
    correctAnswer: 2
  },
  {
    id: 12,
    category: '갈등 해결 능력 ⚖️',
    question: '친구가 나를 놀렸을 때 나는?',
    options: [
      { id: 1, text: '같이 놀린다' },
      { id: 2, text: '기분 나쁘다고 차분히 이야기한다' },
      { id: 3, text: '울어버린다' },
      { id: 4, text: '무시한다' }
    ],
    correctAnswer: 2
  },

  // 6️⃣ 공감 능력 영역
  {
    id: 13,
    category: '공감 능력 🫂',
    question: '친구가 슬퍼할 때 나는?',
    options: [
      { id: 1, text: '모른척한다' },
      { id: 2, text: '위로해주고 공감해준다' },
      { id: 3, text: '웃으며 놀린다' },
      { id: 4, text: '다른 친구에게 말한다' }
    ],
    correctAnswer: 2
  },
  {
    id: 14,
    category: '공감 능력 🫂',
    question: '친구가 선물을 받고 기뻐할 때 나는?',
    options: [
      { id: 1, text: '시기하고 질투한다' },
      { id: 2, text: '진심으로 축하해준다' },
      { id: 3, text: '관심을 보이지 않는다' },
      { id: 4, text: '나도 사달라고 한다' }
    ],
    correctAnswer: 2
  }
];

// 카테고리별 가중치 정의
export const categoryWeights = {
  '대인관계 능력 👥': 0.20,
  '감정 이해와 조절 💝': 0.20,
  '의사소통 능력 🗣️': 0.15,
  '협동과 팀워크 🤝': 0.15,
  '갈등 해결 능력 ⚖️': 0.15,
  '공감 능력 🫂': 0.15
}; 