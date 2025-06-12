import React from "react";
import "../styles/FooterSession.css";

const FooterSession = () => {
    return (
        <footer className="footer-session">
            <div className="footer-top">
                <div className="footer-left">
                    <h3>Gender Healthcare System</h3>
                    <p>for SWP Project</p>
                </div>
                <div className="footer-right">
                    <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                        <i className="fab fa-youtube"></i>
                    </a>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                </div>
            </div>
            <div className="footer-bottom">
                    <p>CompanyName @ 202X. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default FooterSession;
