import React, { useEffect, useState } from "react";
import {
  getAllTestResults,
  getTestResultDetail,
  updateTestResultDetail,
} from "../../../api/testResult";
import "../styles/ResultList.css"
export default function TestResultList() {
  const [results, setResults] = useState([]);
  const [detail, setDetail] = useState(null);
  const [editDetail, setEditDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState(null);

  useEffect(() => {
    getAllTestResults()
      .then((res) => setResults(res.data))
      .catch(() => setResults([]));
  }, []);

  const handleShowDetail = async (resultId) => {
    try {
      const res = await getTestResultDetail(resultId);
      setDetail(res.data);
      setEditDetail(res.data.map((d) => ({ ...d })));
      setSelectedResultId(resultId);
      setShowModal(true);
    } catch (err) {
      alert("Failed to fetch details!");
    }
  };

  // Auto-set result based on threshold from DB
  const handleValueChange = (idx, value) => {
    setEditDetail((ed) =>
      ed.map((d, i) => {
        if (i !== idx) return d;
        const threshold = d.threshold ?? 1.0;
        let result = "";
        if (value !== "") {
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            result = numValue > threshold ? "positive" : "negative";
          }
        }
        return { ...d, value, result };
      })
    );
  };

  const handleSave = async () => {
    try {
      if (editDetail && editDetail.length > 0 && selectedResultId) {
        await updateTestResultDetail(selectedResultId, editDetail);
        setDetail(editDetail);
        setShowModal(false);
      }
    } catch (err) {
      alert("Update failed!");
    }
  };

  return (
    <div className="result-table-container">
      <h2 className="result-table-title">Test Results</h2>
      <table className="result-table">
        <thead>
          <tr>
            <th>Result ID</th>
            <th>Customer Name</th>
            <th>Appointment ID</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.resultId}>
              <td>{r.resultId}</td>
              <td>{r.customerName}</td>
              <td>{r.appointmentId}</td>
              <td>
                <button onClick={() => handleShowDetail(r.resultId)}>
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && editDetail && (
        <div className="result-modal-overlay">
          <div className="result-modal-content">
            <h3>Test Result Detail</h3>
            <table className="result-detail-table">
              <thead>
                <tr>
                  <th>Test ID</th>
                  <th>Value</th>
                  <th>Result</th>
                  <th>Threshold</th>
                </tr>
              </thead>
              <tbody>
                {editDetail.map((d, i) => (
                  <tr key={i}>
                    <td>{d.testId}</td>
                    <td>
                      <input
                        type="text"
                        value={d.value || ""}
                        onChange={(e) => handleValueChange(i, e.target.value)}
                      />
                    </td>
                    <td>
                      {d.result ? (
                        <span className={`result-badge ${d.result}`}>
                          {d.result.charAt(0).toUpperCase() + d.result.slice(1)}
                        </span>
                      ) : (
                        <span style={{ color: "#888" }}>—</span>
                      )}
                    </td>
                    <td>
                      {d.threshold}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="result-modal-actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
