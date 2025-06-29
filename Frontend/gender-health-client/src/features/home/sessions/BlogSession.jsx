import React from "react";
import { Link } from "react-router-dom";
import "../styles/BlogSession.css";
import ourblog1 from "../../img/ourblog1.png";
import ourblog2 from "../../img/ourblog2.png";
import ourblog3 from "../../img/ourblog3.png";

const blogs = [
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
];

const BlogSession = () => {
  return (
    <section className="blog-session">
      <h2 className="blog-title">Our Blogs</h2>

      <div className="blog-subtitle">
        HEALTH & NEWS CORNER
        <span className="separator">|</span>{" "}
        <Link to="/blogs" className="view-all">View All</Link>
      </div>

      <div className="blog-list">
        {blogs.map((blog) => (
          <div className="blog-card" key={blog.id}>
            {blog.img && (
              <img src={blog.img} alt={blog.title} className="blog-img" />
            )}
            <div className="blog-content">
              <h3 className="blog-post-title">{blog.title}</h3>
              <p className="blog-post-meta">
                {blog.date} · {blog.readTime}
              </p>
              <p className="blog-post-desc">{blog.desc}</p>
              <Link to={`/blog/${blog.id}`} className="blog-gradient-btn">
                View details
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="blog-view-more-wrapper">
        <Link to="/blogs">
          <button className="blog-view-more-btn">View More</button>
        </Link>
      </div>
    </section>
  );
};

export default BlogSession;