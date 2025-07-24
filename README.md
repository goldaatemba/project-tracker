# project-tracker
# ProjectBank

#### The app is a project tracking system for Moringa School students, 15/07/2025

#### **By: Golda Atemba, Alex Kimani, Bismark Bett and Christopher Ngili **

## => Description

The application enables Moringa students to store and access all past and present projects organized by cohort and tech stack. Students can browse, upload, and manage their projects while also collaborating with others. The platform ensures easy tracking, inspiration, and reuse of student work.

## => Features / User Stories

### A Student Can:

* Register an account with a username, email, and password.
* Log in securely using JWT.
* Upload a new project with a name, description, GitHub link, and group members.
* Filter and view projects by cohort or tech stack.
* View details of a project and other students’ profiles.
* Edit or delete their own projects.
* Connect with other students for collaboration.

### An Admin Can:

* Log in with admin credentials.
* Add or remove cohorts.
* View and manage all student projects.
* Edit or delete projects that violate guidelines.
* Ensure credibility by moderating content.

## => Setup/Installation Requirements

* Download or clone the repository to your local machine
* Open the project folder with VS Code

### Backend (Flask)

* Navigate to the backend directory
* Create and activate virtual environment (e.g., `pipenv shell` or `python -m venv venv`)
* Install dependencies with `pip install -r requirements.txt`
* Run the server: `flask run --debug`

### Frontend (React)

* Open a new terminal and navigate to the frontend directory
* Run `npm install` to install dependencies
* Start the React app with `npm run dev`

## Deployment

* Live Frontend: [Project Tracker Frontend](https://project-tracker-phgl.vercel.app/)
* Live Backend: [Project Tracker Backend](https://project-bank-db99.onrender.com)

## Known Bugs

The application is currently functioning as expected. No known bugs.

## Technologies Used

* Tailwind CSS
* React
* Redux Toolkit
* React Router
* Flask
* Python
* Flask-JWT-Extended
* PostgreSQL
* Flask-Mail

## Support and contact details
Team Members:
Alex Kimani:kimanialexk07@gmail.com
Golda Atemba:goldaatemba610@gmail.com
Bismark Bett:bettkipkoech45@gmail.com
Christopher Ngili:ngilichristopher@gmail.com

### License

Licensed under the MIT license
