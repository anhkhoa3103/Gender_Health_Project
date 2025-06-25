import React, { useEffect, useState, useContext } from "react";
import { getAllAppointments } from "../../../api/stiAppointment";
import {
  getTestResultsByCustomerId,
  getTestResultDetail,
} from "../../../api/testResult";
import { AuthContext } from "../../../context/AuthContext";
import "../styles/appointment-list.css";
import "../styles/ResultList.css";

export default function AppointmentList() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [allTestResults, setAllTestResults] = useState([]);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultModalLoading, setResultModalLoading] = useState(false);
  const [selectedResultDetails, setSelectedResultDetails] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedResultId, setSelectedResultId] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    getAllAppointments()
      .then(({ data }) => {
        setAppointments(
          data.filter(
            (app) =>
              String(app.customerId) === String(user.id) ||
              String(app.customer_id) === String(user.id)
          )
        );
      })
      .catch(() => setAppointments([]));
    // Get all test results for this customer
    getTestResultsByCustomerId(user.id)
      .then(({ data }) => setAllTestResults(data))
      .catch(() => setAllTestResults([]));
  }, [user]);

  // When click "Show Test Result" for an appointment
  const handleShowTestResult = async (appointment) => {
    setSelectedAppointment(appointment);
    setResultModalOpen(true);
    setResultModalLoading(true);

    // Find the test result for this appointment (assume only one result per appointment)
    const foundResult = (allTestResults || []).find(
      (res) =>
        String(res.appointmentId || res.appointment_id) ===
        String(appointment.appointmentId || appointment.appointment_id)
    );
    if (foundResult?.resultId || foundResult?.result_id) {
      const resultId = foundResult.resultId || foundResult.result_id;
      setSelectedResultId(resultId);
      try {
        const { data } = await getTestResultDetail(resultId);
        setSelectedResultDetails(data);
      } catch {
        setSelectedResultDetails([]);
      }
    } else {
      setSelectedResultDetails([]); // No result for this appointment
    }
    setResultModalLoading(false);
  };

  function closeResultModal() {
    setResultModalOpen(false);
    setSelectedResultDetails([]);
    setSelectedAppointment(null);
    setSelectedResultId(null);
  }

  return (
    <div>
      <div className="appointment-container">
        <h1 className="appointment-title">My Appointments</h1>
        <div className="appointment-table-wrapper">
          <table className="appointment-table">
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Status</th>
                <th>Amount</th>
                
                <th>Test Result</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((app) => (
                  <tr key={app.appointmentId || app.appointment_id}>
                    <td>{app.appointmentId || app.appointment_id}</td>
                    <td>
                      <span
                        className={`status-badge status-${(
                          app.status || "unknown"
                        ).toLowerCase()}`}
                      >
                        {app.status || "N/A"}
                      </span>
                    </td>
                    <td>
                      {typeof app.amount === "number"
                        ? app.amount.toLocaleString("vi-VN")
                        : app.amount}
                    </td>
                    
                    <td>
                      {String(app.status).toLowerCase() === "completed" ? (
                        <button
                          onClick={() => handleShowTestResult(app)}
                          className="view-btn"
                        >
                          Show Test Result
                        </button>
                      ) : (
                        <span style={{ color: "#aaa" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="no-appointments">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Test Result Modal */}
      {resultModalOpen && (
        <div className="result-modal-overlay">
          <div className="result-modal-content">
            <h3>
              Test Result for Appointment #
              {selectedAppointment?.appointmentId ||
                selectedAppointment?.appointment_id}
            </h3>
            {resultModalLoading ? (
              <div style={{ margin: "1rem 0" }}>
                Loading test result details...
              </div>
            ) : selectedResultDetails && selectedResultDetails.length > 0 ? (
              <table className="result-detail-table">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Value</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedResultDetails.map((d, i) => (
                    <tr key={i}>
                      <td>{d.testName || d.test_type_name || "-"}</td>
                      <td>{d.value || "-"}</td>
                      <td>
                        {d.result ? (
                          <span className={`result-badge ${d.result}`}>
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
            ) : (
              <div style={{ color: "#888", margin: "1rem 0" }}>
                No test result detail for this appointment yet.
              </div>
            )}
            <div className="result-modal-actions">
              <button onClick={closeResultModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
