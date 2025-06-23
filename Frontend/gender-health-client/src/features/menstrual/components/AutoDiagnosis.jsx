import React from 'react';

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};

const AutoDiagnosis = ({ dayData = {}, cycleDates = [] }) => {
    const sortedDates = [...cycleDates].sort((a, b) => new Date(a) - new Date(b));

    let flowHighDays = 0;
    let painHighDays = 0;
    let moodLowDays = 0;
    let ovulationLikeDays = [];
    let feverDays = [];
    const dischargeAnalysis = [];

    console.log("⏳ AutoDiagnosis received:", {
        dayData,
        cycleDates
    });

    sortedDates.forEach((date) => {
        const entry = dayData[date];
        if (!entry) return;

        if (entry.hasPeriod && entry.flowLevel >= 4) flowHighDays++;
        if (entry.hasPeriod && entry.painLevel >= 4) painHighDays++;
        if (entry.moodLevel !== null && entry.moodLevel <= 1) moodLowDays++;

        if (
            entry.temperature >= 36.7 &&
            entry.temperature <= 37.3 &&
            entry.discharge?.toLowerCase().includes("lòng trắng trứng")
        ) {
            ovulationLikeDays.push(date);
        }

        if (entry.temperature > 37.5) {
            feverDays.push(date);
        }

        // Phân tích dịch âm đạo
        switch (entry.discharge?.toLowerCase()) {
            case "lòng trắng trứng":
                dischargeAnalysis.push(`${formatDate(date)}: 💡 Giai đoạn rụng trứng – rất dễ thụ thai.`);
                break;
            case "dạng nước":
                dischargeAnalysis.push(`${formatDate(date)}: 🔵 Có thể đang ở giai đoạn dễ thụ thai.`);
                break;
            case "dạng sữa":
                dischargeAnalysis.push(`${formatDate(date)}: ℹ️ Dịch âm đạo dạng sữa – gần giai đoạn rụng trứng.`);
                break;
            case "đặc tính":
                dischargeAnalysis.push(`${formatDate(date)}: ⚠️ Dịch đặc – có thể chưa đến hoặc vừa qua rụng trứng.`);
                break;
            case "khô":
                dischargeAnalysis.push(`${formatDate(date)}: 🔒 Không có dấu hiệu rụng trứng.`);
                break;
            default:
                break;
        }
    });

    const details = [];

    details.push(`🔴 Lượng máu cao xuất hiện trong ${flowHighDays} ngày.`);
    details.push(`💔 Đau bụng kinh mức độ cao trong ${painHighDays} ngày.`);
    details.push(`😞 Tâm trạng rất thấp trong ${moodLowDays} ngày.`);

    if (ovulationLikeDays.length > 0) {
        const dates = ovulationLikeDays.map(formatDate).join(', ');
        details.push(`🟢 Có dấu hiệu rụng trứng vào: ${dates}`);
    } else {
        details.push(`🟢 Không phát hiện dấu hiệu rụng trứng rõ ràng.`);
    }

    if (feverDays.length > 0) {
        const dates = feverDays.map(formatDate).join(', ');
        details.push(`🌡️ Sốt nhẹ ghi nhận vào: ${dates}`);
    } else {
        details.push(`🌡️ Không ghi nhận sốt.`);
    }

    // Kết luận chung
    const issues = [];
    if (flowHighDays >= 3) issues.push('rong kinh');
    if (painHighDays >= 2) issues.push('đau nặng');
    if (moodLowDays >= 3) issues.push('tâm trạng tiêu cực');
    if (feverDays.length > 0) issues.push('sốt');

    const conclusion =
        issues.length === 0
            ? '✅ Chu kỳ này bình thường, không phát hiện dấu hiệu bất thường.'
            : `⚠️ Chu kỳ có dấu hiệu bất thường: ${issues.join(', ')}.`;

    return (
        <div className="diagnosis-box">
            <h4>🩺 Phân tích chi tiết chu kỳ</h4>
            <ul>
                {details.map((text, idx) => (
                    <li key={idx}>{text}</li>
                ))}
            </ul>

            <h4 style={{ marginTop: '1rem' }}>💧 Phân tích dịch âm đạo</h4>
            {dischargeAnalysis.length === 0 ? (
                <p>Không có dữ liệu dịch âm đạo.</p>
            ) : (
                <ul>
                    {dischargeAnalysis.map((line, idx) => (
                        <li key={idx}>{line}</li>
                    ))}
                </ul>
            )}

            <div style={{ marginTop: '1rem', fontWeight: 'bold', color: issues.length === 0 ? '#16a34a' : '#dc2626' }}>
                {conclusion}
            </div>
        </div>
    );
};

export default AutoDiagnosis;
