export async function generateStaticParams() {
    return [
        { slug: "why-pre-engineered-buildings-are-the-future" },
        { slug: "how-peb-structures-reduce-construction-costs" },
        { slug: "mezzanine-floors-vs-conventional-floors" },
    ];
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

  const posts: Record<string, {
    category: string;
    date: string;
    title: string;
    image: string;
    imageAlt: string;
    content: string;
  }> = {
        "why-pre-engineered-buildings-are-the-future": {
            category: "PEB Basics",
            date: "August 10, 2026",
      title: "Why Pre Engineered Buildings Are the Future of Industrial Construction",
      image: "/images/6a1c49f097e85d36dc99059a_Blog%20Thumbnail%203.webp",
      imageAlt: "Pre-engineered industrial building",
      content: `
        <p>Pre-engineered buildings (PEBs) have revolutionized the construction industry by offering faster, more cost-effective, and highly customizable building solutions. As industries continue to evolve, the demand for PEBs is growing rapidly across sectors including manufacturing, warehousing, logistics, and commercial construction.</p>
        <h2>Speed of Construction</h2>
        <p>One of the biggest advantages of PEBs is the significantly reduced construction timeline. Since components are manufactured off-site in a controlled factory environment and then assembled on-site, projects can be completed in 30-40% less time compared to conventional construction methods.</p>
        <h2>Cost Efficiency</h2>
        <p>PEBs optimize material usage through precise engineering and standardized components. This reduces waste, lowers labor costs, and minimizes on-site expenses. The predictable pricing model also helps with budget planning and control.</p>
        <h2>Design Flexibility</h2>
        <p>Modern PEB systems offer extensive customization options for dimensions, bay spacing, roof slopes, and architectural features. They can accommodate large clear spans without internal columns, making them ideal for warehouses, factories, and aircraft hangars.</p>
        <h2>Structural Efficiency</h2>
        <p>PEBs use tapered built-up sections that are engineered to match the exact bending moment diagram, resulting in optimal steel usage. This makes them lighter yet stronger than conventional hot-rolled structures.</p>
        <h2>Sustainability</h2>
        <p>Steel is 100% recyclable, and PEB manufacturing produces minimal waste. The energy efficiency of insulated panels and the reduced construction timeline further lower the carbon footprint of PEB projects.</p>
        <h2>Conclusion</h2>
        <p>With their combination of speed, cost savings, design flexibility, and sustainability, pre-engineered buildings are positioned to dominate the future of industrial construction. As technology advances, PEBs will continue to evolve, offering even more innovative solutions for modern building needs.</p>
      `
        },
        "how-peb-structures-reduce-construction-costs": {
            category: "Cost Savings",
            date: "July 22, 2026",
      title: "How PEB Structures Reduce Construction Costs by 30%",
      image: "/images/6a1c49f097e85d36dc990599_Blog%20Thumbnail%202.webp",
      imageAlt: "Pre-engineered warehouse construction",
      content: `
        <p>Cost reduction is one of the primary reasons businesses choose pre-engineered buildings (PEBs) over conventional construction. On average, PEB projects can reduce overall construction costs by 20-30% while delivering equal or superior performance.</p>
        <h2>Material Optimization</h2>
        <p>PEBs use computer-aided design to optimize every structural member. Tapered sections are designed to match the exact stress requirements at each point, eliminating unnecessary steel weight. This precision engineering typically saves 15-25% on structural steel compared to hot-rolled sections.</p>
        <h2>Reduced Foundation Costs</h2>
        <p>Lighter superstructures mean lighter foundations. PEBs typically require 30-40% less concrete and reinforcement for foundations, which is a significant cost saving, especially on poor soil conditions where deep foundations would otherwise be needed.</p>
        <h2>Faster Project Completion</h2>
        <p>Time is money in construction. PEBs reduce on-site construction time by 30-40%, which translates to lower labor costs, reduced equipment rental, earlier revenue generation, and reduced financing costs during construction.</p>
        <h2>Lower Maintenance Costs</h2>
        <p>High-quality factory-applied coatings, precision-fitted components, and standardized details result in buildings that require minimal maintenance over their lifecycle. This reduces long-term ownership costs significantly.</p>
        <h2>Predictable Pricing</h2>
        <p>With PEBs, most costs are determined upfront during the engineering and fabrication phase. There are fewer variables and change orders during construction, providing better budget certainty for project owners.</p>
        <h2>Conclusion</h2>
        <p>The cost advantages of PEBs come from multiple factors working together: material optimization, reduced foundation requirements, faster construction, lower maintenance, and predictable pricing. For cost-conscious project owners, PEBs offer compelling value without compromising on quality or performance.</p>
      `
        },
        "mezzanine-floors-vs-conventional-floors": {
            category: "Industry",
            date: "June 5, 2026",
            title: "Mezzanine Floors vs. Conventional Floors: Which is Right for Your Warehouse?",
            image: "/images/6a1c49f097e85d36dc990597_Blog%20Thumbnail%201.webp",
            imageAlt: "Steel mezzanine floor inside a warehouse",
            content: `
        <p>Mezzanine floors and conventional floors can both add usable space to a warehouse, but they serve different operational needs. A mezzanine is a raised steel platform installed inside an existing building, while a conventional floor is a ground-level slab that forms part of the original structure. Choosing the right option depends on your available height, storage requirements, and future growth plans.</p>
        <h2>Space Utilization</h2>
        <p>A mezzanine floor creates an additional level without expanding the building footprint. It is especially useful when land is expensive or the existing warehouse has unused vertical space. Conventional floors provide broad, uninterrupted storage areas at ground level, but they require additional land when more capacity is needed.</p>
        <h2>Structural Requirements</h2>
        <p>Mezzanines must be engineered for the expected live load, equipment weight, vibration, and connection details. Conventional floors rely on the building foundation and ground slab, making them suitable for heavy storage and large equipment. For warehouses with frequent handling operations, a properly designed mezzanine can provide a stable platform for storage, offices, and production areas.</p>
        <h2>Cost and Construction Time</h2>
        <p>A mezzanine can be more economical when the existing building has sufficient height and the goal is to add space quickly. It avoids the cost of purchasing and preparing additional land. A conventional floor is often more practical for new developments where the entire layout is designed around the required storage capacity.</p>
        <h2>Flexibility and Maintenance</h2>
        <p>Mezzanine floors can be designed to accommodate racks, workbenches, offices, and equipment rooms. Their modular connections can make future changes easier compared with a permanent concrete floor. Conventional floors are simpler to maintain and offer excellent durability, but changes to their layout are usually more disruptive and costly.</p>
        <h2>Which Option Should You Choose?</h2>
        <p>Choose a mezzanine when you need to maximize vertical space, avoid additional land costs, or create separate working areas within an existing warehouse. Choose a conventional floor when you require high-capacity ground-level storage, heavy equipment loads, or a new building designed from the ground up. A structural engineer can assess your building and recommend the safest, most efficient solution.</p>
      `
        }
    };

    const post = posts[slug] || posts["why-pre-engineered-buildings-are-the-future"];

    return (
        <>
            <section className="section blog-details-hero">
                <div className="blog-hero-background-box">
                    <img src={post.image} loading="lazy" alt={post.imageAlt} className="blog-hero-background-image" />
                    <div className="overlay blog-hero"></div>
                </div>
                <div className="container">
                    <div className="blog-hero-content-box">
              <div className="blog-hero-content">
                <div className="blog-category-date-wrapper fade-in">
                  <a href={`/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`} className="blog-category">{post.category}</a>
                  <p className="blog-date white">{post.date}</p>
                </div>
                <h1 data-animation="blur-stagger" className="big-blog-name">{post.title}</h1>
              </div>
            </div>
                </div>
            </section>
            <section className="section">
                <div className="container medium">
                    <div className="rich-text slide-up w-richtext" dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
            </section>
        </>
    )
}