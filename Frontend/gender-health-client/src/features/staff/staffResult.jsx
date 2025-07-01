import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  getAllTestResults,
  getTestResultDetail,
  updateTestResultDetail,
  setAppointmentStatusCompleted,
  getPdfDataByCustomerId,
} from "../../api/testResult";
import "./styles/staffResult.css";
import Sidebar from "../components/sidebar";

// Main spinner for the whole table loading
function MainListSpinner() {
  return <span className="mainlist-spinner_staffresult" />;
}

// Small spinner for export button
function Spinner() {
  return <span className="spinner_staffresult" />;
}

// Toast using class only!
function Toast({ show, children }) {
  if (!show) return null;
  return <div className="toast_staffresult">{children}</div>;
}

export default function TestResultList() {
  const [results, setResults] = useState([]);
  const [detail, setDetail] = useState(null);
  const [editDetail, setEditDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const [exportTestResult, setExportTestResult] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [pdfExportSuccess, setPdfExportSuccess] = useState(false);

  // Search bar and loading state
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllTestResults()
      .then((res) => {
        setResults(res.data);
        setLoading(false);
      })
      .catch(() => {
        setResults([]);
        setLoading(false);
      });
  }, []);

  const handleShowDetail = async (resultId) => {
    try {
      const resultRow = results.find((r) => r.resultId === resultId);
      setSelectedAppointmentId(resultRow?.appointmentId);
      setSelectedResultId(resultId);

      const res = await getTestResultDetail(resultId);
      setDetail(res.data);
      setEditDetail(res.data.map((d) => ({ ...d })));
      setShowModal(true);
      setExportTestResult(null);
      setPdfExportSuccess(false);
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
        setLoading(true);
        getAllTestResults()
          .then((res) => {
            setResults(res.data);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      }
    } catch (err) {
      alert("Update failed!");
    }
  };

  // ----------- PDF Export Logic in Modal -----------
  const handleModalExportPDF = async () => {
    if (!selectedResultId) return;
    setExportLoading(true);
    try {
      const row = results.find((r) => r.resultId === selectedResultId);
      const { data: pdfResults } = await getPdfDataByCustomerId(row.customerId);

      // Find the exact result by resultId
      const matched = (pdfResults || []).find(
        (r) => String(r.resultId) === String(selectedResultId)
      );
      if (!matched) throw new Error("No PDF data found for this test result.");
      setExportTestResult(matched);

      exportToPDF(matched);

      setPdfExportSuccess(true);
      setTimeout(() => setPdfExportSuccess(false), 2500);
    } catch (err) {
      alert("Failed to fetch data for export PDF!");
    } finally {
      setExportLoading(false);
    }
  };

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

  // --- Filtered array using search ---
  const filteredResults = results.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    // Check name, appointmentId, resultId
    return (
      (r.customerName && r.customerName.toLowerCase().includes(s)) ||
      String(r.appointmentId).includes(s) ||
      String(r.resultId).includes(s)
    );
  });

  return (
    <>
      <Sidebar />
      <div className="result-container_staffresult">
        <h2 className="result-title_staffresult">Test Results</h2>

        {/* --- Search Bar --- */}
        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search ..."
            className="search-input_staffresult"
            style={{
              padding: "8px 15px",
              borderRadius: 7,
              border: "1px solid #e3e5ea",
              fontSize: 16,
              width: 340,
              marginBottom: 10,
            }}
          />
        </div>

        {loading ? (
          <div>
            <MainListSpinner />
            <div style={{ textAlign: "center", marginTop: 14, color: "#888" }}>Loading test results...</div>
          </div>
        ) : (
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
              {filteredResults.map((r) => (
                <tr key={r.resultId}>
                  <td>{r.resultId}</td>
                  <td>{r.customerName}</td>
                  <td>{r.appointmentId}</td>
                  <td>
                    <button
                      className={
                        r.testDetails?.some((t) => t?.value || t?.result)
                          ? "view-btn_staffresult"
                          : "enter-btn_staffresult"
                      }
                      onClick={() => handleShowDetail(r.resultId)}
                    >
                      {
                        r.testDetails?.some((t) => t?.value || t?.result)
                          ? "View Result"
                          : "Enter Result"
                      }
                    </button>
                  </td>
                </tr>
              ))}
              {filteredResults.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "#888" }}>
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Detail Modal */}
        {showModal && editDetail && (
          <div className="modal-overlay_staffresult">
            <div className="modal-content_staffresult">
              <h3 style={{ fontWeight: 600, fontSize: 20 }}>Test Result Detail</h3>
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
                  {editDetail.map((d, i) => (
                    <tr key={i}>
                      <td>{d.testName}</td>
                      <td>
                        <input
                          type="text"
                          value={d.value || ""}
                          onChange={(e) => handleValueChange(i, e.target.value)}
                          className="input-value_staffresult"
                        />
                      </td>
                      <td>
                        {d.result ? (
                          <span className={`result-badge_staffresult ${d.result}`}>
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
                <button
                  className="export-btn_staffresult"
                  disabled={exportLoading}
                  onClick={handleModalExportPDF}
                >
                  {exportLoading && <Spinner />}
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        )}

        <Toast show={pdfExportSuccess}>PDF Exported Successfully!</Toast>
      </div>
    </>
  );
}