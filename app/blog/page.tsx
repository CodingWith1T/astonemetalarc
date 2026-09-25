"use client";

import { useState, type MouseEvent } from "react";

export default function Blog() {
    const [activeCategory, setActiveCategory] = useState("all");

    const selectCategory = (event: MouseEvent<HTMLAnchorElement>, category: string) => {
        event.preventDefault();
        setActiveCategory(category);
    };

    return (
        <>
            <section className="section inner-page-hero">
                <div className="container">
                    <div className="inner-page-hero-content-box">
                        <div className="inner-page-hero-left">
                            <h1 data-animation="blur-stagger-chars" className="heading-1 white">ARTICLES</h1>
                        </div>
                        <div className="inner-page-hero-right fade-in">
                            <div className="breadcrumb-box"><a href="/" className="breadcrumb-link">Home</a>
                                <p className="middle-dot">•</p>
                                <p className="breadcrumb-text">Blog</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="inner-page-hero-box"><img src="/images/6a1c49f097e85d36dc9906bb_Inner%20Hero%20bg%207.webp"
                    loading="lazy" sizes="(max-width: 1442px) 100vw, 1442px"
                    srcSet="/images/6a1c49f097e85d36dc9906bb_Inner%2520Hero%2520bg%25207-p-500.webp 500w, images/6a1c49f097e85d36dc9906bb_Inner%2520Hero%2520bg%25207-p-800.webp 800w, images/6a1c49f097e85d36dc9906bb_Inner%2520Hero%2520bg%25207-p-1080.webp 1080w, images/6a1c49f097e85d36dc9906bb_Inner%20Hero%20bg%207.webp 1442w"
                    alt="" className="hero-background-image" />
                    <div className="inner-page-hero-overlay"></div>
                </div>
            </section>
            <section className="section">
                <div className="container">
                    <div className="all-blogs-box">
                        <div className="blogs-categories slide-up">
                            <div className="categories-list-wrapper w-dyn-list">
                                <div role="list" className="categories-list w-dyn-items">
                                    <div role="listitem" className="category-item w-dyn-item"><a href="#peb-basics"
                                        className={`category-link ${activeCategory === "peb-basics" ? "w--current" : ""}`}
                                        onClick={(event) => selectCategory(event, "peb-basics")}>PEB Basics</a></div>
                                    <div role="listitem" className="category-item w-dyn-item"><a href="#cost-saving"
                                        className={`category-link ${activeCategory === "cost-saving" ? "w--current" : ""}`}
                                        onClick={(event) => selectCategory(event, "cost-saving")}>Cost Saving</a></div>
                                    <div role="listitem" className="category-item w-dyn-item"><a href="#industry"
                                        className={`category-link ${activeCategory === "industry" ? "w--current" : ""}`}
                                        onClick={(event) => selectCategory(event, "industry")}>Industry</a></div>
                                </div>
                            </div><a href="#all" className={`category-link all ${activeCategory === "all" ? "w--current" : ""}`}
                                onClick={(event) => selectCategory(event, "all")}>All</a>
                        </div>
                        <div className="all-blogs-list-wrapper w-dyn-list">
                            <div role="list" className="all-blogs-list w-dyn-items">
                                {activeCategory === "all" || activeCategory === "peb-basics" ? <div role="listitem" className="blog-item slide-up w-dyn-item"><a
                                    href="/post/why-pre-engineered-buildings-are-the-future" className="blog-link w-inline-block">
                                    <div className="blog-thumbnail-box"><img src="images/6a1c49f097e85d36dc99059a_Blog%20Thumbnail%203.webp"
                                        loading="lazy" alt="" sizes="100vw"
                                        srcSet="images/6a1c49f097e85d36dc99059a_Blog%2520Thumbnail%25203-p-500.webp 500w, images/6a1c49f097e85d36dc99059a_Blog%2520Thumbnail%25203-p-800.webp 800w, images/6a1c49f097e85d36dc99059a_Blog%20Thumbnail%203.webp 1000w"
                                        className="blog-thumbnail" /></div>
                                    <div className="blog-card-content-box">
                                        <div className="blog-category-date-box">
                                            <p className="blog-category">PEB Basics</p>
                                            <div className="line"></div>
                                            <p className="blog-date">August 10, 2026</p>
                                        </div>
                                        <h2 className="blog-name">Why Pre Engineered Buildings Are the Future of Industrial Constructions</h2>
                                    </div>
                                </a></div> : null}
                                {activeCategory === "all" || activeCategory === "cost-saving" ? <div role="listitem" className="blog-item slide-up w-dyn-item"><a
                                    href="/post/how-peb-structures-reduce-construction-costs" className="blog-link w-inline-block">
                                    <div className="blog-thumbnail-box"><img src="/images/6a1c49f097e85d36dc990599_Blog%20Thumbnail%202.webp"
                                        loading="lazy" alt="" sizes="100vw"
                                        srcSet="/images/6a1c49f097e85d36dc990599_Blog%20Thumbnail%202.webp 500w, /images/6a1c49f097e85d36dc990599_Blog%20Thumbnail%202.webp 800w, /images/6a1c49f097e85d36dc990599_Blog%20Thumbnail%202.webp 1000w"
                                        className="blog-thumbnail" /></div>
                                    <div className="blog-card-content-box">
                                        <div className="blog-category-date-box">
                                            <p className="blog-category">Cost Saving</p>
                                            <div className="line"></div>
                                            <p className="blog-date">July 22, 2026</p>
                                        </div>
                                        <h2 className="blog-name">How PEB Structures Reduce Construction Costs by 30%</h2>
                                    </div>
                                </a></div> : null}
                                {activeCategory === "all" || activeCategory === "industry" ? <div role="listitem" className="blog-item slide-up w-dyn-item"><a
                                    href="/post/mezzanine-floors-vs-conventional-floors" className="blog-link w-inline-block">
                                    <div className="blog-thumbnail-box"><img src="/images/6a1c49f097e85d36dc990597_Blog%20Thumbnail%201.webp"
                                        loading="lazy" alt="" sizes="100vw"
                                        srcSet="/images/6a1c49f097e85d36dc990597_Blog%20Thumbnail%201.webp 500w, /images/6a1c49f097e85d36dc990597_Blog%20Thumbnail%201.webp 800w, /images/6a1c49f097e85d36dc990597_Blog%20Thumbnail%201.webp 1000w"
                                        className="blog-thumbnail" /></div>
                                    <div className="blog-card-content-box">
                                        <div className="blog-category-date-box">
                                            <p className="blog-category">Industry</p>
                                            <div className="line"></div>
                                            <p className="blog-date">June 5, 2026</p>
                                        </div>
                                        <h2 className="blog-name">Mezzanine Floors vs. Conventional Floors: Which is Right for Your Warehouse?</h2>
                                    </div>
                                </a></div> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}