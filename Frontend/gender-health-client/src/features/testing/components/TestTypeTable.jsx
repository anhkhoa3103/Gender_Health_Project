import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { getTestTypeAxios } from '../../../api/testtype';
import { formatNumberWithDot } from '../helper/helper';

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
    // Find the actual selected objects (not just IDs)
    const selectedTestTypes = testTypes.filter(type => selectedTypes.includes(type.testId));

    // Navigate to payment summary, passing selected test types
    navigate('/payment', { state: { selectedTestTypes } });
};


    return (
        <div className=' py-20'>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input
                                checked={selectedTypes.length === testTypes.length}
                                onChange={() => {
                                    if (selectedTypes.length === testTypes.length) {
                                        setSelectedType([]);
                                    } else {
                                        setSelectedType(testTypes.map(type => type.testId));
                                    }
                                }}
                                type='checkbox'
                            />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {testTypes.map((testType) => (
                        <tr key={testType.testId}>
                            <td className="px-6 py-4 whitespace-nowrap">
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
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{testType.testId}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{testType.testName}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{formatNumberWithDot(testType.price || 0)} VNĐ</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Submit Payment
                </button>
            </div>
        </div>
    )
}
