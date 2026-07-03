import {
  Database,
  BarChart,
  FileCode2,
  FileSpreadsheet,
  Paintbrush,
  Github,
  Cpu,
  PenTool,
  Video,
  Box,
  Wrench
} from 'lucide-react'

export { projects } from './projectsData'

export const navItems = [
  { label: 'Home', id: 'hero' },
  { label: 'Work', id: 'work' },
  { label: 'Skills', id: 'skills' },
  { label: 'About', id: 'about' },
  { label: 'Contact', id: 'contact' },
]

export const skillset = [
  { name: 'Data Analytics', icon: BarChart, color: '#fb923c' },
  { name: 'SQL & Databases', icon: Database, color: '#60a5fa' },
  { name: 'Microsoft Office', icon: FileSpreadsheet, color: '#34d399' },
  { name: 'Web Development', icon: FileCode2, color: '#22d3ee' },
  { name: 'Embedded Systems', icon: Cpu, color: '#a78bfa' },
  { name: 'Arduino & ESP', icon: Wrench, color: '#38bdf8' },
  { name: 'CAD & Engineering', icon: PenTool, color: '#4ade80' },
  { name: 'Graphic Design', icon: Paintbrush, color: '#f472b6' },
  { name: 'Video Editing', icon: Video, color: '#fb7185' },
  { name: '3D Visualization', icon: Box, color: '#93c5fd' },
  { name: 'Version Control', icon: Github, color: '#f4f4f5' },
]

export const testimonials = []

export const marqueeWords = [
  'DATA ANALYTICS',
  'HARDWARE',
  'EMBEDDED SYSTEMS',
  'DIGITAL DESIGN',
  'WEB DEVELOPMENT',
  'INNOVATION',
  'SQL',
  'ARDUINO',
  'AUTOCAD',
]

export const blogPosts = []

export const aboutText = {
  heading: 'Building innovative products through engineering, data, and design.',
  headingHighlight: 'engineering, data, and design',
  paragraphs: [
    'I am a multidisciplinary engineer passionate about transforming ideas into real-world products. My expertise spans hardware development, embedded systems, data analytics, telecommunications, and digital design, allowing me to manage projects from concept to deployment.',
    'With hands-on experience in SQL, Power BI, Arduino, web development, and creative design tools, I focus on building solutions that are practical, efficient, and visually refined. I enjoy solving complex technical challenges by combining engineering principles with modern technologies.',
    'Beyond engineering, I actively participate in startup projects, prototype new ideas, and continuously expand my knowledge across multiple technology fields. My goal is not only to build functional systems but also to create products that deliver real value.',
    'If I had to describe my work in one sentence: I transform ideas into intelligent products by combining engineering, data, software, and creative design.'
  ],
}

export const footerColumns = [
  {
    title: 'General',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Work', href: '/work' },
      { label: 'Skills', href: '/#skills' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'About Me', href: '/#about' },
      { label: 'Contact', href: '/#contact' },
    ],
  },
  {
    title: 'Projects',
    links: [
      { label: 'Exam Morse', href: '/work/exammorse' },
      { label: 'Teacher Urdu', href: '/work/teacherurdu' },
      { label: 'Catelnium', href: '/work/catelnium' },
      { label: 'Hardware Projects', href: '/work' },
    ],
  },
  {
    title: 'Socials',
    links: [
      { label: 'GitHub', href: 'https://github.com/DiliAble' },
      { label: 'Telegram', href: 'https://t.me/karribayev' },
      { label: 'Instagram', href: 'https://www.instagram.com/karribayev_004' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'Email', href: 'mailto:diliable004@gmail.com' },
      { label: 'Phone', href: 'tel:+998773160155' },
    ],
  },
]

export const socialLinks = {
  github: 'https://github.com/DiliAble',
  linkedin: '#',
  twitter: '#',
  telegram: 'https://t.me/karribayev',
  instagram: 'https://www.instagram.com/karribayev_004',
  email: 'mailto:diliable004@gmail.com',
}
