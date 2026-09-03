import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle, Zap, Shield, Clock, ArrowDown, ArrowUp, Activity } from 'lucide-react';
import './Hero.css';

const features = [
  { icon: Zap, label: 'Ultra-Fast Speed' },
  { icon: Shield, label: 'Secure Network' },
  { icon: Clock, label: '24/7 Support' },
];

const stats = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '1Gbps+', label: 'Max Speed' },
  { value: '24/7', label: 'Support' },
];

const formatSpeed = (mbps: number) => {
  if (mbps === 0) {
    return { value: '0.00', unit: 'Gbps' };
  }
  if (mbps >= 1000) {
    return { value: (mbps / 1000).toFixed(2), unit: 'Gbps' };
  }
  return { value: mbps.toString(), unit: 'Mbps' };
};

export default function Hero() {
  const [downloadSpeed, setDownloadSpeed] = useState(1040);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [activeMode, setActiveMode] = useState<'download' | 'upload'>('download');

  // Live speed fluctuation animation (950 Mbps to 1.1 Gbps / 1100 Mbps)
  useEffect(() => {
    const interval = setInterval(() => {
      const targetSpeed = Math.floor(Math.random() * (1100 - 950 + 1)) + 950;

      if (activeMode === 'download') {
        setDownloadSpeed(prev => {
          const startVal = prev === 0 ? 980 : prev;
          return Math.round(startVal + (targetSpeed - startVal) * 0.35);
        });
        setUploadSpeed(0);
      } else {
        setUploadSpeed(prev => {
          const startVal = prev === 0 ? 980 : prev;
          return Math.round(startVal + (targetSpeed - startVal) * 0.35);
        });
        setDownloadSpeed(0);
      }
    }, 180);

    return () => clearInterval(interval);
  }, [activeMode]);

  // Auto switch speed test mode every 4 seconds
  useEffect(() => {
    const toggleInterval = setInterval(() => {
      setActiveMode(prev => (prev === 'download' ? 'upload' : 'download'));
    }, 4000);
    return () => clearInterval(toggleInterval);
  }, []);

  const currentSpeed = activeMode === 'download' ? downloadSpeed : uploadSpeed;
  const currentFormatted = formatSpeed(currentSpeed);

  // Math for SVG progress (range 0 to 1100 Mbps)
  const currentSpeedPercent = Math.min(100, Math.max(10, (currentSpeed / 1100) * 100));

  return (
    <section className="hero" id="home">
      {/* Animated background */}
      <div className="hero__bg">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
        <div className="hero__grid" />
      </div>

      <div className="container hero__container">
        <div className="hero__content">
          {/* Badge */}
          <div className="hero__badge">
            <span className="glow-dot" />
            Bangladesh's Most Reliable ISP
          </div>

          {/* Headline */}
          <h1 className="hero__title">
            Experience
            <span className="hero__title-accent"> Lightning-Fast</span>
            <br />
            Internet Connectivity
          </h1>

          <p className="hero__description">
            Rm Communication Ltd delivers premium broadband internet solutions for homes and businesses.
            Enjoy uninterrupted connectivity with fiber-optic speeds and enterprise-grade reliability.
          </p>

          {/* Features */}
          <div className="hero__features">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="hero__feature">
                <Icon size={14} />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hero__actions">
            <Link to="/pricing" className="btn btn-primary btn-lg">
              View Packages <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="btn btn-outline btn-lg">
              <Play size={16} />
              Get a Connection
            </Link>
          </div>

          {/* Trust badges */}
          <div className="hero__trust">
            <CheckCircle size={14} className="hero__trust-icon" />
            <span>BTRC Licensed &amp; Approved</span>
            <span className="hero__trust-sep">•</span>
            <span>No hidden charges</span>
            <span className="hero__trust-sep">•</span>
            <span>Free installation</span>
          </div>
        </div>

        {/* Right side - Stats & Visual */}
        <div className="hero__visual">
          {/* Central display card */}
          <div className="hero__card-main">
            <div className="hero__card-header">
              <div className="hero__signal">
                <span /><span /><span /><span />
              </div>
              <span className="hero__card-label">Live Network Status</span>
              <span className="hero__online-badge">
                <span className="glow-dot glow-dot--pulse" /> Live Speed Test
              </span>
            </div>

            {/* Dual Download & Upload Live Readouts */}
            <div className="hero__speed-tabs">
              <div
                className={`hero__speed-tab ${activeMode === 'download' ? 'hero__speed-tab--active' : ''}`}
                onClick={() => setActiveMode('download')}
              >
                <div className="hero__speed-tab-icon hero__speed-tab-icon--dl">
                  <ArrowDown size={13} />
                </div>
                <div className="hero__speed-tab-info">
                  <span className="hero__speed-tab-label">DOWNLOAD</span>
                  <span className="hero__speed-tab-val">
                    {formatSpeed(downloadSpeed).value} <small>{formatSpeed(downloadSpeed).unit}</small>
                  </span>
                </div>
              </div>

              <div
                className={`hero__speed-tab ${activeMode === 'upload' ? 'hero__speed-tab--active' : ''}`}
                onClick={() => setActiveMode('upload')}
              >
                <div className="hero__speed-tab-icon hero__speed-tab-icon--ul">
                  <ArrowUp size={13} />
                </div>
                <div className="hero__speed-tab-info">
                  <span className="hero__speed-tab-label">UPLOAD</span>
                  <span className="hero__speed-tab-val">
                    {formatSpeed(uploadSpeed).value} <small>{formatSpeed(uploadSpeed).unit}</small>
                  </span>
                </div>
              </div>
            </div>

            {/* Speed Gauge Ring */}
            <div className="hero__speed-display">
              <div className="hero__speed-ring">
                <svg viewBox="0 0 160 160" className="hero__speed-svg">
                  <defs>
                    <linearGradient id="speed-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00c6ff" />
                      <stop offset="50%" stopColor="#0072ff" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                  {/* Base Track */}
                  <circle cx="80" cy="80" r="64" className="hero__speed-track" />
                  {/* Dynamic Progress Ring */}
                  <circle
                    cx="80"
                    cy="80"
                    r="64"
                    className="hero__speed-progress"
                    style={{
                      strokeDasharray: 402,
                      strokeDashoffset: 402 - (402 * currentSpeedPercent) / 100,
                      transition: 'stroke-dashoffset 0.2s linear'
                    }}
                  />
                </svg>

                {/* Animated Dial Value */}
                <div className="hero__speed-value">
                  <div className="hero__speed-live-badge">
                    <Activity size={10} className="hero__speed-pulse-icon" />
                    <span>TESTING</span>
                  </div>
                  <span className="hero__speed-number">{currentFormatted.value}</span>
                  <span className="hero__speed-unit">{currentFormatted.unit}</span>
                  <span className="hero__speed-label">
                    {activeMode === 'download' ? '↓ Download Speed' : '↑ Upload Speed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="hero__metrics">
              <div className="hero__metric">
                <span className="hero__metric-value">0.3ms</span>
                <span className="hero__metric-label">Latency</span>
              </div>
              <div className="hero__metric-divider" />
              <div className="hero__metric">
                <span className="hero__metric-value">99.9%</span>
                <span className="hero__metric-label">Uptime</span>
              </div>
              <div className="hero__metric-divider" />
              <div className="hero__metric">
                <span className="hero__metric-value">IPv6</span>
                <span className="hero__metric-label">Ready</span>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="hero__float-badge hero__float-badge--1">
            <Zap size={14} />
            <span>Fiber Optic</span>
          </div>
          <div className="hero__float-badge hero__float-badge--2">
            <Shield size={14} />
            <span>Secure</span>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="hero__stats-bar">
        <div className="container">
          <div className="hero__stats">
            {stats.map((s) => (
              <div key={s.label} className="hero__stat">
                <span className="hero__stat-value">{s.value}</span>
                <span className="hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
