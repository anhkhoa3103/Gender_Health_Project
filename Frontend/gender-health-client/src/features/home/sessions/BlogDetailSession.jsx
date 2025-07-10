import React, { useEffect } from "react";
import "../styles/BlogDetailSession.css";
import { useParams, Link } from "react-router-dom";
import ourblog1 from "../../img/ourblog1.png";
import ourblog2 from "../../img/ourblog2.png";
import ourblog3 from "../../img/ourblog3.png";
import Header from "../../components/Header";
import Footer from "../sessions/FooterSession";


const blogs = [
    {
        id: 1,
        title: "How Doctor Consultations Can Improve Your Health Journey",
        date: "June 26th, 7:00 pm",
        author: "Dr. Sarah Johnson",
        readTime: "5 min read",
        category: "Health",
        content: "Understanding the importance of regular doctor consultations can significantly impact your overall health journey. Many people underestimate the value of preventive care and routine check-ups.",
        fullContent: `Regular doctor consultations are the cornerstone of preventive healthcare. They provide an opportunity to catch potential health issues before they become serious problems. During these visits, your doctor can monitor your vital signs, update your medical history, and recommend lifestyle changes that can improve your overall well-being.

One of the most significant benefits of regular consultations is early detection. Many serious conditions, including heart disease, diabetes, and certain cancers, can be detected in their early stages through routine screenings and examinations. When caught early, these conditions are often more treatable and have better outcomes.

Your doctor can also help you establish health goals and create a personalized plan to achieve them. Whether you're looking to lose weight, manage stress, or improve your fitness level, a healthcare professional can provide valuable guidance and support throughout your journey.

During consultations, it's important to be honest and open about your symptoms, concerns, and lifestyle habits. This information helps your doctor make accurate assessments and provide appropriate recommendations. Don't hesitate to ask questions or seek clarification about any aspect of your health.

Regular check-ups also provide an opportunity to review and update your medications. As your health status changes, your medication needs may also change. Your doctor can ensure that you're taking the right medications at the correct dosages and can identify any potential drug interactions.

Building a strong relationship with your healthcare provider is invaluable. When you see the same doctor regularly, they become familiar with your medical history and can better understand changes in your health over time. This continuity of care leads to more personalized and effective treatment.

Prevention is always better than cure. By investing in regular doctor consultations, you're taking a proactive approach to your health that can save you time, money, and unnecessary suffering in the long run. Make your health a priority and schedule regular check-ups with your healthcare provider.`,
        img: ourblog1,
        tags: ["Health", "Prevention", "Doctor", "Wellness"]
    },
    {
        id: 2,
        title: "The Role of CT and MRI Scans in Early Diagnosis",
        date: "June 25th, 2:30 pm",
        author: "Dr. Michael Chen",
        readTime: "7 min read",
        category: "Medical Technology",
        content: "Advanced imaging technologies like CT and MRI scans have revolutionized modern medicine by enabling doctors to see inside the human body with unprecedented clarity.",
        fullContent: `Computed Tomography (CT) and Magnetic Resonance Imaging (MRI) scans have transformed the landscape of medical diagnosis. These advanced imaging technologies provide detailed pictures of internal structures, allowing healthcare professionals to identify diseases and conditions that might otherwise go undetected until they reach advanced stages.

CT scans use X-rays and computer processing to create detailed cross-sectional images of the body. They are particularly useful for examining bones, blood vessels, and soft tissues. CT scans are fast, typically taking only a few minutes, making them ideal for emergency situations where quick diagnosis is crucial.

MRI scans, on the other hand, use powerful magnetic fields and radio waves to generate detailed images. They are especially valuable for examining soft tissues, including the brain, spinal cord, muscles, and organs. MRI scans don't use ionizing radiation, making them safer for repeated use and suitable for pregnant women when necessary.

The role of these imaging technologies in early diagnosis cannot be overstated. They can detect tumors when they're still small and more treatable, identify blood clots before they cause strokes, and reveal structural abnormalities that might explain mysterious symptoms.

For cancer diagnosis, both CT and MRI scans play crucial roles in staging, which determines the extent and spread of cancer. This information is vital for developing appropriate treatment plans and predicting outcomes.

In neurological conditions, MRI scans can reveal brain tumors, multiple sclerosis lesions, and stroke damage. They can also help diagnose conditions like Alzheimer's disease by showing changes in brain structure and function.

While these imaging technologies are powerful diagnostic tools, they should be used judiciously. The decision to order a CT or MRI scan should always be based on clinical necessity and the potential benefits should outweigh any risks.`,
        img: ourblog2,
        tags: ["Medical Technology", "Diagnosis", "CT Scan", "MRI", "Healthcare", "Early Detection"]
    },
    {
        id: 3,
        title: "Why Time by the Sea Is Good for Your Mind and Body",
        date: "June 24th, 9:15 am",
        author: "Dr. Emma Wilson",
        readTime: "4 min read",
        category: "Wellness",
        content: "Scientific research has shown that spending time by the ocean can have profound positive effects on both mental and physical health.",
        fullContent: `The therapeutic benefits of spending time by the sea have been recognized for centuries, and modern science is now validating what many have intuitively known. The ocean environment provides a unique combination of factors that promote healing and well-being.

The sound of ocean waves has a naturally calming effect on the human brain. The rhythmic, repetitive nature of wave sounds can induce a meditative state, reducing stress hormones like cortisol and promoting the release of feel-good chemicals like serotonin and dopamine.

Sea air is rich in negative ions, which are believed to increase oxygen flow to the brain, resulting in improved alertness, decreased drowsiness, and increased mental energy. These negative ions may also help balance serotonin levels, which can alleviate depression and stress.

The color blue, dominant in ocean settings, has been shown to have psychological benefits. Blue is associated with calmness, tranquility, and peace. Studies have found that viewing blue environments can lower heart rate and blood pressure, promoting a sense of relaxation.

Physical activities commonly associated with beach environments, such as swimming, walking on sand, and beach volleyball, provide excellent exercise opportunities. Swimming is a full-body, low-impact workout that's easier on joints than many land-based exercises.

The sun exposure that comes with beach time helps the body produce vitamin D, essential for bone health, immune function, and mood regulation. However, it's important to balance sun exposure with proper sun protection to avoid harmful effects.

Beach environments also encourage digital detox. The natural setting invites people to disconnect from technology and reconnect with nature and themselves. This break from constant digital stimulation can reduce anxiety and improve sleep quality.

The vastness of the ocean can also provide perspective on life's challenges, helping to put problems into context and promote a sense of peace and acceptance. Many people find that time by the sea helps them gain clarity and make important decisions.`,
        img: ourblog3,
        tags: ["Wellness", "Mental Health", "Ocean", "Nature", "Relaxation", "Vitamin D"]
    },
];

const BlogDetailSession = () => {
    const { id } = useParams();
    const blog = blogs.find((b) => b.id === parseInt(id));
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);
    if (!blog) return <div className="blog-not-found_blogdetail">Blog not found.</div>;

    const otherBlogs = blogs.filter((b) => b.id !== parseInt(id)).slice(0, 2);

    return (
        <>
            <div className="header-section_blogdetail">
                <Header />
            </div>
            <div className="blog-detail-container_blogdetail">
                <main className="main-content_blogdetail">
                    <nav className="breadcrumb_blogdetail">
                        <Link to="/">Home</Link>
                        <span className="breadcrumb-separator_blogdetail">/</span>
                        <Link to="/blogs">Blogs</Link>
                        <span className="breadcrumb-separator_blogdetail">/</span>
                        <span className="breadcrumb-current_blogdetail">{blog.title}</span>
                    </nav>

                    <div className="blog-header-section_blogdetail">
                        <div className="blog-category_blogdetail">
                            <span className="category-tag_blogdetail">{blog.category}</span>
                        </div>
                        <h1 className="blog-title_blogdetail">{blog.title}</h1>

                        <div className="blog-meta_blogdetail">
                            <div className="author-info_blogdetail">
                                <div className="author-avatar_blogdetail">
                                    {blog.author.split(' ').map(name => name[0]).join('')}
                                </div>
                                <div className="author-details_blogdetail">
                                    <span className="author-name_blogdetail">{blog.author}</span>
                                    <div className="post-details_blogdetail">
                                        <span className="post-date_blogdetail">{blog.date}</span>
                                        <span className="meta-separator_blogdetail">•</span>
                                        <span className="read-time_blogdetail">{blog.readTime}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="blog-actions_blogdetail">
                                <button className="action-btn_blogdetail share-btn_blogdetail">Share</button>
                                <button className="action-btn_blogdetail bookmark-btn_blogdetail">Save</button>
                            </div>
                        </div>
                    </div>

                    <div className="featured-image-container_blogdetail">
                        <img
                            src={blog.img}
                            alt={blog.title}
                            className="featured-image_blogdetail"
                        />
                    </div>

                    <article className="article-content_blogdetail">
                        <div className="article-intro_blogdetail">
                            <p className="intro-text_blogdetail">{blog.content}</p>
                        </div>

                        <div className="table-of-contents_blogdetail">
                            <h3 className="toc-title_blogdetail">Table of Contents</h3>
                            <ul className="toc-list_blogdetail">
                                <li><a href="#understanding" className="toc-link_blogdetail">Understanding the Basics</a></li>
                                <li><a href="#benefits" className="toc-link_blogdetail">Key Benefits</a></li>
                                <li><a href="#implementation" className="toc-link_blogdetail">How to Implement</a></li>
                                <li><a href="#conclusion" className="toc-link_blogdetail">Conclusion</a></li>
                            </ul>
                        </div>

                        <div className="article-body_blogdetail">
                            {blog.fullContent.split('\n\n').map((paragraph, index) => {
                                if (index === 0) {
                                    return (
                                        <div key={index}>
                                            <h2 id="understanding" className="section-heading_blogdetail">Understanding the Basics</h2>
                                            <p className="article-paragraph_blogdetail">{paragraph}</p>
                                        </div>
                                    );
                                } else if (index === 2) {
                                    return (
                                        <div key={index}>
                                            <h2 id="benefits" className="section-heading_blogdetail">Key Benefits</h2>
                                            <p className="article-paragraph_blogdetail">{paragraph}</p>
                                        </div>
                                    );
                                } else if (index === 4) {
                                    return (
                                        <div key={index}>
                                            <h2 id="implementation" className="section-heading_blogdetail">How to Implement</h2>
                                            <p className="article-paragraph_blogdetail">{paragraph}</p>
                                        </div>
                                    );
                                } else if (index === blog.fullContent.split('\n\n').length - 1) {
                                    return (
                                        <div key={index}>
                                            <h2 id="conclusion" className="section-heading_blogdetail">Conclusion</h2>
                                            <p className="article-paragraph_blogdetail">{paragraph}</p>
                                        </div>
                                    );
                                } else {
                                    return <p key={index} className="article-paragraph_blogdetail">{paragraph}</p>;
                                }
                            })}
                        </div>

                        <div className="article-tags_blogdetail">
                            <h3 className="tags-title_blogdetail">Tags:</h3>
                            <div className="tags-container_blogdetail">
                                {blog.tags.map((tag, index) => (
                                    <span key={index} className="tag_blogdetail">{tag}</span>
                                ))}
                            </div>
                        </div>

                        <div className="social-sharing_blogdetail">
                            <h3 className="sharing-title_blogdetail">Share this article:</h3>
                            <div className="social-buttons_blogdetail">
                                <button className="social-btn_blogdetail">Facebook</button>
                                <button className="social-btn_blogdetail">Twitter</button>
                                <button className="social-btn_blogdetail">LinkedIn</button>
                                <button className="social-btn_blogdetail">Email</button>
                            </div>
                        </div>
                    </article>

                    <section className="related-articles_blogdetail">
                        <h2 className="related-title_blogdetail">You might also like</h2>
                        <div className="related-grid_blogdetail">
                            {otherBlogs.map((relatedBlog) => (
                                <Link
                                    key={relatedBlog.id}
                                    to={`/blog/${relatedBlog.id}`}
                                    className="related-card_blogdetail"
                                >
                                    <div className="related-image_blogdetail">
                                        <img src={relatedBlog.img} alt={relatedBlog.title} />
                                        <div className="related-category_blogdetail">{relatedBlog.category}</div>
                                    </div>
                                    <div className="related-content_blogdetail">
                                        <h3 className="related-card-title_blogdetail">{relatedBlog.title}</h3>
                                        <p className="related-excerpt_blogdetail">
                                            {relatedBlog.content.substring(0, 100)}...
                                        </p>
                                        <div className="related-meta_blogdetail">
                                            <span className="related-author_blogdetail">{relatedBlog.author}</span>
                                            <span className="meta-separator_blogdetail">•</span>
                                            <span className="related-date_blogdetail">{relatedBlog.date}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
            <div className="footer-section_blogdetail">
                <Footer />
            </div>
        </>
    );
};

export default BlogDetailSession;
