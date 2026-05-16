const mongoose = require('mongoose');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Skill = require('../models/Skill');
require('dotenv').config();

const MONGO_URI = "mongodb+srv://mehedi_admin_19:zHsDUbbSlpdxumBi@myportfolio.orsho4o.mongodb.net/portfolio?retryWrites=true&w=majority";

const projects = [
  {
    title: "AI-Powered Content Ecosystem",
    slug: "ai-powered-content-ecosystem",
    description: "A high-performance content management system that bridges the gap between manual authorship and artificial intelligence.",
    technologies: ["PHP 8.0+", "MySQL", "Tailwind CSS", "Gemini AI API"],
    live: "https://mehedi19.netlify.app",
    github: "https://github.com/mehedi-11/AI-Based-Blogsite",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
    order: 1
  },
  {
    title: "Money Tracker - Smart Finance Manager",
    slug: "money-tracker-finance-manager",
    description: "A comprehensive financial intelligence tool designed to empower users with real-time tracking of income and expenditures.",
    technologies: ["React 18", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    live: "https://finance-tracker-19.netlify.app",
    github: "#",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop",
    order: 2
  },
  {
    title: "Advanced Full-Stack Blogging System",
    slug: "advanced-fullstack-blogging-system",
    description: "A robust digital publishing platform designed for performance, security, and enterprise-grade SEO management.",
    technologies: ["PHP", "MySQL", "Tailwind CSS", "JavaScript"],
    live: "https://mehedi19.netlify.app",
    github: "https://github.com/mehedi-11/Full-stack-blog-site",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop",
    order: 3
  },
  {
    title: "Education Consultancy Management System",
    slug: "education-consultancy-system",
    description: "A specialized ERP solution for global education agencies to manage student lifecycles and university partnerships.",
    technologies: ["PHP", "MySQL", "PHPMailer", "JavaScript"],
    live: "https://www.unilinkgs.com",
    github: "#",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop",
    order: 4
  }
];

const experience = [
  {
    designation: "Academic Content Writer",
    company: "MalishaEdu Bangladesh LTD",
    duration: "08/2024 - Present",
    type: "Onsite",
    location: "Dhaka, Bangladesh",
    description: "Working as a content writer.",
    order: 1
  },
  {
    designation: "Full Stack Developer",
    company: "Unilink Global Solution LTD",
    duration: "08/2022 - Present",
    type: "Remote",
    location: "Global",
    description: "Developing full stack applications.",
    order: 2
  },
  {
    designation: "Web Designer | Data Entry Operator",
    company: "MaxPure Food and Beverage Ltd",
    duration: "02/2024 - 05/2024",
    type: "Onsite",
    location: "Dhaka, Bangladesh",
    description: "Managed web design and data entry.",
    order: 3
  }
];

const education = [
  {
    degree: "Bachelor Degree",
    institution: "Primeasia University, Dhaka",
    duration: "2023 - Present",
    location: "Dhaka, Bangladesh",
    result: "N/A",
    order: 1
  },
  {
    degree: "Diploma Degree",
    institution: "Mahsa University, Malaysia",
    duration: "2019 - 2022",
    location: "Kuala Lumpur, Malaysia",
    result: "CGPA: 3.80",
    order: 2
  },
  {
    degree: "Secondary School Certificate (SSC)",
    institution: "Puia Adarsha High School, Nazipur",
    duration: "2016 - 2018",
    location: "Naogaon, Bangladesh",
    result: "GPA: 5.00",
    order: 3
  }
];

const skills = [
  { category: "frontend", items: ["JavaScript (ES6+)", "React.js", "Responsive Design", "TailwindCSS", "Bootstrap 5"], order: 1 },
  { category: "backend", items: ["PHP", "NodeJS", "ExpressJS", "REST API Development"], order: 2 },
  { category: "database", items: ["MySQL", "MongoDB", "Database Design", "Query Optimization"], order: 3 },
  { category: "tools", items: ["Git & GitHub", "Netlify", "Render", "EmailJS", "VS Code"], order: 4 }
];

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    await Project.deleteMany({});
    await Project.insertMany(projects);
    console.log("Projects migrated!");

    await Experience.deleteMany({});
    await Experience.insertMany(experience);
    console.log("Experience migrated!");

    await Education.deleteMany({});
    await Education.insertMany(education);
    console.log("Education migrated!");

    await Skill.deleteMany({});
    await Skill.insertMany(skills);
    console.log("Skills migrated!");

    console.log("Migration successful!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
