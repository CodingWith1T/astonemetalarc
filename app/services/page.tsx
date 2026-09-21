import Link from "next/link"

export default function Services() {
    return (
        <>
            <section className="section inner-page-hero">
                <div className="container">
                    <div className="inner-page-hero-content-box">
                        <div className="inner-page-hero-left">
                            <h1 data-animation="blur-stagger-char" className="heading-1 white">services</h1>
                        </div>
                        <div className="inner-page-hero-right fade-in">
                            <div className="breadcrumb-box"><Link href="/" className="breadcrumb-link">Home</Link>
                                <p className="middle-dot">•</p>
                                <p className="breadcrumb-text">Services</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="inner-page-hero-box"><img src="images/6a1c49f097e85d36dc990684_Inner%20Hero%20bg%203.webp"
                    loading="lazy" sizes="100vw"
                    srcSet="images/6a1c49f097e85d36dc990684_Inner%2520Hero%2520bg%25203-p-500.webp 500w, images/6a1c49f097e85d36dc990684_Inner%2520Hero%2520bg%25203-p-800.webp 800w, images/6a1c49f097e85d36dc990684_Inner%2520Hero%2520bg%25203-p-1080.webp 1080w, images/6a1c49f097e85d36dc990684_Inner%20Hero%20bg%203.webp 1442w"
                    alt="" className="hero-background-image" />
                    <div className="inner-page-hero-overlay"></div>
                </div>
            </section>
            <section className="section">
                <div className="container">
                    <div className="all-services-box">
                        <div className="all-services-top slide-up">
                            <div className="all-services-left">
                                <p data-wf--subtitle--variant="base" className="subtitle">What we offer</p>
                            </div>
                            <div className="all-services-right">
                                <div className="text-box _600">
                                    <h2 className="heading-2">Professional Services Built Around Quality</h2>
                                </div>
                            </div>
                        </div>
                        <div className="all-services-list-wrapper w-dyn-list">
                            <div role="list" className="all-services-list w-dyn-items">
                                <div role="listitem" className="all-services-item slide-up w-dyn-item"><a href="/services/general-contracting"
                                    className="service-link w-inline-block">
                                    <div className="service-image-box">
                                        <div className="div-block"><img src="images/6a1c49f097e85d36dc990662_Service%20thumbnail%20Img%202.webp"
                                            loading="lazy" alt="" sizes="100vw"
                                            srcSet="images/6a1c49f097e85d36dc990662_Service%2520thumbnail%2520Img%25202-p-500.webp 500w, images/6a1c49f097e85d36dc990662_Service%20thumbnail%20Img%202.webp 814w"
                                            className="service-image" /></div>
                                        <div className="service-arrow-box">
                                            <div className="service-arrow w-embed"><svg width="24" height="24" viewBox="0 0 24 24"
                                                preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                style={{ display: "block" }}>
                                                <path d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z"
                                                    fill="currentColor"></path>
                                            </svg></div>
                                        </div>
                                    </div>
                                    <div className="service-card-content-box">
                                        <h3 className="service-name black">General Contracting</h3>
                                        <p className="paragraph medium">Delivering complete contracting services with expert oversight and
                                            reliable execution.</p>
                                    </div>
                                </a></div>
                                <div role="listitem" className="all-services-item slide-up w-dyn-item"><a href="/services/project-management"
                                    className="service-link w-inline-block">
                                    <div className="service-image-box">
                                        <div className="div-block"><img src="images/6a1c49f097e85d36dc990679_Service%20thumbnail%20Img%203.webp"
                                            loading="lazy" alt="" sizes="100vw"
                                            srcSet="images/6a1c49f097e85d36dc990679_Service%2520thumbnail%2520Img%25203-p-500.webp 500w, images/6a1c49f097e85d36dc990679_Service%20thumbnail%20Img%203.webp 814w"
                                            className="service-image" /></div>
                                        <div className="service-arrow-box">
                                            <div className="service-arrow w-embed"><svg width="24" height="24" viewBox="0 0 24 24"
                                                preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                style={{ display: "block" }}>
                                                <path d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z"
                                                    fill="currentColor"></path>
                                            </svg></div>
                                        </div>
                                    </div>
                                    <div className="service-card-content-box">
                                        <h3 className="service-name black">Project Management</h3>
                                        <p className="paragraph medium">Coordinating projects to ensure efficiency, timely delivery, and quality
                                            results.</p>
                                    </div>
                                </a></div>
                                <div role="listitem" className="all-services-item slide-up w-dyn-item"><a href="/services/renovation-works"
                                    className="service-link w-inline-block">
                                    <div className="service-image-box">
                                        <div className="div-block"><img src="images/6a1c49f097e85d36dc990647_Service%20thumbnail%20Img.webp"
                                            loading="lazy" alt="" sizes="100vw"
                                            srcSet="images/6a1c49f097e85d36dc990647_Service%2520thumbnail%2520Img-p-500.webp 500w, images/6a1c49f097e85d36dc990647_Service%20thumbnail%20Img.webp 814w"
                                            className="service-image" /></div>
                                        <div className="service-arrow-box">
                                            <div className="service-arrow w-embed"><svg width="24" height="24" viewBox="0 0 24 24"
                                                preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                style={{ display: "block" }}>
                                                <path d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z"
                                                    fill="currentColor"></path>
                                            </svg></div>
                                        </div>
                                    </div>
                                    <div className="service-card-content-box">
                                        <h3 className="service-name black">Renovation Works</h3>
                                        <p className="paragraph medium">Upgrading spaces to improve functionality, comfort, and overall
                                            long-term value.</p>
                                    </div>
                                </a></div>
                                <div role="listitem" className="all-services-item slide-up w-dyn-item"><a
                                    href="/services/commercial-construction" className="service-link w-inline-block">
                                    <div className="service-image-box">
                                        <div className="div-block"><img src="images/6a1c49f097e85d36dc990695_Service%20thumbnail%20Img%204.webp"
                                            loading="lazy" alt="" sizes="100vw"
                                            srcSet="images/6a1c49f097e85d36dc990695_Service%2520thumbnail%2520Img%25204-p-500.webp 500w, images/6a1c49f097e85d36dc990695_Service%20thumbnail%20Img%204.webp 814w"
                                            className="service-image" /></div>
                                        <div className="service-arrow-box">
                                            <div className="service-arrow w-embed"><svg width="24" height="24" viewBox="0 0 24 24"
                                                preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                style={{ display: "block" }}>
                                                <path d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z"
                                                    fill="currentColor"></path>
                                            </svg></div>
                                        </div>
                                    </div>
                                    <div className="service-card-content-box">
                                        <h3 className="service-name black">Commercial construction</h3>
                                        <p className="paragraph medium">Building durable commercial spaces focused on performance and long-term
                                            value.</p>
                                    </div>
                                </a></div>
                                <div role="listitem" className="all-services-item slide-up w-dyn-item"><a href="/services/consulting-services"
                                    className="service-link w-inline-block">
                                    <div className="service-image-box">
                                        <div className="div-block"><img src="images/6a1c49f097e85d36dc9906b7_Service%20thumbnail%20Img%205.webp"
                                            loading="lazy" alt="" sizes="100vw"
                                            srcSet="images/6a1c49f097e85d36dc9906b7_Service%2520thumbnail%2520Img%25205-p-500.webp 500w, images/6a1c49f097e85d36dc9906b7_Service%20thumbnail%20Img%205.webp 814w"
                                            className="service-image" /></div>
                                        <div className="service-arrow-box">
                                            <div className="service-arrow w-embed"><svg width="24" height="24" viewBox="0 0 24 24"
                                                preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                style={{ display: "block" }}>
                                                <path d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z"
                                                    fill="currentColor"></path>
                                            </svg></div>
                                        </div>
                                    </div>
                                    <div className="service-card-content-box">
                                        <h3 className="service-name black">Consulting services </h3>
                                        <p className="paragraph medium">Providing expert guidance to optimize planning, budgeting, and project
                                            execution.</p>
                                    </div>
                                </a></div>
                                <div role="listitem" className="all-services-item slide-up w-dyn-item"><a
                                    href="/services/building-architecture" className="service-link w-inline-block">
                                    <div className="service-image-box">
                                        <div className="div-block"><img src="images/6a1c49f097e85d36dc9906d8_Service%20thumbnail%20Img%206.webp"
                                            loading="lazy" alt="" sizes="100vw"
                                            srcSet="images/6a1c49f097e85d36dc9906d8_Service%2520thumbnail%2520Img%25206-p-500.webp 500w, images/6a1c49f097e85d36dc9906d8_Service%20thumbnail%20Img%206.webp 814w"
                                            className="service-image" /></div>
                                        <div className="service-arrow-box">
                                            <div className="service-arrow w-embed"><svg width="24" height="24" viewBox="0 0 24 24"
                                                preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                style={{ display: "block" }}>
                                                <path d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z"
                                                    fill="currentColor"></path>
                                            </svg></div>
                                        </div>
                                    </div>
                                    <div className="service-card-content-box">
                                        <h3 className="service-name black">Building Architecture </h3>
                                        <p className="paragraph medium">Designing modern structures that balance aesthetics, function, and
                                            efficiency.</p>
                                    </div>
                                </a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section features">
                <div className="container">
                    <div className="features-box">
                        <div className="features-left slide-up">
                            <div className="subtitle-heading-box">
                                <p data-wf--subtitle--variant="base" className="subtitle">Our Key Advantages</p>
                                <h2 className="heading-2">Delivering Quality at Every Stage</h2>
                            </div>
                            <div className="spacer _24"></div>
                            <p className="paragraph medium">We combine expertise, innovation, and quality craftsmanship to deliver reliable
                                construction solutions that exceed expectations.</p>
                            <div className="spacer _32"></div><Link href="/projects" className="button w-inline-block">
                                <div className="text-icon-box">
                                    <div className="text-icon-content"><img loading="lazy"
                                        src="images/6a1c49f097e85d36dc9905ab_Button%20Arrow%20Icon.svg" alt=""
                                        className="button-arrow-icon" /><img loading="lazy"
                                            src="images/6a1c49f097e85d36dc9905ab_Button%20Arrow%20Icon.svg" alt=""
                                            className="button-arrow-icon second" />
                                        <p className="button-text">our work</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="features-right">
                            <div className="feature-card">
                                <div className="why-us-icon-box"><img src="images/6a1c49f097e85d36dc990614_Why%20us%20Icon%201.svg"
                                    loading="lazy" alt="" /></div>
                                <div className="why-us-content-box">
                                    <h3 className="why-us-name">Expert Team</h3>
                                    <p className="paragraph medium">Our skilled professionals bring extensive industry knowledge and experience
                                        to every stage of construction and project execution.</p>
                                </div>
                            </div>
                            <div className="feature-card _2">
                                <div className="why-us-icon-box"><img src="images/6a1c49f097e85d36dc990615_Why%20us%20Icon%202.svg"
                                    loading="lazy" alt="" /></div>
                                <div className="why-us-content-box">
                                    <h3 className="why-us-name">Full Services</h3>
                                    <p className="paragraph medium">We provide a complete range of construction services covering planning,
                                        design, execution, and project management for all project types.</p>
                                </div>
                            </div>
                            <div className="feature-card _3">
                                <div className="why-us-icon-box"><img src="images/6a1c49f097e85d36dc990616_Why%20us%20Icon%203.svg"
                                    loading="lazy" alt="" /></div>
                                <div className="why-us-content-box">
                                    <h3 className="why-us-name">Timely Delivery</h3>
                                    <p className="paragraph medium">We follow efficient planning and project management practices to complete
                                        projects on schedule and within expectations.</p>
                                </div>
                            </div>
                            <div className="feature-card">
                                <div className="why-us-icon-box"><img src="images/6a1ec98c0fed237183f930ef_Why%20us%20Icon%204.svg"
                                    loading="lazy" alt="" /></div>
                                <div className="why-us-content-box">
                                    <h3 className="why-us-name">Safety First</h3>
                                    <p className="paragraph medium">We prioritize strict safety standards to protect our team, clients, and
                                        every project environment throughout all stages of construction.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}