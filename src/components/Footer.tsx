import Link from "next/link";

export default function Footer() {
    return (
        <section className="section footer">
            <div className="container">
                <div className="cta-box">
                    <div className="cta-content-box slide-up">
                        <div className="text-box _550">
                            <h2 className="cta-heading">Get in Touch</h2>
                        </div>
                        <div className="spacer _24"></div>
                        <div className="text-box _550">
                            <p className="cta-text" style={{ textTransform: "uppercase", marginBottom: "10px", fontWeight: "bold" }}>Drive Your Success</p>
                            <p className="cta-text">Astone Metal Arc is a leading Pre Engineered Building Manufacturer in Uttar Pradesh, India, specializing in Pre Fabricated Steel Structures, Industrial Sheds, Metal Roofing Sheds, Mezzanine Floors, Factory Sheds, Prefab Cold Storage, PEB Cargo Sheds, Rice Mill Structures, and Commercial Warehouses. With 25+ years of industry expertise, we deliver high-quality steel building solutions across India and internationally.
                            </p>
                        </div>
                        <div className="spacer _40"></div><Link href="/contact" className="button w-inline-block">
                            <div className="text-icon-box">
                                <div className="text-icon-content"><img loading="lazy"
                                    src="images/6a1c49f097e85d36dc9905ab_Button%20Arrow%20Icon.svg" alt=""
                                    className="button-arrow-icon" /><img loading="lazy"
                                        src="images/6a1c49f097e85d36dc9905ab_Button%20Arrow%20Icon.svg" alt=""
                                        className="button-arrow-icon second" />
                                    <p className="button-text">Get Started</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="footer-wrapper">
                <div className="container">
                    <div className="footer-box fade-in">
                        <div className="big-brand-name-box">
                            <p className="big-brand-name">ASTONE</p>
                        </div>
                        <div className="footer-left-line"></div>
                        <div className="footer-right-line"></div>
                        <div className="footer-top">
                            <div className="logo-newsletter-box"><Link href="/" aria-current="page"
                                className="brand footer w-nav-brand w--current"><img loading="lazy"
                                    src="images/logo.JPG" width={100} height={100} alt="" className="logo-image" /></Link>
                                <h3 className="brand-name">ASTONE METAL ARC</h3>
                                <div className="newsletter-form-box">
                                    <p className="newsletter-text">Subscribe to our Newsletter</p>
                                    <div className="newsletter-form-block w-form">
                                        <form id="email-form-2" name="email-form-2" data-name="Email Form 2" method="get"
                                            className="newsletter-form" data-wf-page-id="6a1c49f097e85d36dc990568"
                                            data-wf-element-id="1260c01d-25e0-b92a-8e65-c65267fb4d4c"><input className="newsletter-field w-input"
                                                maxLength={256} name="Newsletter-Email" data-name="Newsletter Email" aria-label="field"
                                                placeholder="Enter Your Email Address" type="email" id="Newsletter-Email" /><input
                                                type="submit" data-wait="Please wait..." className="newsletter-submit-btn w-button"
                                                value="Subscribe" /></form>
                                        <div className="success-message newsletter w-form-done">
                                            <div>Thank you! Your submission has been received!</div>
                                        </div>
                                        <div className="w-form-fail">
                                            <div>Oops! Something went wrong while submitting the form.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="footer-links-box">
                                <div className="footer-links-column">
                                    <Link href="/about" className="footer-link footer-link-bold">About us</Link>
                                    <Link href="/services" className="footer-link">Services</Link>
                                    <Link href="/projects" className="footer-link">Projects</Link>
                                    <Link href="/contact" className="footer-link">Contact</Link>
                                </div>
                                <div className="footer-links-column">
                                    <Link href="/services" className="footer-link footer-link-bold">Our Products</Link>
                                    <Link href="/services" className="footer-link">PEB Cargo Shed</Link>
                                    <Link href="/services" className="footer-link">Industrial Shed</Link>
                                    <Link href="/services" className="footer-link">Mezzanine Floor</Link>
                                    <Link href="/services" className="footer-link">Factory Shed</Link>
                                    <Link href="/services" className="footer-link">Warehouse</Link>
                                    <Link href="/services" className="footer-link">Prefab Cold Storage</Link>
                                </div>
                                {/* <div className="footer-links-column">
                                    <Link href="/services" className="footer-link footer-link-bold">Popular Categories</Link>
                                    <Link href="/services" className="footer-link">Metal Roofing Shed</Link>
                                    <Link href="/services" className="footer-link">Prefab Cold Storage</Link>
                                    <Link href="/services" className="footer-link">PEB Cargo Shed</Link>
                                    <Link href="/services" className="footer-link">Rice Mill</Link>
                                    <Link href="/services" className="footer-link">Warehouse Construction</Link>
                                </div> */}
                            </div>
                            <div className="footer-contact-box">
                                <div className="footer-contact-links-box"><Link href="mailto:sales@astonemetalarc.com"
                                    className="footer-contact-link">sales@astonemetalarc.com</Link><Link href="tel:+918744815500"
                                        className="footer-contact-link">+91 874 481 5500</Link>

                                    <p className="footer-contact-link" style={{ marginTop: "10px", lineHeight: "1.3" }}>
                                        707, 7th Floor, Dubai Mall RDC,<br />Ghaziabad - 201002, Uttar Pradesh, India
                                    </p>
                                </div>
                                <div className="footer-social-links-box"><Link href="#" target="_blank"
                                    className="footer-social-link w-inline-block">
                                    <div className="social-icon w-embed"><svg width="24" height="24" viewBox="0 0 24 24"
                                        preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg"
                                        style={{ display: "block" }}>
                                        <path
                                            d="M9.1592 6.10111V8.74342H7.22266V11.9741H9.1592V21.5761H13.1342V11.9752H15.8025C15.8025 11.9752 16.0524 10.4262 16.1736 8.73188H13.1505V6.52226C13.1505 6.19246 13.5832 5.74823 14.0121 5.74823H16.1793V2.38477H13.2333C9.06015 2.38477 9.1592 5.61841 9.1592 6.10111Z"
                                            fill="currentColor"></path>
                                    </svg></div>
                                </Link><Link href="#" target="_blank" className="footer-social-link w-inline-block">
                                        <div className="social-icon w-embed"><svg width="19" height="19" viewBox="0 0 19 19"
                                            preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg"
                                            style={{ display: "block" }}>
                                            <path
                                                d="M9.49965 6.33313C7.75078 6.33313 6.33301 7.75089 6.33301 9.49977C6.33301 11.2487 7.75078 12.6665 9.49965 12.6665C11.2486 12.6665 12.6664 11.2487 12.6664 9.49977C12.6664 7.75089 11.2486 6.33313 9.49965 6.33313Z"
                                                fill="currentColor"></path>
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                d="M5.7 0C2.55198 0 0 2.55198 0 5.7V13.3C0 16.448 2.55198 19 5.7 19H13.3C16.448 19 19 16.448 19 13.3V5.7C19 2.55198 16.448 0 13.3 0H5.7ZM5.06666 9.5C5.06666 7.05154 7.05154 5.06666 9.5 5.06666C11.9484 5.06666 13.9334 7.05154 13.9334 9.5C13.9334 11.9484 11.9484 13.9334 9.5 13.9334C7.05154 13.9334 5.06666 11.9484 5.06666 9.5ZM13.9334 5.06666H15.2V3.8H13.9334V5.06666Z"
                                                fill="currentColor"></path>
                                        </svg></div>
                                    </Link><Link href="https://www.linkedin.com/" target="_blank" className="footer-social-link w-inline-block">
                                        <div className="social-icon w-embed"><svg width="19" height="18" viewBox="0 0 19 18"
                                            preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg"
                                            style={{ display: "block" }}>
                                            <path
                                                d="M3.98741 1.9947C3.98714 2.52346 3.77684 3.03047 3.40276 3.40417C3.02868 3.77788 2.52147 3.98767 1.99271 3.98741C1.46394 3.98714 0.956943 3.77684 0.583238 3.40276C0.209533 3.02868 -0.000264132 2.52147 2.49573e-07 1.99271C0.000264631 1.46394 0.210568 0.956943 0.584648 0.583238C0.958727 0.209533 1.46594 -0.000264132 1.9947 2.49573e-07C2.52346 0.000264631 3.03047 0.210568 3.40417 0.584648C3.77788 0.958727 3.98767 1.46594 3.98741 1.9947ZM4.04722 5.46375H0.0598113V17.9443H4.04722V5.46375ZM10.3473 5.46375H6.37985V17.9443H10.3075V11.395C10.3075 7.74654 15.0624 7.40761 15.0624 11.395V17.9443H19V10.0393C19 3.88872 11.9622 4.118 10.3075 7.13846L10.3473 5.46375Z"
                                                fill="currentColor"></path>
                                        </svg></div>
                                    </Link><Link href="#" target="_blank" className="footer-social-link w-inline-block">
                                        <div className="social-icon w-embed"><svg width="20" height="19" viewBox="0 0 20 19"
                                            preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg"
                                            style={{ display: "block" }}>
                                            <path
                                                d="M15.75 0H18.8171L12.1171 7.67714L20 18.1257H13.8286L8.99143 11.79L3.46286 18.1257H0.392857L7.55857 9.91143L0 0.00142855H6.32857L10.6943 5.79143L15.75 0ZM14.6714 16.2857H16.3714L5.4 1.74429H3.57714L14.6714 16.2857Z"
                                                fill="currentColor"></path>
                                        </svg></div>
                                    </Link></div>
                            </div>
                        </div>
                        <div className="footer-bottom">
                            <p className="footer-rights-text">© 2026 Astone Metal Arc. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-background"></div>
        </section>
    )
}