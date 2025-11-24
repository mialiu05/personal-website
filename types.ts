
export interface CaseStudyItem {
  title: string;
  description: string;
}

export interface CaseStudyImage {
  url: string;
  caption: string;
  type?: 'image' | 'video';
}

export interface CaseStudyBlock {
  title?: string;
  content?: string;
  images: CaseStudyImage[];
  layout?: 'vertical' | 'grid';
}

export interface CaseStudyUnit {
  title?: string; // Added title for structured unit blocks
  content: string;
  image: CaseStudyImage;
}

export interface CaseStudySubsection {
  title: string;
  content: string;
  units: CaseStudyUnit[];
}

export interface CaseStudySection {
  title: string;
  content: string;
  image?: string; // Kept for backward compatibility
  images?: CaseStudyImage[]; // Kept for backward compatibility
  items?: CaseStudyItem[];
  blocks?: CaseStudyBlock[]; 
  subsections?: CaseStudySubsection[]; // New field for vertical narrative flow
}

export interface ImpactMetric {
  value: string;
  label: string;
  description?: string; // Added description for detailed outcome explanation
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  tags: string[];
  comingSoon?: boolean;
  // New Detail Fields
  role: string;
  duration: string;
  website: string;
  impact: ImpactMetric[];
  intro: string;
  caseStudy: {
    problem: CaseStudySection;
    method: CaseStudySection;
    result: CaseStudySection;
    reflection: CaseStudySection;
  };
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export type ViewState = 'home' | 'work' | 'about' | 'contact';