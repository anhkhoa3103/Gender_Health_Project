import React, { useEffect, useState } from "react";
import {
  getAllTestResults,
  getTestResultDetail,
  updateTestResultDetail,
  setAppointmentStatusCompleted,
} from "../../api/testResult";
import "./styles/staffResult.css";
import Sidebar from "../components/sidebar";

export default function TestResultList() {
  const [results, setResults] = useState([]);
  const [detail, setDetail] = useState(null);
  const [editDetail, setEditDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  useEffect(() => {
    getAllTestResults()
      .then((res) => setResults(res.data))
      .catch(() => setResults([]));
  }, []);

  const handleShowDetail = async (resultId) => {
    try {
      const resultRow = results.find((r) => r.resultId === resultId);
      setSelectedAppointmentId(resultRow?.appointmentId);

      const res = await getTestResultDetail(resultId);
      setDetail(res.data);
      setEditDetail(res.data.map((d) => ({ ...d })));
      setSelectedResultId(resultId);
      setShowModal(true);
    } catch (err) {
      alert("Failed to fetch details!");
    }
  };

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
        if (selectedAppointmentId) {
          await setAppointmentStatusCompleted(selectedAppointmentId);
        }
        setDetail(editDetail);
        setShowModal(false);
        getAllTestResults().then((res) => setResults(res.data));
      }
    } catch (err) {
      alert("Update failed!");
    }
  };

  return (
    <>
      <Sidebar />
      <div className="result-container_staffresult">
        <h2 className="result-title_staffresult">Test Results</h2>
        <table className="result-table_staffresult">
          <thead>
            <tr>
              <th>Result ID</th>
              <th>Customer Name</th>
              <th>Appointment ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.resultId}>
                <td>{r.resultId}</td>
                <td>{r.customerName}</td>
                <td>{r.appointmentId}</td>
                <td>
                  <button
                    className="enter-btn_staffresult"
                    onClick={() => handleShowDetail(r.resultId)}
                  >
                    Enter Result
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && editDetail && (
          <div className="modal-overlay_staffresult">
            <div className="modal-content_staffresult">
              <h3>Test Result Detail</h3>
              <table className="detail-table_staffresult">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Value</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {editDetail.map((d, i) => (
                    <tr key={i}>
                      <td>{d.testName}</td>
                      <td>
                        <input
                          type="text"
                          value={d.value || ""}
                          onChange={(e) =>
                            handleValueChange(i, e.target.value)
                          }
                          className="input-value_staffresult"
                        />
                      </td>
                      <td>
                        {d.result ? (
                          <span className={`result-badge_staffresult ${d.result}`}>
                            {d.result.charAt(0).toUpperCase() +
                              d.result.slice(1)}
                          </span>
                        ) : (
                          <span style={{ color: "#888" }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="modal-actions_staffresult">
                <button
                  className="save-btn_staffresult"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="close-btn_staffresult"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
