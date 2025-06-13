import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/Appoinments.css";


const services = [
  {
    id: 1,
    name: "GENERAL CHECK-UP",
    desc: "BASIC HEAL A PHYSICIAN",
    type: "OUTPATIENT",
    time: "30 MINUTES",
    price: "$25",
    consultant: { name: "JACK WILLIAM", img: "/avatar1.jpg" },
  },
  {
    id: 2,
    name: "BLOOD TEST",
    desc: "CBC, CHOLESTEROL LEVELS",
    type: "OUTPATIENT",
    time: "15 MINUTES",
    price: "$40",
    consultant: { name: "JACK WILLIAM", img: "/avatar1.jpg" },
  },
  {
    id: 3,
    name: "X-RAY DIAGNOSTIC",
    desc: "CHEST X-RAY, BONE SCAN",
    type: "IMAGING",
    time: "20 MINUTES",
    price: "$75",
    consultant: { name: "JACK WILLIAM", img: "/avatar1.jpg" },
  },
  {
    id: 4,
    name: "X-RAY DIAGNOSTIC",
    desc: "CHEST X-RAY, BONE SCAN",
    type: "IMAGING",
    time: "20 MINUTES",
    price: "$75",
    consultant: { name: "JONATH DOWE", img: "/avatar2.jpg" },
  },
  {
    id: 5,
    name: "X-RAY DIAGNOSTIC",
    desc: "CHEST X-RAY, BONE SCAN",
    type: "IMAGING",
    time: "20 MINUTES",
    price: "$75",
    consultant: { name: "JONATH DOWE", img: "/avatar2.jpg" },
  },
];

export default function Appointments() {
  const navigate = useNavigate();
  return (
    <div className="dashboard">
      <header>
        <div className="location">📍 Location</div>
        <div className="account-btn">My Account</div>
      </header>
      <h1>
        <span className="blue">Gender Healthcare</span> <span className="purple">System</span>
        <span className="project">for SWP Project</span>
      </h1>
      <nav>
        <a href="#">Home</a>
        <a href="#">About Us</a>
        <a className="active" href="#">Service</a>
        <a href="#">Blog</a>
        <a href="#">Contact Us</a>
      </nav>
      <div className="stats">
        <div>
          <div className="icon">👥</div>
          <div>Total services</div>
          <div className="stat-value">5</div>
        </div>
        <div>
          <div className="icon">👤</div>
          <div>Total hours of use</div>
          <div className="stat-value">1.75</div>
        </div>
        <div>
          <div className="icon">💻</div>
          <div>Total amount spent</div>
          <div className="stat-value">$290</div>
        </div>
      </div>
      <div className="service-table">
        <div className="table-header">
          <button className="filter-btn">⚲</button>
          <input className="search" placeholder="Search..." />
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>SERVICE NAME</th>
              <th>DESCRIPTION</th>
              <th>TYPE</th>
              <th>TIME OF EXECUTION</th>
              <th>PRICE</th>
              <th>CONSULTANT</th>
              <th>DETAIL</th>
              <th>FEEDBACK</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.desc}</td>
<td>{s.type}</td>
                <td>{s.time}</td>
                <td>{s.price}</td>
                <td>
                  <img className="avatar" src={s.consultant.img} alt="" />
                  {s.consultant.name}
                </td>
                <td>
                  <button className="detail-btn">DETAIL</button>
                </td>
                <td>
                  <button
            className="cta-button"
            onClick={() => navigate("/feedback")}
          >
            Feeback
          </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
