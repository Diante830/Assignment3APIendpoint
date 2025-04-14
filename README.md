# Assignment3APIendpoint

# Project Overview
This project implements a Node.js-based API backend that connects to a MySQL database. The API exposes endpoints for managing user data and movie/show reviews. The backend is designed to be simple yet extensible, leveraging RESTful principles to provide efficient access to the stored information.

# Checklist / Before You Begin
The Database: 

Hostname: gbc.goodcodeclub.com

Username: w25_{STUDENTID}

Password: w25_{STUDENTID}

Database: w25_{STUDENTID}

# Install Nodemon for Auto-Reloading: 
Install nodemon globally to automatically reload the server during development:

# bash:

npm i nodemon -g

Set the Visibility of Port 3001 to Public: Ensure that port 3001 is accessible by making the server publicly available.

# Bring Up the Server
Start the Server: To start the server and allow it to auto-reload, run:

# bash:

nodemon backend/main.js

# Technologies Used
Node.js: Backend runtime for building the API.

Express: Web framework used to handle HTTP requests.

MySQL: Database system used to store and manage user and review data.

