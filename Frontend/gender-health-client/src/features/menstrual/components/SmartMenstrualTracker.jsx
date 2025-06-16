import React, { useState, useEffect, useContext } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { saveCycleEntry, getCyclesByMonth, saveBulkCycles } from '../../../api/menstrualApi';
import BloodFlowChart from './BloodFlowChart';
import '../style/MenstrualTracker.css';
import PainLevelChart from './PainLevelChart';
import CycleHistoryChart from './CycleHistoryChart';
import { useParams } from "react-router-dom";
import Header from "../../components/Header.jsx";
import { AuthContext } from '../../../context/AuthContext';



const TOTAL_DAYS = 28;
const TOTAL_DAYS2 = 28;
const radius = 100;
const center = 150;

const moods = ['Vui vẻ', 'Mệt mỏi', 'Buồn', 'Tức giận', 'Lo lắng'];
const flows = ['Ít', 'Trung bình', 'Nhiều'];

const SmartMenstrualTracker = () => {
    const { user } = useContext(AuthContext);
    const userId = user?.id;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const today = new Date();
    const initialMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const [monthKey, setMonthKey] = useState(initialMonthKey);

    const [dayData, setDayData] = useState({});
    const [startDays, setStartDays] = useState({});
    const [cycleDatesMap, setCycleDatesMap] = useState({});
    const [currentDayIndex, setCurrentDayIndex] = useState(0);

    useEffect(() => {
        if (!userId) {
            setDayData({});
            setStartDays({});
            setCycleDatesMap({});
            setCurrentDayIndex(0);
            return;
        }
        const loadInitialData = async () => {
            const today = new Date();
            const mk = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

            try {
                const res = await getCyclesByMonth(userId, today.getFullYear(), today.getMonth() + 1);
                const updated = {};
                const cycleDates = [];

                res.data.forEach(entry => {
                    const key = entry.cycleDate;
                    updated[key] = {
                        hasPeriod: entry.hasPeriod,
                        flowLevel: entry.flowLevel,
                        painLevel: entry.painLevel,
                        moodLevel: entry.moodLevel,
                        habit: entry.habit,
                        discharge: entry.dischargeType,
                        weight: entry.weight,
                        temperature: entry.temperature,
                        note: entry.note
                    };
                    if (entry.hasPeriod) cycleDates.push(new Date(key));
                });

                setDayData({ [mk]: updated });
                setCycleDatesMap({ [mk]: cycleDates });
                if (cycleDates.length > 0) {
                    setStartDays({ [mk]: cycleDates[0] });
                }
            } catch (err) {
                console.error("Không thể tải dữ liệu kỳ kinh:", err);
            }
        };

        loadInitialData();
    }, [userId]);


    const getMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const getKey = (date) => date.toISOString().split('T')[0];
    const isSame = (a, b) => getKey(a) === getKey(b);

    const selectedMonthData = dayData[monthKey] || {};
    const selectedStartDay = startDays[monthKey];
    const selectedCycleDates = cycleDatesMap[monthKey] || [];

    const addPeriodChain = (startDate, count = 5) => {
        const updates = {};
        for (let i = 0; i < count; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            const key = getKey(d);
            updates[key] = { ...selectedMonthData[key], hasPeriod: true };
        }
        return updates;
    };

    const updatePeriod = (date, checked) => {
        const key = getKey(date);
        const updates = { ...selectedMonthData };

        if (checked) {
            // Nếu là ngày đầu tiên
            if (!selectedStartDay) {
                setStartDays(prev => ({ ...prev, [monthKey]: date }));
            }

            const last = selectedCycleDates[selectedCycleDates.length - 1];
            if (last && date > last) {
                const d = new Date(last);
                d.setDate(d.getDate() + 1);
                while (d <= date) {
                    const k = getKey(d);
                    updates[k] = { ...updates[k], hasPeriod: true };
                    d.setDate(d.getDate() + 1);
                }
            } else {
                Object.assign(updates, addPeriodChain(date));
                setStartDays(prev => ({ ...prev, [monthKey]: date }));
            }
        } else {
            // Khi bỏ chọn -> xác định lại chuỗi mới
            const allKeys = Object.entries(selectedMonthData)
                .filter(([_, v]) => v.hasPeriod)
                .map(([k]) => k)
                .sort();

            const index = allKeys.indexOf(key);
            if (index !== -1) {
                // Xoá từ ngày bỏ chọn về sau
                for (let i = index; i < allKeys.length; i++) {
                    const k = allKeys[i];
                    updates[k] = { ...updates[k], hasPeriod: false };
                }

                // Nếu sau khi xoá không còn ngày nào có kinh => reset start day
                const stillHas = Object.entries(updates).filter(([_, v]) => v.hasPeriod);
                if (stillHas.length === 0) {
                    setStartDays(prev => ({ ...prev, [monthKey]: null }));
                    setCycleDatesMap(prev => ({ ...prev, [monthKey]: [] }));
                }
            }
        }

        setDayData(prev => ({ ...prev, [monthKey]: updates }));

        // Rebuild chuỗi mới sau khi cập nhật
        const days = Object.entries(updates)
            .filter(([_, v]) => v.hasPeriod)
            .map(([k]) => new Date(k))
            .sort((a, b) => a - b);

        setCycleDatesMap(prev => ({ ...prev, [monthKey]: days }));
        if (days.length > 0) {
            setStartDays(prev => ({ ...prev, [monthKey]: days[0] }));
        }
    };


    const isValidCycle = (dates) => {
        return dates.length >= 1;
    };


    const isFertileDay = (date) => {
        const startDay = startDays[monthKey];
        if (!isValidCycle(cycleDatesMap[monthKey] || [])) return false;
        if (!startDay) return false;

        const start = new Date(startDay);
        const end = new Date(startDay);
        start.setDate(start.getDate() + 12);
        end.setDate(end.getDate() + 16);

        return date >= start && date <= end;
    };

    const isOvulationDay = (date) => {
        const startDay = startDays[monthKey];
        if (!isValidCycle(cycleDatesMap[monthKey] || [])) return false;
        if (!startDay) return false;

        const ovulation = new Date(startDay);
        ovulation.setDate(ovulation.getDate() + 14);

        return isSame(date, ovulation);
    };


    const cycle = [];
    const baseDate = selectedStartDay || new Date();
    const monthData = dayData[monthKey] || {};

    for (let i = 0; i < TOTAL_DAYS; i++) {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + i);
        const key = getKey(d);

        let phase = 'neutral';

        if (isValidCycle(selectedCycleDates)) {
            if (i < selectedCycleDates.length) {
                phase = 'menstruation';
            } else if (i === 14) {
                phase = 'ovulation';
            } else if (i >= 12 && i <= 16) {
                phase = 'fertile';
            } else if (i < 14) {
                phase = 'follicular';
            } else {
                phase = 'luteal';
            }
        }

        cycle.push({ date: d, phase, data: monthData[key] || {} });
    }


    const getDayPosition = (i, r = radius) => {
        const angle = (360 / TOTAL_DAYS) * i - 90;
        const rad = (Math.PI / 180) * angle;
        return {
            x: center + r * Math.cos(rad),
            y: center + r * Math.sin(rad)
        };
    };


    const handleSave = async () => {
        if (!userId) return;
        const entries = Object.entries(dayData[monthKey] || {}).map(([key, entry]) => ({
            cycleDate: key,
            hasPeriod: entry.hasPeriod || false,
            flowLevel: entry.flowLevel || 0,
            painLevel: entry.painLevel || 0,
            moodLevel: entry.moodLevel || 0,
            habit: entry.habit || '',
            dischargeType: entry.discharge || '',
            weight: entry.weight ? parseFloat(entry.weight) : null,
            temperature: entry.temperature ? parseFloat(entry.temperature) : null,
            note: entry.note || ''
        }));

        try {
            await saveBulkCycles(userId, entries);

            alert("✅ Đã lưu thành công!");

            const [year, month] = monthKey.split('-').map(Number);
            const res = await getCyclesByMonth(userId, year, month);

            const updated = {};
            const cycleDates = [];

            res.data.forEach(entry => {
                const dateKey = entry.cycleDate;
                updated[dateKey] = {
                    hasPeriod: entry.hasPeriod,
                    flowLevel: entry.flowLevel,
                    painLevel: entry.painLevel,
                    moodLevel: entry.moodLevel,
                    habit: entry.habit,
                    discharge: entry.dischargeType,
                    weight: entry.weight,
                    temperature: entry.temperature,
                    note: entry.note
                };
                if (entry.hasPeriod) cycleDates.push(new Date(dateKey));
            });

            setDayData(prev => ({ ...prev, [monthKey]: updated }));
            setCycleDatesMap(prev => ({ ...prev, [monthKey]: cycleDates }));
            if (cycleDates.length > 0) {
                setStartDays(prev => ({ ...prev, [monthKey]: cycleDates[0] }));
            }

        } catch (err) {
            console.error("❌ Lỗi khi lưu bulk:", err);
            alert("Có lỗi xảy ra khi lưu dữ liệu.");
        }
    };

    const radius = 140;
    const center = 180;
    const dotRadius = radius - 15;
    const current = cycle[currentDayIndex] || {};

    return (
        <>
            <div className="header">
                <Header />
            </div>

            <div className="tracker-container">
                <div className="top-section">

                    <div className="formmenstrual-section">
                        <div className="formmenstrual-container">
                            <h3 className="formmenstrual-title">Ngày {selectedDate.toLocaleDateString('vi-VN')}</h3>

                            {/* 0. Checkbox "Có kinh nguyệt" */}
                            <div className="formmenstrual-row">
                                <div className="formmenstrual-label">
                                    💧Có kinh nguyệt
                                </div>
                                <div className="formmenstrual-control">
                                    <input
                                        type="checkbox"
                                        checked={dayData[monthKey]?.[getKey(selectedDate)]?.hasPeriod || false}
                                        onChange={(e) => updatePeriod(selectedDate, e.target.checked)}
                                    />
                                </div>
                            </div>

                            {/* 1. Lượng kinh */}
                            <div className="formmenstrual-row">
                                <div className="formmenstrual-label">
                                    🔥Lượng kinh
                                </div>
                                <div className="formmenstrual-control">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <span
                                            key={level}
                                            className={
                                                (dayData[monthKey]?.[getKey(selectedDate)]?.flowLevel || 0) >= level
                                                    ? "level-icon active"
                                                    : "level-icon"
                                            }
                                            onClick={() =>
                                                setDayData((prev) => ({
                                                    ...prev,
                                                    [monthKey]: {
                                                        ...prev[monthKey],
                                                        [getKey(selectedDate)]: {
                                                            ...prev[monthKey]?.[getKey(selectedDate)],
                                                            flowLevel: level
                                                        }
                                                    }
                                                }))
                                            }
                                        >
                                            💧
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Đau bụng kinh */}
                            <div className="formmenstrual-row">
                                <div className="formmenstrual-label">
                                    💔Đau bụng kinh
                                </div>
                                <div className="formmenstrual-control">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <span
                                            key={level}
                                            className={
                                                (dayData[monthKey]?.[getKey(selectedDate)]?.painLevel || 0) >= level
                                                    ? "level-icon active"
                                                    : "level-icon"
                                            }
                                            onClick={() =>
                                                setDayData((prev) => ({
                                                    ...prev,
                                                    [monthKey]: {
                                                        ...prev[monthKey],
                                                        [getKey(selectedDate)]: {
                                                            ...prev[monthKey]?.[getKey(selectedDate)],
                                                            painLevel: level
                                                        }
                                                    }
                                                }))
                                            }
                                        >
                                            💔
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* 3. Tâm trạng */}
                            <div className="formmenstrual-row">
                                <div className="formmenstrual-label">
                                    😀Tâm trạng
                                </div>
                                <div className="formmenstrual-control">
                                    {['😭', '😞', '😐', '🙂', '😄'].map((face, index) => {
                                        const level = index + 1;
                                        const active = (dayData[monthKey]?.[getKey(selectedDate)]?.moodLevel || 0) >= level;
                                        return (
                                            <span
                                                key={level}
                                                className={active ? "level-icon active" : "level-icon"}
                                                onClick={() =>
                                                    setDayData((prev) => ({
                                                        ...prev,
                                                        [monthKey]: {
                                                            ...prev[monthKey],
                                                            [getKey(selectedDate)]: {
                                                                ...prev[monthKey]?.[getKey(selectedDate)],
                                                                moodLevel: level
                                                            }
                                                        }
                                                    }))
                                                }
                                            >
                                                {face}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 4. Dịch âm đạo */}
                            <div className="formmenstrual-row">
                                <div className="formmenstrual-label">
                                    💦Dịch âm đạo
                                </div>
                                <div className="formmenstrual-control">
                                    <select
                                        value={dayData[monthKey]?.[getKey(selectedDate)]?.discharge || ''}
                                        onChange={(e) =>
                                            setDayData((prev) => ({
                                                ...prev,
                                                [monthKey]: {
                                                    ...prev[monthKey],
                                                    [getKey(selectedDate)]: {
                                                        ...prev[monthKey]?.[getKey(selectedDate)],
                                                        discharge: e.target.value
                                                    }
                                                }
                                            }))
                                        }
                                    >
                                        <option value="">-- Chọn --</option>
                                        <option value="khô">Khô</option>
                                        <option value="đặc tính">Đặc tính</option>
                                        <option value="dạng sữa">Dạng sữa</option>
                                        <option value="dạng nước">Dạng nước</option>
                                        <option value="lòng trắng trứng">Lòng trắng trứng</option>
                                    </select>
                                </div>
                            </div>

                            {/* 5. Cân nặng */}
                            <div className="formmenstrual-row">
                                <div className="formmenstrual-label">
                                    ⚖️Cân nặng
                                </div>
                                <div className="formmenstrual-control">
                                    <input
                                        type="number"
                                        value={dayData[monthKey]?.[getKey(selectedDate)]?.weight || ''}
                                        onChange={(e) =>
                                            setDayData((prev) => ({
                                                ...prev,
                                                [monthKey]: {
                                                    ...prev[monthKey],
                                                    [getKey(selectedDate)]: {
                                                        ...prev[monthKey]?.[getKey(selectedDate)],
                                                        weight: e.target.value
                                                    }
                                                }
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            {/* 6. Nhiệt độ */}
                            <div className="formmenstrual-row">
                                <div className="formmenstrual-label">
                                    🌡️Nhiệt độ
                                </div>
                                <div className="formmenstrual-control">
                                    <input
                                        type="number"
                                        value={dayData[monthKey]?.[getKey(selectedDate)]?.temperature || ''}
                                        onChange={(e) =>
                                            setDayData((prev) => ({
                                                ...prev,
                                                [monthKey]: {
                                                    ...prev[monthKey],
                                                    [getKey(selectedDate)]: {
                                                        ...prev[monthKey]?.[getKey(selectedDate)],
                                                        temperature: e.target.value
                                                    }
                                                }
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            {/* 7. Ghi chú */}
                            <div className="formmenstrual-row">
                                <div className="formmenstrual-label">
                                    📝Ghi chú
                                </div>
                                <div className="formmenstrual-control">
                                    <textarea
                                        value={dayData[monthKey]?.[getKey(selectedDate)]?.note || ''}
                                        onChange={(e) =>
                                            setDayData((prev) => ({
                                                ...prev,
                                                [monthKey]: {
                                                    ...prev[monthKey],
                                                    [getKey(selectedDate)]: {
                                                        ...prev[monthKey]?.[getKey(selectedDate)],
                                                        note: e.target.value
                                                    }
                                                }
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            {/* 8. Save button */}
                            <div className="formmenstrual-row" style={{ justifyContent: 'center', marginTop: '20px' }}>
                                <button onClick={handleSave} className="save-button">💾 Lưu thông tin</button>
                            </div>
                        </div>
                    </div>

                    <div className="circle-section">
                        <div>
                            <h3 className="cycle-label">Vòng chu kỳ</h3>
                            <svg
                                width={360}
                                height={360}
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const dx = e.clientX - rect.left - center;
                                    const dy = e.clientY - rect.top - center;
                                    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
                                    const normalized = (angle + 360) % 360;
                                    const day = Math.round(normalized / (360 / TOTAL_DAYS)) % TOTAL_DAYS;
                                    setCurrentDayIndex(day);
                                }}
                            >
                                {/* vẽ từng ngày */}
                                {cycle.map((c, i) => {
                                    const startAngle = (360 / TOTAL_DAYS) * i - 90;
                                    const endAngle = startAngle + (360 / TOTAL_DAYS);
                                    const x1 = center + radius * Math.cos((Math.PI / 180) * startAngle);
                                    const y1 = center + radius * Math.sin((Math.PI / 180) * startAngle);
                                    const x2 = center + radius * Math.cos((Math.PI / 180) * endAngle);
                                    const y2 = center + radius * Math.sin((Math.PI / 180) * endAngle);
                                    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

                                    let color = '#ddd';
                                    if (c.phase === 'menstruation') color = '#f5c6c6';
                                    else if (c.phase === 'fertile') color = '#b8d7f5';
                                    else if (c.phase === 'ovulation') color = '#5ba4e5';
                                    else if (c.phase === 'follicular') color = '#c4e3c4';
                                    else if (c.phase === 'luteal') color = '#f3d6f3';

                                    const midAngle = (startAngle + endAngle) / 2;
                                    const textX = center + (radius - 20) * Math.cos((Math.PI / 180) * midAngle);
                                    const textY = center + (radius - 20) * Math.sin((Math.PI / 180) * midAngle);

                                    return (
                                        <g key={i}>
                                            <path
                                                d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                fill={color}
                                                stroke="#fff"
                                            />
                                            <text
                                                x={textX}
                                                y={textY}
                                                textAnchor="middle"
                                                alignmentBaseline="middle"
                                                fontSize="10"
                                                fill="#000"
                                            >
                                                {i + 1}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* vòng tròn giữa và dot */}
                                <circle cx={center} cy={center} r={radius - 35} className="cycle-base" />

                                <text x="50%" y="45%" className="cycle-center-text">
                                    {current?.date?.toISOString().split('T')[0]}
                                </text>
                                <text x="50%" y="55%" className="cycle-center-text">
                                    {current?.phase}
                                </text>

                                <circle
                                    className="cycle-dot"
                                    cx={getDayPosition(currentDayIndex, dotRadius).x}
                                    cy={getDayPosition(currentDayIndex, dotRadius).y}
                                    r={8}
                                />
                            </svg>

                        </div>
                    </div>

                    <div className="calendar-section">
                        <div className="calendar-wrapper">
                            <div className="custom-daypicker">
                                <DayPicker
                                    selected={selectedDate}
                                    onDayClick={(date) => {
                                        setSelectedDate(date);
                                        const mk = getMonthKey(date);
                                        setMonthKey(mk);
                                        if (!dayData[mk]) {
                                            setDayData(prev => ({ ...prev, [mk]: {} }));
                                            setStartDays(prev => ({ ...prev, [mk]: null }));
                                            setCycleDatesMap(prev => ({ ...prev, [mk]: [] }));
                                        }
                                    }}
                                    onMonthChange={async (month) => {
                                        const mk = getMonthKey(month);
                                        setMonthKey(mk);

                                        if (!dayData[mk]) {
                                            try {
                                                if (!userId) return;
                                                const res = await getCyclesByMonth(userId, month.getFullYear(), month.getMonth() + 1);

                                                const updated = {};
                                                const cycleDates = [];

                                                res.data.forEach(entry => {
                                                    const key = entry.cycleDate;
                                                    updated[key] = {
                                                        hasPeriod: entry.hasPeriod,
                                                        flowLevel: entry.flowLevel,
                                                        painLevel: entry.painLevel,
                                                        moodLevel: entry.moodLevel,
                                                        habit: entry.habit,
                                                        discharge: entry.dischargeType,
                                                        weight: entry.weight,
                                                        temperature: entry.temperature,
                                                        note: entry.note
                                                    };
                                                    if (entry.hasPeriod) cycleDates.push(new Date(key));
                                                });

                                                setDayData(prev => ({ ...prev, [mk]: updated }));
                                                setCycleDatesMap(prev => ({ ...prev, [mk]: cycleDates }));
                                                if (cycleDates.length > 0) {
                                                    setStartDays(prev => ({ ...prev, [mk]: cycleDates[0] }));
                                                } else {
                                                    setStartDays(prev => ({ ...prev, [mk]: null }));
                                                }

                                            } catch (err) {
                                                console.error("❌ Không thể tải dữ liệu tháng này:", err);
                                            }
                                        }
                                    }}
                                    modifiers={{
                                        period: (date) => dayData[monthKey]?.[getKey(date)]?.hasPeriod,
                                        fertile: isFertileDay,
                                        ovulation: isOvulationDay
                                    }}
                                    modifiersStyles={{
                                        period: { backgroundColor: '#e74c3c', color: 'white' },
                                        fertile: { backgroundColor: '#3498db', color: 'white' },
                                        ovulation: { backgroundColor: '#2ecc71', color: 'white' }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bloodchart-section"><BloodFlowChart
                        dayData={dayData[monthKey] || {}}
                        cycleDates={cycleDatesMap[monthKey] || []}
                    /></div>

                    <div className="painchart-section"><PainLevelChart
                        dayData={dayData[monthKey] || {}}
                        cycleDates={cycleDatesMap[monthKey] || []}
                    /></div>

                    <div className="cyclechart-section">
                        <CycleHistoryChart
                            data={[
                                { startDate: '17 Feb', cycleLength: 21, periodLength: 4 },
                                { startDate: '10 Mar', cycleLength: 30, periodLength: 5 },
                                { startDate: '9 Apr', cycleLength: 32, periodLength: 4 }
                            ]}
                        />
                    </div>

                </div>
            </div >
        </>
    );
};

export default SmartMenstrualTracker;