import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navabar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Astone Metal Arc | PEB & Industrial Shed Manufacturers",

  description:
    "Astone Metal Arc provides Pre Engineered Buildings, prefabricated steel structures, industrial sheds, factory sheds, mezzanine floors, prefab cold storage, PEB cargo sheds, and commercial warehouses across India.",

  keywords: [
    "Astone Metal Arc",
    "PEB manufacturers",
    "PEB manufacturers in Ghaziabad",
    "PEB manufacturers in Uttar Pradesh",
    "pre engineered building",
    "pre engineered building manufacturers",
    "prefabricated steel structure",
    "prefabricated building manufacturers",
    "industrial shed manufacturers",
    "industrial shed manufacturers in Uttar Pradesh",
    "factory shed manufacturers",
    "metal roofing shed",
    "mezzanine floor",
    "prefab cold storage",
    "PEB cargo shed",
    "commercial warehouse",
    "rice mill structure",
    "steel structure manufacturers",
    "PEB company in India",
  ],

  authors: [
    {
      name: "Astone Metal Arc",
      url: "https://www.astonemetalarc.com/",
    },
  ],

  creator: "Astone Metal Arc",
  publisher: "Astone Metal Arc",

  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },

  metadataBase: new URL("https://www.astonemetalarc.com/"),

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.astonemetalarc.com/",
    siteName: "Astone Metal Arc",

    title:
      "Astone Metal Arc | PEB & Industrial Shed Manufacturers in Ghaziabad",

    description:
      "Astone Metal Arc specializes in Pre Engineered Buildings, prefabricated steel structures, industrial sheds, factory sheds, mezzanine floors, prefab cold storage, PEB cargo sheds, and commercial warehouses.",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Astone Metal Arc - PEB and Steel Structure Solutions",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Astone Metal Arc | PEB & Industrial Shed Manufacturers",

    description:
      "Pre Engineered Buildings, prefabricated steel structures, industrial sheds, factory sheds, mezzanine floors, and commercial warehouses.",

    images: ["/twitter-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "https://www.astonemetalarc.com/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script src="/js/webfont.js" type="text/javascript"></script>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              WebFont.load({
                google: {
                  families: ["Inter:300,400,500,600,700","Space Grotesk:300,400,500,600,700"]
                }
              });
            `
          }}
        />
        <script src="https://unpkg.com/split-type"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__WF_REVIEW_BRIDGE = {
                siteId: "6a1c49f097e85d36dc990582",
                version: "0.3.0",
                marker: "__wf_review_snippet_v1",
                bridgeToken: "wfbt_034d54388c9345a9b90423947ac1ce20",
                reviewSurface: "published-review",
                reviewScriptUrl: "https://validation-worker.createsomething.workers.dev/app-validator/snippet/review.js"
              };
            `
          }}
        />
        <style>{`
          /* Hide both word and character stagger elements instantly when the page starts loading */
          [data-animation="blur-stagger"],
          [data-animation="blur-stagger-chars"] {
            opacity: 0;
          }
        `}</style>
        <script src="/js/review.js"></script>
      </head>
      <body>
        <div className="page-wrapper">
          <Navabar />
          {children}
          <Footer />
        </div>

        <script src="/js/jquery-3.5.1.min.dc5e7f18c8.js" type="text/javascript"></script>
        <script src="/js/webflow.schunk.a3140c51201be139.js" type="text/javascript"></script>
        <script src="/js/webflow.schunk.a97914c1ae4e5a04.js" type="text/javascript"></script>
        <script src="/js/webflow.schunk.b577cb78c16441bf.js" type="text/javascript"></script>
        <script src="/js/webflow.dd6d9f03.4f965d73eaf8fc82.js" type="text/javascript"></script>
        <script src="/js/gsap.min.js" type="text/javascript"></script>
        <script src="/js/ScrollTrigger.min.js" type="text/javascript"></script>

        <Script
          id="gsap-init-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
    function initGsapAnimations() {

      // -------------------------------------------------------
      // 1. STAT COUNTER ANIMATION
      // -------------------------------------------------------
      const stats = document.querySelectorAll(".stat-number");

      stats.forEach((stat) => {
        const target = +stat.getAttribute("data-target");
          const suffix = stat.getAttribute("data-suffix") || "";

          stat.innerText = "0" + suffix;

          let countObj = {value: 0 };

          gsap.to(countObj, {
            value: target,
          duration: 2.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stat,
          start: "top bottom",
          toggleActions: "play none none none",
          },
          onUpdate: () => {
            stat.innerText = Math.floor(countObj.value) + suffix;
          }
        });
      });

          // -------------------------------------------------------
          // 2. TEXT SCRUB REVEAL ANIMATION
          // -------------------------------------------------------

          let typeSplit = new SplitType("[scrub-each-word]", {
            types: "words",
          tagName: "span"
      });

          $("[scrub-each-word]").each(function () {
        const words = $(this).find(".word");

          let tl = gsap.timeline({
            scrollTrigger: {
            trigger: $(this),
          start: "top 90%",
          end: "top 15%",
          scrub: true
          }
        });

          tl.from(words, {
            opacity: 0.4,
          duration: 0.2,
          ease: "none",
          stagger: {each: 0.4 }
        });
      });

          gsap.set("[scrub-each-word]", {opacity: 1 });


          // -------------------------------------------------------
          // 3. BLUR STAGGER ANIMATION (UPDATED FOR BOTTOM ENTRY)
          // -------------------------------------------------------
          const blurTargetElements = document.querySelectorAll('[data-animation="blur-stagger"], [data-animation="blur-stagger-chars"]');

      blurTargetElements.forEach((element) => {
        // 1. Detect configuration
        const animType = element.getAttribute('data-animation');
          const isCharMode = animType === 'blur-stagger-chars';

          // 2. Split text based on mode
          const splitTypeOptions = isCharMode ? {types: 'words, chars' } : {types: 'words' };
          const splitText = new SplitType(element, splitTypeOptions);

          // 3. Define visual variables (Where the "Nice" feel comes from)
          let animationVars = {
            opacity: 0,
          filter: "blur(8px)", // Keep original blur amount
          x: 0,
          y: 0,
          duration: 1.2, // Slightly longer duration for smoother entry
          stagger: 0.06, // Default word stagger speed
          ease: "quart.out" // More premium feeling ease than power2
        };

          // 4. Update variables ONLY for character mode
          if (isCharMode) {
            // Come from 30px down (Bottom entry)
            animationVars.y = 15;
          // Slower stagger than before so it doesn't rush
          animationVars.stagger = 0.06;
        } else {
            // Keep original Word settings (Sideways entry)
            animationVars.x = 14;
        }

          // 5. Target the actual items to animate (chars array or words array)
          const animTargets = isCharMode ? splitText.chars : splitText.words;

          // Apply performance hints
          gsap.set(animTargets, {willChange: "transform, filter, opacity" });

          // 6. Run Animation
          gsap.from(animTargets, {
            ...animationVars, // Spread the variables defined above
            scrollTrigger: {
            trigger: element,
          start: "top 88%", // Triggers slightly later so more of the element is in view
          toggleActions: "play none none none"
          }
        });
      });

          // Keep FOUC fix active
          gsap.set('[data-animation="blur-stagger"], [data-animation="blur-stagger-chars"]', {opacity: 1 });


      // -------------------------------------------------------
      // 4. MARQUEE INFINITE ANIMATION
      // -------------------------------------------------------
      gsap.utils.toArray(".awards-marquee-box").forEach((wrap) => {
        const tracks = wrap.querySelectorAll(".awards-list");

          // Check Webflow custom attribute: data-direction="right" (defaults to left)
          const direction = wrap.getAttribute("data-direction") === "right" ? "right" : "left";

        const tweens = Array.from(tracks).map((track) => {
          // Define settings based on direction
          const startX = direction === "right" ? -100 : 0;
          const endX = direction === "right" ? 0 : -100;

          // Set initial position immediately
          gsap.set(track, {xPercent: startX });

          // Create the infinite animation
          return gsap.to(track, {
            xPercent: endX,
          duration: 25,
          ease: "none",
          repeat: -1
          });
        });

        // Hover interactions
        wrap.addEventListener("mouseenter", () => tweens.forEach(t => t.pause()));
        wrap.addEventListener("mouseleave", () => tweens.forEach(t => t.resume()));
      });

    }
    
    // In Next.js, DOMContentLoaded might have already fired.
    if (document.readyState === "complete" || document.readyState === "interactive") {
      setTimeout(initGsapAnimations, 100);
    } else {
      window.addEventListener("DOMContentLoaded", initGsapAnimations);
    }
`
          }}
        />
      </body>
    </html>
  );
}
