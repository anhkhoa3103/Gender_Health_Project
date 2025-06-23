import React, { useState } from 'react';
import '../style/SymptomCheckForm.css'; 

const SYMPTOMS = [
  { key: 'discharge', label: 'Khí hư bất thường (màu vàng/xanh, mùi hôi)' },
  { key: 'itching', label: 'Ngứa hoặc rát vùng kín' },
  { key: 'painUrination', label: 'Tiểu buốt hoặc rát khi đi tiểu' },
  { key: 'painIntercourse', label: 'Đau khi quan hệ tình dục' },
  { key: 'bleeding', label: 'Chảy máu bất thường ngoài kỳ kinh' },
  { key: 'sores', label: 'Xuất hiện mụn hoặc loét vùng kín' },
  { key: 'pelvicPain', label: 'Đau bụng dưới kéo dài hoặc thường xuyên' }
];

const diagnosisRules = (symptoms) => {
  const active = Object.entries(symptoms).filter(([_, value]) => value).map(([key]) => key);
  const suggestions = [];

  if (active.includes('discharge') && active.includes('itching')) {
    suggestions.push('🔴 Có thể bạn đang bị viêm âm đạo hoặc nhiễm nấm Candida.');
  }
  if (active.includes('painUrination') && active.includes('pelvicPain')) {
    suggestions.push('🟠 Có thể là viêm đường tiết niệu hoặc viêm vùng chậu.');
  }
  if (active.includes('sores')) {
    suggestions.push('⚠️ Cảnh báo: Có thể là dấu hiệu của Herpes sinh dục hoặc bệnh xã hội.');
  }
  if (active.includes('painIntercourse')) {
    suggestions.push('🔶 Có thể bạn gặp vấn đề về nội tiết tố hoặc viêm âm đạo.');
  }
  if (active.includes('bleeding')) {
    suggestions.push('🔺 Chảy máu bất thường nên được kiểm tra ngay.');
  }

  if (suggestions.length === 0) {
    return ['✅ Không phát hiện dấu hiệu bất thường nghiêm trọng. Tuy nhiên, nếu có lo lắng, hãy tham khảo ý kiến chuyên gia.'];
  }

  return suggestions;
};

const SymptomCheckForm = () => {
  const [symptoms, setSymptoms] = useState({});
  const [results, setResults] = useState(null);

  const toggleSymptom = (key) => {
    setSymptoms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAnalyze = () => {
    const resultList = diagnosisRules(symptoms);
    setResults(resultList);
  };

  return (
    <div className="symptom-check-form">
      <h3>🩺 Kiểm tra dấu hiệu bất thường</h3>
      <p>Hãy tick vào các triệu chứng bạn đang gặp phải:</p>
      <div className="symptom-list">
        {SYMPTOMS.map((symptom) => (
          <label key={symptom.key} className="symptom-item">
            <input
              type="checkbox"
              checked={!!symptoms[symptom.key]}
              onChange={() => toggleSymptom(symptom.key)}
            />
            {symptom.label}
          </label>
        ))}
      </div>

      <button className="analyze-button" onClick={handleAnalyze}>
        🔍 Phân tích dấu hiệu
      </button>

      {results && (
        <div className="diagnosis-result">
          <h4>Kết quả chẩn đoán</h4>
          <ul>
            {results.map((r, idx) => (
              <li key={idx}>{r}</li>
            ))}
          </ul>
          <div style={{ marginTop: '1rem' }}>
            👉 <strong>Gợi ý:</strong> Bạn có thể <a href="/consultation">đặt lịch tư vấn</a> hoặc <a href="/package">xét nghiệm</a> để xác minh kết quả.
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomCheckForm;
