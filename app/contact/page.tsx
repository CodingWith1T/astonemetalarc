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

export default function Contact() {
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
                            <h1 data-animation="blur-stagger-cha" className="heading-1 white">Contact us</h1>
                        </div>
                        <div className="inner-page-hero-right fade-in">
                            <div className="breadcrumb-box"><Link href="/" className="breadcrumb-link">Home</Link>
                                <p className="middle-dot">•</p>
                                <p className="breadcrumb-text">Contact us</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="inner-page-hero-box"><img src="/astoneImages/oman_project.jpeg"
                    loading="lazy" sizes="(max-width: 1442px) 100vw, 1442px"
                    srcSet="/astoneImages/oman_project.jpeg 500w, /astoneImages/oman_project.jpeg 800w, /astoneImages/oman_project.jpeg 1080w, /astoneImages/oman_project.jpeg 1442w"
                    alt="oman project" className="hero-background-image" />
                    <div className="inner-page-hero-overlay"></div>
                </div>
            </section>
            <section className="section">
                <div className="container">
                    <div className="contact-box">
                        <div className="contact-top">
                            <div className="contact-info-box slide-up">
                                <div className="contact-icon-box"><img src="images/6a1c49f097e85d36dc99066e_Mail.svg" loading="lazy" alt="" />
                                </div>
                                <div className="contact-info-bottom">
                                    <p className="contact-name">mail us</p>
                                    <p className="contact-info">sales@astonemetalarc.com</p>
                                    <div className="spacer _32"></div><a data-wf--button-outline--variant="full-width"
                                        href="mailto:sales@astonemetalarc.com"
                                        className="button-outline w-variant-e0420fc5-a571-560d-51cb-900e26947139">Write to us</a>
                                </div>
                            </div>
                            <div className="contact-info-box slide-up">
                                <div className="contact-icon-box"><img src="images/6a1c49f097e85d36dc99066f_Phone.svg" loading="lazy" alt="" />
                                </div>
                                <div className="contact-info-bottom">
                                    <p className="contact-name">call us</p>
                                    <p className="contact-info">+91 874 481 5500</p>
                                    <div className="spacer _32"></div><a data-wf--button-outline--variant="full-width" href="tel:+91-8744815500"
                                        className="button-outline w-variant-e0420fc5-a571-560d-51cb-900e26947139">Speak With Us</a>
                                </div>
                            </div>
                            <div className="contact-info-box slide-up">
                                <div className="contact-icon-box"><img src="images/6a1c49f097e85d36dc99066c_Location.svg" loading="lazy"
                                    alt="" /></div>
                                <div className="contact-info-bottom">
                                    <p className="contact-name">Find Us</p>
                                    <p className="contact-info">707, 7th Floor, Dubai Mall RDC,
                                        Ghaziabad - 201002</p>
                                    <div className="spacer _32"></div><a data-wf--button-outline--variant="full-width"
                                        href="https://maps.apple.com/place?address=RDC,%20Raj%20Nagar,%20Ghaziabad,%20201002,%20Uttar%20Pradesh,%20India&auid=9676118608274116570&coordinate=28.673301,77.440827&lsp=6489&name=RDC&map=explore"
                                        target="_blank" className="button-outline w-variant-e0420fc5-a571-560d-51cb-900e26947139">visit us</a>
                                </div>
                            </div>
                        </div>
                        <div className="contact-bottom">
                            <div className="contact-image-box slide-right"><img src="/astoneImages/PEB_shade_2.jpeg"
                                loading="lazy" sizes="(max-width: 1246px) 100vw, 1246px"
                                srcSet="/astoneImages/PEB_shade_2.jpeg 500w, /astoneImages/PEB_shade_2.jpeg 800w, /astoneImages/PEB_shade_2.jpeg 1080w, /astoneImages/PEB_shade_2.jpeg 1246w"
                                alt="" className="contact-image" />
                                <div className="contact-image-text-box">
                                    <p className="contact-image-text"><span className="text-orange">25+</span> Years of Industry Excellence.</p>
                                </div>
                            </div>
                            <div className="contact-form-block slide-left w-form">
                                <form id="email-form-3" name="email-form-3" data-name="Email Form 3" method="get" className="contact-form"
                                    data-wf-page-id="6a1c49f097e85d36dc990577" data-wf-element-id="2c56c145-6e13-4c37-68e7-0cb14e3d0f53">
                                    <input className="contact-field w-input" maxLength={256} name="Full-Name" data-name="Full Name"
                                        placeholder="Full Name" type="text" id="Full-Name" required /><input className="contact-field w-input"
                                            maxLength={256} name="Email" data-name="Email" placeholder="Email Address" type="email" id="Email"
                                            required /><input className="contact-field w-input" maxLength={256} name="Phone" data-name="Phone"
                                                placeholder="Phone Number" type="tel" id="Phone" required /><select id="Service" name="Service"
                                                    data-name="Service" required className="contact-field w-select">
                                        <option value="">Select Service</option>
                                        <option value="First">Home Construction</option>
                                        <option value="Second">Commercial Construction</option>
                                        <option value="Third">Renovation Work</option>
                                    </select><textarea placeholder="Your Message" maxLength={5000} id="Message" name="Message"
                                        data-name="Message" className="contact-field text-area w-input" /><input type="submit"
                                            data-wait="Please wait..." className="contact-submit-button w-button" value="Send message" /></form>
                                <div className="success-message w-form-done">
                                    <div>Thank you! Your submission has been received!</div>
                                </div>
                                <div className="w-form-fail">
                                    <div>Oops! Something went wrong while submitting the form.</div>
                                </div>
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
                                <p data-wf--subtitle--variant="base" className="subtitle">OUR FAQS</p>
                                <h2 className="heading-2">Got any questions? We've got answers</h2>
                            </div>
                            <div className="spacer _54"></div>
                            <div className="faq-image-box"><img sizes="100vw"
                                srcSet="/astoneImages/warehouse_1.jpeg 500w, /astoneImages/warehouse_1.jpeg 800w, /astoneImages/warehouse_1.jpeg 1060w"
                                alt="" src="/astoneImages/warehouse_1.jpeg" loading="lazy" className="faq-image" /></div>
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
    );
}