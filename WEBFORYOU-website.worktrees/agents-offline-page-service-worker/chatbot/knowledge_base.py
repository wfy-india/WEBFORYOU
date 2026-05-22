# ──────────────────────────────────────────────────────────────────────────────
#  WebForYou RAG Knowledge Base
#  Each document is a plain-text chunk that will be embedded and stored in
#  ChromaDB. Keep chunks focused (one topic each) for best retrieval quality.
# ──────────────────────────────────────────────────────────────────────────────

DOCUMENTS = [
    # ── ABOUT ──────────────────────────────────────────────────────────────
    "WebForYou (also called WFY) is an AI-powered web development agency based in Hyderabad, India. "
    "The domain is wfy.co.in. We serve clients across India and are expanding to international clients.",

    "WebForYou's slogan is: 'AI-powered web design. Stunning results. Built in days, not months.' "
    "We are a full agency (not freelancers), so clients get a whole team, not just one person.",

    "WebForYou is located in Hyderabad, India. The primary contact WhatsApp number is +91 8106532307. "
    "Clients can also reach us via the contact form at wfy.co.in/contact.",

    # ── SERVICES ───────────────────────────────────────────────────────────
    "WebForYou currently offers: business websites, landing pages, portfolio sites, e-commerce stores "
    "(Shopify, WooCommerce, or custom), web application development, website redesigns, website "
    "performance optimisation and bug fixes, and post-launch maintenance and support.",

    "Services coming soon at WebForYou: digital marketing, full SEO campaigns, branding, logo design, "
    "and graphic design. These are not yet available but clients can register interest via the contact form.",

    "WebForYou does NOT currently offer native mobile app development (iOS / Android). "
    "We build mobile-responsive web apps that work well on all devices.",

    "Every website WebForYou delivers is fully responsive — it works on phones, tablets, and desktops. "
    "All sites also follow basic SEO best practices: clean HTML structure, fast loading, proper meta tags.",

    "WebForYou offers AI Integration as a service — embedding AI features into websites and web apps. "
    "E-commerce development (custom, Shopify, WooCommerce) is also a core service.",

    # ── PRICING ────────────────────────────────────────────────────────────
    "WebForYou has fixed-price packages for common website types such as business sites, portfolios, "
    "and landing pages. Complex or custom projects receive a tailored quote. "
    "Exact prices are shared after the client fills out the contact form.",

    "WebForYou uses milestone-based payments. A portion is paid upfront to begin, and the rest is "
    "tied to delivery milestones. There are NO hidden charges — only what is agreed in the quote.",

    "WebForYou does not publish a fixed minimum budget publicly. Clients should share their budget "
    "range in the contact form and the team will confirm if it is a good fit.",

    "Payments at WebForYou are split into installments linked to project milestones. "
    "Full payment is not required upfront. After final payment, the client owns everything — "
    "the code, design files, and domain.",

    "WebForYou accepts online payments via Razorpay (secure Indian payment gateway). "
    "Clients can pay through the Client Portal at wfy.co.in/client/login.",

    # ── TIMELINE & PROCESS ─────────────────────────────────────────────────
    "Most WebForYou projects are completed within 1 to 2 weeks. Larger or more complex builds "
    "take longer. A clear timeline is given before work starts.",

    "WebForYou's development process: (1) Client fills contact form. (2) Team reviews requirements "
    "and sends a proposal and quote. (3) After approval, design and development begin. "
    "(4) Progress is shared for feedback. (5) Final delivery and handover.",

    "Clients are involved at key stages: design approval, content review, and before the final launch. "
    "Communication happens via email, WhatsApp, or video calls.",

    # ── OWNERSHIP & CONTRACTS ──────────────────────────────────────────────
    "Once a WebForYou project is complete and fully paid, the client owns 100% of the deliverables — "
    "code, designs, domain, and hosting credentials. WebForYou does NOT retain ownership.",

    "WebForYou works with formal contracts to protect both sides. NDAs can be arranged if needed. "
    "A contract is standard for every project.",

    # ── HOSTING & DOMAIN ───────────────────────────────────────────────────
    "WebForYou can work with a client's existing domain and hosting. If the client does not have "
    "them yet, WebForYou can recommend providers and help set everything up. "
    "Hosting is a third-party cost paid directly by the client.",

    # ── CLIENT PORTAL ──────────────────────────────────────────────────────
    "The Client Portal (wfy.co.in/client/login) is a secure dashboard for existing clients. "
    "Clients log in with a unique passkey to track project milestones, submit maintenance requests, "
    "and view and pay invoices via Razorpay.",

    # ── DEVELOPER PORTAL ───────────────────────────────────────────────────
    "The Developer Portal (wfy.co.in/developer/login) is a secure internal area for the WebForYou "
    "development team. It is NOT for clients — it is used to manage projects, billing, and settings.",

    # ── NAVIGATION GUIDE ──────────────────────────────────────────────────
    "Website pages: Home (/), Services (/services), Pricing (/pricing), About (/about), "
    "Contact (/contact), Terms (/terms), Certificate verification (/certificate). "
    "Portals: Client Portal (/client/login), Developer Portal (/developer/login).",

    # ── GETTING STARTED ────────────────────────────────────────────────────
    "To get started with WebForYou, fill out the contact form at wfy.co.in/contact. "
    "Provide: your business type, what you need the website to do, examples of sites you like, "
    "your budget range, and your target deadline.",

    "If a visitor is ready to hire WebForYou they should fill out the contact form. "
    "The team responds within 24 hours.",

    # ── INTERNSHIP / CERTIFICATES ─────────────────────────────────────────
    "WebForYou has run business development and sales internship programmes. "
    "Interns who completed the programme received a certificate. "
    "Certificate verification is available at wfy.co.in/certificate.",
]

# Metadata tags — must match DOCUMENTS index exactly
METADATAS = [
    {"topic": "about"},
    {"topic": "about"},
    {"topic": "about, contact"},
    {"topic": "services"},
    {"topic": "services"},
    {"topic": "services"},
    {"topic": "services"},
    {"topic": "services"},
    {"topic": "pricing"},
    {"topic": "pricing"},
    {"topic": "pricing"},
    {"topic": "pricing"},
    {"topic": "pricing, payments"},
    {"topic": "timeline, process"},
    {"topic": "timeline, process"},
    {"topic": "timeline, process"},
    {"topic": "ownership, legal"},
    {"topic": "legal, contracts"},
    {"topic": "hosting, domain"},
    {"topic": "client portal"},
    {"topic": "developer portal"},
    {"topic": "navigation"},
    {"topic": "getting started"},
    {"topic": "getting started"},
    {"topic": "internship, certificates"},
]
