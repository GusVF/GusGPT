# Gus ChatGPT Clone
A personal project by Gus Ferreira, the Gus ChatGPT Clone is a React application designed to mirror the appearance of ChatGPT. It interfaces with the OpenAI API, giving users a firsthand experience of a chatbot powered by state-of-the-art GPT-3.5 model (you can use GPT-4 but you will need to make modifications on server.js).

## link:
use this link to checkout the application. 
read bellow about OpenAI API's 'key' that you are going to need for this the application to work. 
https://gusvf.github.io/GusGPT/

## Features:
### Create New Chats: 
Start a fresh conversation with the GPT-powered chatbot.

### View Chat History:
 Users can see a list of all previous chats and click on one to view its content.
### Persistent Chat History:
The chat history is stored locally in the browser, enabling users to continue the chat later.
### Deletion: 
Remove a specific chat from the history if needed.
Interactive User Interface: The application features an intuitive UI with an option to send new messages and view chatbot's responses.
## Prerequisites:
### OpenAI Key:
 To interact with OpenAI's API, you need a valid API key. Ensure to keep this key safe, and do not expose it publicly.
### Node.js and NPM:
Ensure that you have Node.js and NPM installed to run the app locally.
### Setup:
Clone the repository:

bash
Copy code
git clone [repository_url]
cd gus-chatgpt-clone
Install dependencies:

Copy code
npm install
Setup OpenAI Key:

Option 1 - Using .env file:

Create a .env file in the root directory.
Add the following line:
makefile
Copy code
OPENAI_KEY=YOUR_OPENAI_KEY
Replace YOUR_OPENAI_KEY with your actual OpenAI API key.
Option 2 - Directly in server.js:

Open server.js in the root directory.
Locate the line: const API_KEY = process.env.OPENAI_KEY;
Replace process.env.OPENAI_KEY with your actual OpenAI API key in quotes. Example:
javascript
Copy code
const API_KEY = "YOUR_OPENAI_KEY";
Note: Ensure to safeguard your API key. Avoid pushing it to public repositories or sharing it with others.

Run the application:

sql
Copy code
npm start
This will start both the frontend React app and the backend server concurrently.
There are also other scripts for you to run only front or back end. 

Navigate to the application: Open a browser and go to http://localhost:3000 to interact with the application.

### testing: 
I did used Jest for the testing. 
I made an integration/unit test all in one file since I have the entire app in one component. 

Notes:
This application is developed for learning purposes and is a demonstration of integrating OpenAI's API in a React application.
Ensure to have a stable internet connection for the app to communicate with OpenAI's API.
While the local chat history feature allows you to pick up where you left off, be cautious about storing sensitive information since this application stores all your conversation in localStorage.
### Credits:
Developed by Gus Ferreira. The goal is to further understand and learn about AI, given its ever-increasing role in our lives. Feedback is highly appreciated, as it aids in refining and improving the application.

By following the above instructions, users should be able to set up and run the Gus ChatGPT Clone on their local machine seamlessly. Remember, always safeguard your API keys and never expose them publicly. 
Cheers and happy coding. 
