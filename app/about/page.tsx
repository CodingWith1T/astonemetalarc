"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
    {
        question: "What is a Pre Engineered Building (PEB)?",
        answer: "A Pre Engineered Building is a steel structure system where all components are designed, fabricated, and pre-assembled at the factory, then transported to site for quick erection. PEBs offer 30-40% faster construction than conventional buildings.",
    },
    {
        question: "What services does Astone Metal Arc offer?",
        answer: "We provide end-to-end PEB solutions including design, fabrication, and erection of industrial sheds, factory buildings, warehouses, mezzanine floors, prefab cold storage, PEB cargo sheds, commercial warehouses, rice mill structures, and aircraft hangars across India.",
    },
    {
        question: "How long does a PEB project typically take?",
        answer: "PEB construction is significantly faster than conventional methods. A typical industrial shed (50,000 sq ft) can be completed in 8-12 weeks from order to erection, depending on design complexity and site conditions.",
    },
    {
        question: "Do you provide turnkey PEB solutions?",
        answer: "Yes, we offer complete turnkey PEB solutions — from structural design and engineering to factory fabrication, transportation, on-site erection, and project handover. We manage the entire project lifecycle.",
    },
    {
        question: "What is the warranty on your steel structures?",
        answer: "Our PEB structures come with a 25+ year structural warranty. We use high-grade steel (IS 2062 / ASTM A572) with galvanized or painted finishes for corrosion protection and long-term durability.",
    },
    {
        question: "Can you build multi-storey steel buildings?",
        answer: "Yes, we specialize in multi-storey steel buildings including mezzanine floors, multi-level warehouses, and commercial complexes. Our engineering team designs for optimal load-bearing and seismic compliance.",
    },
    {
        question: "Do you provide free project estimates?",
        answer: "Yes, we offer free project estimates and preliminary design consultations. Share your requirements (location, dimensions, usage, load requirements) and our team will provide a detailed quotation within 48 hours.",
    },
    {
        question: "What locations do you serve in India?",
        answer: "We have delivered projects across 28+ locations in India including Uttar Pradesh, Delhi NCR, Maharashtra, Gujarat, Rajasthan, Tamil Nadu, Karnataka, and more. We also execute international projects in Africa, Middle East, and Southeast Asia.",
    },
    {
        question: "What are the advantages of PEB over conventional construction?",
        answer: "PEB offers: 30-40% faster construction, 20-30% cost savings, column-free large spans (up to 100m), lighter foundation requirements, easy future expansion, factory-controlled quality, and lower maintenance costs.",
    },
    {
        question: "Do you manufacture mezzanine floors for existing buildings?",
        answer: "Yes, we design and install structural steel mezzanine floors for existing warehouses, factories, and commercial spaces to maximize vertical storage capacity without expanding the building footprint.",
    },
];

export default function About() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };
    return (
        <>
            <section className="section inner-page-hero">
                <div className="container">
                    <div className="inner-page-hero-content-box">
                        <div className="inner-page-hero-left">
                            <h1 data-animation="blur-stagger-char" className="heading-1 white">ABOUT US</h1>
                        </div>
                        <div className="inner-page-hero-right fade-in">
                            <div className="breadcrumb-box"><Link href="/" className="breadcrumb-link">Home</Link>
                                <p className="middle-dot">•</p>
                                <p className="breadcrumb-text">About us</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="inner-page-hero-box"><img src="/astoneImages/PEB_shade_3.jpeg" loading="lazy"
                    sizes="(max-width: 1442px) 100vw, 1442px"
                    srcSet="/astoneImages/PEB_shade_3.jpeg 500w, /astoneImages/PEB_shade_3.jpeg 800w, /astoneImages/PEB_shade_3.jpeg 1080w, /astoneImages/PEB_shade_3.jpeg 1442w"
                    alt="" className="hero-background-image" />
                    <div className="inner-page-hero-overlay"></div>
                </div>
            </section>
            <section className="section about">
                <div className="container">
                    <div className="about-box">
                        <div>
                            <div className="about-top slide-up">
                                <div className="about-left">
                                    <p data-wf--subtitle--variant="base" className="subtitle">Who Are We</p>
                                </div>
                                <div className="about-right">
                                    <p className="about-us-big-text"> We engineer durable steel structures that combine smart design, structural strength, and long-term value. </p>
                                    <div className="spacer _24"></div>
                                    <p className="about-text"> Founded and led by <strong>Sanjeev Sharma</strong>, Astone Metal Arc specializes in Pre Engineered Buildings, prefabricated steel structures, industrial sheds, warehouses, mezzanine floors, and customized steel solutions. From design and engineering to manufacturing and on-site installation, we focus on precision, quality, efficiency, and reliable execution. We work closely with every client to deliver practical structures designed around their specific requirements, operational needs, and future growth. </p>
                                </div>
                            </div>
                            <div className="about-bottom slide-up">
                                <div className="project-image-link-box">
                                    <div className="about-project-image-box"><img
                                        src="/astoneImages/oman_project.jpeg" loading="lazy"
                                        sizes="(max-width: 560px) 100vw, 560px"
                                        srcSet="/astoneImages/oman_project.jpeg 500w, /astoneImages/oman_project.jpeg 560w"
                                        alt="" className="about-project-image" /></div><Link data-wf--custom-link--variant="base"
                                            data-wf-component-id="8b846f2b-4c03-f3ea-c387-aab4a5c2f35a" data-wf-variant-state="base"
                                            href="/projects" className="custom-link w-inline-block">
                                        <p className="custom-link-text">our projects</p>
                                        <div className="custom-link-line"></div><img loading="lazy"
                                            src="images/6a1c49f097e85d36dc99061d_Top%20Right%20Arrow%202.svg" alt="" />
                                    </Link>
                                </div>
                                <div className="about-right">
                                    <div className="big-stats-box">
                                        <div className="big-stat-box">
                                            <div className="stat-number-suffix-box">
                                                <p data-target="25" className="big-stat-number stat-number">0</p>
                                                <p className="big-stat-suffix">+</p>
                                            </div>
                                            <p className="big-stat-text">Years of experience</p>
                                        </div>
                                        <div className="big-stat-box">
                                            <div className="stat-number-suffix-box">
                                                <p data-target="1000" className="big-stat-number stat-number">1000</p>
                                                <p className="big-stat-suffix">+</p>
                                            </div>
                                            <p className="big-stat-text">Total Delivered &nbsp;Projects</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="about-video-box">
                            <div className="about-bottom-stats-box">
                                <div className="about-bottom-stat-box orange slide-right">
                                    <p data-suffix="+" data-target="120" className="about-bottom-stat-number stat-number">120+</p>
                                    <div className="text-box _500">
                                        <p className="about-bottom-stats-text">Skilled experts delivering quality construction with precision,
                                            experience, and reliable project execution.</p>
                                    </div>
                                </div>
                                <div className="about-bottom-stat-box slide-left">
                                    <p data-suffix="%" data-target="99" className="about-bottom-stat-number stat-number">99%</p>
                                    <div className="text-box _500">
                                        <p className="about-bottom-stats-text">Satisfied clients trusting our commitment to quality, reliability,
                                            and exceptional results across every project.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="building-image-text-box">
                <div className="text-marquee-box">
                    <p className="marquee-text"> ENGINEERED FOR STRENGTH. BUILT TO LAST. </p> <p className="marquee-text"> ENGINEERED FOR STRENGTH. BUILT TO LAST. </p>
                </div><img src="images/6a1c49f097e85d36dc99061e_Building%20Image.webp" loading="lazy"
                    sizes="(max-width: 1418px) 100vw, 1418px"
                    srcSet="images/6a1c49f097e85d36dc99061e_Building%2520Image-p-500.webp 500w, images/6a1c49f097e85d36dc99061e_Building%2520Image-p-800.webp 800w, images/6a1c49f097e85d36dc99061e_Building%2520Image-p-1080.webp 1080w, images/6a1c49f097e85d36dc99061e_Building%20Image.webp 1418w"
                    alt="" className="building-image parallax" />
            </div>
            <section className="section values">
                <div className="container">
                    <div className="values-box">
                        <div className="values-top slide-up">
                            <div className="subtitle-heading-box center">
                                <p className="subtitle w-variant-3f90d24c-fa4f-8670-fe85-63e8aa9aadf1">Core
                                    Values</p>
                                <h2 className="heading-2 white">The Values That Shape Our Work</h2>
                            </div>
                        </div>
                        <div className="values-bottom fade-in">
                            <div className="values-list">
                                <div className="value-card">
                                    <div className="value-icon-box"><img src="images/6a1c49f097e85d36dc990638_shape%201.svg" loading="lazy"
                                        alt="" /></div>
                                    <div className="value-content-box">
                                        <h3 className="value-name">Integrity</h3>
                                        <p className="paragraph medium neutral-01">We operate with honesty and transparency in every project and
                                            client relationship, ensuring trust at all stages of collaboration.</p>
                                    </div>
                                </div>
                                <div className="value-card">
                                    <div className="value-icon-box"><img src="images/6a1c49f097e85d36dc99061f_Value%20Icon%201.svg"
                                        loading="lazy" alt="" /></div>
                                    <div className="value-content-box">
                                        <h3 className="value-name">Reliability</h3>
                                        <p className="paragraph medium neutral-01">We consistently meet deadlines and expectations with dependable
                                            and efficient execution, ensuring smooth project delivery.</p>
                                    </div>
                                </div>
                                <div className="value-card">
                                    <div className="value-icon-box"><img src="images/6a1c49f097e85d36dc99063a_shape%203.svg" loading="lazy"
                                        alt="" /></div>
                                    <div className="value-content-box">
                                        <h3 className="value-name">Quality</h3>
                                        <p className="paragraph medium neutral-01">We are committed to delivering durable, high-standard
                                            construction without compromise, focusing on excellence in every detail.</p>
                                    </div>
                                </div>
                                <div className="value-card">
                                    <div className="value-icon-box"><img src="images/6a1c49f097e85d36dc990630_Value%20Icon%206.svg"
                                        loading="lazy" alt="" /></div>
                                    <div className="value-content-box">
                                        <h3 className="value-name">Innovation</h3>
                                        <p className="paragraph medium neutral-01">We embrace modern solutions and technologies to improve
                                            efficiency and project outcomes, driving smarter construction practices forward.</p>
                                    </div>
                                </div>
                                <div className="value-card">
                                    <div className="value-icon-box"><img src="images/6a1c49f097e85d36dc990639_shape%202.svg" loading="lazy"
                                        alt="" /></div>
                                    <div className="value-content-box">
                                        <h3 className="value-name">Client-first</h3>
                                        <p className="paragraph medium neutral-01">We listen, adapt, and deliver solutions that align with our
                                            clients’ needs and goals, ensuring complete satisfaction throughout.</p>
                                    </div>
                                </div>
                                <div className="value-card">
                                    <div className="value-icon-box"><img src="images/6a1c49f097e85d36dc99063b_shape%204.svg" loading="lazy"
                                        alt="" /></div>
                                    <div className="value-content-box">
                                        <h3 className="value-name">Safety</h3>
                                        <p className="paragraph medium neutral-01">We prioritize safe practices to protect our team, clients, and
                                            every project environment, maintaining strict safety standards always.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="services-text">Discover top-tier construction services. <a href="/services" className="link">View our
                            services</a></p>
                    </div>
                </div>
            </section>
            <section className="section process">
                <div className="container">
                    <div className="process-box">
                        <div className="process-top">
                            <div className="process-top-left slide-left">
                                <div className="subtitle-heading-box">
                                    <p data-wf--subtitle--variant="base" className="subtitle">our process</p>
                                    <h2 className="heading-2">A Simple Process, Proven Results</h2>
                                </div>
                            </div>
                            <div className="process-top-right slide-right"><a href="/contact" className="button w-inline-block">
                                <div className="text-icon-box">
                                    <div className="text-icon-content"><img loading="lazy"
                                        src="images/6a1c49f097e85d36dc9905ab_Button%20Arrow%20Icon.svg" alt=""
                                        className="button-arrow-icon" /><img loading="lazy"
                                            src="images/6a1c49f097e85d36dc9905ab_Button%20Arrow%20Icon.svg" alt=""
                                            className="button-arrow-icon second" />
                                        <p className="button-text">Get in Touch</p>
                                    </div>
                                </div>
                            </a></div>
                        </div>
                        <div className="process-bottom">
                            <div className="process-card">
                                <div className="process-card-header">
                                    <div className="process-icon-box"><img src="images/6a1c49f097e85d36dc990681_Process%20Icon%201.svg"
                                        loading="lazy" alt="" /></div>
                                    <p className="process-number">01</p>
                                </div>
                                <h3 className="process-name">Planning </h3>
                                <p className="paragraph medium">We understand your goals, discuss requirements, and create a clear project
                                    strategy for successful execution.</p>
                            </div>
                            <div className="process-card _2">
                                <div className="process-card-header">
                                    <div className="process-icon-box"><img src="images/6a1c49f097e85d36dc990680_Process%20Icon%202.svg"
                                        loading="lazy" alt="" /></div>
                                    <p className="process-number">02</p>
                                </div>
                                <h3 className="process-name">Designing</h3>
                                <p className="paragraph medium">Our team develops practical and modern design solutions focused on
                                    functionality, quality, and efficiency.</p>
                            </div>
                            <div id="w-node-_3a45499e-aa77-0377-4274-b1c4c9dd3784-dc990573" className="process-card _3">
                                <div className="process-card-header">
                                    <div className="process-icon-box"><img src="images/6a1c49f097e85d36dc99067f_Process%20Icon%203.svg"
                                        loading="lazy" alt="" /></div>
                                    <p className="process-number">03</p>
                                </div>
                                <h3 className="process-name">building</h3>
                                <p className="paragraph medium">We manage the building process with precision, ensuring reliable delivery and
                                    high quality project results.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section faq">
                <div className="container">
                    <div className="faq-box">
                        <div className="faq-left slide-up">
                            <div className="subtitle-heading-box">
                                <p className="subtitle">OUR FAQS</p>
                                <h2 className="heading-2">Got any questions?We’ve got answers</h2>
                            </div>
                            <div className="spacer _54"></div>
                            <div className="faq-image-box"><img sizes="100vw"
                                srcSet="/astoneImages/oman_project.jpeg 500w, /astoneImages/oman_project.jpeg 800w, /astoneImages/oman_project.jpeg 1060w"
                                alt="" src="/astoneImages/oman_project.jpeg" loading="lazy" className="faq-image" /></div>
                        </div>
                        <div className="faq-right">
                            <div className="faq-list">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="faq-item slide-up">
                                        <div
                                            className="faq-title"
                                            onClick={() => toggleFaq(index)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <p className="faq-title-text">{faq.question}</p>
                                            <div className="faq-icon-box">
                                                <img
                                                    loading="lazy"
                                                    src="images/6a1c49f097e85d36dc99067d_caret.svg"
                                                    alt=""
                                                    className={`faq-icon ${openIndex === index ? "open" : ""}`}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="faq-content"
                                            style={{
                                                maxHeight: openIndex === index ? "500px" : "0",
                                                overflow: "hidden",
                                                transition: "max-height 0.3s ease-out",
                                                opacity: openIndex === index ? 1 : 0,
                                            }}
                                        >
                                            <div className="faq-text-box">
                                                <p className="faq-content-text">{faq.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}