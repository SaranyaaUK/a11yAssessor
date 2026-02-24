### README

# a11yAssessor

## Introduction

a11yAssessor is an online tool that helps web developers assess the digital accessibility of webpages with ease and also educate the importance of making the web accessible to all.

## Features

- **User Authentication**: Secure registration and login process.
- **Automated Evaluation**: Conduct automated evaluation to quickly identify the web accessibility issues on the evaluated webpage.
- **Guided Manual Evaluation**: Help authenticated users conduct a guided manual evaluation to spot the web accessibility issues on a webpage.
- **Note Observation**: Provision to list the observations done.
- **Evaluation Summary**: Give summary of the evaluations.
- **Remediation Suggestions**: Give users information on why the issue was reported and how to fix it.
- **Resume Evaluation**: Allow users to save the results and resume evaluation of a webpage at any time.

## Pages

- **Home**: Home page, you can also initiate an automated web accessibility evaluation.
- **Guest Evaluation Result**: View results of the automated evaluation
- **User Dashboard**: Manage and conduct web accessibility of different webpages.
- **Site Dashboard**: Perform automated and guided manual web accessibility evaluation of webpage.
- **Result Summary**: View the results of the

## Tech Stack

- **Frontend**: React.js, Bootstrap, HTML, CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: Json Web Token (JWT)

## Getting Started

### Prerequisites

- Node.js version >=20.x
- npm (Node Package Installer)
- PostgreSQL 16
- pgAdmin

### Installation

1. **Clone the repository**

   ```
   git clone https://github.com/SaranyaaUK/a11yAssessor.git

   cd a11y-assessor
   ```

2. **Install Backend Dependencies**


   ```
   cd server
   npm install
   ```

3. ** Configure environment variables for Backend **

   Create a file named .env in the `server` folder and configure the below variables

   ```
   # Port to listen to - Server
   PORT=5000
   # Client URL - Change as required
   CLIENT_BASE_URL=http://localhost:3000
   # For JWT generation
   SECRET_KEY=secretkey
   # Database configuration
   DB_USER=postgres
   DB_PASSWORD=password
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=database_name
   # Email configuration to send
   # verification email and password-reset
   EMAIL=johndoe@example.com
   EMAIL_PASSWORD=password
   # Development
   NODE_ENV=local
   ```
3. **Migrate the Database**

   ```
   Install `PostgreSQL` and `pgAdmin`
   
   Then in a terminal execute the below commands
   cd a11yAssessor folder
   createdb a11yassessordb
   psql -U postgres -d a11yassessordb -f server/database.sql
   ```


5. **Run the Backend Server**

   ```
   npm start
   ```

6. **Install Frontend Dependencies**

   ```
   cd ../client
   npm install
   ```

7. **Run the Frontend Development Server**
   ```
   npm start
   ```

The application should now be running on `localhost:3000` for the frontend and `localhost:5000` for the backend.
