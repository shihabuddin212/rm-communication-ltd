import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, ExternalLink } from 'lucide-react';
import './PromoPopup.css';

export default function PromoPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show popup banner upon website visit
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 400);

        return () => clearTimeout(timer);
    }, []);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsOpen(false);
    };

    const googleFormUrl = 'https://forms.gle/XKVF5uAg7BtHJPh18';

    return (
        <div className="promo-popup-overlay" onClick={handleClose}>
            <div className="promo-popup-card" onClick={(e) => e.stopPropagation()}>
                {/* Floating Close Button */}
                <button
                    className="promo-popup-close"
                    onClick={handleClose}
                    aria-label="Close offer banner"
                >
                    <X size={18} />
                </button>

                {/* Banner Image */}
                <div className="promo-popup-img-wrap">
                    <img
                        src="/RMC_Prize.jpg"
                        alt="রেফার করুন, আকর্ষণীয় সব পুরষ্কার জিতুন!"
                        className="promo-popup-img"
                    />
                </div>

                {/* Bottom Info & Action Bar */}
                <div className="promo-popup-body">
                    <div className="promo-popup-info">
                        <span className="promo-popup-badge">বিশেষ অফার (SPECIAL OFFER)</span>
                        <h3 className="promo-popup-title">রেফার করুন, আকর্ষণীয় সব পুরষ্কার জিতুন!</h3>
                    </div>

                    <div className="promo-popup-actions">
                        <Link
                            to="/offers/referral"
                            className="promo-popup-btn-outline"
                            onClick={handleClose}
                        >
                            বিস্তারিত দেখুন <ArrowRight size={15} />
                        </Link>

                        <a
                            href={googleFormUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="promo-popup-btn-solid"
                            onClick={handleClose}
                        >
                            Sign Up <ExternalLink size={15} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
