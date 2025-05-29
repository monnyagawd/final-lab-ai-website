/**
 * Lab AI Analytics Chrome Extension
 * Background Service Worker
 * 
 * This script handles the core extension functionality that runs in the background,
 * including authentication, data synchronization, and communication with the Lab AI API.
 */

// Configuration
const API_BASE_URL = 'https://api.labai.com'; // Update with your actual API endpoint
const AUTH_ENDPOINT = `${API_BASE_URL}/api/extension/auth`;
const ANALYTICS_ENDPOINT = `${API_BASE_URL}/api/extension/analytics`;
const WEBSITES_ENDPOINT = `${API_BASE_URL}/api/tracked-websites`;

// Extension state
let userAuthState = {
  isLoggedIn: false,
  userId: null,
  userEmail: null,
  authToken: null,
  trackedWebsites: []
};

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Lab AI Analytics Extension installed');
  
  // Check if user is already authenticated
  const savedAuth = await chrome.storage.local.get(['authToken', 'userId', 'userEmail']);
  if (savedAuth.authToken) {
    userAuthState.isLoggedIn = true;
    userAuthState.userId = savedAuth.userId;
    userAuthState.userEmail = savedAuth.userEmail;
    userAuthState.authToken = savedAuth.authToken;
    
    // Fetch user's tracked websites
    await fetchTrackedWebsites();
  }
  
  // Create context menu items
  chrome.contextMenus.create({
    id: 'analyzeWebsite',
    title: 'Analyze this website',
    contexts: ['page']
  });
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle login messages
  if (message.action === 'login') {
    handleLogin(message.credentials, sendResponse);
    return true; // Keep the message channel open for async response
  }
  
  // Handle logout messages
  if (message.action === 'logout') {
    handleLogout(sendResponse);
    return true;
  }
  
  // Handle website tracking activation
  if (message.action === 'activateTracking') {
    activateTracking(message.domain, message.trackingOptions, sendResponse);
    return true;
  }
  
  // Handle website data analysis request
  if (message.action === 'analyzeWebsite') {
    analyzeWebsite(message.url, sendResponse);
    return true;
  }
  
  // Handle data request for popup
  if (message.action === 'getAuthStatus') {
    sendResponse({
      isLoggedIn: userAuthState.isLoggedIn,
      userId: userAuthState.userId,
      userEmail: userAuthState.userEmail,
      trackedWebsites: userAuthState.trackedWebsites
    });
    return true;
  }
  
  // Handle analytics data request
  if (message.action === 'getAnalyticsData') {
    getAnalyticsData(message.websiteId, message.timeRange, sendResponse);
    return true;
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'analyzeWebsite') {
    // Send message to the current tab to analyze the website
    chrome.tabs.sendMessage(tab.id, { action: 'analyzeWebsite' });
  }
});

// Authentication Functions

/**
 * Handle user login
 * @param {Object} credentials - User credentials (email/password)
 * @param {Function} sendResponse - Function to send response back to caller
 */
async function handleLogin(credentials, sendResponse) {
  try {
    const response = await fetch(AUTH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    
    // Save authentication state
    userAuthState.isLoggedIn = true;
    userAuthState.userId = data.userId;
    userAuthState.userEmail = data.email;
    userAuthState.authToken = data.token;
    
    // Save to storage
    await chrome.storage.local.set({
      userId: data.userId,
      userEmail: data.email,
      authToken: data.token
    });
    
    // Fetch tracked websites
    await fetchTrackedWebsites();
    
    sendResponse({ success: true, user: data });
  } catch (error) {
    console.error('Login error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

/**
 * Handle user logout
 * @param {Function} sendResponse - Function to send response back to caller
 */
async function handleLogout(sendResponse) {
  try {
    // Clear authentication state
    userAuthState = {
      isLoggedIn: false,
      userId: null,
      userEmail: null,
      authToken: null,
      trackedWebsites: []
    };
    
    // Clear storage
    await chrome.storage.local.remove(['userId', 'userEmail', 'authToken']);
    
    sendResponse({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

/**
 * Fetch user's tracked websites from the API
 */
async function fetchTrackedWebsites() {
  if (!userAuthState.isLoggedIn) return;
  
  try {
    const response = await fetch(WEBSITES_ENDPOINT, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userAuthState.authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch websites');
    }
    
    const websites = await response.json();
    userAuthState.trackedWebsites = websites;
    
    // Save to storage for offline access
    await chrome.storage.local.set({ trackedWebsites: websites });
    
    return websites;
  } catch (error) {
    console.error('Error fetching tracked websites:', error);
    return [];
  }
}

/**
 * Activate tracking for a website
 * @param {string} domain - Website domain to track
 * @param {Object} options - Tracking options
 * @param {Function} sendResponse - Function to send response back to caller
 */
async function activateTracking(domain, options, sendResponse) {
  if (!userAuthState.isLoggedIn) {
    sendResponse({ success: false, error: 'Authentication required' });
    return;
  }
  
  try {
    // Check if website is already tracked
    const existingWebsite = userAuthState.trackedWebsites.find(site => 
      site.domain === domain || domain.includes(site.domain) || site.domain.includes(domain)
    );
    
    if (existingWebsite) {
      sendResponse({
        success: true,
        message: 'Website already tracked',
        websiteId: existingWebsite.id,
        trackingId: existingWebsite.trackingId
      });
      return;
    }
    
    // Register new website for tracking
    const response = await fetch(WEBSITES_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userAuthState.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        domain: domain,
        name: options.name || domain,
        settings: JSON.stringify(options)
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to activate tracking');
    }
    
    const newWebsite = await response.json();
    
    // Update tracked websites list
    await fetchTrackedWebsites();
    
    sendResponse({
      success: true,
      message: 'Tracking activated successfully',
      websiteId: newWebsite.id,
      trackingId: newWebsite.trackingId
    });
  } catch (error) {
    console.error('Error activating tracking:', error);
    sendResponse({ success: false, error: error.message });
  }
}

/**
 * Analyze website structure and performance
 * @param {string} url - URL of the website to analyze
 * @param {Function} sendResponse - Function to send response back to caller
 */
async function analyzeWebsite(url, sendResponse) {
  try {
    // Send message to content script to perform analysis
    const activeTab = await getActiveTab();
    
    chrome.tabs.sendMessage(
      activeTab.id,
      { action: 'performAnalysis', url: url },
      async (analysisData) => {
        if (!analysisData) {
          sendResponse({ success: false, error: 'Analysis failed' });
          return;
        }
        
        // If user is logged in, save analysis to API
        if (userAuthState.isLoggedIn) {
          try {
            await saveAnalysisToApi(url, analysisData);
          } catch (error) {
            console.error('Error saving analysis:', error);
            // Continue even if saving fails
          }
        }
        
        sendResponse({
          success: true,
          analysisData: analysisData
        });
      }
    );
  } catch (error) {
    console.error('Error analyzing website:', error);
    sendResponse({ success: false, error: error.message });
  }
}

/**
 * Save website analysis data to API
 * @param {string} url - Website URL
 * @param {Object} analysisData - Analysis results
 */
async function saveAnalysisToApi(url, analysisData) {
  const response = await fetch(`${API_BASE_URL}/api/extension/analysis`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userAuthState.authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: url,
      analysisData: analysisData,
      timestamp: new Date().toISOString()
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to save analysis data');
  }
  
  return await response.json();
}

/**
 * Get analytics data for a specific website
 * @param {string} websiteId - ID of the website
 * @param {Object} timeRange - Time range for data
 * @param {Function} sendResponse - Function to send response back to caller
 */
async function getAnalyticsData(websiteId, timeRange, sendResponse) {
  if (!userAuthState.isLoggedIn) {
    sendResponse({ success: false, error: 'Authentication required' });
    return;
  }
  
  try {
    const response = await fetch(`${ANALYTICS_ENDPOINT}/${websiteId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userAuthState.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ timeRange })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch analytics data');
    }
    
    const data = await response.json();
    sendResponse({ success: true, data });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    sendResponse({ success: false, error: error.message });
  }
}

/**
 * Helper function to get the active tab
 */
async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}