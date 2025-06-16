import React, { useState } from "react";
import "../styles/ContactSession.css";

const ContactSession = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        availableDate: "",
        email: "",
        note: "",
        phoneCountryCode: "+971",
        phoneNumber: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Booking submitted!");
    };

    return (
        <section className="contact-session">
            <div className="form-container">
                <h2 className="contact-title">Book your appointment now</h2>
                <p className="contact-subtitle">So our team can reach out to you on time</p>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            placeholder="Your full name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="availableDate">Available Date</label>
                        <select
                            id="availableDate"
                            name="availableDate"
                            value={formData.availableDate}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select</option>
                            <option value="2025-06-15">June 15, 2025</option>
                            <option value="2025-06-16">June 16, 2025</option>
                            <option value="2025-06-17">June 17, 2025</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your.email@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="note">Note</label>
                        <textarea
                            id="note"
                            name="note"
                            rows="4"
                            value={formData.note}
                            onChange={handleChange}
                            placeholder="Message"
                        />
                    </div>

                    <div className="form-group phone-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <div className="phone-input-wrapper">
                            <select
                                name="phoneCountryCode"
                                value={formData.phoneCountryCode}
                                onChange={handleChange}
                                className="phone-country-select"
                            >
                                <option value="+971">+971</option>
                                <option value="+84">+84</option>
                                <option value="+1">+1</option>
                                {/* Thêm các mã vùng khác nếu cần */}
                            </select>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                placeholder="Phone number"
                                className="phone-number-input"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-book-now">
                        Book Now <span className="btn-arrow">→</span>
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ContactSession;
