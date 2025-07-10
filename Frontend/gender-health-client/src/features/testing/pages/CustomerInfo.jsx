import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { getCustomerById, updateCustomer } from "../../../api/customer";
import { AuthContext } from "../../../context/AuthContext";
import Header from "../../components/Header";
import "../styles/CustomerProfile.css";

export default function UserProfile() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const missingFields = location.state?.missingFields || [];

  useEffect(() => {
    if (!user?.id) return;
    getCustomerById(user.id)
      .then(res => {
        setCustomer(res.data);
        setFormData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (missingFields.length > 0) setEditMode(true);
  }, [missingFields]);

  // === Loading Spinner ===
  if (loading) return (
    <div className="loader">
      <div className="loader-spinner"></div>
    </div>
  );
  if (!customer) return <div>No customer information found.</div>;

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setFormData(customer);
    setEditMode(false);
  };

  // Avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          avatar: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateCustomer(customer.customerId, formData);
      setEditMode(false);
      setCustomer({ ...customer, ...formData });
    } catch (e) {
      alert("Update failed.");
    }
  };

  const avatarUrl = formData.avatar || "https://via.placeholder.com/120";

  // CSS helper
  const highlightIfMissing = (field) =>
    missingFields.includes(field) ? " highlight-missing" : "";

  return (
    <>
      <Header />
      <div className="profile-fa-main-container">
        <div className="profile-fa-card">
          {/* LEFT */}
          <div className="profile-fa-left">
            <label
              className={`profile-fa-avatar-label ${editMode ? "editable" : ""}`}
              title={editMode ? "Click to change avatar" : ""}
            >
              <img
                src={avatarUrl}
                alt="avatar"
                className="profile-fa-avatar"
              />
              {editMode && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
              )}
            </label>
            <div className="profile-fa-name">{formData.fullName || "Customer name"}</div>
            <div className="profile-fa-email">{formData.email || ""}</div>
          </div>
          {/* Divider */}
          <div className="profile-fa-divider"></div>
          {/* RIGHT */}
          <div className="profile-fa-right">
            {!editMode ? (
              <>
                <div className="profile-fa-info">
                  <div>
                    <span className="profile-fa-label">Name:</span>
                    <span className={`profile-fa-value${highlightIfMissing("fullName")}`}>{formData.fullName || "-"}</span>
                  </div>
                  <div>
                    <span className="profile-fa-label">Email:</span>
                    <span className={`profile-fa-value${highlightIfMissing("email")}`}>{formData.email || "-"}</span>
                  </div>
                  <div>
                    <span className="profile-fa-label">Phone:</span>
                    <span className={`profile-fa-value${highlightIfMissing("phone")}`}>{formData.phone || "-"}</span>
                  </div>
                  <div>
                    <span className="profile-fa-label">Birthdate:</span>
                    <span className={`profile-fa-value${highlightIfMissing("dateOfBirth")}`}>{formData.dateOfBirth || "-"}</span>
                  </div>
                  <div>
                    <span className="profile-fa-label">Gender:</span>
                    <span className={`profile-fa-value${highlightIfMissing("gender")}`}>{formData.gender || "-"}</span>
                  </div>
                  <div>
                    <span className="profile-fa-label">Address:</span>
                    <span className={`profile-fa-value${highlightIfMissing("address")}`}>{formData.address || "-"}</span>
                  </div>
                </div>
                <button className="profile-fa-edit-btn" onClick={handleEdit}>
                  Edit Profile
                </button>
              </>
            ) : (
              <form className="profile-fa-edit-form" onSubmit={handleSave} autoComplete="off">
                <div className="profile-fa-info">
                  <div>
                    <span className="profile-fa-label">Name:</span>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName || ""}
                      onChange={handleChange}
                      className={`profile-fa-input${highlightIfMissing("fullName")}`}
                      required
                    />
                  </div>
                  <div>
                    <span className="profile-fa-label">Email:</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      className={`profile-fa-input${highlightIfMissing("email")}`}
                      required
                    />
                  </div>
                  <div>
                    <span className="profile-fa-label">Phone:</span>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleChange}
                      className={`profile-fa-input${highlightIfMissing("phone")}`}
                    />
                  </div>
                  <div>
                    <span className="profile-fa-label">Birthdate:</span>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth || ""}
                      onChange={handleChange}
                      className={`profile-fa-input${highlightIfMissing("dateOfBirth")}`}
                    />
                  </div>
                  <div>
                    <span className="profile-fa-label">Gender:</span>
                    <select
                      name="gender"
                      value={formData.gender || ""}
                      onChange={handleChange}
                      className={`profile-fa-input${highlightIfMissing("gender")}`}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <span className="profile-fa-label">Address</span>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleChange}
                      className={`profile-fa-input${highlightIfMissing("address")}`}
                    />
                  </div>
                </div>
                <div className="profile-fa-edit-actions">
                  <button type="submit" className="profile-fa-save-btn">
                    Save Changes
                  </button>
                  <button type="button" className="profile-fa-cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
