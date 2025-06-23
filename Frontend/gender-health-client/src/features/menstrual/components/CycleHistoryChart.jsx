import React, { useEffect, useState } from 'react';
import { getCycleHistory } from '../../../api/menstrualApi';
import { Line } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';
import '../style/CycleHistoryChart.css'; // ✨ Thêm file CSS riêng

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const CycleHistoryChart = () => {
    const { userId } = useParams();
    const [cycleHistory, setCycleHistory] = useState([]);
    const [cycleInfo, setCycleInfo] = useState(null);

    useEffect(() => {
        if (!userId) return;
        const fetchData = async () => {
            try {
                const res = await getCycleHistory(userId);
                const history = res.data.reverse();
                setCycleHistory(history);

                if (history.length >= 3) {
                    const [latest, prev, prev2] = history;

                    const isRegular = Math.abs(latest.cycleDays - prev.cycleDays) <= 3 &&
                                      Math.abs(prev.cycleDays - prev2.cycleDays) <= 3;

                    const currentCycleLength = latest.cycleDays;
                    const lastStartDate = new Date(prev.startDate);
                    const currentStartDate = new Date(latest.startDate);
                    const daysBetween = Math.floor((currentStartDate - lastStartDate) / (1000 * 60 * 60 * 24));

                    const periodLength = latest.periodDays;
                    const periodStatus = (periodLength >= 3 && periodLength <= 7) ? 'bình thường' : 'bất thường';

                    setCycleInfo({
                        isRegular,
                        currentCycleLength,
                        daysBetween,
                        periodLength,
                        periodStatus,
                    });
                }
            } catch (err) {
                console.error('Lỗi khi gọi API:', err);
            }
        };
        fetchData();
    }, [userId]);

    const labels = cycleHistory.map((entry) =>
        new Date(entry.startDate).toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })
    );

    const cycleDays = cycleHistory.map((entry) => entry.cycleDays);
    const periodDays = cycleHistory.map((entry) => entry.periodDays);

    const data = {
        labels,
        datasets: [
            {
                label: 'Số ngày của chu kỳ',
                data: cycleDays,
                borderColor: 'rgba(255, 99, 132, 0.7)',
                borderDash: [5, 5],
                tension: 0.4,
                pointBackgroundColor: 'rgba(255, 99, 132)',
            },
            {
                label: 'Số ngày hành kinh',
                data: periodDays,
                borderColor: 'rgba(75, 192, 192, 0.9)',
                backgroundColor: 'rgba(75, 192, 192, 0.3)',
                tension: 0.4,
                pointBackgroundColor: 'rgba(75, 192, 192)',
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.formattedValue} ngày`;
                    }
                }
            }
        },
        scales: {
            y: {
                min: 0,
                max: 40,
                ticks: {
                    stepSize: 10
                },
                title: {
                    display: true,
                    text: 'Số ngày'
                }
            }
        }
    };

    return (
        <div className="chart-container">
            <h2>📊 Thống kê chu kỳ kinh nguyệt</h2>
            <Line data={data} options={options} />

            {cycleInfo && (
                <div className="cycle-info-box">
                    <h4>💡 Thông tin chu kỳ gần nhất</h4>
                    <p>💮 3 chu kỳ gần nhất: <strong>{cycleInfo.isRegular ? 'Đều' : 'Không đều'}</strong></p>
                    <p>📅 Chu kỳ lần này: <strong>{cycleInfo.currentCycleLength}</strong> ngày</p>
                    <p>🔁 Cách kỳ trước: <strong>{cycleInfo.daysBetween}</strong> ngày</p>
                    <p>🩸 Số ngày hành kinh: <strong>{cycleInfo.periodLength}</strong> ngày – <em>{cycleInfo.periodStatus}</em></p>
                </div>
            )}
        </div>
    );
};

export default CycleHistoryChart;
