import React, { useEffect, useState, useContext, useMemo } from 'react'
import { useNavigate } from "react-router-dom";
import { getTestTypeAxios } from '../../../api/testtype';
import { getCustomerById } from "../../../api/customer";
import { AuthContext } from "../../../context/AuthContext";
import { formatNumberWithDot } from '../helper/helper';
import "../styles/TestType.css";

// Modal for missing info and missing selection
function InfoModal({ open, title, message, fields, onConfirm }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-title">{title}</div>
        <div className="modal-message">
          {message}
          {fields && fields.length > 0 && (
            <ul style={{ textAlign: "left", margin: "12px 0 0 22px" }}>
              {fields.map((f, i) =>
                <li key={i} style={{ color: "#e74c3c" }}>{f.label || f}</li>
              )}
            </ul>
          )}
        </div>
        <button className="modal-close-btn" onClick={onConfirm}>
          OK
        </button>
      </div>
    </div>
  );
}

export default function TestTypeTable() {
  const [testTypes, setTestTypes] = useState([]);
  const [selectedTypes, setSelectedType] = useState([]);
  const [showNoSelectionModal, setShowNoSelectionModal] = useState(false);
  const [showMissingInfoModal, setShowMissingInfoModal] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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

  // Select all logic for **all test types**
  const isAllSelected = testTypes.length > 0 && testTypes.every(type => selectedTypes.includes(type.testId));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedType([]);
    } else {
      setSelectedType(testTypes.map(type => type.testId));
    }
  };

  // Total for all selected
  const totalPrice = useMemo(() => {
    return testTypes
      .filter(type => selectedTypes.includes(type.testId))
      .reduce((sum, type) => sum + (type.price || 0), 0);
  }, [selectedTypes, testTypes]);

  const handleSubmit = async () => {
    if (selectedTypes.length === 0) {
      setShowNoSelectionModal(true);
      return;
    }
    if (!user?.id) {
      navigate("/login");
      return;
    }
    try {
      const res = await getCustomerById(user.id);
      const info = res.data;
      const requiredFields = [
        { name: "fullName", label: "Name" },
        { name: "email", label: "Email" },
        { name: "phone", label: "Phone" },
        { name: "dateOfBirth", label: "Birthdate" },
        { name: "gender", label: "Gender" },
        { name: "address", label: "Location" },
      ];
      const missing = requiredFields.filter(
        (f) => !info[f.name] || info[f.name].toString().trim() === ""
      );
      if (missing.length > 0) {
        setMissingFields(missing);
        setShowMissingInfoModal(true);
        return;
      }
      // All good, proceed to payment
      const selectedTestTypes = testTypes.filter(type => selectedTypes.includes(type.testId));
      navigate('/payment', { state: { selectedTestTypes } });
    } catch (error) {
      alert("Failed to validate customer info.");
    }
  };

  // Modal actions
  const handleNoSelectionOk = () => setShowNoSelectionModal(false);
  const handleMissingInfoOk = () => {
    setShowMissingInfoModal(false);
    navigate("/customer-info", {
      state: { missingFields: missingFields.map(f => f.name) },
    });
  };

  return (
    <>
      {/* Modal for missing selection */}
      <InfoModal
        open={showNoSelectionModal}
        title="Missing Selection"
        message="Please select at least one test type before submitting payment."
        onConfirm={handleNoSelectionOk}
      />
      {/* Modal for missing info */}
      <InfoModal
        open={showMissingInfoModal}
        title="Incomplete Profile"
        message="Please fill out the following information before making a purchase:"
        fields={missingFields}
        onConfirm={handleMissingInfoOk}
      />
      <div className="test-table-container">
        <table className="test-type-table">
          <thead>
            <tr>
              <th>
                <input
                  checked={isAllSelected}
                  onChange={handleSelectAll}
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
      </div>
      {/* Total */}
      <div className="test-table-summary">
        <p><strong>Total:</strong> {formatNumberWithDot(totalPrice)} VNĐ</p>
      </div>
      {/* Only submit button */}
      <div className="test-table-actions">
        <button
          onClick={handleSubmit}
          className="submit-btn"
        >
          Submit Payment
        </button>
      </div>
    </>
  )
}
