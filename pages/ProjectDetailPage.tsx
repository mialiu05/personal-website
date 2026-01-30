import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectDetail } from '../components/ProjectDetail';
import { PROJECTS } from '../constants';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exitingProject, setExitingProject] = useState(false);

  const project = PROJECTS.find(p => p.id === id);

  if (!project) {
    // Redirect to home if project not found
    navigate('/');
    return null;
  }

  const handleBack = () => {
    setExitingProject(true);
    setTimeout(() => {
      navigate('/');
      setExitingProject(false);
    }, 280); // Match fade-out duration
  };

  const handleNextProject = (nextId: string) => {
    setExitingProject(true);
    setTimeout(() => {
      setExitingProject(false);
      navigate(`/project/${nextId}`);
      window.scrollTo(0, 0);
    }, 280);
  };

  return (
    <ProjectDetail
      project={project}
      onBack={handleBack}
      onNextProject={handleNextProject}
      isExiting={exitingProject}
    />
  );
};
