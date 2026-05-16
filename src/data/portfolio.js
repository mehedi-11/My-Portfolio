import { 
  Code2, 
  Globe, 
  BookOpen,
  GraduationCap,
  Layout,
  Cpu,
  Smartphone
} from 'lucide-react';

export const personalInfo = {
  name: "MD Mehedi Hasan",
  title: "Front-end Developer | Content Writer",
  email: "mehedimridul1919@gmail.com",
  phone: "01776323859",
  whatsapp: "01776323859",
  location: "Amtola, 60 Feet, Mirpur, Dhaka",
  github: "https://github.com/mehedi-11",
  linkedin: "https://www.linkedin.com/in/mehedi-hasan-3423351a6/",
  website: "https://mehedi19.netlify.app",
  cvPath: "/Mehedi_Hasan_CV.pdf",
  statement: "I am Mehedi Hasan, a coding enthusiast from Bangladesh with a strong academic background. I completed my Bachelor's in Computer Science and Engineering from Primeasia University and a Diploma in Information Technology from Mahsa University. I enjoy learning new things, love playing cricket, and appreciate good food like Biryani. Cooking is also one of my hobbies, and I love cooking. I strive to grow and lead myself in a unique way. I am a responsible and hardworking individual who values discipline and consistency. I aim to apply my skills and knowledge to contribute positively to any organization."
};

export const education = [
  {
    degree: "Bachelor Degree",
    field: "Computer Science and Technology",
    institution: "Primeasia University, Dhaka",
    period: "2023 - Present",
    icon: GraduationCap
  },
  {
    degree: "Diploma Degree",
    field: "Information Technology",
    institution: "Mahsa University, Malaysia",
    period: "2019 - 2022",
    icon: GraduationCap
  },
  {
    degree: "Secondary School Certificate (SSC)",
    field: "Science Group",
    institution: "Puia Adarsha High School, Nazipur",
    period: "2016 - 2018",
    icon: GraduationCap
  }
];

export const experience = [
  {
    role: "Academic Content Writer",
    company: "MalishaEdu Bangladesh LTD",
    period: "08/2024 - Present",
    type: "On-site",
    icon: BookOpen
  },
  {
    role: "Full Stack Developer",
    company: "Unilink Global Solution LTD",
    period: "08/2022 - Present",
    type: "Remote",
    icon: Code2
  },
  {
    role: "Web Designer | Data Entry Operator",
    company: "MaxPure Food and Beverage Ltd",
    period: "02/2024 - 05/2024",
    type: "On-site",
    icon: Layout
  },
  {
    role: "Full Stack Developer",
    company: "Unilink Global Solution LTD",
    period: "05/2021 - 08/2022",
    type: "Remote",
    icon: Cpu
  },
  {
    role: "Front-end Development",
    company: "YRJ Euro International",
    period: "01/2021 - 03/2021",
    type: "Remote",
    icon: Globe
  },
  {
    role: "Front-end Development",
    company: "Sunmoon International",
    period: "01/2021 - 03/2021",
    type: "Remote",
    icon: Smartphone
  }
];

export const projects = [
  {
    title: "AI-Powered Content Ecosystem",
    slug: "ai-powered-content-ecosystem",
    description: "A high-performance content management system that bridges the gap between manual authorship and artificial intelligence. Built for modern publishers who demand speed without compromising on SEO and structure.",
    longDescription: "The AI-Powered Content Ecosystem was engineered to solve the bottleneck of professional content production. By integrating advanced Large Language Models (LLMs) like Google Gemini, the platform allows authors to generate SEO-optimized drafts, meta-descriptions, and content summaries in seconds. The architecture focuses on a clean separation between the editorial workflow and the AI processing layer, ensuring a seamless experience for multi-role teams.",
    architecture: [
      "Modular PHP 8.0 backend with a secure RESTful approach.",
      "Google Gemini API integration for real-time content intelligence.",
      "Tailwind CSS driven UI for a distraction-free editorial experience.",
      "MySQL relational database optimized for high-volume content retrieval."
    ],
    technicalHighlights: [
      "Role-Based Access Control (RBAC) ensuring data integrity across different user tiers.",
      "Asynchronous AI processing to prevent UI blocking during content generation.",
      "Advanced media management with automated image optimization for faster page loads.",
      "Custom-built SEO module that automatically analyzes content density and meta-tag relevance."
    ],
    technologies: ["PHP 8.0+", "MySQL", "Tailwind CSS", "Gemini AI API"],
    features: [
      "Hybrid AI Content Creator: Seamless integration with Google Gemini API.",
      "Role-Based Access (RBAC): Dedicated dashboards for Super Admins and Authors.",
      "Advanced Media Library: Centralized system for high-performance asset management."
    ],
    github: "https://github.com/mehedi-11/AI-Based-Blogsite",
    live: "https://mehedi19.netlify.app",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Money Tracker - Smart Finance Manager",
    slug: "money-tracker-finance-manager",
    description: "A comprehensive financial intelligence tool designed to empower users with real-time tracking of income and expenditures through advanced data visualization.",
    longDescription: "Money Tracker is a MERN stack application designed to simplify personal financial management. The core philosophy of the project is 'Financial Transparency'. It goes beyond simple ledger entries by providing users with deep insights into their spending habits through interactive charts and AI-driven recommendations. The application prioritizes security and speed, ensuring that financial data is accessible yet protected by enterprise-grade encryption standards.",
    architecture: [
      "React 18 frontend utilizing Hooks and Context API for state management.",
      "Node.js & Express.js backend architected with a microservices-ready structure.",
      "MongoDB Atlas for scalable, document-oriented data persistence.",
      "Recharts integration for professional-grade data visualization."
    ],
    technicalHighlights: [
      "JWT-based authentication with secure cookie storage for robust session management.",
      "Optimistic UI updates for a lag-free experience during transaction logging.",
      "Automated financial report generation in PDF format using server-side rendering.",
      "Responsive data tables with advanced filtering and sorting capabilities."
    ],
    technologies: ["React 18", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    features: [
      "Real-time Dashboard: Interactive visualization of financial health.",
      "AI-Powered Insights: Personalized spending analysis and budgeting advice.",
      "Professional Exporting: One-click PDF/CSV reports for financial auditing."
    ],
    github: "#",
    live: "https://finance-tracker-19.netlify.app",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Advanced Full-Stack Blogging System",
    slug: "advanced-fullstack-blogging-system",
    description: "A robust digital publishing platform designed for performance, security, and enterprise-grade SEO management.",
    longDescription: "This Full-Stack Blogging System was developed to provide a stable and scalable environment for professional digital creators. The system features a sophisticated backend built with PHP and MySQL, designed to handle large datasets while maintaining sub-second page load times. It prioritizes the user experience with a minimalist aesthetic and high readability standards.",
    architecture: [
      "Secure PHP backend with customized routing and security filters.",
      "Relational MySQL database with optimized indexing for rapid query execution.",
      "Modern Tailwind CSS UI architecture with custom performance utilities.",
      "Integrated SEO middleware for dynamic meta-tag generation."
    ],
    technicalHighlights: [
      "Custom Administrative Dashboard for real-time site management and analytics.",
      "High-speed content delivery through optimized asset pipelines.",
      "Enhanced security protocols against SQL injection and XSS attacks.",
      "Dynamic URL rewriting (via .htaccess) for search-engine-friendly link structures."
    ],
    technologies: ["PHP", "MySQL", "Tailwind CSS", "JavaScript"],
    features: [
      "Enterprise Admin Panel: Full control over posts, categories, and SEO.",
      "Performance-First UI: Optimized for maximum readability and speed.",
      "SEO-Ready Architecture: Built-in metadata and slug management system."
    ],
    github: "https://github.com/mehedi-11/Full-stack-blog-site",
    live: "https://mehedi19.netlify.app",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Education Consultancy Management System",
    slug: "education-consultancy-system",
    description: "A specialized ERP solution for global education agencies to manage student lifecycles, university partnerships, and international event logistics.",
    longDescription: "Designed for Unilink Global Solution, this system is a dedicated management platform that handles the complexities of international student recruitment. From tracking university application deadlines to managing student counseling sessions, the system provides a centralized 'command center' for education consultants. It significantly reduces manual paperwork by automating lead capture and appointment scheduling.",
    architecture: [
      "Robust PHP/MySQL foundation designed for high availability.",
      "Integrated SMTP protocols for automated student-consultant communication.",
      "Custom .htaccess configuration for secure URL structures and routing.",
      "Cloud-ready architecture for global university database synchronization."
    ],
    technicalHighlights: [
      "Dynamic Appointment Engine that manages consultant availability in real-time.",
      "Multi-destination database allowing students to compare universities across countries.",
      "Integrated Lead Management System (LMS) with automated follow-up triggers.",
      "Secure document upload portal for student application materials."
    ],
    technologies: ["PHP", "MySQL", "PHPMailer", "JavaScript"],
    features: [
      "Appointment Booking: Real-time scheduling for student consultations.",
      "Global University Database: Centralized management of partner institutions.",
      "Automated Notifications: Instance confirmation emails for all leads."
    ],
    github: "#",
    live: "https://www.unilinkgs.com",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop"
  }
];

export const skills = {
  frontend: ["JavaScript (ES6+)", "React.js", "Responsive Design", "TailwindCSS", "Bootstrap 5"],
  backend: ["PHP", "NodeJS", "ExpressJS", "REST API Development"],
  database: ["MySQL", "MongoDB", "Database Design", "Query Optimization"],
  tools: ["Git & GitHub", "Netlify", "Render", "EmailJS", "VS Code"]
};
