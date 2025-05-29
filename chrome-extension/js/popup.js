/**
 * Lab AI Analytics Chrome Extension
 * Popup Script
 * 
 * This script handles the popup UI functionality, authentication,
 * and communication with the background script.
 */

// DOM elements
const loginContainer = document.getElementById('login-container');
const mainContainer = document.getElementById('main-container');
const loginForm = document.getElementById('login-form');
const statusIndicator = document.getElementById('status-indicator');
const statusDot = document.querySelector('.status-dot');
const statusText = document.querySelector('.status-text');
const userInfo = document.getElementById('user-info');
const userEmail = document.getElementById('user-email');
const logoutLink = document.getElementById('logout-link');
const websiteUrl = document.getElementById('website-url').querySelector('span');
const trackingStatus = document.getElementById('website-tracking-status').querySelector('span');
const activateTrackingContainer = document.getElementById('activate-tracking-container');
const trackingActiveContainer = document.getElementById('tracking-active-container');
const activateTrackingBtn = document.getElementById('activate-tracking');
const viewAnalyticsBtn = document.getElementById('view-analytics');
const trackedWebsitesList = document.getElementById('tracked-websites-list');
const quickInsights = document.getElementById('quick-insights');
const analyzeWebsiteBtn = document.getElementById('analyze-website');
const viewFullReportBtn = document.getElementById('view-full-report');
const loadingIndicator = document.getElementById('loading-indicator');
const loadingText = document.getElementById('loading-text');

// Performance score circles
const performanceScore = document.getElementById('performance-score');
const seoScore = document.getElementById('seo-score');
const accessibilityScore = document.getElementById('accessibility-score');
const mobileScore = document.getElementById('mobile-score');
const insightsSummary = document.getElementById('insights-summary');

// Current tab and user state
let currentTab = null;
let currentUrl = '';
let currentDomain = '';
let isLoggedIn = false;
let authUser = null;
let trackedWebsites = [];
let analysisResults = null;
let currentWebsiteTracked = false;
let currentTrackingId = null;
let currentWebsiteId = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async function() {
  // Show loading indicator
  showLoading('Loading...');
  
  // Get the current tab
  currentTab = await getCurrentTab();
  if (currentTab) {
    currentUrl = currentTab.url;
    try {
      const url = new URL(currentUrl);
      currentDomain = url.hostname;
      websiteUrl.textContent = currentDomain;
    } catch (e) {
      websiteUrl.textContent = 'Invalid URL';
    }
  }
  
  // Check authentication status
  await checkAuthStatus();
  
  // Hide loading indicator
  hideLoading();
  
  // Check if the current site is being tracked
  if (isLoggedIn) {
    checkTrackingStatus();
    fetchTrackedWebsites();
  }
  
  // Show quick insights section
  quickInsights.style.display = 'block';
});

// Check if user is logged in
async function checkAuthStatus() {
  try {
    const response = await sendMessageToBackground({ action: 'getAuthStatus' });
    
    if (response && response.isLoggedIn) {
      isLoggedIn = true;
      authUser = {
        userId: response.userId,
        email: response.userEmail
      };
      trackedWebsites = response.trackedWebsites || [];
      
      // Update UI for logged in state
      loginContainer.style.display = 'none';
      mainContainer.style.display = 'block';
      userInfo.style.display = 'block';
      userEmail.textContent = authUser.email;
      updateStatusIndicator(true);
    } else {
      // Update UI for logged out state
      loginContainer.style.display = 'block';
      mainContainer.style.display = 'none';
      userInfo.style.display = 'none';
      updateStatusIndicator(false);
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
    updateStatusIndicator(false);
  }
}

// Check if current website is being tracked
async function checkTrackingStatus() {
  try {
    // First check if the website is in the tracked websites list
    const matchedWebsite = trackedWebsites.find(site => 
      currentDomain.includes(site.domain) || site.domain.includes(currentDomain)
    );
    
    if (matchedWebsite) {
      currentWebsiteTracked = true;
      currentTrackingId = matchedWebsite.trackingId;
      currentWebsiteId = matchedWebsite.id;
      
      updateTrackingStatusUI(true);
      
      // Send message to content script to activate tracking
      chrome.tabs.sendMessage(currentTab.id, {
        action: 'activateTracking',
        trackingId: currentTrackingId,
        websiteId: currentWebsiteId
      });
      
      return;
    }
    
    // If not found in the list, check with the content script directly
    const response = await sendMessageToContentScript({ action: 'checkTracking' });
    
    if (response && response.isActive) {
      currentWebsiteTracked = true;
      currentTrackingId = response.trackingId;
      currentWebsiteId = response.websiteId;
      updateTrackingStatusUI(true);
    } else {
      currentWebsiteTracked = false;
      updateTrackingStatusUI(false);
    }
  } catch (error) {
    console.error('Error checking tracking status:', error);
    currentWebsiteTracked = false;
    updateTrackingStatusUI(false);
  }
}

// Fetch tracked websites
async function fetchTrackedWebsites() {
  try {
    const response = await sendMessageToBackground({ action: 'fetchTrackedWebsites' });
    
    if (response && response.success) {
      trackedWebsites = response.websites;
      renderTrackedWebsites();
    } else {
      renderTrackedWebsites();
    }
  } catch (error) {
    console.error('Error fetching tracked websites:', error);
    renderTrackedWebsites();
  }
}

// Render tracked websites list
function renderTrackedWebsites() {
  if (!trackedWebsites || trackedWebsites.length === 0) {
    trackedWebsitesList.innerHTML = '<p class="empty-state">No websites found. Activate tracking on a website to get started.</p>';
    return;
  }
  
  let html = '';
  trackedWebsites.forEach(website => {
    html += `
      <div class="website-item">
        <div class="website-item-info">
          <div class="website-item-domain">${website.domain}</div>
          <div class="website-item-id">ID: ${website.trackingId}</div>
        </div>
        <button class="btn btn-secondary view-site-btn" data-id="${website.id}">View</button>
      </div>
    `;
  });
  
  trackedWebsitesList.innerHTML = html;
  
  // Add event listeners to view buttons
  document.querySelectorAll('.view-site-btn').forEach(button => {
    button.addEventListener('click', function() {
      const websiteId = this.getAttribute('data-id');
      openDashboardForWebsite(websiteId);
    });
  });
}

// Update tracking status UI
function updateTrackingStatusUI(isTracked) {
  if (isTracked) {
    trackingStatus.textContent = 'Active';
    trackingStatus.classList.remove('not-tracked');
    trackingStatus.classList.add('tracked');
    activateTrackingContainer.style.display = 'none';
    trackingActiveContainer.style.display = 'block';
  } else {
    trackingStatus.textContent = 'Not Tracked';
    trackingStatus.classList.add('not-tracked');
    trackingStatus.classList.remove('tracked');
    activateTrackingContainer.style.display = 'block';
    trackingActiveContainer.style.display = 'none';
  }
}

// Update status indicator
function updateStatusIndicator(isConnected) {
  if (isConnected) {
    statusDot.classList.add('connected');
    statusText.textContent = 'Connected';
  } else {
    statusDot.classList.remove('connected');
    statusText.textContent = 'Not connected';
  }
}

// Show loading indicator
function showLoading(text) {
  loadingText.textContent = text || 'Loading...';
  loadingIndicator.style.display = 'flex';
}

// Hide loading indicator
function hideLoading() {
  loadingIndicator.style.display = 'none';
}

// Get current active tab
async function getCurrentTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

// Send message to background script
function sendMessageToBackground(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, response => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

// Send message to content script
function sendMessageToContentScript(message) {
  return new Promise((resolve, reject) => {
    if (!currentTab || !currentTab.id) {
      reject(new Error('No active tab'));
      return;
    }
    
    chrome.tabs.sendMessage(currentTab.id, message, response => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

// Analyze current website
async function analyzeWebsite() {
  showLoading('Analyzing website...');
  
  try {
    const response = await sendMessageToContentScript({ 
      action: 'performAnalysis',
      url: currentUrl
    });
    
    if (response && response.success) {
      analysisResults = response.analysisData;
      updateAnalysisUI(analysisResults);
      viewFullReportBtn.style.display = 'block';
    } else {
      throw new Error('Analysis failed');
    }
  } catch (error) {
    console.error('Error analyzing website:', error);
    insightsSummary.innerHTML = `
      <p>Analysis failed. Please try again.</p>
      <p class="error-text">${error.message}</p>
    `;
  } finally {
    hideLoading();
  }
}

// Update analysis UI with results
function updateAnalysisUI(results) {
  if (!results) return;
  
  // Update score circles
  updateScoreCircle(performanceScore, results.performance.score);
  updateScoreCircle(seoScore, results.seo.score);
  updateScoreCircle(accessibilityScore, results.accessibility.score);
  updateScoreCircle(mobileScore, results.mobile.score);
  
  // Generate insights summary
  const insights = generateInsightsSummary(results);
  insightsSummary.innerHTML = insights;
}

// Update score circle with value and color
function updateScoreCircle(element, score) {
  element.textContent = Math.round(score);
  
  // Remove existing classes
  element.classList.remove('score-good', 'score-warning', 'score-bad');
  
  // Add appropriate class based on score
  if (score >= 80) {
    element.classList.add('score-good');
  } else if (score >= 50) {
    element.classList.add('score-warning');
  } else {
    element.classList.add('score-bad');
  }
}

// Generate insights summary from analysis results
function generateInsightsSummary(results) {
  let summary = '<ul>';
  
  // Performance insights
  if (results.performance.score < 60) {
    summary += `<li><span class="indicator indicator-bad"></span> Page load time is slow (${Math.round(results.performance.loadTime)}ms)</li>`;
  }
  
  if (results.performance.resources.total > 50) {
    summary += `<li><span class="indicator indicator-warning"></span> High resource count (${results.performance.resources.total} files)</li>`;
  }
  
  // SEO insights
  if (!results.seo.title.exists || results.seo.title.length < 10) {
    summary += '<li><span class="indicator indicator-bad"></span> Missing or short page title</li>';
  }
  
  if (!results.seo.metaDescription.exists) {
    summary += '<li><span class="indicator indicator-bad"></span> Missing meta description</li>';
  }
  
  if (results.seo.h1.count === 0) {
    summary += '<li><span class="indicator indicator-bad"></span> No H1 heading found</li>';
  } else if (results.seo.h1.count > 1) {
    summary += `<li><span class="indicator indicator-warning"></span> Multiple H1 headings (${results.seo.h1.count})</li>`;
  }
  
  if (results.seo.images.withoutAlt > 0) {
    summary += `<li><span class="indicator indicator-warning"></span> ${results.seo.images.withoutAlt} images missing alt text</li>`;
  }
  
  // Accessibility insights
  if (results.accessibility.score < 70) {
    summary += '<li><span class="indicator indicator-bad"></span> Poor accessibility score</li>';
  }
  
  if (results.accessibility.forms.withoutLabel > 0) {
    summary += `<li><span class="indicator indicator-bad"></span> ${results.accessibility.forms.withoutLabel} form fields missing labels</li>`;
  }
  
  // Mobile insights
  if (!results.mobile.viewport.isResponsive) {
    summary += '<li><span class="indicator indicator-bad"></span> Non-responsive viewport meta tag</li>';
  }
  
  if (results.mobile.smallTargets > 0) {
    summary += `<li><span class="indicator indicator-warning"></span> ${results.mobile.smallTargets} tap targets too small for mobile</li>`;
  }
  
  // Technical insights
  if (!results.technical.secure) {
    summary += '<li><span class="indicator indicator-bad"></span> Website not using HTTPS</li>';
  }
  
  summary += '</ul>';
  
  // If no issues were found
  if (summary === '<ul></ul>') {
    summary = '<p>No significant issues found. This website appears to be well-optimized!</p>';
  }
  
  return summary;
}

// Open dashboard for website
function openDashboardForWebsite(websiteId) {
  chrome.tabs.create({
    url: `https://www.labai.com/dashboard/websites/${websiteId}`
  });
}

// Event Listeners

// Login form submission
loginForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  if (!email || !password) {
    return;
  }
  
  showLoading('Logging in...');
  
  try {
    const response = await sendMessageToBackground({
      action: 'login',
      credentials: { email, password }
    });
    
    if (response && response.success) {
      isLoggedIn = true;
      authUser = response.user;
      
      // Update UI
      loginContainer.style.display = 'none';
      mainContainer.style.display = 'block';
      userInfo.style.display = 'block';
      userEmail.textContent = authUser.email;
      updateStatusIndicator(true);
      
      // Fetch tracked websites
      fetchTrackedWebsites();
      
      // Check if current site is tracked
      checkTrackingStatus();
    } else {
      throw new Error(response?.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert(`Login failed: ${error.message}`);
  } finally {
    hideLoading();
  }
});

// Logout link
logoutLink.addEventListener('click', async function(e) {
  e.preventDefault();
  
  showLoading('Logging out...');
  
  try {
    await sendMessageToBackground({ action: 'logout' });
    
    // Update UI
    isLoggedIn = false;
    authUser = null;
    
    loginContainer.style.display = 'block';
    mainContainer.style.display = 'none';
    userInfo.style.display = 'none';
    updateStatusIndicator(false);
    
    // Clear form
    loginForm.reset();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    hideLoading();
  }
});

// Activate tracking button
activateTrackingBtn.addEventListener('click', async function() {
  if (!isLoggedIn) {
    alert('Please log in to activate tracking');
    return;
  }
  
  showLoading('Activating tracking...');
  
  try {
    const response = await sendMessageToBackground({
      action: 'activateTracking',
      domain: currentDomain,
      trackingOptions: {
        name: document.title || currentDomain
      }
    });
    
    if (response && response.success) {
      currentWebsiteTracked = true;
      currentTrackingId = response.trackingId;
      currentWebsiteId = response.websiteId;
      
      // Update UI
      updateTrackingStatusUI(true);
      
      // Send message to content script to activate tracking
      await sendMessageToContentScript({
        action: 'activateTracking',
        trackingId: currentTrackingId,
        websiteId: currentWebsiteId
      });
      
      // Refresh tracked websites list
      fetchTrackedWebsites();
    } else {
      throw new Error(response?.error || 'Failed to activate tracking');
    }
  } catch (error) {
    console.error('Tracking activation error:', error);
    alert(`Failed to activate tracking: ${error.message}`);
  } finally {
    hideLoading();
  }
});

// View analytics button
viewAnalyticsBtn.addEventListener('click', function() {
  if (currentWebsiteId) {
    openDashboardForWebsite(currentWebsiteId);
  }
});

// Analyze website button
analyzeWebsiteBtn.addEventListener('click', function() {
  analyzeWebsite();
});

// View full report button
viewFullReportBtn.addEventListener('click', function() {
  if (currentWebsiteId) {
    openDashboardForWebsite(currentWebsiteId);
  } else {
    // If website is not tracked, show prompt to track it
    alert('To view a full report, please activate tracking for this website first.');
  }
});