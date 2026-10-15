import { useInView } from 'react-intersection-observer';
import { Phone, Mail, MessageCircle, Copy, CheckCheck, ChevronRight, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import './PageCommon.css';
import './SalesTeamPage.css';

const expertise1 = [
    'Corporate & SME Internet Solutions',
    'Dedicated Internet & Data Connectivity',
    'Network Infrastructure & Security Solutions',
    'Dedicated Server Hosting & Business Connectivity',
    'ISP Reseller Partnerships & Business Development',
    'Strategic Sales Planning & Client Relationship Management',
];

const expertise2 = [
    'Home Broadband & Internet Service Promotion',
    'Corporate & SME Internet Sales',
    'Dedicated Internet & Data Connectivity',
    'Network Solutions, Firewall Security & CCTV',
    'Dedicated Server Hosting Enquiries',
    'Customer Communication & Sales Follow-up',
    'ISP Reseller Acquisition & Partnership Support',
];

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button className="sales-team__copy-btn" onClick={handleCopy} title="Copy to clipboard">
            {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
    );
}

export default function SalesTeamPage() {
    const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.1, triggerOnce: true });
    const { ref: card1Ref, inView: card1InView } = useInView({ threshold: 0.1, triggerOnce: true });
    const { ref: card2Ref, inView: card2InView } = useInView({ threshold: 0.1, triggerOnce: true });

    return (
        <>
            {/* Hero */}
            <div className="page-hero">
                <div className="page-hero__bg" />
                <div className="container">
                    <span className="section-badge">
                        <TrendingUp size={12} />
                        Sales &amp; Marketing
                    </span>
                    <h1 className="page-hero__title">
                        Meet Our <span className="highlight">Sales &amp; Marketing Team</span>
                    </h1>
                    <p className="page-hero__sub sales-team__hero-sub">
                        Building Strong Partnerships. Delivering Reliable Connectivity. Empowering Business Growth.
                    </p>
                </div>
            </div>

            {/* Intro section */}
            <section className="section-sm sales-team__intro" ref={heroRef}>
                <div className="container">
                    <div className={`sales-team__intro-card ${heroInView ? 'animate-fade-in-up' : 'pre-animate'}`}>
                        <div className="sales-team__intro-icon">
                            <Users size={28} strokeWidth={1.5} />
                        </div>
                        <p className="sales-team__intro-text">
                            Our sales and marketing team is committed to helping individuals, businesses, and ISP partners discover
                            the right connectivity and technology solutions through professional guidance, responsive communication,
                            and customer-focused service.
                        </p>
                    </div>
                </div>
            </section>

            {/* Profile 1 — Hasibur Rahman */}
            <section className="section sales-team__section" ref={card1Ref}>
                <div className="container">
                    <div className={`sales-team__card ${card1InView ? 'animate-fade-in-up' : 'pre-animate'}`}>
                        {/* Role badge */}
                        <div className="sales-team__role-badge">
                            <span className="sales-team__role-label">TEAM LEADERSHIP</span>
                        </div>

                        <div className="sales-team__card-body">
                            {/* Left — Photo */}
                            <div className="sales-team__photo-col">
                                <div className="sales-team__photo-wrap">
                                    <img
                                        src="/team_profile.webp"
                                        alt="Hasibur Rahman — Head of Sales & Marketing"
                                        className="sales-team__photo sales-team__photo--portrait"
                                    />
                                    <div className="sales-team__photo-glow" />
                                </div>
                                <div className="sales-team__photo-badge">
                                    <span className="glow-dot" />
                                    Available
                                </div>
                            </div>

                            {/* Right — Content */}
                            <div className="sales-team__content">
                                <h2 className="sales-team__name">Hasibur Rahman</h2>
                                <p className="sales-team__title-role">Head of Sales &amp; Marketing</p>
                                <p className="sales-team__company">RM Communication Ltd.</p>

                                <p className="sales-team__tagline">
                                    Driving Business Growth Through Reliable Connectivity
                                </p>

                                <p className="sales-team__bio">
                                    As Head of Sales &amp; Marketing at RM Communication Ltd., Hasibur Rahman leads sales strategy,
                                    corporate client acquisition, business development, and strategic partnership initiatives. He
                                    focuses on building long-term business relationships and delivering reliable connectivity and
                                    technology solutions tailored to each client's needs.
                                </p>
                                <p className="sales-team__bio">
                                    From corporate and SME internet to dedicated internet connectivity, network infrastructure,
                                    cybersecurity, and server hosting, he helps businesses identify the right solutions to improve
                                    operational efficiency, connectivity, and digital performance.
                                </p>

                                {/* Expertise */}
                                <div className="sales-team__expertise">
                                    <h3 className="sales-team__expertise-title">Areas of Expertise</h3>
                                    <ul className="sales-team__expertise-list">
                                        {expertise1.map((item) => (
                                            <li key={item}>
                                                <ChevronRight size={14} strokeWidth={2.5} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Contact */}
                                <div className="sales-team__contacts">
                                    <h3 className="sales-team__contacts-title">Connect with Hasibur Rahman</h3>
                                    <div className="sales-team__contact-grid">
                                        <div className="sales-team__contact-item">
                                            <div className="sales-team__contact-icon sales-team__contact-icon--phone">
                                                <Phone size={16} />
                                            </div>
                                            <div className="sales-team__contact-data">
                                                <span className="sales-team__contact-label">Phone</span>
                                                <a href="tel:01335254857" className="sales-team__contact-value">01335254857</a>
                                            </div>
                                            <CopyButton text="01335254857" />
                                        </div>

                                        <div className="sales-team__contact-item">
                                            <div className="sales-team__contact-icon sales-team__contact-icon--wa">
                                                <MessageCircle size={16} />
                                            </div>
                                            <div className="sales-team__contact-data">
                                                <span className="sales-team__contact-label">WhatsApp</span>
                                                <a
                                                    href="https://wa.me/8801335254857"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="sales-team__contact-value"
                                                >
                                                    01335254857
                                                </a>
                                            </div>
                                            <a
                                                href="https://wa.me/8801335254857"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="sales-team__chat-btn"
                                            >
                                                Chat
                                            </a>
                                        </div>

                                        <div className="sales-team__contact-item">
                                            <div className="sales-team__contact-icon sales-team__contact-icon--email">
                                                <Mail size={16} />
                                            </div>
                                            <div className="sales-team__contact-data">
                                                <span className="sales-team__contact-label">Email</span>
                                                <a href="mailto:hasibulislam21.94@gmail.com" className="sales-team__contact-value">
                                                    hasibulislam21.94@gmail.com
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="sales-team__divider">
                <div className="container">
                    <div className="sales-team__divider-line" />
                </div>
            </div>

            {/* Profile 2 — Ashraful Alam */}
            <section className="section sales-team__section" ref={card2Ref}>
                <div className="container">
                    <div className={`sales-team__card ${card2InView ? 'animate-fade-in-up' : 'pre-animate'}`}>
                        {/* Role badge */}
                        <div className="sales-team__role-badge sales-team__role-badge--teal">
                            <span className="sales-team__role-label">SALES &amp; CLIENT RELATIONS</span>
                        </div>

                        <div className="sales-team__card-body">
                            {/* Left — Photo */}
                            <div className="sales-team__photo-col">
                                <div className="sales-team__photo-wrap">
                                    <img
                                        src="/ashraful_profile.jpeg"
                                        alt="Ashraful Alam — Marketing & Sales Executive"
                                        className="sales-team__photo sales-team__photo--portrait"
                                    />
                                    <div className="sales-team__photo-glow sales-team__photo-glow--teal" />
                                </div>
                                <div className="sales-team__photo-badge">
                                    <span className="glow-dot" />
                                    Available
                                </div>
                            </div>

                            {/* Right — Content */}
                            <div className="sales-team__content">
                                <h2 className="sales-team__name">Ashraful Alam</h2>
                                <p className="sales-team__title-role">Marketing &amp; Sales Executive</p>
                                <p className="sales-team__company">RM Communication Ltd.</p>

                                <p className="sales-team__tagline">
                                    Connecting Customers with the Right Technology Solutions
                                </p>

                                <p className="sales-team__bio">
                                    As Marketing &amp; Sales Executive at RM Communication Ltd., Ashraful Alam focuses on promoting
                                    the company's internet, networking, security, and hosting services while helping customers find
                                    solutions that match their requirements.
                                </p>
                                <p className="sales-team__bio">
                                    He supports customer acquisition, service promotion, corporate sales coordination, and ISP reseller
                                    development. Whether a customer needs high-speed home broadband, dedicated business internet, CCTV
                                    surveillance, network security, or point-to-point connectivity, he helps guide them toward suitable
                                    services and supports them throughout the sales enquiry process.
                                </p>

                                {/* Expertise */}
                                <div className="sales-team__expertise">
                                    <h3 className="sales-team__expertise-title">Areas of Expertise</h3>
                                    <ul className="sales-team__expertise-list">
                                        {expertise2.map((item) => (
                                            <li key={item}>
                                                <ChevronRight size={14} strokeWidth={2.5} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Contact */}
                                <div className="sales-team__contacts">
                                    <h3 className="sales-team__contacts-title">Get in Touch with Ashraful Alam</h3>
                                    <div className="sales-team__contact-grid">
                                        <div className="sales-team__contact-item">
                                            <div className="sales-team__contact-icon sales-team__contact-icon--phone">
                                                <Phone size={16} />
                                            </div>
                                            <div className="sales-team__contact-data">
                                                <span className="sales-team__contact-label">Phone</span>
                                                <a href="tel:01909506395" className="sales-team__contact-value">01909-506395</a>
                                            </div>
                                            <CopyButton text="01909506395" />
                                        </div>

                                        <div className="sales-team__contact-item">
                                            <div className="sales-team__contact-icon sales-team__contact-icon--wa">
                                                <MessageCircle size={16} />
                                            </div>
                                            <div className="sales-team__contact-data">
                                                <span className="sales-team__contact-label">WhatsApp</span>
                                                <a
                                                    href="https://wa.me/8801909506395"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="sales-team__contact-value"
                                                >
                                                    01909-506395
                                                </a>
                                            </div>
                                            <a
                                                href="https://wa.me/8801909506395"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="sales-team__chat-btn"
                                            >
                                                Chat
                                            </a>
                                        </div>

                                        <div className="sales-team__contact-item">
                                            <div className="sales-team__contact-icon sales-team__contact-icon--email">
                                                <Mail size={16} />
                                            </div>
                                            <div className="sales-team__contact-data">
                                                <span className="sales-team__contact-label">Email</span>
                                                <a href="mailto:ashrafulalam200q@gmail.com" className="sales-team__contact-value">
                                                    ashrafulalam200q@gmail.com
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
