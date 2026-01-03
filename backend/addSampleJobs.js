const mongoose = require('mongoose');
require('dotenv').config();

const Job = require('./models/Job');

const sampleJobs = [
    {
        title: "Civil Engineer",
        department: "Ministry of Physical Infrastructure and Transport",
        location: "Kathmandu",
        vacancies: 5,
        deadline: new Date("2026-02-15"),
        salary: "NPR 50,000 - 70,000",
        education: "Bachelor's degree in Civil Engineering",
        experience: "Minimum 2 years experience in construction projects",
        requirements: "Valid engineering license, Knowledge of AutoCAD"
    },
    {
        title: "Health Inspector",
        department: "Ministry of Health and Population",
        location: "Pokhara",
        vacancies: 3,
        deadline: new Date("2026-02-20"),
        salary: "NPR 40,000 - 55,000",
        education: "Bachelor's degree in Public Health or related field",
        experience: "1 year experience in health sector",
        requirements: "Valid health inspector certification"
    },
    {
        title: "Administrative Officer",
        department: "Ministry of Home Affairs",
        location: "Lalitpur",
        vacancies: 8,
        deadline: new Date("2026-03-01"),
        salary: "NPR 45,000 - 60,000",
        education: "Bachelor's degree in Management or Public Administration",
        experience: "Fresh graduates can apply",
        requirements: "Good communication skills, Computer literacy"
    },
    {
        title: "Forest Officer",
        department: "Ministry of Forests and Environment",
        location: "Chitwan",
        vacancies: 4,
        deadline: new Date("2026-02-28"),
        salary: "NPR 48,000 - 65,000",
        education: "Bachelor's in Forestry or Environmental Science",
        experience: "2 years field experience",
        requirements: "Knowledge of forest management, Willingness to work in remote areas"
    },
    {
        title: "Teacher - Secondary Level",
        department: "Ministry of Education",
        location: "Bhaktapur",
        vacancies: 10,
        deadline: new Date("2026-02-25"),
        salary: "NPR 35,000 - 50,000",
        education: "Bachelor's degree in Education (B.Ed)",
        experience: "Fresh graduates can apply",
        requirements: "Teaching license required, Subject specialization"
    },
    {
        title: "Police Constable",
        department: "Nepal Police",
        location: "Various Districts",
        vacancies: 50,
        deadline: new Date("2026-03-10"),
        salary: "NPR 30,000 - 42,000",
        education: "SEE (10+2) passed",
        experience: "No experience required",
        requirements: "Physical fitness test required, Age 18-30 years"
    },
    {
        title: "Accounts Officer",
        department: "Ministry of Finance",
        location: "Kathmandu",
        vacancies: 6,
        deadline: new Date("2026-02-18"),
        salary: "NPR 55,000 - 75,000",
        education: "CA or Master's in Accounting/Finance",
        experience: "3 years in government accounting",
        requirements: "Knowledge of government financial systems"
    },
    {
        title: "Information Technology Officer",
        department: "Ministry of Communication and IT",
        location: "Kathmandu",
        vacancies: 7,
        deadline: new Date("2026-03-05"),
        salary: "NPR 60,000 - 80,000",
        education: "Bachelor's in Computer Science or IT",
        experience: "2 years software development experience",
        requirements: "Knowledge of web technologies, Database management"
    },
    {
        title: "Agriculture Extension Officer",
        department: "Ministry of Agriculture and Livestock",
        location: "Dhangadhi",
        vacancies: 4,
        deadline: new Date("2026-02-22"),
        salary: "NPR 42,000 - 58,000",
        education: "Bachelor's in Agriculture",
        experience: "1 year field experience",
        requirements: "Knowledge of modern farming techniques"
    },
    {
        title: "Legal Officer",
        department: "Ministry of Law, Justice",
        location: "Kathmandu",
        vacancies: 3,
        deadline: new Date("2026-03-08"),
        salary: "NPR 65,000 - 85,000",
        education: "LLB or LLM degree",
        experience: "3 years legal practice",
        requirements: "Valid bar council license, Knowledge of constitutional law"
    }
];

async function addSampleJobs() {
    try {
       
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

    
        await Job.deleteMany({});
        console.log("🗑️ Cleared existing jobs");

        
        const result = await Job.insertMany(sampleJobs);
        console.log(`✅ Added ${result.length} sample jobs to database!`);

    
        await mongoose.connection.close();
        console.log("👋 Connection closed");
    } catch (err) {
        console.error("❌ Error:", err);
    }
}

addSampleJobs();