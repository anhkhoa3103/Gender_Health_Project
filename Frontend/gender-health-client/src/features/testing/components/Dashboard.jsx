import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { getAllTestResults, getTestResultDetail, getPdfDataByCustomerId } from "../../../api/testResult";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Bar } from "react-chartjs-2";
import "../styles/Dashboard.css";

// Chart.js registration
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Spinner & Toast components
function Spinner() {
  return <span className="spinner_staffresult" />;
}
function Toast({ show, children }) {
  if (!show) return null;
  return <div className="toast_staffresult">{children}</div>;
}

export default function StaffDashboard() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [toastMsg, setToastMsg] = useState("");
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalTestDetails, setModalTestDetails] = useState([]);
  const [modalTestMeta, setModalTestMeta] = useState(null);
  const [modalAppointment, setModalAppointment] = useState(null);
  const [pdfExportLoading, setPdfExportLoading] = useState(false);
  const [pdfExportSuccess, setPdfExportSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/api/sti-appointment/staff/all"),
      getAllTestResults(),
    ])
      .then(([appointmentsRes, testResultsRes]) => {
        setAppointments(
          (appointmentsRes.data || []).map((app) => ({
            id: app.appointmentId || app.id,
            customer: app.customerName || app.customer?.fullName || "Unknown",
            status: app.status || "Unknown",
            amount: app.amount,
            customerId: app.customerId || app.customer_id,
            appointmentId: app.appointmentId || app.id,
          }))
        );
        setTestResults(testResultsRes.data || []);
        setLoading(false);
      })
      .catch(() => {
        setAppointments([]);
        setTestResults([]);
        setLoading(false);
      });
  }, []);

  // Totals
  const totalAppointments = appointments.length;
  const completedTotal = appointments.filter(
    app => (app.status || "").toLowerCase() === "completed"
  ).length;
  const cancelledTotal = appointments.filter(
    app => (app.status || "").toLowerCase() === "canceled" // or 'cancelled' based on your API spelling
  ).length;
  const totalSampled = appointments.filter(
    app => (app.status || "").toLowerCase() === "sampled"
  ).length;

  // --- Chart Data (Not Completed as last bar) ---
  const totalAmount = appointments.reduce((sum, app) => sum + (app.amount || 0), 0);
  const completedAmount = appointments
    .filter(app => (app.status || "").toLowerCase() === "completed")
    .reduce((sum, app) => sum + (app.amount || 0), 0);
  const notCompletedAmount = appointments
    .filter(app => (app.status || "").toLowerCase() !== "completed")
    .reduce((sum, app) => sum + (app.amount || 0), 0);

  const chartData = {
    labels: ["Total", "Completed", "Not Completed"],
    datasets: [
      {
        label: "Amount (VNĐ)",
        data: [totalAmount, completedAmount, notCompletedAmount],
        backgroundColor: [
          "#2563eb", // Total
          "#22c55e", // Completed
          "#ef4444", // Not Completed
        ],
        borderRadius: 7,
        barThickness: 46,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (context) =>
            context.parsed.y
              ? context.parsed.y.toLocaleString("vi-VN") + " VNĐ"
              : "0 VNĐ",
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 15 } },
      },
      y: {
        grid: { color: "#e5e7eb" },
        ticks: {
          font: { size: 13 },
          callback: value => value.toLocaleString("vi-VN"),
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Show result modal
  const handleShowTestResult = async (app) => {
    setModalAppointment(app);
    setResultModalOpen(true);
    setModalLoading(true);
    setModalTestDetails([]);
    setModalTestMeta(null);

    // Find the corresponding result for this appointment
    const foundResult = (testResults || []).find(
      (r) =>
        String(r.appointmentId || r.appointment_id) ===
        String(app.appointmentId || app.id)
    );
    if (foundResult?.resultId || foundResult?.result_id) {
      const resultId = foundResult.resultId || foundResult.result_id;
      try {
        const { data } = await getTestResultDetail(resultId);
        setModalTestDetails(data || []);
        setModalTestMeta(foundResult);
      } catch {
        setModalTestDetails([]);
        setModalTestMeta(null);
      }
    } else {
      setModalTestDetails([]);
      setModalTestMeta(null);
    }
    setModalLoading(false);
  };

  // PDF Export from modal
  const handleModalExportPDF = async () => {
    if (!modalTestMeta?.customerId || !modalTestMeta?.resultId) return;
    setPdfExportLoading(true);
    try {
      const { data: pdfResults } = await getPdfDataByCustomerId(modalTestMeta.customerId);
      const matched = (pdfResults || []).find(
        r => String(r.resultId) === String(modalTestMeta.resultId)
      );
      if (!matched) throw new Error("No PDF data found for this test result.");

      exportToPDF(matched);

      setPdfExportSuccess(true);
      setTimeout(() => setPdfExportSuccess(false), 2200);
    } catch (err) {
      alert("Failed to export PDF!");
    } finally {
      setPdfExportLoading(false);
    }
  };

  function exportToPDF(c) {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor("#2563eb");
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

  function closeResultModal() {
    setResultModalOpen(false);
    setModalTestDetails([]);
    setModalTestMeta(null);
    setModalAppointment(null);
  }

  return (
    <div className="staffdashboard-container">
      <h2 className="staffdashboard-title">Staff Dashboard</h2>
      {/* DASHBOARD GRID ROW */}
      <div className="staffdashboard-summary-row">
        <div className="staffdashboard-summary-cards">
          <div className="staffdashboard-card">
            <span className="icon">📅</span>
            <div className="label">Total Appointments</div>
            <div className="value">{totalAppointments}</div>
          </div>
          <div className="staffdashboard-card">
            <span className="icon">✅</span>
            <div className="label">Total Completed</div>
            <div className="value">{completedTotal}</div>
          </div>
          <div className="staffdashboard-card">
            <span className="icon">🚫</span>
            <div className="label">Total Canceled</div>
            <div className="value">{cancelledTotal}</div>
          </div>
          <div className="staffdashboard-card">
            <span className="icon">🧪</span>
            <div className="label">Total Sampled</div>
            <div className="value">{totalSampled}</div>
          </div>
        </div>
        <div className="staffdashboard-summary-chart">
          <Bar data={chartData} options={chartOptions} height={220} />
        </div>
      </div>

      <div className="staffdashboard-section-title">Recent Appointments</div>
      <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 0 7px rgba(0,0,0,0.07)" }}>
        <table className="staffdashboard-table">
          <thead>
            <tr>
              <th>Appointment #</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 30 }}>
                  <Spinner /> Loading appointments...
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ color: "#777", textAlign: "center" }}>
                  No appointments found.
                </td>
              </tr>
            ) : (
              appointments.map((app) => (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>{app.customer}</td>
                  <td>
                    <span className={`status-badge status-${(app.status || "").toLowerCase()}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>{app.amount?.toLocaleString("vi-VN") || "—"} VNĐ</td>
                  <td>
                    <button
                      style={{
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: 5,
                        padding: "6px 14px",
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                      onClick={() => handleShowTestResult(app)}
                    >
                      Show Test Result
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Test Result Modal */}
      {resultModalOpen && (
        <div className="modal-overlay_staffresult">
          <div className="modal-content_staffresult">
            <h3 style={{ fontWeight: 600, fontSize: 20 }}>
              Test Result for Appointment #{modalAppointment?.id}
            </h3>
            {modalLoading ? (
              <div style={{ margin: "1rem 0" }}>
                <Spinner /> Loading test result details...
              </div>
            ) : modalTestDetails && modalTestDetails.length > 0 ? (
              <table className="detail-table_staffresult">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Test Name</th>
                    <th style={{ textAlign: "center" }}>Value</th>
                    <th style={{ textAlign: "center" }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {modalTestDetails.map((d, i) => (
                    <tr key={i}>
                      <td style={{ textAlign: "center" }}>{d.testName}</td>
                      <td style={{ textAlign: "center" }}>{d.value || "-"}</td>
                      <td style={{ textAlign: "center" }}>
                        {d.result ? (
                          <span className={`result-badge_staffresult ${d.result}`}>
                            {d.result.charAt(0).toUpperCase() + d.result.slice(1)}
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
            <div className="modal-actions_staffresult">
              <button
                className="close-btn_staffresult"
                onClick={closeResultModal}
              >
                Close
              </button>
              <button
                className="export-btn_staffresult"
                onClick={handleModalExportPDF}
                disabled={pdfExportLoading || !modalTestMeta}
                style={{ marginLeft: 8 }}
              >
                {pdfExportLoading && <Spinner />}
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast show={!!pdfExportSuccess}>PDF Exported Successfully!</Toast>
      <Toast show={!!toastMsg}>{toastMsg}</Toast>
    </div>
  );
}