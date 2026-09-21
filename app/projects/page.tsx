"use client";

import { useState } from "react";

const projects = [
  {
    id: 1,
    href: "/projects/greenfield-office-building",
    image: "/astoneImages/warehouse_1.jpeg",
    category: "Factory Shed",
    location: "Uttar Pradesh, India",
    name: "Industrial Factory Shed",
  },
  {
    id: 2,
    href: "/projects/horizon-view-residences",
    image: "/astoneImages/warehouse_2.jpeg",
    category: "Mezzanine Floor",
    location: "Gujarat, India",
    name: "Mezzanine Floor Installation",
  },
  {
    id: 3,
    href: "/projects/emerald-hills-residence",
    image: "/astoneImages/blinkit_project.png",
    category: "Cold Storage",
    location: "Maharashtra, India",
    name: "Prefab Cold Storage Facility",
  },
  {
    id: 4,
    href: "/projects/skyline-business-tower",
    image: "/astoneImages/liberia_project.png",
    category: "Hospital PEB",
    location: "Liberia, Africa",
    name: "Hospital PEB Project",
  },
  {
    id: 5,
    href: "/projects/indra-gandhi-university",
    image: "/astoneImages/Indra_Gandhi_trivel_university_Amarkantak.png",
    category: "Institutional",
    location: "Amarkantak, Madhya Pradesh",
    name: "Indira Gandhi Tribal University",
  },
  {
    id: 6,
    href: "/projects/mazzainine-building-1",
    image: "/astoneImages/Mazzainine_building_project_1.png",
    category: "Mezzanine Floor",
    location: "Delhi NCR, India",
    name: "Mezzanine Building Project 1",
  },
  {
    id: 7,
    href: "/projects/mazzainine-building-2",
    image: "/astoneImages/Mazzainine_building_project_2.png",
    category: "Mezzanine Floor",
    location: "Delhi NCR, India",
    name: "Mezzanine Building Project 2",
  },
  {
    id: 8,
    href: "/projects/mazzainine-building-3",
    image: "/astoneImages/Mazzainine_building_project_3.png",
    category: "Mezzanine Floor",
    location: "Delhi NCR, India",
    name: "Mezzanine Building Project 3",
  },
  {
    id: 9,
    href: "/projects/mazzainine-building-4",
    image: "/astoneImages/Mazzainine_building_project_4.png",
    category: "Mezzanine Floor",
    location: "Delhi NCR, India",
    name: "Mezzanine Building Project 4",
  },
  {
    id: 10,
    href: "/projects/mazzainine-building-5",
    image: "/astoneImages/Mazzainine_building_project_5.png",
    category: "Mezzanine Floor",
    location: "Delhi NCR, India",
    name: "Mezzanine Building Project 5",
  },
  {
    id: 11,
    href: "/projects/bhutani-project",
    image: "/astoneImages/bhutani_project.png",
    category: "Villa's PEB",
    location: "Greater Noida, Uttar Pradesh",
    name: "Bhutani Villa's PEB Project",
  },
  {
    id: 12,
    href: "/projects/managal-electrical",
    image: "/astoneImages/managal_electircal_pvt_ltd_jaipur_project.png",
    category: "Industrial",
    location: "Jaipur, Rajasthan",
    name: "Managal Electrical Pvt Ltd",
  },
  {
    id: 13,
    href: "/projects/oman-project",
    image: "/astoneImages/oman_project.jpeg",
    category: "Cargo Shed",
    location: "Oman, Middle East",
    name: "Oman Cargo Shed Project",
  },
  {
    id: 14,
    href: "/projects/warehouse-3",
    image: "/astoneImages/warehouse_3.jpeg",
    category: "Warehouse",
    location: "Tamil Nadu, India",
    name: "Industrial Warehouse Complex",
  },
  {
    id: 15,
    href: "/projects/cargo-shed-project",
    image: "/astoneImages/cargo_shed_project.png",
    category: "Cargo Shed",
    location: "Gujarat, India",
    name: "Cargo Shed Project",
  },
  {
    id: 16,
    href: "/projects/factory-1",
    image: "/astoneImages/factory_1.png",
    category: "Factory Shed",
    location: "Maharashtra, India",
    name: "Factory Shed Project 1",
  },
  {
    id: 17,
    href: "/projects/factory-2",
    image: "/astoneImages/factory_2.png",
    category: "Factory Shed",
    location: "Karnataka, India",
    name: "Factory Shed Project 2",
  },
  {
    id: 18,
    href: "/projects/factory-with-crane",
    image: "/astoneImages/factory_with_crane.png",
    category: "Factory Shed",
    location: "Tamil Nadu, India",
    name: "Factory with Crane Project",
  },
];

const categories = [
  "All",
  "Factory Shed",
  "Mezzanine Floor",
  "Cold Storage",
  "Hospital PEB",
  "Villa's PEB",
  "Cargo Shed",
  "Rice Mill",
  "Institutional",
  "Industrial",
  "Warehouse",
];

export default function Project() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <>
      <section className="section inner-page-hero">
        <div className="container">
          <div className="inner-page-hero-content-box">
            <div className="inner-page-hero-left">
              <h1 data-animation="blur-stagger-chars" className="heading-1 white">Projects</h1>
            </div>
            <div className="inner-page-hero-right fade-in">
              <div className="breadcrumb-box"><a href="/" className="breadcrumb-link">Home</a>
                <p className="middle-dot">•</p>
                <p className="breadcrumb-text">projects</p>
              </div>
            </div>
          </div>
        </div>
        <div className="inner-page-hero-box"><img src="/astoneImages/PEB_shade_3.jpeg"
            loading="lazy" sizes="100vw"
            srcSet="/astoneImages/PEB_shade_3.jpeg 500w, /astoneImages/PEB_shade_3.jpeg 800w, /astoneImages/PEB_shade_3.jpeg 1080w, /astoneImages/PEB_shade_3.jpeg 1442w"
            alt="" className="hero-background-image" />
          <div className="inner-page-hero-overlay"></div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="all-projects-box">
            <div className="all-projects-top slide-up">
              <div className="all-projects-heading-box">
                <div className="subtitle-heading-box">
                  <p data-wf--subtitle--variant="base" className="subtitle">Our Portfolio</p>
                  <h2 className="heading-2">Where Design Meets Structural Excellence</h2>
                </div>
              </div>
            </div>
            <div className="all-projects-bottom">
              <div className="projects-categories-box slide-up">
                <div className="projects-categories-list-wrapper w-dyn-list">
                  <div role="list" className="projects-categories-list w-dyn-items">
                    {categories.map((cat) => (
                      <div key={cat} role="listitem" className="project-category-item w-dyn-item">
                        <a
                          href="#"
                          className={`project-category-link ${activeCategory === cat ? "w--current" : ""}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveCategory(cat);
                          }}
                        >
                          {cat}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="all-projects-list-wrapper w-dyn-list">
                <div role="list" className="all-projects-list w-dyn-items">
                  {filteredProjects.map((project) => (
                    <div key={project.id} role="listitem" className="project-item slide-up w-dyn-item"><a
                        href={project.href} className="project-link w-inline-block">
                        <div className="project-image-box"><img src={project.image}
                            loading="lazy" alt="" sizes="100vw"
                            srcSet={`${project.image} 500w, ${project.image} 800w, ${project.image} 1080w, ${project.image} 1370w`}
                            className="project-image" />
                          <div className="project-overlay"></div>
                        </div>
                        <div className="project-content-box">
                          <p className="project-category">{project.category}</p>
                          <div className="project-location-name-box">
                            <div className="project-location-box"><img
                                src="images/6a1c49f097e85d36dc990696_Orange%20Location%20Icon.svg" loading="lazy" alt=""
                                className="project-location-icon" />
                              <p className="project-location">{project.location}</p>
                            </div>
                            <h3 className="project-name">{project.name}</h3>
                          </div>
                        </div>
                      </a></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}