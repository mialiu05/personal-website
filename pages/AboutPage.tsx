import React from 'react';
import { AboutSection } from '../components/AboutSection';
import { WorkStyle } from '../components/WorkStyle';
import { LifeGallery } from '../components/LifeGallery';
import { Contact } from '../components/Contact';

const AboutPage: React.FC = () => {
  return (
    <>
      {/* About Section */}
      <section id="about" className="scroll-mt-16">
        <AboutSection />
        <WorkStyle />
        <LifeGallery />
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-16">
        <Contact />
      </section>
    </>
  );
};

export default AboutPage;
