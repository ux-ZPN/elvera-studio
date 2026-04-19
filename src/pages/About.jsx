import React, { useEffect } from 'react';
import './About.css';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page animate-fade-in">
      <div className="container about-container">
        
        <div className="about-content">
          <p className="about-lead">We are ELVÉRA STUDIO.</p>
          <p>A design label rooted in the Northeast. Built on heritage. Made to last.</p>
          <p>Most things are made to be consumed — worn once, forgotten, replaced. We made something different.</p>
          <p>ELVÉRA STUDIO was founded with a single conviction: that the culture of Northeast India deserves to be worn, not just witnessed. That its stories — carried across eight states, across centuries of craft, language and landscape — are worth designing around.</p>
          <p>We don't chase trends. We don't do loud. We build pieces that hold meaning long after the season ends.</p>
          
          <h2 className="about-subheading">VOL 01 - SEVEN SISTERS</h2>
          <p>Our debut collection. Seven tees. One for each of the seven sisters of the Northeast — Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Tripura.</p>
          <p>Each piece is a cultural artifact. Designed to be worn. Built to be kept.</p>
          
          <h2 className="about-subheading">What we believe</h2>
          <p>Heritage is not traditional. It is timeless. <br/>
          Design is not decoration. It is language. <br/>
          Clothing is not fashion. It is identity.</p>
          
          <p className="about-footer-text">Made in the Northeast. Made for the world.</p>
        </div>

      </div>
    </div>
  );
};

export default About;
