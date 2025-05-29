# Deploying a Static Version to Netlify

This guide explains how to create and deploy a static version of the Lab AI application to Netlify. This static version will only showcase the UI and design but won't have any actual functionality.

## Option 1: Simple HTML Deployment

For the simplest static view of the application:

1. **Download the Zip File** - After downloading the project zip file, extract it to your local machine.

2. **Use the Static HTML Version** - The `static-index.html` file is a simplified static HTML version of the landing page.

3. **Deploy to Netlify**:
   - Log in to your Netlify account
   - Go to "Sites" and click "Add new site" > "Deploy manually"
   - Drag and drop the `static-index.html` file (rename it to `index.html` first)
   - Wait for deployment to complete

## Option 2: Building a Static Version of the React App

For a more complete static representation of the UI (without functionality):

1. **Required Tools**:
   - Node.js (version 16 or later)
   - npm or yarn package manager

2. **Prepare the Project**:
   - Clone or download the project to your local machine
   - Open a terminal in the project root directory
   - Run `npm install` to install dependencies

3. **Make Modifications for Static Rendering**:
   - Replace dynamic API calls with static data in key components
   - The `client/src/pages/StaticWebsiteAnalytics.tsx` file is an example of how to modify components to use static data

4. **Build the Project**:
   ```bash
   npm run build
   ```

5. **Deploy to Netlify**:
   - Log in to your Netlify account
   - Go to "Sites" and click "Add new site" > "Deploy manually"
   - Drag and drop the `dist/client` directory
   - Add a `_redirects` file with the content: `/* /index.html 200`
   - Wait for deployment to complete

## Important Notes

- This static version is for demonstration purposes only and does not include any of the backend functionality
- Features like authentication, data fetching, form submissions, and real-time updates will not work
- Interactive elements like buttons and links may not function as expected

## Getting the Full Application Running

If you want to run the full application with all functionality:

1. Follow the standard setup instructions in the main README.md file
2. Ensure you have a PostgreSQL database configured
3. Run both the frontend and backend components
4. Deploy to a platform that supports full-stack applications like Render, Railway, or Heroku