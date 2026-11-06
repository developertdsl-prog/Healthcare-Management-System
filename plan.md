MASTER PROJECT INSTRUCTION
Healthcare Management System – GitHub Milestone-Based Development

You are a Senior Full-Stack Developer, Software Architect, GitHub Project Manager, QA Engineer, and DevOps Engineer.

Your responsibility is to develop the complete Healthcare Management System directly inside my existing GitHub repository.

1. GitHub Repository

Repository Name: Healthcare Management System

Repository: Use the currently authenticated GitHub repository.

GitHub Authentication:

Use the existing authenticated GitHub CLI or Git credentials.
Never ask me to paste my Personal Access Token.
Never hardcode credentials or tokens.
Never commit .env files, secrets, passwords, or API keys.

Before starting:

Check GitHub authentication.
Verify repository access.
Clone the repository if it is not already available locally.
Inspect the existing project structure.
Check existing branches, commits, issues, and README.
Identify the existing technology stack.
Preserve existing working code.
Do not overwrite existing files without inspecting them first.

If the repository is empty, initialize the project using the planned technology stack.

2. Technology Stack

Use the following stack unless the existing repository already has a suitable working stack:

Frontend:

React.js
Vite
Tailwind CSS
Lucide React
Recharts

Backend:

Node.js
Express.js
REST APIs

Database:

MySQL

Authentication:

JWT
bcrypt
Role-Based Access Control

Other:

Git
GitHub
Postman
jsPDF
3. GitHub Development Workflow

You MUST follow this workflow for EVERY milestone.

Step 1: Create GitHub Issue

Before development:

Create a separate GitHub Issue for the milestone.
Add a descriptive title.
Write a detailed description.
Add objectives and requirements.
Add acceptance criteria.
Add a testing checklist.
Assign suitable labels such as:
milestone
enhancement
frontend
backend
database
testing

Example: Issue #1: Milestone 1 – Project Setup & UI Design.

Step 2: Create a New Branch

Create one separate branch for every milestone.

Branch naming convention:

milestone/01-project-setup milestone/02-authentication milestone/03-admin-dashboard milestone/04-patient-management milestone/05-doctor-staff-management milestone/06-appointment-management milestone/07-medical-records milestone/08-billing-payments milestone/09-laboratory-pharmacy milestone/10-testing-deployment

Always branch from the latest approved main branch.

Never develop directly on main.

Step 3: Develop the Milestone
Read the GitHub Issue.
Implement all specified features.
Write clean and modular code.
Follow existing coding conventions.
Maintain backward compatibility.
Integrate frontend, backend, and database where required.
Do not use fake data for functionality that requires real database integration.
Do not leave unfinished buttons or non-functional pages.
Update project documentation where necessary.
Step 4: Test the Milestone

Before committing:

Run frontend build.
Run backend tests.
Test relevant APIs.
Check database integration.
Check authentication and authorization where applicable.
Check browser console errors.
Check responsive layouts.
Fix errors before proceeding.

Never claim a test passed if it was not executed successfully.

Step 5: Commit Changes

Use meaningful commit messages.

Examples:

feat: initialize healthcare management frontend

feat: implement authentication and role management

feat: develop admin dashboard

feat: implement patient management CRUD

fix: resolve appointment scheduling validation

docs: update project documentation

Do not combine unrelated milestones into one commit.

Step 6: Push Branch to GitHub

Push the completed milestone branch to GitHub.

Example:

git push -u origin milestone/01-project-setup

Step 7: Create Pull Request

Create a GitHub Pull Request containing:

Milestone title.
Issue reference.
Implemented features.
Files changed.
Database changes.
API changes.
Testing results.
Screenshots where appropriate.

Use the appropriate closing reference, such as:

Closes #1

Do not merge automatically unless repository settings and my approval permit it.

Step 8: Verify Completion

After pushing:

Verify that the remote branch exists.
Verify the commits.
Verify the pull request.
Verify the GitHub Issue is linked.
Report all completed work.

Then STOP.

Wait for my explicit approval before starting the next milestone.

IMPORTANT: Never automatically start multiple milestones in one execution.

4. PROJECT MILESTONES

Develop these milestones strictly in the following order.

MILESTONE 1: Project Setup & UI Design

GitHub Issue: Milestone 1 – Project Setup & UI Design

Branch: milestone/01-project-setup

Tasks:

Inspect the existing repository.
Set up the frontend project.
Configure React.js and Vite.
Configure Tailwind CSS.
Install Lucide React icons.
Create a professional healthcare color theme.
Create responsive sidebar navigation.
Create a top navigation bar.
Create a reusable dashboard layout.
Create reusable UI components.
Create placeholder pages for:
Admin Dashboard
Doctor Dashboard
Receptionist Dashboard
Patient Dashboard
Create responsive layouts.
Add navigation between pages.
Create a README with setup instructions.

Acceptance Criteria:

Frontend runs successfully.
Navigation works.
Responsive UI works.
Components are reusable.
No major console errors.
Build succeeds.

After completing this milestone: Commit, push, create a Pull Request, verify the results, and STOP.

WAIT FOR MY APPROVAL.

MILESTONE 2: Authentication & Authorization

Branch: milestone/02-authentication

Tasks:

Configure Express backend.
Connect MySQL.
Create Users table.
Implement registration.
Implement login.
Implement JWT authentication.
Implement bcrypt password hashing.
Implement four roles:
Admin
Doctor
Receptionist
Patient
Implement protected routes.
Implement role-based permissions.
Add logout.
Add form validation.
Implement proper error handling.

Acceptance Criteria:

Users can register and log in.
Each role accesses only authorized pages.
Protected APIs work.
Passwords are securely hashed.
Authentication tests pass.

Create Issue, branch, develop, test, commit, push, create PR, verify, and STOP.

WAIT FOR MY APPROVAL.

MILESTONE 3: Admin Dashboard

Branch: milestone/03-admin-dashboard

Tasks:

Total patients.
Total doctors.
Total staff.
Total appointments.
Today's appointments.
Total revenue.
Department statistics.
Appointment charts.
Revenue charts.
Recent patient registrations.
Recent activities.
Connect all statistics to real backend APIs.

Acceptance Criteria:

All dashboard statistics load from the database.
Charts display accurate information.
Loading and error states work.
Dashboard is responsive.

Create Issue, branch, develop, test, commit, push, create PR, verify, and STOP.

WAIT FOR MY APPROVAL.

MILESTONE 4: Patient Management

Branch: milestone/04-patient-management

Tasks:

Patient registration.
Unique patient ID generation.
Patient listing.
Patient profile.
Edit patient information.
Deactivate patient records.
Search and filtering.
Blood group and allergy information.
Medical history.
Previous appointments.
Patient CRUD APIs.
Database integration.

Acceptance Criteria:

Patient CRUD works.
Data persists in MySQL.
Search and filtering work.
Role-based access is enforced.

Create Issue, branch, develop, test, commit, push, create PR, verify, and STOP.

WAIT FOR MY APPROVAL.

MILESTONE 5: Doctor & Staff Management

Branch: milestone/05-doctor-staff-management

Tasks:

Add doctors.
Edit doctor profiles.
Manage qualifications.
Manage specializations.
Create departments.
Assign doctors to departments.
Manage availability.
Set consultation fees.
Add staff.
Manage staff roles.
Activate and deactivate accounts.

Acceptance Criteria:

Doctor and staff CRUD works.
Department relationships work.
Availability is manageable.
Access permissions are enforced.

Create Issue, branch, develop, test, commit, push, create PR, verify, and STOP.

WAIT FOR MY APPROVAL.

MILESTONE 6: Appointment Management

Branch: milestone/06-appointment-management

Tasks:

Book appointments.
Select doctors.
Select departments.
Select available dates.
Select time slots.
Receptionist appointment booking.
Doctor appointment schedule.
Approve and reject appointments.
Reschedule appointments.
Cancel appointments.
Appointment history.
Calendar and table views.
Appointment notifications.
Prevent overlapping bookings.

Acceptance Criteria:

Appointment booking works.
Doctor availability is validated.
Double booking is prevented.
Appointment status updates work.
All changes persist in the database.

Create Issue, branch, develop, test, commit, push, create PR, verify, and STOP.

WAIT FOR MY APPROVAL.

MILESTONE 7: Medical Records & Prescriptions

Branch: milestone/07-medical-records

Tasks:

Medical history.
Patient diagnosis.
Symptoms and observations.
Treatment details.
Doctor notes.
Previous visits.
Digital prescriptions.
Medicine dosage.
Medicine frequency.
Treatment duration.
Prescription instructions.
PDF prescription generation.
Patient prescription access.
Medical record audit logs.

Acceptance Criteria:

Authorized doctors can manage clinical records.
Patients can access only their permitted records.
Prescriptions generate correctly.
Sensitive records are protected.

Create Issue, branch, develop, test, commit, push, create PR, verify, and STOP.

WAIT FOR MY APPROVAL.

MILESTONE 8: Billing & Payments

Branch: milestone/08-billing-payments

Tasks:

Generate invoices.
Consultation charges.
Laboratory charges.
Medicine charges.
Calculate totals.
Apply authorized discounts.
Track payments.
Record payment methods.
Generate receipts.
Payment history.
Revenue reports.
Printable bills.

Acceptance Criteria:

Invoice calculations are accurate.
Payments are recorded correctly.
Receipts generate correctly.
Payment status updates work.

Create Issue, branch, develop, test, commit, push, create PR, verify, and STOP.

WAIT FOR MY APPROVAL.

MILESTONE 9: Laboratory & Pharmacy Management

Branch: milestone/09-laboratory-pharmacy

Tasks:

Laboratory:

Manage test categories.
Add laboratory tests.
Create test requests.
Assign tests to patients.
Record test results.
Upload laboratory reports.
View patient reports.

Pharmacy:

Add medicines.
Manage categories.
Track stock.
Manage expiry dates.
Update inventory.
Record medicine sales.
Low-stock notifications.
Inventory reports.

Acceptance Criteria:

Laboratory operations work.
Pharmacy inventory updates correctly.
Expiry and low-stock alerts work.
Database integration is complete.

Create Issue, branch, develop, test, commit, push, create PR, verify, and STOP.

WAIT FOR MY APPROVAL.

MILESTONE 10: Reports, Testing & Deployment

Branch: milestone/10-testing-deployment

Tasks:

Patient reports.
Appointment reports.
Doctor performance reports.
Revenue analytics.
Department reports.
Pharmacy reports.
Laboratory reports.
PDF export.
Excel export.
Complete frontend testing.
Complete backend testing.
Security testing.
Database validation.
Performance optimization.
Fix all identified bugs.
Update README.
Add installation instructions.
Prepare production build.
Configure deployment.
Verify production application.

Acceptance Criteria:

All major features work.
Tests pass.
Production build succeeds.
Security checks are completed.
Documentation is complete.

Create Issue, branch, develop, test, commit, push, create PR, verify, and STOP.

WAIT FOR MY APPROVAL.

5. STRICT GITHUB RULES

These rules are mandatory:

Work on only ONE milestone at a time.
Every milestone must have its own GitHub Issue.
Every milestone must have its own Git branch.
Never push unfinished code to main.
Never overwrite existing working functionality unnecessarily.
Never commit credentials or sensitive information.
Always run tests before pushing.
Always use meaningful commit messages.
Always link Pull Requests to their respective Issues.
Never merge without authorization.
Never start the next milestone automatically.
Wait for my explicit approval after every milestone.

If an error occurs:

Stop the affected operation.
Explain the error.
Fix it if possible without risking existing code.
Retest.
Do not claim success without verification.

If GitHub access is unavailable, explain the problem and do not pretend that an Issue, branch, commit, push, or Pull Request was created.

6. MILESTONE COMPLETION REPORT

After every milestone, provide this report:

Milestone Number: Milestone Name: GitHub Issue: GitHub Branch: Commit ID: Push Status: Pull Request: Files Created: Files Modified: Database Changes: API Endpoints: Features Completed: Tests Executed: Tests Passed: Tests Failed: Known Issues: Remaining Tasks:

Final Status: COMPLETED / BLOCKED / FAILED

Then STOP and ask:

"Milestone [number] has been completed and pushed to GitHub. Do you approve proceeding to Milestone [next number]?"

Do not continue until I explicitly approve.

7. START NOW

Start with MILESTONE 1 ONLY.

First inspect my existing GitHub repository.

Then:

Create GitHub Issue for Milestone 1.
Create milestone/01-project-setup branch.
Implement the complete frontend foundation.
Test the application.
Commit the changes.
Push the branch to GitHub.
Create the Pull Request.
Verify everything.
Provide the milestone completion report.
STOP and wait for my approval.

DO NOT START MILESTONE 2 AUTOMATICALLY.

The goal is to build a complete, professional, secure, production-ready Healthcare Management System through controlled, sequential GitHub milestone development.
github token: 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Task: Create GitHub Milestones and Issues Directly in the Repository

Act as a professional GitHub project manager and senior software engineer.

Your task is to create and manage project milestones and their associated issues directly in the GitHub repository using GitHub's Milestones and Issues sections.

Repository:
https://github.com/developertdsl-prog/Healthcare-Management-System

1. Analyze the project
Inspect the complete repository structure.
Read the README, source code, documentation, and configuration files.
Understand the project's purpose, features, technology stack, and development requirements.
Divide the project into logical development phases.
2. Create GitHub milestones

Navigate to the repository's GitHub Issues → Milestones section.

Create meaningful milestones for each development phase.

Example milestones:

Project Setup
Database Design and Configuration
Authentication and Authorization
Patient Management
Doctor Management
Appointment Management
Medical Records Management
Billing and Payments
Admin Dashboard
Testing and Bug Fixes
Deployment and Documentation

For each milestone:

Add a clear title.
Write a detailed description.
Set a realistic due date when appropriate.
Avoid duplicate milestones.
Use the correct milestone numbering and development sequence.
3. Create GitHub issues

Navigate to the repository's GitHub Issues section.

Create individual issues for all tasks required to complete each milestone.

Every issue must include:

Clear and descriptive title.
Detailed task description.
Objectives and implementation requirements.
Acceptance criteria.
Relevant technical details.
Appropriate labels.
Assignment to the correct milestone.

Example:

Issue Title: Set up the project structure

Description: Create the initial project structure and configure the required development environment.

Tasks:

Create the required directories.
Configure dependencies.
Add environment configuration.
Set up the application entry point.
Update README documentation.

Acceptance Criteria:

Project structure is created.
Dependencies install successfully.
Application starts without errors.
Documentation is updated.
4. Connect issues to milestones

IMPORTANT:

Every issue must be assigned to its appropriate GitHub milestone.
Do not create issues without milestone assignments unless genuinely necessary.
Ensure that all issues belong to the correct development phase.
Avoid duplicate issues.
Maintain logical issue numbering and development order.
5. Create a branch for every milestone

Use this branch naming convention:

milestone/01-project-setup milestone/02-database-design milestone/03-authentication milestone/04-patient-management

Create each branch from the appropriate base branch.

Do not overwrite existing branches or delete existing work.

6. Verify everything on GitHub

After creating milestones, issues, and branches, independently verify them using the GitHub API, GitHub CLI, or repository interface.

Check:

Every milestone exists in the repository's Milestones section.
Every issue exists in the repository's Issues section.
Every issue is assigned to the correct milestone.
Every milestone has its corresponding branch.
No duplicate milestones or issues were created.
All GitHub URLs are valid and accessible.

Do not rely only on successful API responses. Fetch the created resources again to confirm their existence.

7. Final report

Provide a completion report containing:

Repository name and URL.
Total milestones created.
Total issues created.
Total branches created.
Milestone titles and descriptions.
Issue numbers and titles grouped by milestone.
Direct GitHub URLs for every milestone and issue.
Branch URLs.
Verification results.
Any errors or incomplete tasks.
IMPORTANT RULES
Perform the actual operations on GitHub. Do not just generate a plan.
Use the correct repository: developertdsl-prog/Healthcare-Management-System.
Create milestones in the GitHub Milestones section.
Create issues in the GitHub Issues section.
Assign every issue to its corresponding milestone.
Create milestone-specific branches.
Never claim something was created unless it has been verified on GitHub.
Preserve all existing repository files, branches, issues, and milestones.
If GitHub authentication or permissions are missing, explain what access is required instead of pretending the operation succeeded.

Expected result: A fully organized GitHub project with actual milestones, properly assigned issues, milestone-specific branches, and verified GitHub links.
