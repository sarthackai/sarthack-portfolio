// All data extracted directly from Sarthack_Resume_.pdf
// Do NOT invent or fabricate any information

export const personalInfo = {
  name: "Sarthack Das",
  location: "Kolkata, West Bengal",
  phone: "8240768694",
  email: "sarthackdas@gmail.com",
  linkedin: "https://www.linkedin.com/in/sarthack-das-9074b731a",
  github: "https://github.com/sarthackai/Sarthackdas.git",
  careerObjective:
    "Motivated AI/ML student with strong foundation in Data Structures, Machine Learning, and Web Development. Seeking an entry-level position to apply analytical and development skills.",
};

export const education = [
  {
    degree: "B.Tech in CSE AI/ML",
    institution: "Techno India University",
    period: "2023 – 2027",
  },
];

export const technicalSkills = {
  languages: ["Python", "C++", "C", "SQL"],
  coreSubjects: ["DSA", "DBMS", "OS", "CN", "OOP"],
  frontend: ["HTML5", "CSS3", "React.js"],
  backend: ["Supabase", "REST APIs"],
  databases: ["PostgreSQL", "MySQL"],
  machineLearning: ["Scikit-learn", "Pandas", "NumPy", "TensorFlow"],
  devTools: ["Git", "GitHub", "VS Code", "Jupyter Notebook"],
};

export const projects = [
  {
    title: "AI Disease Prediction System",
    technologies: ["Python", "React", "Supabase", "Machine Learning"],
    icon: "disease",
    github: "https://github.com/sarthackai/disease-prediction-platform.git",
    description:
      "Built a full-stack disease prediction web application with React frontend and Supabase backend. Trained a Scikit-learn classification model on patient records achieving 92% prediction accuracy. Designed and integrated a Supabase PostgreSQL backend with REST APIs, reducing average query response time. Created a responsive React.js user interface for returning predictions.",
  },
  {
    title: "Netflix Recommendation System",
    technologies: ["Python", "Scikit-learn", "Pandas"],
    icon: "recommendation",
    description:
      "Engineered a recommendation system engine processing a dataset of titles to deliver personalized content suggestions for users. Applied Pandas and NumPy for data preprocessing, enhancing recommendation relevance. Benchmarked Cosine similarity algorithms and selected the best-performing approach, increasing recommendation accuracy.",
  },
  {
    title: "CineHub — AI-Powered Real-Time OTT Content Recommendation Platform",
    technologies: ["Python", "React", "Supabase", "FastAPI"],
    icon: "cinehub",
    github: "https://github.com/sarthackai/cinehub.git",
    description:
      "Built a full-stack, production-style streaming content platform demonstrating machine learning, real-time data engineering, and modern full-stack development. Aggregates live movie and TV metadata from TMDB. Stores movie and TV metadata in a normalized PostgreSQL database.",
  },
];

export const certifications = [
  {
    title: "Machine Learning with Python",
    issuer: "IBM Learning",
    courseId: "ML0101EN",
    date: "January 31, 2026",
    image: "/certificates/ml-python.png",
    verificationUrl:
      "https://courses.ibmlearning.skillsnetwork.site/certificates/29a5bb3006a6455baf7fe7a710679149",
  },
  {
    title: "Deep Learning with TensorFlow",
    issuer: "IBM Learning",
    courseId: "ML0120EN",
    date: "February 1, 2026",
    image: "/certificates/deep-learning-tensorflow.png",
    verificationUrl:
      "https://courses.ibmlearning.skillsnetwork.site/certificates/f6c237b706ec4f9bba91fbdf6e8862b4",
  },
  {
    title: "Prompt Engineering for Everyone",
    issuer: "IBM Learning",
    courseId: "AI0117EN",
    date: "February 2, 2026",
    image: "/certificates/prompt-engineering.png",
    verificationUrl:
      "https://courses.ibmlearning.skillsnetwork.site/certificates/e3c31ae61d394614a267a5afad6b22df",
  },
  {
    title: "Virtual Internship in Machine Learning & Artificial Intelligence",
    issuer: "IBM Learning",
    date: "February 02, 2026",
    image: "/certificates/virtual-internship-ml-ai.png",
    verificationUrl:
      "https://ibmlearning.skillsnetwork.site/certificates/de39d9dc-1daa-44ff-beef-8cffd39952c8",
  },
];
