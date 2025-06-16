import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/Appoinments.css"



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

export default function Appointments_consultation() {
  const navigate = useNavigate();
  return (
    <div className="dashboard_consultation">
      <div className="stats_consultation">
        <div>
          <div className="icon_consultation">👥</div>
          <div>Total services</div>
          <div className="stat-value_consultation">5</div>
        </div>
        <div>
          <div className="icon_consultation">👤</div>
          <div>Total hours of use</div>
          <div className="stat-value_consultation">1.75</div>
        </div>
        <div>
          <div className="icon_consultation">💻</div>
          <div>Total amount spent</div>
          <div className="stat-value_consultation">$290</div>
        </div>
      </div>
      <div className="service-table_consultation">
        <div className="table-header_consultation">
          <button className="filter-btn_consultation">⚲</button>
          <input className="search_consultation" placeholder="Search..." />
        </div>
        <table className="consultation">
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
              <tr key={s.id} className="consultation">
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.desc}</td>
                <td>{s.type}</td>
                <td>{s.time}</td>
                <td>{s.price}</td>
                <td>
                  <img
                    className="avatar_consultation"
                    src={s.consultant.img}
                    alt=""
                  />
                  {s.consultant.name}
                </td>
                <td>
                  <button className="detail-btn_consultation">DETAIL</button>
                </td>
                <td>
                  <button
                    className="cta-button_consultation"
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
