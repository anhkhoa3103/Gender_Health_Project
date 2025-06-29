import React from "react";
import "../styles/AboutSession.css";
import { useNavigate } from "react-router-dom";
import doctor1 from "../../img/doctorteam1.png";
import doctor2 from "../../img/doctorteam2.png";
import doctor3 from "../../img/doctorteam3.png";
import doctor4 from "../../img/doctorteam4.png";

const AboutSession = () => {
    const navigate = useNavigate();

    const teamMembers = [
        {
            id: 1,
            name: "Elderly Care",
            role: "Surgery & Internal Medicine Team",
            desc: "We provide health care and support services for seniors, including chronic disease treatment, rehabilitation and appropriate nutritional advice.",
            img: doctor1,
        },
        {
            id: 2,
            name: "Surgical & Specialized Care",
            role: "Medical Team Member",
            desc: "A team of highly specialized doctors in the fields of surgery, internal medicine and post-operative care provide comprehensive diagnosis, treatment and recovery.",
            img: doctor2,
        },
        {
            id: 3,
            name: "Online Medical Consultation",
            role: "Telemedicine Doctor",
            desc: "Remote medical examination through an online platform helps you easily access doctors, save time and costs with absolute confidentiality.",
            img: doctor3,
        },
        {
            id: 4,
            name: "General Health Checkup",
            role: "Multi-specialty Team",
            desc: "Providing regular general health check-up packages, supporting early disease screening with the coordination of many specialties.",
            img: doctor4,
        },
    ];

    return (
        <section className="about-session">
            <div className="about-info">
                <div className="about-left">
                    <h2 className="about-title">
                        We Are Ready to <br />
                        <span className="gradient-text">Help Your Health</span> <br />
                        Problems
                    </h2>
                    <p className="about-desc">
                        In times like today, your health is very important, especially with the
                        increasing number of STI cases. We’re ready to support you with
                        confidential and professional health consultations about STI.
                    </p>
                    <button className="about-button">Medical Team</button>

                    <div className="stats">
                        <div className="stat-item">
                            <span className="stat-number">200<span className="plus">+</span></span>
                            <span className="stat-label">Active Doctor</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">15K<span className="plus">+</span></span>
                            <span className="stat-label">Active User</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">50<span className="plus">+</span></span>
                            <span className="stat-label">Active Pharmacy</span>
                        </div>
                    </div>
                </div>
                <div className="about-right" />
            </div>

            <div className="about-team">
                <h3 className="team-title">
                    Our <span className="gradient-text">Medical Team</span>
                </h3>
                <p className="team-desc">
                    Our experienced and compassionate team is dedicated to providing inclusive,
                    respectful, and high-quality care. We’re here to support your health with
                    professionalism, empathy, and confidentiality.
                </p>

                <div className="team-list">
                    {teamMembers.map((member) => (
                        <div className="team-card" key={member.id}>
                            <div className="team-img-placeholder">
                                <img src={member.img} alt={member.name} className="team-img" />
                            </div>
                            <h4 className="team-name">{member.name}</h4>
                            <p className="team-role">{member.role}</p>
                            <p className="team-desc-text">{member.desc}</p>
                            <button
                                className="team-button"
                                onClick={() => navigate(`/doctor/${member.id}`, { state: member })}
                            >
                                View details
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutSession;