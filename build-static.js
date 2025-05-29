// This script builds a static version of the site with mock data for Netlify deployment
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building static version for Netlify...');

// Create a static directory for the build
if (!fs.existsSync('static-build')) {
  fs.mkdirSync('static-build');
}

// Build the frontend
try {
  console.log('Building frontend assets...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Copy the built frontend to the static directory
  console.log('Copying built assets to static-build directory...');
  fs.cpSync('dist/client', 'static-build', { recursive: true });
  
  // Create a simple netlify.toml file for configuration
  const netlifyConfig = `
[build]
  publish = "static-build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;
  
  fs.writeFileSync('netlify.toml', netlifyConfig);
  
  console.log('Static build completed successfully!');
  console.log('To deploy to Netlify:');
  console.log('1. Zip the "static-build" folder and the netlify.toml file');
  console.log('2. Upload to Netlify via their "Deploy manually" option');
} catch (error) {
  console.error('Error building static version:', error);
  process.exit(1);
}