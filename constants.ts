

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
    'Cursor',
    'Claude',
    'ProtoPie',
    'Cinema 4D',
    'React / Tailwind',
    'Midjourney',
    'ChatGPT',
    'Python',
    'Perplexity',
    'NotebookLM'
  ]
};

export const PROJECTS: Project[] = [
  {
    id: '2',
    title: 'AI Writing Assistant',
    category: 'Typography',
    year: '2023',
    description: 'Led UX and visual design for the system’s first AI writing assistant, growing DAU from 1.03 M to 2.79 M with strong user feedback.',
    imageUrl: '/covers/ai-writing-cover.webp',
    videoUrl: '',
    tags: ['AI-Driven', 'Growth', 'Productivity'],
    role: 'UX & UI, Visual Strategy, AI Interaction Design, Design Leadership',
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
            { url: 'https://assets.imiaoliu.com/2.1.1.webp', caption: 'Formal addresses and in-market visits in India require dedicated translation support.' },
            { url: 'https://assets.imiaoliu.com/2.1.2.webp', caption: 'Prototype: Phone supported languages and sales performance are positively correlated.' }
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
                            url: 'https://assets.imiaoliu.com/2.2.1.1.webp',
                            caption: 'Instanced mesh generation for font glyphs.',
                            type: 'image'
                        }
                    },
                    {
                        content: 'Many users are young digital natives or small entrepreneurs who rely on the internet and value clear, confident expression. This insight led to the system’s first AI-powered feature.',
                        image: {
                            url: 'https://assets.imiaoliu.com/2.2.1.2.webp',
                            caption: 'Texture atlas generation.',
                            type: 'image'
                        }
                    },
                    {
                        content: 'I designed an AI workflow triggered directly from the keyboard, creating the most natural and seamless entry point for users.',
                        image: {
                            url: 'https://assets.imiaoliu.com/2.2.1.3.mp4?v=2',
                            caption: 'Velocity-based vertex distortion.',
                            type: 'video'
                        }
                    },
                    {
                        content: 'All remaining interactions, including new feature updates, are handled within a unified bottom panel.',
                        image: {
                            url: 'https://assets.imiaoliu.com/2.2.1.4.webp',
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
                            url: 'https://assets.imiaoliu.com/2.2.2.1.mp4?v=2',
                            caption: 'Procedural grid generation logic.',
                            type: 'video'
                        }
                    },
                    {
                        content: 'The color dynamics alone express the subtle differences between each stage of the AI workflow.',
                        image: {
                            url: 'https://assets.imiaoliu.com/2.2.2.2.mp4?v=2',
                            caption: 'Fluid scaling across viewports.',
                            type: 'video'
                        }
                    },
                    {
                        content: 'I designed the AI brand identity for the entire smartphone line, including the symbol, color direction, and motion language.',
                        image: {
                            url: 'https://assets.imiaoliu.com/2.2.2.4.mp4?v=2',
                            caption: 'Depth-based color interpolation.',
                            type: 'video'
                        }
                    },
                    {
                        content: 'This design language was widely applied across AI features in OS15.',
                        image: {
                            url: 'https://assets.imiaoliu.com/2.2.2.5.mp4?v=2',
                            caption: 'Organic motion response testing.',
                            type: 'video'
                        }
                    },
                    {
                        content: '',
                        image: {
                            url: 'https://assets.imiaoliu.com/2.2.2.3.mp4?v=2',
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
    id: '1',
    title: 'Wallpaper Customization',
    category: 'Design System',
    year: '2025',
    description: 'Redesigned the wallpaper customization flow and creative features, boosting setup success rate by 46% and user satisfaction by 3.7%.',
    imageUrl: '/covers/wallpaper-cover.webp',
    videoUrl: '',
    tags: ['Innovation', 'Engagement', 'Aesthetics'],
    role: 'UX & UI, Product Strategy, Cross-Team Collaboration (13 teams), Prototyping',
    duration: '8 Months',
    website: 'www.infinixmobility.com/xos/',
    impact: [
      { value: "7", label: "OS Features" },
      { value: "12", label: "Patents" },
      { value: "46.1%", label: "Apply Success Rate" },
      { value: "3.7%", label: "Overall Satisfaction" }
    ],
    intro: 'Unclear entry points and confusing flows led to low wallpaper setup success. I restructured the personalization system and applied modular design to help users create richer wallpapers at lower cost.',
    caseStudy: {
      problem: {
        title: 'The Gap Between Design and Use',
        content: 'The brand invested significant design resources into creating unique wallpapers and styles to express its aesthetics and vision. However, the wallpaper page felt like an abandoned library. Users had low success rates in changing wallpapers and little satisfaction with the available styles, revealing a clear gap between design investment and actual experience.',
        images: [
            { url: 'https://assets.imiaoliu.com/01.1.webp', caption: 'Every new phone launch comes with a new set of wallpapers.' },
            { url: 'https://assets.imiaoliu.com/01.2.webp', caption: 'User Voices from OS14' }
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
                            url: 'https://assets.imiaoliu.com/1.02.1.1.mp4?v=2', 
                            caption: '',
                            type: 'video'
                        }
                    },
                    {
                        content: 'New user data and testing revealed that wallpaper usage could not be separated from its context. Setting wallpapers directly from the lock screen or home screen felt more intuitive to users. Based on this insight, I designed a new flow that unifies style editing across AOD, lock screen, and home screen scenarios.',
                        image: { 
                            url: 'https://assets.imiaoliu.com/1.2.1.2.mp4?v=2', 
                            caption: 'Component states across different interaction modes.',
                            type: 'video'
                        }
                    },
                    {
                        content: 'Different device series had distinct focuses in wallpaper presentation. After several iterations, I streamlined the structure into a horizontal entry with a cascading layout, adjusting the order to align with each brand\'s launch focus.',
                        image: { 
                            url: 'https://assets.imiaoliu.com/1.2.1.3.webp',
                            caption: 'Layout grids applied across different viewports.',
                            type: 'image'
                        }
                    },
                    {
                        content: 'For other styles such as AOD, lighting effects, and fonts, I unified the settings structure to reduce user cognitive load.',
                        image: { 
                            url: 'https://assets.imiaoliu.com/1.2.1.4.webp',
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
                            url: 'https://assets.imiaoliu.com/1.2.2.1.mp4?v=2', 
                            caption: 'Responsive behavior on foldable displays.',
                            type: 'video'
                        }
                    },
                    {
                        content: 'Graffiti: Text * Sticker * Background',
                        image: { 
                            url: 'https://assets.imiaoliu.com/1.2.2.2.mp4?v=2', 
                            caption: 'Vogue Portrait: Portrait * Outline * Background',
                            type: 'video'
                        }
                    },
                    {
                        content: 'AI Wallpaper: Text Prompt * Art Style',
                        image: { 
                            url: 'https://assets.imiaoliu.com/1.2.2.3.mp4?v=2', 
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
    id: '3',
    title: 'Adaptive Display System',
    category: 'Product Design',
    year: '2025',
    description: 'Established design guidelines to ensure consistent, high-quality experiences across entry-level hardware, driving a user satisfaction increase from 8.3 to 8.8.',
    imageUrl: '/covers/design-system-cover.webp',
    videoUrl: '',
    tags: ['Scalability', 'Standards', 'Adaptivity'],
    role: 'User Research, Visual Strategy, Design Standards',
    duration: '2 months',
    website: 'www.mobile-phantom.com/phantom-v-flip/',
    impact: [
        { value: "8.8", label: "User Satisfaction" },
        { value: "30+", label: "Applications Guided by New Low-Spec Design Standards" }
    ],
    intro: 'By defining clear and vibrant design guidelines for low-quality displays, I improved reading efficiency and user satisfaction under limited hardware conditions.',
    caseStudy: {
      problem: {
        title: 'Market & Hardware Constraints',
        content: 'Users were overwhelmed by dense tables and charts. They spent hours manually correlating data points to find anomalies. The product was powerful but inaccessible.',
        images: [
            { url: 'https://assets.imiaoliu.com/3.1.1.webp', caption: 'Hardware display limitations' },
            { url: 'https://assets.imiaoliu.com/3.1.2.webp', caption: 'New and inexperienced smartphone users' }
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
                        url: 'https://assets.imiaoliu.com/3.2.1.webp',
                        caption: 'Try a spacious layout with bright, colorful cards.'
                    },
                    {
                        url: 'https://assets.imiaoliu.com/3.2.2.webp',
                        caption: ''
                    },
                    {
                        url: 'https://assets.imiaoliu.com/3.2.3.webp',
                        caption: ''
                    }
                ]
            },
            {
                layout: 'grid', 
                images: [
                    {
                        url: 'https://assets.imiaoliu.com/3.2.4.1.webp',
                        caption: 'Before: itel A23S — 2 GB RAM | 32 GB ROM | 854*480'
                    },
                    {
                        url: 'https://assets.imiaoliu.com/3.2.4.2.webp',
                        caption: 'After'
                    }
                ]
            },
            {
                layout: 'vertical',
                images: [
                    {
                        url: 'https://assets.imiaoliu.com/3.2.5.webp',
                        caption: 'Unfortunately, this system design was eventually discontinued due to changes in the device release plan. However, I documented and refined a set of design principles tailored for low-performance displays.'
                    },
                    {
                        url: 'https://assets.imiaoliu.com/3.2.6.webp',
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
    title: 'Gaming Experience',
    category: 'Mobile App',
    year: '2025',
    description: 'Redesigned GT30 gaming experience to activate system and hardware capabilities, driving 47,000+ paid conversions and 35.7% revenue growth.',
    imageUrl: '/covers/gaming-cover.webp',
    videoUrl: '',
    tags: ['Gamification', 'Monetization', 'Hardware'],
    role: 'UX & UI, Agile Leadership, Growth Strategy',
    duration: '4 months',
    website: 'https://www.infinixmobility.com/gt-30',
    impact: [
        { value: "47k", label: "Paid Conversions" },
        { value: "35.7%", label: "Revenue Growth" },
        { value: "11.6%", label: "MAU Growth" },
        { value: "24.1%", label: "Gaming Brand Awareness" }
    ],
    intro: 'GT30 had strong hardware but weak software integration. I redesigned game entry, in-game interactions, and hardware coordination to turn system capabilities into real gameplay value.',
    caseStudy: {
      problem: {
        title: 'Game capabilities failed to become part of real gameplay',
        content: 'To establish the GT series as a gaming brand, hardware capabilities were continuously upgraded. However, the software experience failed to translate these capabilities into real gameplay.',
        images: [
            { url: 'https://assets.imiaoliu.com/4.1.1.1.webp', caption: 'Brand: Unclear gaming brand identity' },
            { url: 'https://assets.imiaoliu.com/4.1.1.2.webp', caption: 'Product: Low gaming feature adoption and retention' }
        ]
      },
      method: {
        title: 'Gameplay System Design',
        content: 'I redesigned GT30\'s end-to-end gaming experience to make system and hardware capabilities usable during real gameplay.',
        blocks: [
          {
            title: 'Faster Entry to Gameplay',
            content: 'I focused on shortening the distance between entering the system and starting gameplay by restructuring both Game Space and Game Assistant.',
            layout: 'vertical',
            images: [
              { url: 'https://assets.imiaoliu.com/4.2.1.1%20game%20space.webp', caption: 'Game Space redesigned with a clearer swipe structure and optimized information density, shifting launch from browsing and confirmation to direct selection and continuation.' },
              { url: 'https://assets.imiaoliu.com/4.2.1.2%20game%20assistant.webp', caption: 'Game Assistant transformed into a customizable, context-aware block layout, enabling access through spatial memory rather than visual search.' }
            ]
          },
          {
            title: 'Usable Hardware in Gameplay',
            content: 'I redesigned how gaming hardware was presented and interacted with, focusing on clarity, feedback, and predictability.',
            layout: 'vertical',
            images: [
              { url: 'https://assets.imiaoliu.com/4.2.2.1%20Gt%20trigger.webp', caption: 'Shoulder keys were mapped to in-game actions with guided setup and immediate feedback, helping players build reliable muscle memory.' },
              { url: 'https://assets.imiaoliu.com/4.2.2.2%20fan.webp', caption: 'External cooling was expressed through dynamic states and animations rather than static toggles, reinforcing active performance support.' }
            ]
          },
          {
            title: 'Low-Interruption Intelligence',
            content: 'All intelligent and multimodal features were designed around minimal interruption to avoid being ignored in high-intensity gameplay.',
            layout: 'vertical',
            images: [
              { url: 'https://assets.imiaoliu.com/4.2.3.1%20vocie.webp', caption: 'Voice interaction was constrained to command-based execution and enabled only when hands were occupied.' },
              { url: 'https://assets.imiaoliu.com/4.2.3.2%20magic.webp', caption: 'Voice effects were framed as role-based expression that blends naturally into social play.' }
            ]
          }
        ]
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
            { title: 'Design the Funnel, Not the Feature', description: 'I used behavioral data to redesign the path from intent to gameplay and remove hidden drop-offs.' },
            { title: 'Advanced Users Are Still First-Time Users', description: 'I designed for learnability, not assumed expertise, to help power gamers build muscle memory.' }
        ]
      }
    }
  }
];

// Design System Constants
export const TYPOGRAPHY = {
  h1: 'text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter',
  h2: 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter',
  h3: 'text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight',
  h4: 'text-xl md:text-2xl lg:text-3xl font-bold tracking-tight',
  h5: 'text-lg md:text-xl lg:text-2xl font-bold tracking-tight',
  body: {
    large: 'text-base md:text-lg lg:text-xl',
    regular: 'text-sm md:text-base lg:text-lg',
    small: 'text-xs md:text-sm lg:text-base',
  },
  label: {
    large: 'text-xs md:text-sm font-bold tracking-widest uppercase',
    regular: 'text-[10px] md:text-xs font-bold tracking-widest uppercase',
    small: 'text-[8px] md:text-[10px] font-bold tracking-widest uppercase',
  },
  mono: 'font-mono text-xs md:text-sm',
};

export const SPACING = {
  section: {
    padding: 'p-6 md:p-8 lg:p-12 xl:p-16',
    paddingX: 'px-6 md:px-8 lg:px-12 xl:px-16',
    paddingY: 'py-12 md:py-16 lg:py-20 xl:py-24',
    gap: 'gap-8 md:gap-12 lg:gap-16',
  },
  card: {
    padding: 'p-6 md:p-8',
    gap: 'gap-4 md:gap-6',
  },
  grid: {
    dense: 'gap-4',
    regular: 'gap-6 md:gap-8',
    loose: 'gap-8 md:gap-12',
  },
  button: {
    small: 'px-3 py-1.5',
    medium: 'px-6 py-3',
    large: 'px-8 py-4',
  },
  margin: {
    element: 'mb-4 md:mb-6',
    section: 'mb-8 md:mb-12',
    large: 'mb-12 md:mb-16',
  },
};

export const BORDERS = {
  card: 'border-2 border-black',
  cardResponsive: 'border border-black md:border-2',
  divider: 'border-b border-black',
  subtle: 'border border-black/10',
};

export const CONTAINERS = {
  imageAspect: {
    landscape: 'aspect-[4/3]',
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
    tall: 'aspect-[7/9]',
  },
  overflow: 'overflow-hidden',
  rounded: '', // Brutalist style - no rounding
};