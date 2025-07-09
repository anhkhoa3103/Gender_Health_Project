import { useEffect, useState, useContext } from "react";
import { getPackagesAxios } from "../../../api/package";
import { getCustomerById } from "../../../api/customer";
import { AuthContext } from "../../../context/AuthContext";
import { formatNumberWithDot } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import TestTypeTable from "./TestTypeTable";
import axios from "axios";
import "../styles/Packages.css";

// Modal for missing info
function MissingInfoModal({ open, missingLabels, onConfirm }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-title">Incomplete Profile</div>
        <div className="modal-message">
          Please fill out the following information before making a purchase:
          <ul style={{ textAlign: "left", margin: "12px 0 0 22px" }}>
            {missingLabels.map((label) => (
              <li key={label} style={{ color: "#e74c3c" }}>
                • {label}
              </li>
            ))}
          </ul>
        </div>
        <button className="modal-close-btn" onClick={onConfirm}>
          Go to Profile
        </button>
      </div>
    </div>
  );
}

export default function PackageList() {
  const [packages, setPackages] = useState([]);
  const [selectedTestTypeIds, setSelectedTestTypeIds] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [missingLabels, setMissingLabels] = useState([]);
  const [missingFieldNames, setMissingFieldNames] = useState([]);

  useEffect(() => {
    const getPackages = async () => {
      try {
        const { data } = await getPackagesAxios();
        setPackages(data);
      } catch (error) {
        console.log(error);
      }
    };
    getPackages();
  }, []);

  // Validate info fields and auto-select test types in table when clicking package
 const handleBuyNow = async (pm) => {
  if (!user?.id) {
    alert("Please log in first.");
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
    const missingFields = requiredFields.filter(
      (f) => !info[f.name] || info[f.name].toString().trim() === ""
    );
    if (missingFields.length > 0) {
      setMissingLabels(missingFields.map((f) => f.label));
      setMissingFieldNames(missingFields.map((f) => f.name));
      setModalOpen(true);
      return;
    }
    // All info is filled, auto-select test types from package in the table
    // Fetch test types for the package
    const resp = await axios.get(
      "http://localhost:8080/api/package/" + pm.packageId + "/test-types"
    );
    const ids = resp.data.map((testType) => testType.testId);
    setSelectedTestTypeIds(ids);

    // Navigate to /payment, passing both the package info and selected test types
    navigate("/payment", {
      state: {
        selectedTestTypes: resp.data, // full list of test type objects
        package: pm                   // the package object itself
      }
    });
  } catch (err) {
    alert("Failed to validate customer info.");
  }
};


  // Modal confirm: navigate to customer info
  const handleModalConfirm = () => {
    setModalOpen(false);
    navigate("/customer-info", {
      state: { missingFields: missingFieldNames },
    });
  };

  return (
    <div className="sti-testing-wrapper">
      <MissingInfoModal
        open={modalOpen}
        missingLabels={missingLabels}
        onConfirm={handleModalConfirm}
      />

      {/* Feature section */}
      <div className="service-features-box">
        <h2 className="service-title_experience">
          For the Best Testing Experience, Our Service Includes
        </h2>
        <div className="service-features-grid">
          <div className="feature-item">
            <div className="feature-icon">🔒</div>
            <p>Secure and confidential STD testing services</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📄</div>
            <p>FDA-approved / cleared tests performed in CLIA-certified labs</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📅</div>
            <p>The fastest results possible - available in 1 to 2 days</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⏰</div>
            <p>Private ordering online or by phone</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">👨‍⚕️</div>
            <p>Doctor consultations available for positive test results</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📞</div>
            <p>Care Advisors available at 1-800-456-2323</p>
          </div>
        </div>
      </div>

      <h1 className="sti-title">STI Testing Package</h1>
      <p className="sti-subtitle">STI Test Prices and Packages</p>

      <div className="sti-section">
        <div className="package-card-list">
          {packages.map((pm, index) => (
            <div key={index} className="sti-package-card">
              <h2 className="package-name">{pm.packageName}</h2>
              <p className="package-price">
                {formatNumberWithDot(pm.totalPrice || 0)} VNĐ
              </p>
              <button onClick={() => handleBuyNow(pm)} className="package-btn">
                Get Tested Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Individual test price table here */}
      <div className="sti-test-table">
        <h1 className="sti-title">Individual Test Type</h1>
        <p className="sti-subtitle">Individual test type price</p>
        <TestTypeTable selectedByPackage={selectedTestTypeIds} />
      </div>

      {/* FAQ section */}
      <div className="faq-section">
        <h2 className="faq-title">Complete STD Testing at Unbeatable Prices</h2>
        <p className="faq-subtitle">
          You may be concerned about the best time to test for STDs. If you have
          had unprotected sexual contact, our doctors recommend testing 3 weeks
          after initial exposure, and again 3 months after to confirm your
          initial diagnosis...
        </p>
        {/* ...the rest of your FAQ blocks, unchanged ... */}
        <div className="faq-block">
          <h3>Why test with STDcheck.com?</h3>
          <ul>
            <li>Private and Confidential STD Testing Service</li>
            <li>
              We are the only testing service to offer FDA-approved HIV RNA
              Early Detection testing
            </li>
            <li>We have over 4,500 convenient testing locations nationwide</li>
            <li>
              All-inclusive 10-Test Panel tests for all common STDs, including
              hepatitis A and HIV-2
            </li>
            <li>Fast test results in 1–2 days</li>
            <li>
              Doctor consultation and treatment available upon positive results
            </li>
            <li>All services approved and managed by our physicians</li>
          </ul>
        </div>
        <div className="faq-block">
          <h3>
            What are the differences between the HIV RNA test and the HIV 4th
            Generation Antibody test?
          </h3>
          <p>
            The HIV RNA test can detect HIV sooner than any other test; as early
            as 9–11 days after exposure...
          </p>
        </div>
        <div className="faq-block">
          <h3>What happens next?</h3>
          <p>
            STDcheck.com makes testing for STDs fast and convenient. Select a
            testing center closest to you...
          </p>
        </div>
        <div className="faq-block">
          <h3>Do I have to set an appointment?</h3>
          <p>
            No, it is not necessary for you to set an appointment for STD
            testing...
          </p>
        </div>
        <div className="faq-block">
          <h3>
            Will everyone at the Lab Center know what I'm getting tested for?
          </h3>
          <p>No. Our lab centers test for many diseases other than STDs...</p>
        </div>
        <div className="faq-block">
          <h3>Is this private?</h3>
          <p>
            We go well above and beyond standard industry practices to provide
            you with the utmost privacy...
          </p>
        </div>
        <div className="faq-block">
          <h3>How does the doctor consultation work?</h3>
          <p>
            If you test positive for an STD, you will be able to speak with one
            of our physicians...
          </p>
        </div>
        <div className="faq-block">
          <h3>Is there anything I have to do before or after the test?</h3>
          <p>
            It depends on the type of test you are taking. If you are taking a
            blood test...
          </p>
        </div>
        <div className="faq-block">
          <h3>How soon can I take the test after ordering?</h3>
          <p>
            You can take your STD test as soon as you have completed your
            order...
          </p>
        </div>
        <div className="faq-block">
          <h3>How long is the lab visit?</h3>
          <p>Testing for STDs with STDcheck.com usually takes 5 minutes...</p>
        </div>
        <div className="faq-block">
          <h3>Do I need to bring anything to the lab for my test?</h3>
          <p>
            We do not require you to bring anything to the test center other
            than your Lab Requisition Form...
          </p>
        </div>
      </div>
    </div>
  );
}