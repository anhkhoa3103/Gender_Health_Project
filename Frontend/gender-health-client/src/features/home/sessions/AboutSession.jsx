import React from "react";
import "../styles/AboutSession.css";

const AboutSession = () => {


    const teamMembers = [
        {
            id: 1,
            name: "Name",
            role: "Medical Team Member",
            desc: "Worem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
            img: null, // Bạn có thể thêm đường dẫn ảnh ở đây
        },
        {
            id: 2,
            name: "Name",
            role: "Medical Team Member",
            desc: "Worem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
            img: null,
        },
        {
            id: 3,
            name: "Name",
            role: "Medical Team Member",
            desc: "Worem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
            img: null,
        },
        {
            id: 4,
            name: "Name",
            role: "Medical Team Member",
            desc: "Worem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
            img: null,
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
                <h3 className="team-title">Our <span className="gradient-text">Medical Team</span></h3>
                <p className="team-desc">
                    Our experienced and compassionate team is dedicated to providing inclusive,
                    respectful, and high-quality care. We’re here to support your health with
                    professionalism, empathy, and confidentiality.
                </p>

                <div className="team-list">
                    {teamMembers.map((member) => (
                        <div className="team-card" key={member.id}>
                            <div className="team-img-placeholder" />
                            <h4 className="team-name">{member.name}</h4>
                            <p className="team-role">{member.role}</p>
                            <p className="team-desc-text">{member.desc}</p>
                            <button className="team-button">View details</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutSession;
