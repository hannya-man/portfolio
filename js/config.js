window.PORTFOLIO = {
  /* ---------- Basics ---------- */
  name: 'Neil Kevin La Viña',
  initials: 'NK',
  role: 'BSIT Student & Software Developer',
  location: 'Ozamiz City, Philippines',
  email: 'neilkevin.lavina@lsu.edu.ph',
  avatar: 'assets/images/profile.jpg',
  availability: 'Open to software development internships',

  /* ---------- Hero ---------- */
  rolesPrefix: 'I build',
  roles: ['POS & inventory systems', 'Laravel web apps', 'offline-first software', 'CTF challenges'],
  bio:
    'BSIT student at La Salle University – Ozamiz. I build POS and inventory systems in Laravel ' +
    'for real clients, compete in cybersecurity competitions, and want to learn how professional ' +
    'teams plan, review and ship software.',
  resume: '',

  /* ---------- Links ---------- */
  socials: {
    github: 'https://github.com/hannya-man',
    linkedin: 'https://www.linkedin.com/in/neil-kevin-la-vina-9a1a06316',
    website: '',
  },

  github: {
    username: 'hannya-man',
    maxRepos: 6,
    excludeForks: true,
    exclude: ['hyewonn777'], // hide repos
    // shows when a repo has no desc. on GitHub
    descriptions: {
      'hardware-pos': 'Offline-first POS and inventory system for RRC Merchandise, a hardware and construction supply store.',
      'Marcomedia-Tangub': 'POS and inventory system for Marcomedia, a printing and photography shop in Tangub City.',
      Marcomedia: 'Earlier version of the Marcomedia POS and website.',
    },
  },

  /* ---------- About ---------- */
  about: [
    "I'm an Information Technology student at La Salle University – Ozamiz City. My capstone is a " +
      'full website and inventory system for a printing and photography shop, and as a freelance ' +
      "developer I'm building an offline-first POS for a hardware and construction supply store.",
    "I'm also into cybersecurity. My team placed 2nd in the Philippine Army's TRON CUP 2026 cyber " +
      "defense qualifiers, I write OSINT and reverse engineering challenges for a CTF site, and I've " +
      'spoken about OSINT and cryptography at our InfoSec bootcamp. Outside of code, I serve in ' +
      'LSU SOURCE and host academic events for our college.',
  ],

  facts: [
    { label: 'Education', value: 'BS Information Technology, La Salle University – Ozamiz (2023 – Present)' },
    { label: 'Focus', value: 'Laravel web apps, POS & inventory systems' },
    { label: 'Also into', value: 'Cybersecurity, CTFs & game development' },
    { label: 'Certification', value: 'TESDA NC II – Computer System Servicing' },
  ],

  skills: [
    {
      group: 'Languages',
      icon: 'code',
      items: ['PHP', 'JavaScript', 'TypeScript', 'Python', 'C#', 'C++', 'HTML', 'CSS'],
    },
    {
      group: 'Web Development',
      icon: 'frontend',
      items: [
        'Laravel', 'Blade', 'Inertia.js', 'React.js', 'Angular', 'NestJS', 'Tailwind CSS', 'Alpine.js',
        'REST API', 'GraphQL', 'JWT Auth', 'Role-Based Access Control',
      ],
    },
    {
      group: 'Databases',
      icon: 'database',
      items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'Supabase', 'XAMPP'],
    },
    {
      group: 'Cybersecurity',
      icon: 'security',
      items: ['Wireshark', 'Burp Suite', 'Nmap', 'SQLMap', 'Ghidra', 'Metasploit', 'CyberChef', 'Kali Linux'],
    },
    {
      group: 'Data & Analytics',
      icon: 'chart',
      items: ['Power BI', 'Tableau', 'Excel', 'Access', 'Python (NumPy, Pandas)'],
    },
    {
      group: 'Design & Game Dev',
      icon: 'design',
      items: ['Figma', 'Adobe Photoshop', 'Canva', 'Unity', 'Unreal Engine'],
    },
  ],

  projects: [
    {
      title: 'Marcomedia Website & Inventory System',
      role: 'Capstone project',
      category: 'Web',
      description:
        'A web-based POS and inventory system for a printing and photography shop in Tangub City, ' +
        'covering billing, inventory, sales history, staff chat and user management. Stock is tracked ' +
        'per variant, a bill of materials deducts raw materials with each sale, and sales move through ' +
        'pending, processing and completed with voiding rules and Chart.js reports.',
      tech: ['Laravel', 'MySQL', 'Tailwind CSS', 'Alpine.js', 'Chart.js'],
      image: 'assets/images/projects/marcomedia.jpg',
      demo: 'https://marcomedia-tangub.vercel.app',
      repo: 'https://github.com/hannya-man/Marcomedia-Tangub',
    },
    {
      title: 'RRC Merchandise POS',
      role: 'Freelance project',
      category: 'Web',
      description:
        'An offline-first POS and inventory system for RRC Merchandise, a hardware and construction supply store. ' +
        'Cashiers keep ringing up sales without internet, and an outbox queue with exponential backoff ' +
        'and idempotent upserts syncs everything once the connection is back. Includes a stock movement ' +
        'ledger, PIN login for staff and TOTP two-factor authentication for the owner.',
      tech: ['Laravel', 'PostgreSQL', 'Vite', 'JavaScript', 'Dexie.js (IndexedDB)'],
      image: 'assets/images/projects/rrc-merchandise-pos.svg',
      demo: 'https://hannya-man.github.io/hardware-pos/',
      repo: 'https://github.com/hannya-man/hardware-pos',
    },
    {
      title: "Hyo's Lair CTF",
      role: 'Developer',
      category: 'Cybersecurity',
      description:
        'A capture-the-flag website inspired by picoCTF. I develop the OSINT and reverse engineering ' +
        'challenges that players solve to capture flags and climb the scoreboard.',
      tech: ['Web', 'OSINT', 'Reverse Engineering', 'CTF'],
      image: 'assets/images/projects/hyos-lair-ctf.svg',
      demo: '',
      repo: '',
    },
    {
      title: 'Poker Hand Classifier',
      role: 'Team project',
      category: 'Machine Learning',
      description:
        'A poker hand classifier built in Python and Jupyter, served through a Flask API, with a ' +
        'casino-style web interface and sound design made with the Web Audio API.',
      tech: ['Python', 'Jupyter', 'Flask', 'JavaScript', 'Web Audio API'],
      image: 'assets/images/projects/poker-classifier.svg',
      demo: '',
      repo: '',
    },
    {
      title: 'Wrecking Ball',
      role: 'Game developer',
      category: 'Game',
      description:
        'A Super Monkey Ball-style game where you tilt the board and let gravity roll the ball ' +
        'through each stage to the goal.',
      tech: ['Unity', 'C#'],
      image: 'assets/images/projects/wrecking-ball.svg',
      demo: '',
      repo: '',
    },
    {
      title: 'Personal Portfolio',
      role: 'Skills showcase',
      category: 'Web',
      description:
        "The site you're looking at: a responsive single-page portfolio with dark mode, scroll " +
        'animations, a photo lightbox, a validated contact form and live repositories from the GitHub API.',
      tech: ['HTML', 'CSS', 'JavaScript', 'GitHub API'],
      image: 'assets/images/projects/portfolio.svg',
      demo: 'https://hannya-man.github.io/portfolio/',
      repo: 'https://github.com/hannya-man/portfolio',
    },
  ],

  achievements: [
    {
      badge: '2nd Place',
      title: 'TRON CUP 2026: Cyber Defense Exercise Qualifiers',
      org: 'Philippine Army · Team LSU_TROJANS.exe',
      date: 'November 13–14, 2025',
      description:
        "Competed with our university team in the Philippine Army's Cyber Defense Exercise " +
        'Qualifiers, held for the 128th Philippine Army Founding Anniversary.',
      photos: [
        {
          src: 'assets/images/achievements/troncup-team.jpg',
          full: 'assets/images/achievements/troncup-post.jpg',
          alt: 'Team LSU_TROJANS.exe with their adviser in front of a screen announcing 2nd place at TRON CUP 2026',
        },
        {
          src: 'assets/images/achievements/troncup-competing.jpg',
          full: 'assets/images/achievements/troncup-competing-post.jpg',
          alt: 'Team members working on laptops during the cyber defense exercise',
        },
      ],
    },
    {
      badge: '11th Place',
      title: 'Hack4Gov 2026 Region X Qualifier',
      org: 'Individual performance · Qualifier round',
      date: 'September 2026',
      description:
        'Represented La Salle University in the regional qualifier of the government-hosted ' +
        'cybersecurity competition and placed 11th in individual performance.',
      photos: [
        {
          src: 'assets/images/achievements/hack4gov-team.jpg',
          full: 'assets/images/achievements/hack4gov-team-post.jpg',
          alt: 'La Salle University participants at the Hack4Gov 2026 Region X venue',
        },
        {
          src: 'assets/images/achievements/hack4gov-awarding.jpg',
          full: 'assets/images/achievements/hack4gov-awarding-post.jpg',
          alt: 'Participants holding certificates on stage at the Hack4Gov awarding ceremony',
        },
      ],
    },
    {
      badge: 'Guest Speaker',
      title: 'Information Security Bootcamp',
      org: 'LSU SOURCE · La Salle University',
      date: '2026',
      description:
        'Spoke on OSINT, cryptography and digital investigation tools during a multi-day ' +
        'cybersecurity bootcamp for fellow students.',
      photos: [
        {
          src: 'assets/images/achievements/infosec-bootcamp.jpg',
          alt: 'Speakers in front of a screen showing a Cryptography presentation at the InfoSec bootcamp',
        },
      ],
    },
  ],

  photoCredit: 'Event photos courtesy of LSU SOURCE.',

  certifications: [
    { title: 'TESDA NC II – Computer System Servicing', meta: 'Passer · 2023' },
    { title: '2nd Place, TRON CUP 2026 Cyber Defense Exercise Qualifiers', meta: 'Philippine Army · November 2025' },
    { title: '11th Place, Hack4Gov 2026 Region X Qualifier (Individual)', meta: 'September 2026' },
    { title: 'CyberConnectCTF Preliminaries', meta: 'Participant · DICT Region 10 · August 2025' },
  ],

  leadership: [
    {
      title: 'Vice President Undersecretary',
      org: 'LSU SOURCE (Student Organization Utilizing the Realm of Computer Eclecticism)',
      date: '2024 – 2026',
      description: 'Supported organization operations, coordinated activities and worked with the core team across two school years.',
    },
    {
      title: 'Guest Speaker, Information Security Bootcamp',
      org: 'La Salle University',
      date: '2026',
      description: 'Taught OSINT, cryptography and digital investigation tools.',
    },
    {
      title: 'Event Host / Emcee',
      org: 'College of Computer Science, Engineering, and Architecture',
      date: 'Ongoing',
      description: 'Hosts academic events and webinars for the college.',
    },
  ],

  trainings: [
    { title: 'Introduction to Git Version Control', date: 'Sep 19, 2025' },
    { title: 'UI/UX Design', date: 'Sep 26, 2025' },
    { title: 'AWS', date: 'Oct 14, 2025' },
    { title: 'Classroom to Career', date: 'Nov 4, 2025' },
    { title: 'IT Certification', date: 'Mar 11, 2026' },
    { title: 'Cybersecurity Essentials', date: 'Mar 26, 2026' },
    { title: 'Multimedia Workshop: Photography & Videography', date: 'Apr 22, 2026' },
  ],
  trainingsHost: 'All held at La Salle University – Ozamiz',

  /* ---------- Contacts ---------- */
  contactBlurb:
    'Have an internship opening, a project idea, or just want to talk tech or CTFs? ' +
    "My inbox is always open, and I'll get back to you as soon as I can.",
};
