import React, { useEffect } from 'react';
import './Contact.css';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="contact-page animate-fade-in">
      <div className="container contact-container">
        <h1 className="contact-title">Contact</h1>
        
        <div className="contact-content">
          <p>
            If you have any questions, concerns or requests regarding this Privacy Policy or how your information is handled, please contact us:
          </p>
          
          <div className="contact-info-block">
            <p className="contact-brand">ELVÉRA STUDIO</p>
            <p className="contact-email">
              Email: <a href="mailto:support@elverastudio.in">support@elverastudio.in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
