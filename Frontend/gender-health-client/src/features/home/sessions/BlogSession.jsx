import React from "react";
import "../styles/BlogSession.css";

const blogs = [
  {
    id: 1,
    title: "What Traveling Greece For 2 Weeks Taught Me About Life",
    date: "Jun 21, 2021",
    readTime: "11 min read",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam mollis lectus vitae nulla malesuada amet purus sed. A condimentum tempus a egestas sodales diam cras.",
    img: null, // Thay bằng đường dẫn ảnh nếu có
  },
  {
    id: 2,
    title: "What Traveling Greece For 2 Weeks Taught Me About Life",
    date: "Jun 21, 2021",
    readTime: "11 min read",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam mollis lectus vitae nulla malesuada amet purus sed. A condimentum tempus a egestas sodales diam cras.",
    img: null,
  },
  {
    id: 3,
    title: "What Traveling Greece For 2 Weeks Taught Me About Life",
    date: "Jun 21, 2021",
    readTime: "11 min read",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam mollis lectus vitae nulla malesuada amet purus sed. A condimentum tempus a egestas sodales diam cras.",
    img: null,
  },
];

const BlogSession = () => {
  return (
    <section className="blog-session">
      <h2 className="blog-title">
        Our Blogs
      </h2>
      <div className="blog-subtitle">
        HEALTH & NEWS CORNER <span className="separator">|</span> <a href="#" className="view-all">View All</a>
      </div>

      <div className="blog-list">
        {blogs.map(blog => (
          <div className="blog-card" key={blog.id}>
            <div className="blog-img-placeholder" />
            <div className="blog-content">
              <h3 className="blog-post-title">{blog.title}</h3>
              <p className="blog-post-meta">{blog.date} · {blog.readTime}</p>
              <p className="blog-post-desc">{blog.desc}</p>
              <button className="blog-btn-details">
                View details <span className="arrow">›</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="blog-view-more-wrapper">
        <button className="blog-view-more-btn">View More</button>
      </div>
    </section>
  );
};

export default BlogSession;
