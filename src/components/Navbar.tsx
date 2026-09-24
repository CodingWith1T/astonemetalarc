import Link from "next/link";

export default function Navabr() {
    return (
        <div data-animation="default" data-collapse="medium" data-duration="400"
            data-easing="ease" data-easing2="ease" role="banner" className="navbar w-nav">
            <div className="container">
                <div className="navbar-wrapper"><Link href="/" aria-current="page" className="brand w-nav-brand w--current"><img
                    loading="lazy" src="images/logo.JPG" height={60} width={60} alt="" className="logo-image" /></Link>
                    <nav role="navigation" className="nav-menu w-nav-menu">
                        <a href="/" className="nav-link w-inline-block">
                            <p className="nav-link-text">HOME</p>
                        </a>
                        <Link href="/about" className="nav-link w-inline-block">
                            <p className="nav-link-text">ABOUT</p>
                        </Link>
                        <Link href="/services" className="nav-link w-inline-block">
                            <p className="nav-link-text">Services</p>
                        </Link><Link href="/projects" className="nav-link w-inline-block">
                            <p className="nav-link-text">projects</p>
                        </Link><Link href="/contact" className="nav-link w-inline-block">
                            <p className="nav-link-text">Contact</p>
                        </Link>
                        {/* <div data-delay="0" data-hover="true" className="drop-down w-dropdown">
                            <div className="nav-link pages w-dropdown-toggle">
                                <div className="nav-link-text pages">pages</div>
                                <div className="drop-down-arrow w-icon-dropdown-toggle"></div>
                            </div>
                            <nav className="drop-down-navigation w-dropdown-list">
                                <div className="drop-down-links-box">
                                    <div className="drop-down-column"><Link href="/" aria-current="page"
                                        className="drop-down-link w--current">Home</Link><Link href="/about" className="drop-down-link">About</Link><Link
                                            href="/services" className="drop-down-link">Services</Link><Link href="/projects"
                                                className="drop-down-link">Projects</Link><Link href="/blog" className="drop-down-link">Blog</Link><Link
                                                    href="/contact" className="drop-down-link">Contact</Link></div>
                                    <div className="drop-down-column"><Link href="https://modera-template.webflow.io/services/renovation-works"
                                        className="drop-down-link">Service Details</Link><Link
                                            href="https://modera-template.webflow.io/category/architecture" className="drop-down-link">Blog
                                            Category</Link><Link
                                                href="https://modera-template.webflow.io/post/smart-design-tips-for-commercial-spaces"
                                                className="drop-down-link">Blog Details</Link><Link
                                                    href="https://modera-template.webflow.io/projects-category/residential"
                                                    className="drop-down-link">Projects Category</Link><Link
                                                        href="https://modera-template.webflow.io/projects/horizon-view-residences"
                                                        className="drop-down-link">Project Details</Link><Link href="https://modera-template.webflow.io/404"
                                                            className="drop-down-link">404</Link></div>
                                    <div id="w-node-_4c84c4c1-7d30-12c2-0b96-e81694a58bbd-77cae34a" className="drop-down-column last"><Link
                                        href="/template/instruction" className="drop-down-link">Instruction</Link><Link href="/template/licenses"
                                            className="drop-down-link">Licenses</Link><Link href="/template/styleguide"
                                                className="drop-down-link">Styleguide</Link><Link
                                                    href="https://webflow.com/templates/designers/mohammed-rafiq" target="_blank"
                                                    className="drop-down-link">All Templates</Link></div>
                                </div>
                            </nav>
                        </div> */}
                    </nav>
                    <div className="nav-button-wrapper"><Link href="/contact"
                        target="_blank" className="button w-inline-block">
                        <div className="text-icon-box">
                            <div className="text-icon-content">
                                <img loading="lazy"
                                    src="images/6a1c49f097e85d36dc9905ab_Button%20Arrow%20Icon.svg" alt=""
                                    className="button-arrow-icon" />
                                <img loading="lazy"
                                    src="images/6a1c49f097e85d36dc9905ab_Button%20Arrow%20Icon.svg" alt=""
                                    className="button-arrow-icon second" />
                                {/* <p className="button-text">Contact Us</p> */}
                                <div id="google_translate_element" />
                            </div>
                        </div>
                    </Link></div>
                    <div className="navbar-menu-button w-nav-button">
                        <div className="menu-icon">
                            <div className="menu-icon-line-top"></div>
                            <div className="menu-icon-line-middle">
                                <div className="menu-icon1_line-middle-inner"></div>
                            </div>
                            <div className="menu-icon-line-bottom"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}