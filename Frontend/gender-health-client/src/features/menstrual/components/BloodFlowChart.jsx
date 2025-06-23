import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const getRedShade = (level) => {
    const lightness = 90 - (level * 10); // từ hồng nhạt đến đỏ đậm
    return `hsl(0, 100%, ${lightness}%)`;
};

const formatDateKey = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const BloodFlowChart = ({ dayData = {}, cycleDates = [] }) => {
    const labels = [];
    const values = [];
    const colors = [];

    const sortedDates = [...cycleDates].sort((a, b) => new Date(a) - new Date(b));
    sortedDates.forEach((date, index) => {
        const key = formatDateKey(date);
        const entry = dayData[key];
        if (entry?.hasPeriod) {
            const level = entry.flowLevel || 0;
            labels.push(`${index + 1}`);
            values.push(level);
            colors.push(getRedShade(level));
        }
    });

    // Phân tích thống kê
    let stats = null;
    if (values.length > 0) {
        const total = values.reduce((sum, val) => sum + val, 0);
        const avg = (total / values.length).toFixed(2);
        const max = Math.max(...values);
        const peakIndex = values.indexOf(max);
        const peakDate = formatDateKey(sortedDates[peakIndex]);

        let levelLabel = 'Nhẹ';
        if (max >= 4) levelLabel = 'Nặng';
        else if (max >= 2) levelLabel = 'Trung bình';

        stats = {
            totalDays: values.length,
            avg,
            max,
            peakDate,
            levelLabel
        };
    }

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Lượng máu kinh',
                data: values,
                backgroundColor: colors,
                borderRadius: 4,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Lượng máu: ${context.raw}`;
                    }
                }
            }
        },
        scales: {
            y: {
                min: 0,
                max: 5,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <div className="chart-container">
            <h3>🩸 Biểu đồ Lượng Máu Kinh</h3>
            <Bar data={chartData} options={options} />

            {stats && (
                <div className="blood-stats-box" >
                    <h4>📌 Thống kê lượng máu</h4>
                    <p>🗓 Số ngày có kinh: <strong>{stats.totalDays}</strong></p>
                    <p>📊 Lượng trung bình: <strong>{stats.avg}</strong></p>
                    <p>🔺 Cao nhất: <strong>{stats.max}</strong> (ngày {stats.peakDate})</p>
                    <p>🧾 Đánh giá: <strong>{stats.levelLabel}</strong></p>
                </div>
            )}
        </div>
    );
};

export default BloodFlowChart;
