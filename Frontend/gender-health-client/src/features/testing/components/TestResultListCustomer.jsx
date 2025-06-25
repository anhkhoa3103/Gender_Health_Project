import React, { useEffect, useState, useContext } from "react";
import { getTestResultsByCustomerId, getTestResultDetail } from "../../../api/testResult";
import { AuthContext } from "../../../context/AuthContext"; // or your auth path
import "../styles/ResultList.css";

export default function CustomerResultList() {
  const { user } = useContext(AuthContext); // get current logged in user
  const [results, setResults] = useState([]);
  const [detail, setDetail] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.id) {
      getTestResultsByCustomerId(user.id)
        .then((res) => setResults(res.data))
        .catch(() => setResults([]));
    }
  }, [user]);

  const handleShowDetail = async (resultId) => {
    try {
      const res = await getTestResultDetail(resultId);
      setDetail(res.data); // just view, no edit
      setShowModal(true);
    } catch (err) {
      alert("Failed to fetch details!");
    }
  };

  return (
    <div className="result-table-container">
      <h2 className="result-table-title">My Test Results</h2>
      <table className="result-table">
        <thead>
          <tr>
            <th>Result ID</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.resultId}>
              <td>{r.resultId}</td>
              <td>
                <button onClick={() => handleShowDetail(r.resultId)}>
                  Test Result
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && detail && (
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
                {detail.map((d, i) => (
                  <tr key={i}>
                    <td>{d.testId}</td>
                    <td>{d.value}</td>
                    <td>
                      {d.result ? (
                        <span className={`result-badge ${d.result}`}>
                          {d.result.charAt(0).toUpperCase() + d.result.slice(1)}
                        </span>
                      ) : (
                        <span style={{ color: "#888" }}>—</span>
                      )}
                    </td>
                    <td>{d.threshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="result-modal-actions">
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}