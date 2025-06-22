import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { getTestTypeAxios } from '../../../api/testtype';
import { formatNumberWithDot } from '../helper/helper';
import "../styles/TestType.css";

export default function TestTypeTable({ SubmitPayment }) {
    const [testTypes, setTestTypes] = useState([]);
    const [selectedTypes, setSelectedType] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getTestTypes();
    }, []);
    
    const getTestTypes = async () => {
        try {
            const { data } = await getTestTypeAxios();
            setTestTypes(data);
        } catch (error) {
            console.error("Error fetching test types:", error);
        }
    };

    const handleSubmit = () => {
        if (selectedTypes.length === 0) {
            alert("Please select at least one test type.");
            return;
        }
        const selectedTestTypes = testTypes.filter(type => selectedTypes.includes(type.testId));
        navigate('/payment', { state: { selectedTestTypes } });
    };

    return (
        <div className="test-table-container">
            <table className="test-type-table">
                <thead>
                    <tr>
                        <th>
                            <input
                                checked={selectedTypes.length === testTypes.length && testTypes.length > 0}
                                onChange={() => {
                                    if (selectedTypes.length === testTypes.length) {
                                        setSelectedType([]);
                                    } else {
                                        setSelectedType(testTypes.map(type => type.testId));
                                    }
                                }}
                                type='checkbox'
                                className="table-checkbox"
                            />
                        </th>
                        <th>Test Type ID</th>
                        <th>Test Type Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {testTypes.map((testType) => (
                        <tr key={testType.testId}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedTypes.includes(testType.testId)}
                                    onChange={() => {
                                        if (selectedTypes.includes(testType.testId)) {
                                            setSelectedType(selectedTypes.filter(id => id !== testType.testId));
                                        } else {
                                            setSelectedType([...selectedTypes, testType.testId]);
                                        }
                                    }}
                                    className="table-checkbox"
                                />
                            </td>
                            <td>{testType.testId}</td>
                            <td>{testType.testName}</td>
                            <td>{formatNumberWithDot(testType.price || 0)} VNĐ</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="test-table-actions">
                <button
                    onClick={handleSubmit}
                    className="submit-btn"
                >
                    Submit Payment
                </button>
            </div>
        </div>
    )
}
