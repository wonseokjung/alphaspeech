const AZURE_OPENAI_ENDPOINT = process.env.REACT_APP_AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_KEY = process.env.REACT_APP_AZURE_OPENAI_KEY;
const DEPLOYMENT_NAME = process.env.REACT_APP_DEPLOYMENT_NAME;
const API_VERSION = '2024-08-01-preview';

console.log('Environment Variables Check:', {
  ENDPOINT: AZURE_OPENAI_ENDPOINT ? 'Set' : 'Not Set',
  KEY: AZURE_OPENAI_KEY ? 'Set' : 'Not Set',
  DEPLOYMENT: DEPLOYMENT_NAME ? 'Set' : 'Not Set'
});

// 점수를 등급으로 변환하는 함수
export const getGrade = (score) => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'E';
};

// 지연 함수 추가
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeResponses = async (responses) => {
  try {
    if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_KEY || !DEPLOYMENT_NAME) {
      throw new Error('Azure OpenAI 설정이 누락되었습니다.');
    }

    const prompt = `
당신은 따뜻하고 친근한 커뮤니케이션 선생님입니다. 학생의 답변을 분석하고 격려하는 마음으로 상세한 평가 리포트를 작성해주세요.

[답변 내용]
1번 문항 (아이폰 설득)
답변: "${responses[0]?.transcript || '답변 없음'}"
평가항목: 문제파악능력/문제해결능력/논리력/전달력

2번 문항 (다이어트 고민)
답변: "${responses[1]?.transcript || '답변 없음'}"
평가항목: 내용구성력/상호작용능력/전달력

3번 문항 (크리스마스 선물)
답변: "${responses[2]?.transcript || '답변 없음'}"
평가항목: 내용구성력/상호작용능력/전달력

4번 문항 (용돈 협상)
답변: "${responses[3]?.transcript || '답변 없음'}"
평가항목: 문제파악능력/문제해결능력/논리력/전달력

5번 문항 (생일파티 거절)
답변: "${responses[4]?.transcript || '답변 없음'}"
평가항목: 내용구성력/상호작용능력/전달력

다음 형식으로 평가해주세요:

1. 각 문항별 평가:
- 평가항목별 점수 (100점 만점) 및 등급 (A: 90점 이상, B: 80-89점, C: 70-79점, D: 60-69점, E: 60점 미만)
- 답변의 주요 강점
- 개선이 필요한 부분
- 선생님의 따뜻한 조언 (친근하고 구체적인 조언을 해주세요)

2. 종합 역량 평가:
각 역량별로 다음 형식으로 평가해주세요:
- 문제파악능력: [점수]/[등급] - [총평]
- 문제해결능력: [점수]/[등급] - [총평]
- 논리력: [점수]/[등급] - [총평]
- 내용구성력: [점수]/[등급] - [총평]
- 전달력: [점수]/[등급] - [총평]
- 상호작용능력: [점수]/[등급] - [총평]

3. 개선을 위한 제안:
- 각 역량별 구체적인 개선 방안
- 실천 가능한 학습 방법
- 일상생활에서 시도해볼 수 있는 재미있는 연습 방법

4. 종합 의견:
- 전반적인 강점
- 발전이 기대되는 부분
- 선생님의 응원 메시지 (학생의 잠재력과 가능성을 언급하며 따뜻하게 격려해주세요)
- 최종 종합 등급 (전체 역량의 평균 점수를 기준으로 A~E 등급 부여)
- 향후 발전 가능성

5. 선생님의 특별 조언:
- 학생의 답변 특징을 반영한 맞춤형 조언
- 학생의 강점을 살리는 구체적인 활동 제안
- 재미있게 참여할 수 있는 의사소통 게임이나 활동 추천
- 친구들과 함께 해볼 수 있는 대화 연습 방법

답변을 분석할 때는 다음 사항을 고려해주세요:
1. 발달단계에 맞는 적절한 표현과 논리성
2. 상황에 대한 이해도와 공감 능력
3. 실현 가능한 해결책 제시 여부
4. 자신의 의견을 명확하게 전달하는 능력

분석은 항상 긍정적인 톤으로 시작하고, 개선점은 "~하면 더 좋을 것 같아요"와 같은 격려하는 방식으로 제안해주세요.
마치 친근한 선생님이 학생과 대화하듯이 따뜻하고 친근한 어조로 작성해주세요.`;

    console.log('Sending request to Azure OpenAI...');
    
    // Rate limit 처리를 위한 재시도 로직
    let maxRetries = 3;
    let attempt = 1;
    let lastError = null;
    
    while (attempt <= maxRetries) {
      try {
        const response = await fetch(`${AZURE_OPENAI_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': AZURE_OPENAI_KEY
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: "당신은 청소년 커뮤니케이션 교육 전문가입니다. 답변을 분석할 때는 발달단계와 교육적 관점을 고려하여 건설적이고 긍정적인 피드백을 제공하되, 개선이 필요한 부분도 명확히 짚어주세요. 모든 점수는 등급(A~E)과 함께 표시해주세요."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 2500,
            top_p: 0.95,
            frequency_penalty: 0,
            presence_penalty: 0
          })
        });

        if (response.status === 429) {
          console.log(`Rate limit exceeded. Attempt ${attempt}/${maxRetries}. Waiting before retry...`);
          await delay(55000); // 55초 대기
          attempt++;
          continue;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error:', errorData);
          lastError = new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
          throw lastError;
        }

        const data = await response.json();
        console.log('Received response from Azure OpenAI');
        return data.choices[0].message.content;
      } catch (error) {
        lastError = error;
        if (attempt === maxRetries) break;
        console.log(`Error on attempt ${attempt}/${maxRetries}. Retrying...`);
        await delay(1000 * attempt); // 점진적으로 대기 시간 증가
        attempt++;
      }
    }
    
    throw lastError || new Error('모든 재시도 실패');
  } catch (error) {
    console.error('Error analyzing responses:', error);
    throw new Error(`분석 중 오류 발생: ${error.message}`);
  }
};

export const formatAnalysis = (analysisText) => {
  if (!analysisText) return null;

  try {
    // 섹션별로 분리
    const sections = analysisText.split('\n\n');
    
    // 종합 등급 추출
    const conclusionSection = sections.find(s => s.includes('종합 의견'));
    const gradeMatch = conclusionSection?.match(/최종 종합 등급[:\s]*([A-E])/);
    const finalGrade = gradeMatch ? gradeMatch[1] : null;

    // 선생님의 특별 조언 섹션 추출
    const specialAdvice = sections.find(s => s.includes('선생님의 특별 조언'))?.replace('5. 선생님의 특별 조언:', '').trim();

    return {
      itemAnalysis: sections.find(s => s.includes('문항별 평가'))?.replace('1. 각 문항별 평가:', '').trim(),
      competencyAnalysis: sections.find(s => s.includes('종합 역량 평가'))?.replace('2. 종합 역량 평가:', '').trim(),
      improvements: sections.find(s => s.includes('개선을 위한 제안'))?.replace('3. 개선을 위한 제안:', '').trim(),
      conclusion: sections.find(s => s.includes('종합 의견'))?.replace('4. 종합 의견:', '').trim(),
      specialAdvice,
      finalGrade
    };
  } catch (error) {
    console.error('Error formatting analysis:', error);
    return null;
  }
};