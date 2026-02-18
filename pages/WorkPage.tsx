import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { ProjectGrid } from '../components/ProjectGrid';
import { Contact } from '../components/Contact';

const WorkPage: React.FC = () => {
  const navigate = useNavigate();

  const handleProjectClick = (id: string) => {
    navigate(`/project/${id}`);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="scroll-mt-16">
        <Hero />
      </section>

      {/* Work Section */}
      <section id="work">
        <ProjectGrid onProjectClick={handleProjectClick} />
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-16">
        <Contact />
      </section>
    </>
  );
};

export default WorkPage;
