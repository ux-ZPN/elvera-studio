import React from 'react';
import './BrandStory.css';

const BrandStory = () => {
  return (
    <section className="brand-story-container container animate-fade-in">
      <div className="brand-story-grid">
        <div className="brand-story-image-wrapper">
          {/* Using a high-quality editorial placeholder reflecting nature/texture */}
          <img 
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1500&auto=format&fit=crop" 
            alt="Elvera Studio Heritage" 
            className="brand-story-image"
            loading="lazy"
          />
        </div>
        <div className="brand-story-content">
          <h2 className="brand-story-title">About Us</h2>
          <div className="brand-story-quote">
            <p className="brand-story-lead">
              "ELVÉRA STUDIO is a design label rooted in the Northeast."
            </p>
            <p>
              We build pieces around the culture, stories, and identity of Northeast India—not trends, not noise. Every drop is intentional. Every design carries meaning.
            </p>
            <p>
              Heritage is not traditional. It is timeless.
            </p>
            <p className="brand-story-signature">Made to be kept.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
