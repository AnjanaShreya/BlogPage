const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clear existing database entries in correct order (child tables first)
  console.log('🗑️ Cleaning up existing tables...');
  await prisma.programApplication.deleteMany({});
  await prisma.mootCourtRegistration.deleteMany({});
  await prisma.mootCourtSchedule.deleteMany({});
  await prisma.internshipApplication.deleteMany({});
  await prisma.blog.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.mootCourt.deleteMany({});
  await prisma.internship.deleteMany({});

  // 2. Create Users
  console.log('👤 Seeding users...');
  const adminPassword = await bcrypt.hash('admin123', 12);
  const userPassword = await bcrypt.hash('user123', 12);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@lexscripta.com',
      password: adminPassword,
      role: 'admin',
      status: 'Active'
    }
  });

  const chiefEditor = await prisma.user.create({
    data: {
      email: 'editor@lexscripta.com',
      password: adminPassword,
      role: 'Chief Editor',
      status: 'Active'
    }
  });

  const reviewerUser = await prisma.user.create({
    data: {
      email: 'reviewer@lexscripta.com',
      password: adminPassword,
      role: 'Blog Reviewer',
      status: 'Active'
    }
  });

  const regularUser = await prisma.user.create({
    data: {
      email: 'student@lexscripta.com',
      password: userPassword,
      role: 'user',
      status: 'Active'
    }
  });

  console.log('✅ Users seeded successfully!');

  // 3. Create Blogs
  console.log('📝 Seeding blogs...');
  const blog1 = await prisma.blog.create({
    data: {
      authorId: regularUser.id,
      name: 'Anshuman Gupta',
      university: 'National Law School of India University',
      degree: 'B.A. LL.B. (Hons.)',
      year: '3rd Year',
      shortBio: 'Avid reader and research enthusiast focusing on constitutional jurisprudence and democratic systems.',
      category: 'Constitutional Law',
      heading: 'The Evolving Paradigm of Article 21: Right to Privacy in the Digital Age',
      blogContent: '<p>The right to privacy has transitioned from a penumbral guarantee to a core fundamental right in the landmark K.S. Puttaswamy judgment. With the rapid expansion of digital databases, algorithms, and AI tools, state surveillance and data brokers have gained unprecedented access to individual behavioral profiles.</p><p>This article analyzes how contemporary digital regulatory schemas in India intersect with Article 21 of the Constitution. We trace legal precedents and argue for strict encryption protections and strong judicial checks on government interception frameworks to safeguard democratic liberties.</p>',
      status: 'approved',
      approvedById: chiefEditor.id
    }
  });

  const blog2 = await prisma.blog.create({
    data: {
      authorId: regularUser.id,
      name: 'Rohan Sharma',
      university: 'Symbiosis Law School, Pune',
      degree: 'B.B.A. LL.B. (Hons.)',
      year: '4th Year',
      shortBio: 'Specializes in corporate regulation, international trade dispute resolution, and insolvency laws.',
      category: 'Corporate Law',
      heading: 'Insolvency and Bankruptcy Code: Structural Challenges in Real Estate Resolutions',
      blogContent: '<p>The Insolvency and Bankruptcy Code (IBC) of 2016 has significantly reformed corporate debt recovery in India. However, the unique framework of the real estate sector, where homebuyers act as financial creditors, presents structural anomalies in corporate insolvency resolution processes (CIRP).</p><p>This article reviews the statutory modifications and judicial overrides governing builders\' liquidations, and assesses practical solutions to prevent stalled housing projects from leaving buyers stranded without financial recourse.</p>',
      status: 'pending'
    }
  });

  const blog3 = await prisma.blog.create({
    data: {
      authorId: regularUser.id,
      name: 'Ananya Iyer',
      university: 'NALSAR University of Law',
      degree: 'B.A. LL.B. (Hons.)',
      year: '5th Year',
      shortBio: 'IPR law enthusiast with published research on copyright regimes in generative neural networks.',
      category: 'Intellectual Property Law',
      heading: 'Generative AI and Fair Use Doctrine: Redefining Authorship Under Copyright Law',
      blogContent: '<p>Generative Artificial Intelligence algorithms train on vast swathes of copyrighted literature, art, and proprietary data. When AI generates custom essays or artworks based on natural language prompts, does the output infringe the underlying copyrighted dataset?</p><p>This article examines the application of the classic four-factor Fair Use test under global intellectual property regimes to training datasets, and suggests licensing guidelines for technological developers.</p>',
      status: 'needs-revision',
      reviewComments: 'Please expand your discussion on the European Union IPR Directive and clarify the specific legal tests utilized in US courts.',
      isResubmitted: false,
      revisionCount: 1
    }
  });

  console.log('✅ Blogs seeded successfully!');

  // 4. Create Programs
  console.log('🎓 Seeding programs...');
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 15);

  const program1 = await prisma.program.create({
    data: {
      title: 'Summer School on Constitutional Hermeneutics',
      description: 'An intensive two-week educational series examining principles of originalism, living constitutionalism, and statutory interpretation under the guidance of leading supreme court advocates.',
      startDate: nextMonth,
      endDate: nextMonthEnd,
      programType: 'summer',
      status: 'Active',
      hostInstitution: 'LexScripta Academy',
      programFee: '₹1,500',
      speakerName: 'Senior Advocate Dr. Abhishek Manu Singhvi',
      maxCapacity: '100',
      liveSessionLink: 'https://zoom.us/j/lexscriptasummerschool',
      prizePool: '₹25,000 for top researchers',
      courtVenue: 'Online',
      enrollmentType: 'Individual',
      capacityType: 'Limited',
      stipend: 'N/A',
      duration: '14 Days',
      seatsAvailable: '45'
    }
  });

  // Seed application for Program
  await prisma.programApplication.create({
    data: {
      programId: program1.id,
      name: 'Vikram Aditya',
      email: 'vikram@nlu.ac.in',
      college: 'National Law University, Delhi',
      status: 'Pending',
      skills: 'Legal Research, Mooting, Article Writing',
      whyInterested: 'Keen to understand advanced judicial review doctrines directly from legal pioneers.',
      resumeLink: 'https://drive.google.com/file/d/cv1234/view'
    }
  });

  console.log('✅ Programs seeded successfully!');

  // 5. Create Moot Courts
  console.log('⚖️ Seeding moot courts...');
  const mootCourtDate = new Date(today.getFullYear(), today.getMonth() + 2, 20);
  const moot1 = await prisma.mootCourt.create({
    data: {
      title: '1st LexScripta National Environmental Law Moot Court Competition',
      date: mootCourtDate,
      venue: 'National Law University Campus, Jodhpur (Hybrid Mode)',
      description: 'This competition focuses on emerging global ecological crises, transnational trade regulations, and national tribal displacement issues.',
      registrationDeadline: new Date(today.getFullYear(), today.getMonth() + 2, 5),
      contact: 'mootcoordinator@lexscripta.com (+91 99999 88888)',
      teams: 48,
      prizes: 'Winner: ₹50,000 | Runner Up: ₹30,000 | Best Researcher: ₹10,000 | Best Memorial: ₹10,000',
      rulesLink: 'https://lexscripta.com/files/moot_2026_rules.pdf'
    }
  });

  // Add schedule
  await prisma.mootCourtSchedule.createMany({
    data: [
      {
        mootCourtId: moot1.id,
        day: 'Day 1 (Friday)',
        events: 'Registration, Desk Evaluation of Memorials, and Inaugural Plenary Session'
      },
      {
        mootCourtId: moot1.id,
        day: 'Day 2 (Saturday)',
        events: 'Preliminary Rounds 1 and 2, Quarterfinals, and Researchers\' Test'
      },
      {
        mootCourtId: moot1.id,
        day: 'Day 3 (Sunday)',
        events: 'Semifinal Rounds, Final Plenary Round, Valedictory Ceremony and Prize Distribution'
      }
    ]
  });

  // Add registration
  await prisma.mootCourtRegistration.create({
    data: {
      mootCourtId: moot1.id,
      name: 'Kartik Aryan',
      email: 'kartik.aryan@sls.edu',
      college: 'Symbiosis Law School, Noida',
      leader: 'Kartik Aryan',
      members: 'Sneha Roy (Speaker 2), Ayush Verma (Researcher)',
      status: 'Confirmed'
    }
  });

  console.log('✅ Moot Courts seeded successfully!');

  // 6. Create Internships
  console.log('💼 Seeding internships...');
  const internStart = new Date(today.getFullYear(), today.getMonth() + 1, 10);
  const internEnd = new Date(today.getFullYear(), today.getMonth() + 2, 10);

  const internship1 = await prisma.internship.create({
    data: {
      title: 'Legal Editorial Internship (Virtual)',
      description: 'Reviewing academic blog submissions, conducting rigorous plagiarism and source verification audits, and editing selected legal essays for publishing schedules.',
      startDate: internStart,
      endDate: internEnd,
      programType: 'internship',
      status: 'Active',
      stipend: '₹3,000/month (performance-based bonus)',
      duration: '4 Weeks',
      seatsAvailable: '5'
    }
  });

  // Add application for Internship
  await prisma.internshipApplication.create({
    data: {
      internshipId: internship1.id,
      name: 'Rohan Mehra',
      email: 'rohan.mehra@gmail.com',
      college: 'Government Law College, Mumbai',
      status: 'Pending',
      skills: 'Editing, Bluebook citation, LexisNexis research',
      whyInterested: 'Looking to build professional acumen in academic publishing operations.',
      resumeLink: 'https://linkedin.com/in/rohanmehra-cv'
    }
  });

  console.log('✅ Internships seeded successfully!');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('🚨 Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
