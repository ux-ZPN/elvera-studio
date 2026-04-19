import React from 'react';
import { Truck, RefreshCcw, ShieldCheck, MapPin } from 'lucide-react';
import './TrustBadges.css';

const TrustBadges = () => {
  const badges = [
    {
      icon: <Truck size={32} strokeWidth={1} />,
      title: "Free Shipping",
      description: "On all orders across India"
    },
    {
      icon: <RefreshCcw size={32} strokeWidth={1} />,
      title: "Easy Returns",
      description: "7-day hassle-free process"
    },
    {
      icon: <ShieldCheck size={32} strokeWidth={1} />,
      title: "Secure Payments",
      description: "100% encrypted & safe"
    },
    {
      icon: <MapPin size={32} strokeWidth={1} />,
      title: "Made in Northeast",
      description: "Crafted with local pride"
    }
  ];

  return (
    <section className="trust-badges-container">
      <div className="trust-badges-grid container">
        {badges.map((badge, index) => (
          <div key={index} className="trust-badge-item">
            <div className="trust-badge-icon">
              {badge.icon}
            </div>
            <h4 className="trust-badge-title">{badge.title}</h4>
            <p className="trust-badge-desc">{badge.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBadges;
