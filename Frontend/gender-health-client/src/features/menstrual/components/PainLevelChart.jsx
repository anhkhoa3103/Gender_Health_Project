import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

const getYellowShade = (level) => {
    const intensity = Math.floor(255 - (level * 30)); // Vàng nhạt đến vàng đậm
    return `rgb(255, ${intensity}, 0)`; // từ vàng nhạt đến cam đậm
};

const formatDateKey = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};


const PainLevelChart = ({ dayData, cycleDates }) => {
    const labels = [];
    const data = [];
    const backgroundColors = [];

    const sortedDates = [...cycleDates].sort((a, b) => new Date(a) - new Date(b));
    sortedDates.forEach((date, index) => {
        const key = formatDateKey(date);
        const entry = dayData[key];
        if (entry?.hasPeriod) {
            const pain = entry.painLevel || 0;
            labels.push(index + 1);
            data.push(pain);
            backgroundColors.push(getYellowShade(pain));
        }
    });

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Đau bụng kinh',
                data,
                backgroundColor: backgroundColors,
                borderRadius: 4
            }
        ]
    };

    const options = {
        scales: {
            y: {
                min: 0,
                max: 5,
                ticks: {
                    stepSize: 1
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Mức đau: ${context.raw}`;
                    }
                }
            }
        }
    };
    let painStats = null;
    if (data.length > 0) {
        const totalPain = data.reduce((sum, val) => sum + val, 0);
        const avgPain = (totalPain / data.length).toFixed(2);
        const maxPain = Math.max(...data);
        const peakIndex = data.indexOf(maxPain);
        const peakDate = sortedDates[peakIndex];

        let levelLabel = 'Không đau';
        if (maxPain >= 4) levelLabel = 'Đau nặng';
        else if (maxPain >= 2) levelLabel = 'Đau trung bình';
        else if (maxPain > 0) levelLabel = 'Đau nhẹ';

        painStats = {
            totalDays: data.length,
            avgPain,
            maxPain,
            peakDate: formatDateKey(peakDate),
            levelLabel
        };
    }

    return (
        <div className="chart-container">
            <h3>Biểu đồ Đau Bụng Kinh</h3>
            <Bar data={chartData} options={options} />
            {painStats && (
                <div className="pain-stats-box">
                    <h4>📌 Thống kê đau bụng kinh</h4>
                    <p>🗓 Số ngày có đau: <strong>{painStats.totalDays}</strong></p>
                    <p>📈 Mức đau trung bình: <strong>{painStats.avgPain}</strong></p>
                    <p>🔺 Mức đau cao nhất: <strong>{painStats.maxPain}</strong> (ngày {painStats.peakDate})</p>
                    <p>🩸 Đánh giá mức độ đau: <strong>{painStats.levelLabel}</strong></p>
                </div>
            )}
        </div>
    );
};

export default PainLevelChart;
