import React, { useEffect, useState, useContext } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getAllAppointments } from "../../../api/stiAppointment";
import {
  getTestResultsByCustomerId,
  getTestResultDetail,
  getPdfDataByCustomerId,
} from "../../../api/testResult";
import { AuthContext } from "../../../context/AuthContext";
import "../styles/appointment-list.css";
import "../../staff/styles/staffResult.css";
import Header from "../../components/Header";

// Spinner with class only!
function Spinner() {
  return <span className="spinner_staffresult" />;
}

// Toast with class only!
function Toast({ show, children }) {
  if (!show) return null;
  return <div className="toast_staffresult">{children}</div>;
}

export default function AppointmentList() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [allTestResults, setAllTestResults] = useState([]);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultModalLoading, setResultModalLoading] = useState(false);
  const [selectedResultDetails, setSelectedResultDetails] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedResultId, setSelectedResultId] = useState(null);

  // PDF Export states
  const [exportLoading, setExportLoading] = useState(false);
  const [pdfExportSuccess, setPdfExportSuccess] = useState(false);

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
    getTestResultsByCustomerId(user.id)
      .then(({ data }) => setAllTestResults(data))
      .catch(() => setAllTestResults([]));
  }, [user]);

  // When click "Show Test Result" for an appointment
  const handleShowTestResult = async (appointment) => {
    setSelectedAppointment(appointment);
    setResultModalOpen(true);
    setResultModalLoading(true);
    setPdfExportSuccess(false);

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
      setSelectedResultId(null);
    }
    setResultModalLoading(false);
  };

  function closeResultModal() {
    setResultModalOpen(false);
    setSelectedResultDetails([]);
    setSelectedAppointment(null);
    setSelectedResultId(null);
  }

  // PDF Export logic (styled like staff)
  const handleModalExportPDF = async () => {
    if (!selectedResultId || !selectedAppointment) return;
    setExportLoading(true);
    try {
      // Find customerId
      const row = (allTestResults || []).find(r => String(r.resultId) === String(selectedResultId));
      const customerId = row ? row.customerId : user.id;

      // Fetch PDF data for this customer
      const { data: pdfResults } = await getPdfDataByCustomerId(customerId);

      // Find the exact result by resultId
      const matched = (pdfResults || []).find(
        (r) => String(r.resultId) === String(selectedResultId)
      );
      if (!matched) throw new Error("No PDF data found for this test result.");

      exportToPDF(matched);

      setPdfExportSuccess(true);
      setTimeout(() => setPdfExportSuccess(false), 2500);
    } catch (err) {
      alert("Failed to fetch data for export PDF!");
    } finally {
      setExportLoading(false);
    }
  };

  // PDF format same as staff result export
  function exportToPDF(c) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor("#e74c3c");
    doc.text("Test Results Summary", 20, 20);

    doc.setFillColor(88, 120, 164);
    doc.rect(20, 35, 170, 8, "F");
    doc.setTextColor("#fff");
    doc.setFontSize(13);
    doc.text("PERSON BEING TESTED", 22, 41);

    doc.setFontSize(11);
    doc.setTextColor("#000");
    let y = 49;
    doc.text(`Name: ${c.customerName || ""}`, 22, y); y += 7;
    doc.text(`Gender: ${c.gender || ""}`, 22, y); y += 7;
    doc.text(`Age: ${c.age !== undefined ? c.age : ""}`, 22, y); y += 7;
    doc.text(`DOB: ${c.dob || c.dateOfBirth || ""}`, 22, y); y += 7;
    doc.text(`Address: ${c.address || ""}`, 22, y); y += 7;

    y += 10;
    doc.setFillColor(88, 120, 164);
    doc.rect(20, y, 170, 8, "F");
    doc.setTextColor("#fff");
    doc.setFontSize(13);
    doc.text("LABORATORY PROCESSING DETAILS", 22, y + 6);

    y += 12;
    doc.setFontSize(11);
    doc.setTextColor("#000");
    doc.text(`Collected: ${c.collectedAt ? new Date(c.collectedAt).toLocaleDateString() : ""}`, 22, y); y += 7;
    doc.text(`Received: ${c.receivedAt ? new Date(c.receivedAt).toLocaleDateString() : ""}`, 22, y); y += 7;
    doc.text(`Reported: ${c.reportedAt ? new Date(c.reportedAt).toLocaleDateString() : ""}`, 22, y); y += 7;

    y += 10;
    doc.setFillColor(88, 120, 164);
    doc.rect(20, y, 170, 8, "F");
    doc.setTextColor("#fff");
    doc.setFontSize(13);
    doc.text("RESULT", 22, y + 6);

    y += 10;
    doc.autoTable({
      startY: y,
      head: [["Test", "Value", "Result", "Lab ID"]],
      body: (c.testDetails || []).map((t, i) => [
        t.testName || `Test ${i + 1}`,
        t.value || "",
        t.result || "",
        t.labId || "",
      ]),
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 2 },
      headStyles: { fillColor: [220, 220, 220] },
      columnStyles: { 0: { cellWidth: 50 } },
      tableWidth: 170,
      margin: { left: 20, right: 20 },
    });

    doc.save(`TestResultsSummary-${c.customerName}.pdf`);
  }

  return (
    <div>
      <div className="header-section">
        <Header />
      </div>
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
                          className="enter-btn_staffresult"
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
                  <td colSpan={4} className="no-appointments">
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
        <div className="modal-overlay_staffresult">
          <div className="modal-content_staffresult">
            <h3>
              Test Result for Appointment #
              {selectedAppointment?.appointmentId ||
                selectedAppointment?.appointment_id}
            </h3>
            {resultModalLoading ? (
              <div style={{ margin: "1rem 0", textAlign: "center" }}>
                Loading test result details...
              </div>
            ) : selectedResultDetails && selectedResultDetails.length > 0 ? (
              <table className="detail-table_staffresult">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Value</th>
                    <th>Result</th>
                    <th>Threshold</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedResultDetails.map((d, i) => (
                    <tr key={i}>
                      <td>{d.testName || d.test_type_name || "-"}</td>
                      <td>{d.value || "-"}</td>
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
                      <td>{d.threshold || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: "#888", margin: "1rem 0" }}>
                No test result detail for this appointment yet.
              </div>
            )}

            <div className="modal-actions_staffresult">
              <button
                className="save-btn_staffresult"
                disabled={exportLoading || !selectedResultDetails.length}
                onClick={handleModalExportPDF}
              >
                {exportLoading && <Spinner />}
                Export PDF
              </button>
              <button
                className="close-btn_staffresult"
                onClick={closeResultModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast show={pdfExportSuccess}>PDF Exported Successfully!</Toast>
    </div>
  );
}
