import React, { useEffect, useState } from 'react';
import { getCycleHistory } from '../../../api/menstrualApi';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const CycleHistoryChart = ({customerId }) => {
    const [cycleHistory, setCycleHistory] = useState([]);

    useEffect(() => {
         if (!customerId) return;
        const fetchData = async () => {
            try {
                const res = await getCycleHistory(customerId);
                console.log('res.data =', res.data);
                setCycleHistory(res.data.reverse());
            } catch (err) {
                console.error('Lỗi khi gọi API:', err);
            }
        };
        fetchData();
    }, [customerId]);


    const labels = cycleHistory.map((entry, i) =>
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
                borderColor: 'rgba(255, 206, 86, 0.8)',
                backgroundColor: 'rgba(255, 206, 86, 0.5)',
                tension: 0.4,
                pointBackgroundColor: 'rgba(255, 206, 86)',
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
                    stepSize: 10,
                    autoSkip: false
                },
                title: {
                    display: true
                }
            }
        }
    };

    return (
        <div style={{ marginTop: '2rem' }}>
            <h3>Chu kỳ kinh nguyệt & thời kỳ</h3>
            <Line data={data} options={options} />
        </div>
    );
};

export default CycleHistoryChart;
