

import { Project, Experience } from './types';

export const AUTHOR_NAME = "Miao Liu";
export const AUTHOR_ROLE = "Senior Experience Designer";
export const AUTHOR_BIO = `
  I craft digital experiences where rigorous logic meets human emotion. Specializing in AI and system strategy, I transform complex technology into clear, accessible narratives.
`;

export const EXPERIENCE: Experience[] = [
  {
    id: '1',
    role: 'Senior Experience Designer',
    company: 'Transsion',
    period: 'Nov 2021 - Aug 2025',
    description: 'Led UX strategy for AI-driven OS features (Translation, Text-gen) and defined experience standards for foldable devices and personalization systems.'
  },
  {
    id: '2',
    role: 'Experience Designer',
    company: 'OPPO',
    period: 'Jun 2019 - May 2021',
    description: 'Spearheaded system app design for ColorOS 11–13 (Notes, File Manager, Weather) and redesigned the end-to-end service experience for feedback platforms.'
  },
  {
    id: '3',
    role: 'B.S. Industrial Design',
    company: 'Sichuan University',
    period: '2015 - 2019',
    description: 'GPA: 3.46/4, Built a rigorous foundation in industrial design logic, ergonomics, and system thinking at a top-tier research university (Project 985).'
  }
];

export const SKILLS = {
  capabilities: [
    'AI-Driven Design Ops',
    'Design Systems',
    'Product Strategy',
    'Data-driven Design',
    'User Research & Testing',
    'Rapid Prototyping',
    'Design Engineering',
    'Cross-cultural Design'
  ],
  tools: [
    'Figma',
    'Protopie',
    'After Effects',
    'Cinema 4D',
    'React / Tailwind',
    'Midjourney / ChatGPT',
    'Python',
    'GenAI Tools'
  ]
};

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Wallpaper Customization',
    category: 'Design System',
    year: '2025',
    description: 'Redesigned the wallpaper customization flow and creative features, boosting setup success rate by 46% and user satisfaction by 3.7%.',
    imageUrl: 'https://i.postimg.cc/NF10byhh/A.png',
    videoUrl: 'https://github.com/mialiu05/portfolio-assets/raw/refs/heads/main/Project%201.mp4',
    tags: ['UX & UI', 'Multiple Patents', 'Cross-Team Collaboration'],
    role: 'UX & UI Design, Product Strategy, Cross-Team Collaboration(13 teams), Prototypes',
    duration: '8 Months',
    website: 'www.infinixmobility.com/xos/',
    impact: [
      { value: "7", label: "OS Features" },
      { value: "12", label: "Patents" },
      { value: "46.1%", label: "Apply Success Rate" },
      { value: "3.7%", label: "Overall Satisfaction" }
    ],
    intro: 'The brand invested significant design resources in each new phone launch to express its aesthetics and vision, but unclear entry points and a confusing flow led to low wallpaper setup success and user satisfaction. To address this, I restructured the personalization system, refined categorization and naming, and applied modular design to enable users to create richer wallpapers at lower design cost.',
    caseStudy: {
      problem: {
        title: 'The Gap Between Design and Use',
        content: 'The brand invested significant design resources into creating unique wallpapers and styles to express its aesthetics and vision. However, the wallpaper page felt like an abandoned library. Users had low success rates in changing wallpapers and little satisfaction with the available styles, revealing a clear gap between design investment and actual experience.',
        images: [
            { url: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/1045d44518431ff6dd8bc483de87219ba7065e24/01.1.png', caption: 'Every new phone launch comes with a new set of wallpapers.' },
            { url: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/47f3c392bbb22f87fd3f6f6063e6ff38664d6ca5/01.2.png', caption: 'User Voices from OS14' }
        ]
      },
      method: {
        title: 'Streamlined Architecture',
        content: '',
        subsections: [
            {
                title: 'Streamlined Architecture',
                content: 'I acted like a content librarian, organizing wallpapers and other styles by removing, merging, simplifying, and reordering categories and names to create a clearer and more efficient information structure.',
                units: [
                    {
                        content: 'Primitive tokens define the smallest atomic values for spacing, color, and typography.',
                        image: { 
                            url: 'https://github.com/mialiu05/portfolio-assets/raw/refs/heads/main/1.02.1.1.mp4', 
                            caption: '',
                            type: 'video'
                        }
                    },
                    {
                        content: 'New user data and testing revealed that wallpaper usage could not be separated from its context. Setting wallpapers directly from the lock screen or home screen felt more intuitive to users. Based on this insight, I designed a new flow that unifies style editing across AOD, lock screen, and home screen scenarios.',
                        image: { 
                            url: 'https://github.com/mialiu05/portfolio-assets/raw/refs/heads/main/1.2.1.2.mp4', 
                            caption: 'Component states across different interaction modes.',
                            type: 'video'
                        }
                    },
                    {
                        content: 'Different device series had distinct focuses in wallpaper presentation. After several iterations, I streamlined the structure into a horizontal entry with a cascading layout, adjusting the order to align with each brand\'s launch focus.',
                        image: { 
                            url: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/main/1.2.2.3.png', 
                            caption: 'Layout grids applied across different viewports.',
                            type: 'image'
                        }
                    },
                    {
                        content: 'For other styles such as AOD, lighting effects, and fonts, I unified the settings structure to reduce user cognitive load.',
                        image: { 
                            url: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/main/1.2.2.4.png', 
                            caption: 'Interaction patterns standardized for touch targets.',
                            type: 'image'
                        }
                    }
                ]
            },
            {
                title: 'Modular System',
                content: 'High-cost 3D and motion effects were handled by the brand team, while my focus was to explore modular and combinable personalization methods that allow users to “multiply” their creativity and generate more wallpaper variations.',
                units: [
                    {
                        content: 'Vogue Portrait: Portrait * Outline * Background',
                        image: { 
                            url: 'https://github.com/mialiu05/portfolio-assets/raw/refs/heads/main/1.2.2.1.mp4', 
                            caption: 'Responsive behavior on foldable displays.',
                            type: 'video'
                        }
                    },
                    {
                        content: 'Graffiti: Text * Sticker * Background',
                        image: { 
                            url: 'https://github.com/mialiu05/portfolio-assets/raw/refs/heads/main/1.2.2.2.mp4', 
                            caption: 'Vogue Portrait: Portrait * Outline * Background',
                            type: 'video'
                        }
                    },
                    {
                        content: 'AI Wallpaper: Text Prompt * Art Style',
                        image: { 
                            url: 'https://github.com/mialiu05/portfolio-assets/raw/refs/heads/main/1.2.2.3.mp4', 
                            caption: 'Localization stress testing for text expansion.',
                            type: 'video'
                        }
                    }
                ]
            }
        ]
      },
      result: {
        title: 'Unified Velocity',
        content: 'The system deployment had immediate measurable effects on the engineering workflow and product consistency.',
        items: []
      },
      reflection: {
        title: 'Systems are Living',
        content: '',
        items: [
            { title: 'User Verification', description: 'Design is incomplete without validation. We must confirm via user testing that resources (like wallpapers) are not just designed, but actually discoverable by users.' },
            { title: 'Synchronized Execution', description: 'Clarity drives efficiency. Using demos and daily syncs bridges the gap between design and code, ensuring the engineering team perfectly understands the vision.' },
            { title: 'Trust via Transparency', description: 'Collaboration relies on evidence. Maintaining traceable documentation and clear records is the foundation for building trust and accountability across teams.' }
        ]
      }
    }
  },
  {
    id: '2',
    title: 'AI Writing Assistant',
    category: 'Typography',
    year: '2023',
    description: 'Led UX and visual design for the system’s first AI writing assistant, growing DAU from 1.03 M to 2.79 M with strong user feedback.',
    imageUrl: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/main/2%20COVER.png',
    videoUrl: 'https://github.com/mialiu05/portfolio-assets/raw/refs/heads/main/cover2%20.mp4',
    tags: ['Design Lead', 'Visual Strategy', 'AI'],
    role: 'UX & UI Design, Visual Strategy, AI Interaction Design, Design Leadership',
    duration: '5 Months',
    website: 'www.tecno-mobile.com/hios/home/',
    impact: [
      { value: "171%", label: "Increase in DAU" },
      { value: "24", label: "Countries & Regions with Identified Top Purchasing Drivers" },
      { value: "23.5 Billion", label: "Global Impressions Worldwide" }
    ],
    intro: 'In multilingual markets, users struggled to express themselves accurately and confidently. I transformed the translation experience into the system’s first AI writing assistant, defining its interaction flow and visual language.',
    caseStudy: {
      problem: {
        title: 'Language Diversity Challenge',
        content: 'In markets like India and Africa, language diversity is immense, with dozens of local languages in one country. People often rely on translation tools in daily life and work. Research showed that improved translation features and local language support significantly enhance user experience and sales.',
        images: [
            { url: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/main/2.1.1.png', caption: 'Formal addresses and in-market visits in India require dedicated translation support.' },
            { url: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/main/2.1.2.png', caption: 'Prototype: Phone supported languages and sales performance are positively correlated.' }
        ]
      },
      method: {
        title: 'Kinetic Type',
        content: '',
        subsections: [
            {
                title: 'From Translation to AI Writing Assistant',
                content: '',
                units: [
                    {
                        content: 'In the early phase, we focused on building a powerful, multi-scenario translation experience. User feedback was highly positive, and to our surprise, 80% of one million daily active users turned out to be using social media translation.',
                        image: {
                            url: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/main/2.2.1.1.png',
                            caption: 'Instanced mesh generation for font glyphs.',
                            type: 'image'
                        }
                    },
                    {
                        content: 'Many users are young digital natives or small entrepreneurs who rely on the internet and value clear, confident expression. This insight led to the system’s first AI-powered feature.',
                        image: {
                            url: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/main/2.2.1.2.png',
                            caption: 'Texture atlas generation.',
                            type: 'image'
                        }
                    },
                    {
                        content: 'I designed an AI workflow triggered directly from the keyboard, creating the most natural and seamless entry point for users.',
                        image: {
                            url: 'https://github.com/mialiu05/portfolio-assets/raw/refs/heads/main/2.2.1.3.mp4',
                            caption: 'Velocity-based vertex distortion.',
                            type: 'video'
                        }
                    },
                    {
                        content: 'All remaining interactions, including new feature updates, are handled within a unified bottom panel.',
                        image: {
                            url: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/main/2.2.1.4.png',
                            caption: 'Shader-based edge anti-aliasing.',
                            type: 'image'
                        }
                    }
                ]
            },
            {
                title: 'Visual Strategy',
                content: 'Through brainstorming, the design team shaped the AI’s persona. We envisioned her as a delicate, gentle, and intelligent woman. I wanted users to sense her presence in the most subtle and elegant way.',
                units: [
                    {
                        content: 'Only color transitions are needed to simulate the exploratory process of AI.',
                        image: {
                            url: 'https://github.com/mialiu05/portfolio-assets/raw/refs/heads/main/2.2.2.1.mp4',
                            caption: 'Procedural grid generation logic.',
                            type: 'video'
                        }
                    },
                    {
                        content: 'The color dynamics alone express the subtle differences between each stage of the AI workflow.',
                        image: {
                            url: 'https://github.com/mialiu05/portfolio-assets/raw/refs/heads/main/2.2.2.2.mp4',
                            caption: 'Fluid scaling across viewports.',
                            type: 'video'
                        }
                    },
                    {
                        content: 'I designed the AI brand identity for the entire smartphone line, including the symbol, color direction, and motion language.',
                        image: {
                            url: 'https://github.com/mialiu05/portfolio-assets/raw/refs/heads/main/2.2.2.4.mp4',
                            caption: 'Depth-based color interpolation.',
                            type: 'video'
                        }
                    },
                    {
                        content: 'This design language was widely applied across AI features in OS15.',
                        image: {
                            url: 'https://github.com/mialiu05/portfolio-assets/raw/refs/heads/main/2.2.2.5.mp4',
                            caption: 'Organic motion response testing.',
                            type: 'video'
                        }
                    },
                    {
                        content: '',
                        image: {
                            url: 'https://github.com/mialiu05/portfolio-assets/raw/refs/heads/main/2.2.2.3.mp4',
                            caption: 'Final production build.',
                            type: 'video'
                        }
                    }
                ]
            }
        ]
      },
      result: {
        title: 'Visceral Reading',
        content: 'The result is a high-impact visual narrative where the form of the text reinforces the content.',
        items: []
      },
      reflection: {
        title: 'Performance Costs',
        content: '',
        items: [
            { title: 'Designing AI with Real User Value', description: 'Even with the current AI hype, meaningful design must return to real user stories and focus on the value it creates.' },
            { title: 'From Features to a Cohesive System', description: 'In a smartphone ecosystem, each feature iteration should be considered as part of the larger system to maintain a consistent and enduring brand experience.' }
        ]
      }
    }
  },
  {
    id: '3',
    title: 'Design Guidelines for Display Adaptation',
    category: 'Product Design',
    year: '2025',
    description: 'Established design guidelines to ensure consistent, high-quality experiences across entry-level hardware, driving a user satisfaction increase from 8.3 to 8.8.',
    imageUrl: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/e121fd7a72bc682f14b6033bb2ad7b2b3c73b784/cover%203.png',
    videoUrl: 'https://github.com/mialiu05/portfolio-assets/raw/refs/heads/main/Video%20cover%203.mp4',
    tags: ['UX Research', 'Visual Strategy', 'Design Guidelines'],
    role: 'User Research Visual Strategy, Design Standards',
    duration: '3 Months',
    website: 'www.mobile-phantom.com/phantom-v-flip/',
    impact: [
        { value: "8.8", label: "User Satisfaction", description: "Achieved a +0.5 increase from baseline by improving legibility on low-res screens." },
        { value: "30+", label: "Applications Guided by New Low-Spec Design Standards", description: "Significant reduction in navigation errors due to improved touch targets and clarity." }
    ],
    intro: 'By defining clear and vibrant design guidelines for low-quality displays, I improved reading efficiency and user satisfaction under limited hardware conditions.',
    caseStudy: {
      problem: {
        title: 'Market & Hardware Constraints',
        content: 'Users were overwhelmed by dense tables and charts. They spent hours manually correlating data points to find anomalies. The product was powerful but inaccessible.',
        images: [
            { url: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/e121fd7a72bc682f14b6033bb2ad7b2b3c73b784/3.1.1.png', caption: 'Hardware display limitations' },
            { url: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/e121fd7a72bc682f14b6033bb2ad7b2b3c73b784/3.1.2.png', caption: 'New and inexperienced smartphone users' }
        ]
      },
      method: {
        title: 'Design Guidelines',
        content: '',
        blocks: [
            {
                title: 'Design Exploration',
                content: '',
                layout: 'vertical',
                images: [
                    {
                        url: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/main/3.2.1.png',
                        caption: 'Try a spacious layout with bright, colorful cards.'
                    },
                    {
                        url: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/e121fd7a72bc682f14b6033bb2ad7b2b3c73b784/3.2.2.png',
                        caption: ''
                    },
                    {
                        url: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/e121fd7a72bc682f14b6033bb2ad7b2b3c73b784/3.2.3.png',
                        caption: ''
                    }
                ]
            },
            {
                layout: 'grid', 
                images: [
                    {
                        url: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/e121fd7a72bc682f14b6033bb2ad7b2b3c73b784/3.2.4.1.png',
                        caption: 'Before: itel A23S — 2 GB RAM | 32 GB ROM | 854*480'
                    },
                    {
                        url: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/e121fd7a72bc682f14b6033bb2ad7b2b3c73b784/3.2.4.2.png',
                        caption: 'After'
                    }
                ]
            },
            {
                layout: 'vertical',
                images: [
                    {
                        url: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/e121fd7a72bc682f14b6033bb2ad7b2b3c73b784/3.2.5.png',
                        caption: 'Unfortunately, this system design was eventually discontinued due to changes in the device release plan. However, I documented and refined a set of design principles tailored for low-performance displays.'
                    },
                    {
                        url: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/e121fd7a72bc682f14b6033bb2ad7b2b3c73b784/3.2.6.png',
                        caption: 'These principles were further stress-tested and adapted for the first-generation vertical foldable device, proving the system\'s flexibility.'
                    }
                ]
            }
        ]
      },
      result: {
        title: 'Clarity at Scale',
        content: 'The new interface democratized data access, allowing non-technical teams to self-serve insights.',
        items: []
      },
      reflection: {
        title: '',
        content: '',
        items: []
      }
    }
  },
  {
    id: '4',
    title: 'User Feedback System',
    category: 'Mobile App',
    year: '2022',
    description: 'Optimizing the post-sales ecosystem by unifying repair and feedback workflows, driving a 35.9% increase in ticket efficiency.',
    imageUrl: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/3a5db72872f7516c0d6d4c9deba6128d12229473/cover4.png',
    videoUrl: 'https://raw.githubusercontent.com/mialiu05/portfolio-assets/3a5db72872f7516c0d6d4c9deba6128d12229473/cover4.png',
    tags: ['Web & App', 'Service Design', 'Workflow Optimization'],
    comingSoon: true,
    role: 'Product Designer',
    duration: '4 Months',
    website: 'App Store / UrbanFlow',
    impact: [
        { value: "4.8", label: "App Store Rating" },
        { value: "10k+", label: "Daily Active Users" },
        { value: "50%", label: "Faster Input" }
    ],
    intro: 'City navigation apps are often cluttered with ads and irrelevant features. Urban Flow is a return to basics—a tool designed for the speed of city life.',
    caseStudy: {
      problem: {
        title: 'Cognitive Load',
        content: 'Commuters are often rushing. Trying to tap tiny buttons on a complex map while walking is frustrating and unsafe.',
        images: [
            { url: 'https://picsum.photos/800/600?random=40', caption: 'Field Study: Commuters struggling with navigation apps during rush hour.' },
            { url: 'https://picsum.photos/800/600?random=401', caption: 'Thumb Zone Analysis: Most existing controls were out of reach.' }
        ]
      },
      method: {
        title: 'Thumb Zone Design',
        content: 'I mapped the entire interface to the bottom third of the screen. Gestures replace buttons: swipe down to search, swipe right for next route. Haptic feedback confirms actions without looking.',
        image: 'https://picsum.photos/800/500?random=41'
      },
      result: {
        title: 'Fluid Navigation',
        content: 'User testing confirmed that the gesture-based interface significantly improved on-the-go usability.',
        items: [
            { title: '50%', description: 'Reduction in input time compared to standard map apps.' },
            { title: '10k+', description: 'Daily active users achieved within 3 months of launch.' },
            { title: '4.8', description: 'Average App Store rating based on 500+ reviews.' }
        ]
      },
      reflection: {
        title: 'Invisible Design',
        content: '',
        items: [
            { title: 'Onboarding', description: 'Gestures are not intuitive initially. A robust onboarding flow was essential for adoption.' },
            { title: 'Haptics', description: 'Tactile feedback replaces visual confirmation, allowing "eyes-free" usage.' },
            { title: 'Constraint', description: 'Removing features is harder than adding them. We said no to 90% of requests.' }
        ]
      }
    }
  }
];