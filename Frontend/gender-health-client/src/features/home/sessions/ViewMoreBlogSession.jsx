import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header.jsx";
import FooterSession from "../sessions/FooterSession.jsx";
import "../styles/ViewMoreBlogSession.css";

// Ảnh tĩnh
import ourblog1 from "../../img/ourblog1.png";
import ourblog2 from "../../img/ourblog2.png";
import ourblog3 from "../../img/ourblog3.png";

// Dữ liệu blog tĩnh (đã thống nhất dùng `img`)
const blogData = [
  {
    id: 1,
    title: "How Doctor Consultations Can Improve Your Health Journey",
    date: "May 10, 2024",
    readTime: "11 min read",
    desc: "Effective communication with your doctor can lead to better treatment outcomes, increased confidence in care, and a stronger focus on prevention.",
    img: ourblog1,
  },
  {
    id: 2,
    title: "The Role of CT and MRI Scans in Early Diagnosis",
    date: "May 23, 2024",
    readTime: "8 min read",
    desc: "Medical imaging technology allows doctors to detect and monitor health issues with incredible precision—often before symptoms appear.",
    img: ourblog2,
  },
  {
    id: 3,
    title: "Why Time by the Sea Is Good for Your Mind and Body",
    date: "June 1, 2024",
    readTime: "5 min read",
    desc: "Spending time in nature—especially by the ocean—can reduce stress, elevate mood, and enhance your overall wellbeing.",
    img: ourblog3,
  },
  {
    id: 4,
    title: "How Balanced Nutrition Boosts Your Immune System",
    date: "June 10, 2024",
    readTime: "7 min read",
    desc: "A diet rich in fruits, vegetables, and whole grains strengthens your immune system and helps prevent chronic diseases.",
    img: "https://dubailondonhospital.com/wp-content/uploads/2022/09/immunity.jpg",
  },
  {
    id: 5,
    title: "Yoga and Its Mental Health Benefits",
    date: "June 20, 2024",
    readTime: "6 min read",
    desc: "Practicing yoga regularly can improve flexibility, reduce anxiety, and support mental clarity.",
    img: "https://cdn.tgdd.vn/Files/2022/12/22/1497387/cach-tap-yoga-giup-cai-thien-tinh-than-ho-tro-chua-benh-tram-cam-202212220625036753.jpg",
  },
  {
    id: 6,
    title: "Hydration and Your Health: What You Need to Know",
    date: "July 1, 2024",
    readTime: "4 min read",
    desc: "Drinking enough water daily is crucial for digestion, energy, and brain function.",
    img: "https://www.opalphysio.ca/wp-content/uploads/2022/10/Importance-Of-Staying-Hydrated-1024x576.jpg",
  }
];

const ViewMoreBlogSession = () => {
  const [visibleCount, setVisibleCount] = useState(3);

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const visibleBlogs = blogData.slice(0, visibleCount);

  return (
    <div className="page-wrapper">
      <div className="header-wrapper">
        <Header />
      </div>

      <section className="view-more-container">
        <h1 className="section-title">Our Blogs</h1>
        <div className="section-subtitle">HEALTH & NEWS CORNER</div>

        <div className="blog-grid">
          {visibleBlogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <img src={blog.img} alt={blog.title} className="blog-image" />
              <div className="blog-content">
                <h2 className="blog-title">{blog.title}</h2>
                <p className="blog-meta">{blog.date} · {blog.readTime}</p>
                <p className="blog-description">{blog.desc}</p>
                <Link to={`/blog/${blog.id}`} className="view-button">
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < blogData.length && (
          <div className="view-more-wrapper">
            <button className="view-more-button" onClick={handleViewMore}>
              View More
            </button>
          </div>
        )}
      </section>

      <FooterSession />
    </div>
  );
};

export default ViewMoreBlogSession;
