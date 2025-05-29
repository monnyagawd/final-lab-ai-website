/**
 * Lab AI Analytics Chrome Extension
 * Content Script
 * 
 * This script runs in the context of web pages and is responsible for:
 * 1. Analyzing the page structure and performance
 * 2. Collecting user behavior data (when tracking is enabled)
 * 3. Injecting the tracking script on authorized websites
 */

// Track whether this site has tracking activated
let trackingActive = false;
let trackingId = null;
let websiteId = null;

// Store analysis results
let pageAnalysis = null;

// Event tracking data
const eventQueue = [];
const MAX_QUEUE_SIZE = 50;
const FLUSH_INTERVAL = 10000; // 10 seconds

// Initialize when the content script is injected
initialize();

// Communication with background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle analysis request
  if (message.action === 'performAnalysis') {
    performAnalysis().then(results => {
      sendResponse(results);
    });
    return true; // Keep the message channel open for async response
  }
  
  // Handle tracking activation
  if (message.action === 'activateTracking') {
    activateTracking(message.trackingId, message.websiteId);
    sendResponse({ success: true });
    return true;
  }
  
  // Handle checking if tracking is active
  if (message.action === 'checkTracking') {
    sendResponse({
      isActive: trackingActive,
      trackingId: trackingId,
      websiteId: websiteId
    });
    return true;
  }
});

/**
 * Initialize the content script
 */
async function initialize() {
  // Check if current site is in the user's tracked websites
  const url = window.location.href;
  const domain = window.location.hostname;
  
  chrome.runtime.sendMessage(
    { action: 'getAuthStatus' },
    (response) => {
      if (!response || !response.isLoggedIn || !response.trackedWebsites) {
        return;
      }
      
      // Check if current site is tracked
      const matchedSite = response.trackedWebsites.find(site => 
        domain.includes(site.domain) || site.domain.includes(domain)
      );
      
      if (matchedSite) {
        activateTracking(matchedSite.trackingId, matchedSite.id);
      }
    }
  );
  
  // Perform initial page analysis
  pageAnalysis = await performAnalysis();
}

/**
 * Activate tracking for this website
 * @param {string} id - Tracking ID
 * @param {string} siteId - Website ID
 */
function activateTracking(id, siteId) {
  trackingId = id;
  websiteId = siteId;
  trackingActive = true;
  
  // Inject tracking script
  injectTrackingScript();
  
  // Set up event listeners
  setupEventListeners();
  
  // Start periodic data transmission
  startEventTransmission();
  
  console.log(`Lab AI Analytics tracking activated for site ID: ${websiteId}`);
}

/**
 * Inject the tracking script into the page
 */
function injectTrackingScript() {
  // Create script element
  const scriptElement = document.createElement('script');
  scriptElement.src = chrome.runtime.getURL('js/tracker.js');
  scriptElement.onload = function() {
    // Initialize tracker with configuration
    const event = new CustomEvent('labai_init', {
      detail: {
        trackingId: trackingId,
        websiteId: websiteId
      }
    });
    document.dispatchEvent(event);
    
    // This script tag is no longer needed after loading
    this.remove();
  };
  
  // Add script to page
  (document.head || document.documentElement).appendChild(scriptElement);
}

/**
 * Set up event listeners for user behavior tracking
 */
function setupEventListeners() {
  if (!trackingActive) return;
  
  // Track page view
  trackEvent('page_view', {
    title: document.title,
    url: window.location.href,
    referrer: document.referrer
  });
  
  // Track clicks
  document.addEventListener('click', (e) => {
    const target = e.target;
    const tagName = target.tagName.toLowerCase();
    
    // Determine what was clicked
    let elementType = tagName;
    if (tagName === 'a') {
      elementType = 'link';
    } else if (tagName === 'button' || 
               (tagName === 'input' && (target.type === 'button' || target.type === 'submit'))) {
      elementType = 'button';
    } else if (tagName === 'img') {
      elementType = 'image';
    }
    
    // Get text content or alt text
    let elementText = '';
    if (target.textContent && target.textContent.trim()) {
      elementText = target.textContent.trim().substring(0, 100);
    } else if (target.alt) {
      elementText = target.alt.trim().substring(0, 100);
    }
    
    // Get position information
    const rect = target.getBoundingClientRect();
    const position = {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      viewportX: rect.left,
      viewportY: rect.top
    };
    
    trackEvent('click', {
      elementType,
      elementText,
      tagName,
      position,
      url: window.location.href,
      path: getElementPath(target)
    });
  });
  
  // Track form submissions
  document.addEventListener('submit', (e) => {
    const form = e.target;
    
    // Don't track sensitive forms
    if (containsSensitiveFields(form)) {
      return;
    }
    
    // Get form data (excluding sensitive fields)
    const formData = {};
    for (const element of form.elements) {
      if (element.name && !isSensitiveField(element)) {
        // For checkboxes and radio buttons, track their state
        if (element.type === 'checkbox' || element.type === 'radio') {
          formData[element.name] = element.checked;
        } else if (element.value) {
          // For other fields, track the fact they have a value, but not the value itself
          formData[element.name] = '[FIELD_FILLED]';
        }
      }
    }
    
    trackEvent('form_submit', {
      formAction: form.action,
      formMethod: form.method,
      formId: form.id,
      hasFormData: Object.keys(formData).length > 0,
      formDataKeys: Object.keys(formData),
      url: window.location.href
    });
  });
  
  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      trackEvent('page_leave', {
        leaveTime: new Date().toISOString(),
        timeOnPage: performance.now(),
        url: window.location.href
      });
    } else {
      trackEvent('page_return', {
        returnTime: new Date().toISOString(),
        url: window.location.href
      });
    }
  });
  
  // Track scroll depth
  let maxScrollDepth = 0;
  let lastScrollDepthUpdate = 0;
  window.addEventListener('scroll', () => {
    // Throttle scroll tracking to reduce event frequency
    if (Date.now() - lastScrollDepthUpdate < 1000) return;
    
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Calculate scroll percentage
    const scrollPercentage = Math.floor((scrollTop + windowHeight) / documentHeight * 100);
    
    // Only track if we've scrolled deeper than before
    if (scrollPercentage > maxScrollDepth) {
      maxScrollDepth = scrollPercentage;
      lastScrollDepthUpdate = Date.now();
      
      if (maxScrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
        trackEvent('scroll_depth', {
          depth: maxScrollDepth,
          url: window.location.href
        });
      }
    }
  }, { passive: true });
}

/**
 * Track an event and add it to the queue
 * @param {string} eventType - Type of event
 * @param {Object} eventData - Data associated with the event
 */
function trackEvent(eventType, eventData) {
  if (!trackingActive) return;
  
  const event = {
    type: eventType,
    data: eventData,
    timestamp: new Date().toISOString(),
    trackingId: trackingId,
    websiteId: websiteId,
    sessionId: getSessionId(),
    visitorId: getVisitorId(),
    url: window.location.href,
    userAgent: navigator.userAgent
  };
  
  // Add to queue
  eventQueue.push(event);
  
  // If queue is full, flush immediately
  if (eventQueue.length >= MAX_QUEUE_SIZE) {
    flushEventQueue();
  }
}

/**
 * Start periodic transmission of event data
 */
function startEventTransmission() {
  // Flush queue every interval
  setInterval(flushEventQueue, FLUSH_INTERVAL);
  
  // Flush queue when page is being unloaded
  window.addEventListener('beforeunload', flushEventQueue);
}

/**
 * Send queued events to the background script
 */
function flushEventQueue() {
  if (!trackingActive || eventQueue.length === 0) return;
  
  const events = [...eventQueue];
  eventQueue.length = 0; // Clear queue
  
  chrome.runtime.sendMessage({
    action: 'processEvents',
    events: events
  }, (response) => {
    if (!response || !response.success) {
      // If sending fails, add events back to queue
      eventQueue.push(...events);
      // Limit queue size if adding back would make it too large
      if (eventQueue.length > MAX_QUEUE_SIZE) {
        eventQueue.splice(0, eventQueue.length - MAX_QUEUE_SIZE);
      }
    }
  });
}

/**
 * Generate or retrieve session ID
 */
function getSessionId() {
  let sessionId = sessionStorage.getItem('labai_session_id');
  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem('labai_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Generate or retrieve visitor ID
 */
function getVisitorId() {
  let visitorId = localStorage.getItem('labai_visitor_id');
  if (!visitorId) {
    visitorId = generateId();
    localStorage.setItem('labai_visitor_id', visitorId);
  }
  return visitorId;
}

/**
 * Generate a unique ID
 */
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Check if a form contains sensitive fields
 * @param {HTMLFormElement} form - Form element to check
 * @returns {boolean} - True if form contains sensitive fields
 */
function containsSensitiveFields(form) {
  for (const element of form.elements) {
    if (isSensitiveField(element)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if a form field is sensitive
 * @param {HTMLElement} field - Form field to check
 * @returns {boolean} - True if field is sensitive
 */
function isSensitiveField(field) {
  if (!field.name && !field.id) return false;
  
  const name = (field.name || field.id).toLowerCase();
  const type = (field.type || '').toLowerCase();
  
  // Check field type
  if (type === 'password' || type === 'email' || type === 'tel') {
    return true;
  }
  
  // Check field name/id patterns
  const sensitivePatterns = [
    'pass', 'pwd', 'secret', 'token',
    'card', 'credit', 'ccv', 'cvv', 'cvc', 'secur',
    'ssn', 'social', 'tax', 'ein', 'account',
    'auth', 'user', 'email', 'name', 'phone', 'mobile',
    'birth', 'address', 'zip', 'postal', 'city',
    'gender', 'age', 'race', 'nationality', 'citizenship',
    'salary', 'income', 'payment', 'billing'
  ];
  
  for (const pattern of sensitivePatterns) {
    if (name.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get CSS selector path for an element
 * @param {HTMLElement} element - Element to get path for
 * @returns {string} - CSS selector path
 */
function getElementPath(element) {
  if (!element) return '';
  if (element === document.body) return 'body';
  
  let path = '';
  
  while (element && element !== document.body) {
    let selector = element.tagName.toLowerCase();
    
    if (element.id) {
      selector += `#${element.id}`;
      return path ? `${selector} > ${path}` : selector;
    } else if (element.className) {
      const classes = element.className.split(/\s+/).filter(c => c);
      if (classes.length) {
        selector += `.${classes.join('.')}`;
      }
    }
    
    // Add position if there are siblings of same type
    const siblings = Array.from(element.parentNode.children).filter(
      sibling => sibling.tagName === element.tagName
    );
    
    if (siblings.length > 1) {
      const index = siblings.indexOf(element) + 1;
      selector += `:nth-of-type(${index})`;
    }
    
    path = path ? `${selector} > ${path}` : selector;
    element = element.parentNode;
  }
  
  return `body > ${path}`;
}

/**
 * Perform website analysis
 * @returns {Object} - Analysis results
 */
async function performAnalysis() {
  console.log('Performing website analysis...');
  
  const analysis = {
    url: window.location.href,
    domain: window.location.hostname,
    title: document.title,
    timestamp: new Date().toISOString(),
    
    // Performance metrics
    performance: await analyzePerformance(),
    
    // SEO analysis
    seo: analyzeSEO(),
    
    // Content analysis
    content: analyzeContent(),
    
    // Technical analysis
    technical: analyzeTechnical(),
    
    // Accessibility analysis
    accessibility: analyzeAccessibility(),
    
    // Mobile responsiveness
    mobile: analyzeMobile()
  };
  
  return analysis;
}

/**
 * Analyze page performance
 * @returns {Object} - Performance metrics
 */
async function analyzePerformance() {
  const performanceEntries = performance.getEntriesByType('navigation');
  const resourceEntries = performance.getEntriesByType('resource');
  
  // Get timing metrics from the Navigation Timing API
  const timing = performanceEntries.length > 0 ? performanceEntries[0] : null;
  
  // Calculate key metrics
  let loadTime = 0;
  let domContentLoaded = 0;
  let firstPaint = 0;
  let firstContentfulPaint = 0;
  
  if (timing) {
    loadTime = timing.loadEventEnd - timing.navigationStart;
    domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
  }
  
  // Try to get paint timing
  const paintEntries = performance.getEntriesByType('paint');
  if (paintEntries.length > 0) {
    for (const entry of paintEntries) {
      if (entry.name === 'first-paint') {
        firstPaint = entry.startTime;
      } else if (entry.name === 'first-contentful-paint') {
        firstContentfulPaint = entry.startTime;
      }
    }
  }
  
  // Analyze resources
  const resources = {
    total: resourceEntries.length,
    totalSize: 0,
    byType: {}
  };
  
  for (const entry of resourceEntries) {
    // Skip entries with invalid transferSize
    if (!entry.transferSize || entry.transferSize <= 0) continue;
    
    resources.totalSize += entry.transferSize;
    
    // Categorize by resource type
    const type = entry.initiatorType || 'other';
    if (!resources.byType[type]) {
      resources.byType[type] = {
        count: 0,
        size: 0
      };
    }
    
    resources.byType[type].count++;
    resources.byType[type].size += entry.transferSize;
  }
  
  return {
    loadTime,
    domContentLoaded,
    firstPaint,
    firstContentfulPaint,
    resources,
    score: calculatePerformanceScore({
      loadTime,
      resourceCount: resources.total,
      resourceSize: resources.totalSize
    })
  };
}

/**
 * Calculate performance score based on metrics
 * @param {Object} metrics - Performance metrics
 * @returns {number} - Score between 0-100
 */
function calculatePerformanceScore(metrics) {
  // Very basic scoring algorithm
  let score = 100;
  
  // Penalize for load time
  if (metrics.loadTime > 5000) {
    score -= 30;
  } else if (metrics.loadTime > 3000) {
    score -= 20;
  } else if (metrics.loadTime > 1000) {
    score -= 10;
  }
  
  // Penalize for resource count
  if (metrics.resourceCount > 100) {
    score -= 20;
  } else if (metrics.resourceCount > 50) {
    score -= 10;
  } else if (metrics.resourceCount > 30) {
    score -= 5;
  }
  
  // Penalize for resource size
  const totalSizeMB = metrics.resourceSize / (1024 * 1024);
  if (totalSizeMB > 5) {
    score -= 20;
  } else if (totalSizeMB > 3) {
    score -= 15;
  } else if (totalSizeMB > 1) {
    score -= 5;
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Analyze SEO aspects of the page
 * @returns {Object} - SEO analysis results
 */
function analyzeSEO() {
  // Get meta tags
  const metaTags = Array.from(document.querySelectorAll('meta')).map(tag => ({
    name: tag.getAttribute('name') || tag.getAttribute('property'),
    content: tag.getAttribute('content')
  })).filter(tag => tag.name && tag.content);
  
  // Check title
  const title = document.title;
  const titleLength = title.length;
  const hasTitleTag = titleLength > 0;
  const titleQuality = titleLength > 10 && titleLength < 60 ? 'good' : 'needs-improvement';
  
  // Check meta description
  const metaDescription = metaTags.find(tag => tag.name === 'description');
  const hasMetaDescription = !!metaDescription;
  const metaDescriptionLength = metaDescription ? metaDescription.content.length : 0;
  const metaDescriptionQuality = metaDescriptionLength > 50 && metaDescriptionLength < 160 ? 'good' : 'needs-improvement';
  
  // Check headings
  const h1Elements = document.querySelectorAll('h1');
  const hasH1 = h1Elements.length > 0;
  const h1Count = h1Elements.length;
  const h1Quality = h1Count === 1 ? 'good' : 'needs-improvement';
  
  const headings = {
    h1: Array.from(h1Elements).map(h => h.textContent.trim()),
    h2: Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim()),
    h3: Array.from(document.querySelectorAll('h3')).map(h => h.textContent.trim())
  };
  
  // Check images
  const images = Array.from(document.querySelectorAll('img'));
  const imagesWithAlt = images.filter(img => img.hasAttribute('alt') && img.getAttribute('alt').trim() !== '');
  const imagesWithoutAlt = images.length - imagesWithAlt.length;
  
  // Check links
  const links = Array.from(document.querySelectorAll('a'));
  const internalLinks = links.filter(link => {
    try {
      const url = new URL(link.href, window.location.origin);
      return url.hostname === window.location.hostname;
    } catch (e) {
      return false;
    }
  });
  const externalLinks = links.length - internalLinks.length;
  
  // Calculate SEO score
  let seoScore = 100;
  
  if (!hasTitleTag) seoScore -= 20;
  if (titleQuality !== 'good') seoScore -= 10;
  if (!hasMetaDescription) seoScore -= 15;
  if (metaDescriptionQuality !== 'good') seoScore -= 10;
  if (!hasH1) seoScore -= 15;
  if (h1Quality !== 'good') seoScore -= 10;
  if (imagesWithoutAlt > 0) seoScore -= Math.min(20, imagesWithoutAlt * 2);
  
  return {
    title: {
      value: title,
      length: titleLength,
      exists: hasTitleTag,
      quality: titleQuality
    },
    metaDescription: {
      value: metaDescription ? metaDescription.content : '',
      exists: hasMetaDescription,
      length: metaDescriptionLength,
      quality: metaDescriptionQuality
    },
    headings,
    h1: {
      exists: hasH1,
      count: h1Count,
      quality: h1Quality
    },
    images: {
      total: images.length,
      withAlt: imagesWithAlt.length,
      withoutAlt: imagesWithoutAlt
    },
    links: {
      total: links.length,
      internal: internalLinks.length,
      external: externalLinks
    },
    metaTags,
    score: Math.max(0, Math.min(100, seoScore))
  };
}

/**
 * Analyze content aspects of the page
 * @returns {Object} - Content analysis results
 */
function analyzeContent() {
  // Get main content
  const mainContent = document.body.textContent.trim();
  const wordCount = mainContent.split(/\s+/).length;
  
  // Check content length
  const contentLength = mainContent.length;
  const contentQuality = wordCount > 300 ? 'good' : 'needs-improvement';
  
  // Check for media content
  const images = document.querySelectorAll('img').length;
  const videos = document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length;
  
  // Check for social sharing
  const socialElements = document.querySelectorAll(
    'a[href*="facebook.com/share"], a[href*="twitter.com/intent/tweet"], ' +
    'a[href*="linkedin.com/share"], a[href*="pinterest.com/pin"]'
  ).length;
  
  // Calculate content score
  let contentScore = 100;
  
  if (wordCount < 300) contentScore -= 20;
  if (wordCount < 100) contentScore -= 20;
  if (images === 0) contentScore -= 10;
  if (videos === 0) contentScore -= 5;
  if (socialElements === 0) contentScore -= 5;
  
  return {
    wordCount,
    quality: contentQuality,
    images,
    videos,
    socialElements,
    score: Math.max(0, Math.min(100, contentScore))
  };
}

/**
 * Analyze technical aspects of the page
 * @returns {Object} - Technical analysis results
 */
function analyzeTechnical() {
  // Check doctype
  const hasDoctype = document.doctype !== null;
  
  // Check character encoding
  const charsetMeta = document.querySelector('meta[charset]');
  const hasCharset = charsetMeta !== null;
  const charset = hasCharset ? charsetMeta.getAttribute('charset') : '';
  
  // Check viewport
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  const hasViewport = viewportMeta !== null;
  const viewport = hasViewport ? viewportMeta.getAttribute('content') : '';
  
  // Check JavaScript libraries
  const detectedLibraries = detectJavaScriptLibraries();
  
  // Check for schema markup
  const hasSchemaMarkup = document.querySelector('[itemtype], script[type="application/ld+json"]') !== null;
  
  // Check for canonical URL
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  const hasCanonical = canonicalLink !== null;
  const canonical = hasCanonical ? canonicalLink.getAttribute('href') : '';
  
  // Check for SSL
  const isSecure = window.location.protocol === 'https:';
  
  // Calculate technical score
  let technicalScore = 100;
  
  if (!hasDoctype) technicalScore -= 10;
  if (!hasCharset) technicalScore -= 10;
  if (!hasViewport) technicalScore -= 15;
  if (!hasSchemaMarkup) technicalScore -= 10;
  if (!hasCanonical) technicalScore -= 10;
  if (!isSecure) technicalScore -= 20;
  
  return {
    doctype: {
      exists: hasDoctype
    },
    charset: {
      exists: hasCharset,
      value: charset
    },
    viewport: {
      exists: hasViewport,
      value: viewport
    },
    libraries: detectedLibraries,
    schema: {
      exists: hasSchemaMarkup
    },
    canonical: {
      exists: hasCanonical,
      value: canonical
    },
    secure: isSecure,
    score: Math.max(0, Math.min(100, technicalScore))
  };
}

/**
 * Detect JavaScript libraries used on the page
 * @returns {Array} - Detected libraries and versions
 */
function detectJavaScriptLibraries() {
  const libraries = [];
  
  // Check for common libraries
  if (typeof jQuery !== 'undefined') {
    libraries.push({ name: 'jQuery', version: jQuery.fn.jquery });
  }
  
  if (typeof React !== 'undefined') {
    libraries.push({ name: 'React', version: React.version });
  }
  
  if (typeof angular !== 'undefined') {
    libraries.push({ name: 'Angular', version: angular.version ? angular.version.full : 'unknown' });
  }
  
  if (typeof Vue !== 'undefined') {
    libraries.push({ name: 'Vue.js', version: Vue.version });
  }
  
  if (typeof bootstrap !== 'undefined') {
    libraries.push({ name: 'Bootstrap', version: bootstrap.version || 'unknown' });
  }
  
  if (typeof _ !== 'undefined') {
    libraries.push({ name: 'Lodash', version: _.VERSION });
  }
  
  // Check for scripts with version info in the URL
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  for (const script of scripts) {
    const src = script.getAttribute('src');
    
    // Look for library names and versions in script source URLs
    const libraryMatches = [
      { pattern: /jquery[.-]([0-9.]+)/i, name: 'jQuery' },
      { pattern: /react[.-]([0-9.]+)/i, name: 'React' },
      { pattern: /angular[.-]([0-9.]+)/i, name: 'Angular' },
      { pattern: /vue[.-]([0-9.]+)/i, name: 'Vue.js' },
      { pattern: /bootstrap[.-]([0-9.]+)/i, name: 'Bootstrap' },
      { pattern: /lodash[.-]([0-9.]+)/i, name: 'Lodash' },
      { pattern: /gsap[.-]([0-9.]+)/i, name: 'GSAP' },
      { pattern: /three[.-]([0-9.]+)/i, name: 'Three.js' }
    ];
    
    for (const { pattern, name } of libraryMatches) {
      const match = src.match(pattern);
      if (match && match[1]) {
        // Check if we've already detected this library
        if (!libraries.some(lib => lib.name === name)) {
          libraries.push({ name, version: match[1] });
        }
      }
    }
  }
  
  return libraries;
}

/**
 * Analyze accessibility aspects of the page
 * @returns {Object} - Accessibility analysis results
 */
function analyzeAccessibility() {
  // Check for alt text on images
  const images = Array.from(document.querySelectorAll('img'));
  const imagesWithAlt = images.filter(img => img.hasAttribute('alt'));
  const imagesWithoutAlt = images.length - imagesWithAlt.length;
  
  // Check for form labels
  const formInputs = Array.from(document.querySelectorAll('input, select, textarea'));
  const inputsWithLabel = formInputs.filter(input => {
    if (!input.id) return false;
    return document.querySelector(`label[for="${input.id}"]`) !== null;
  });
  const inputsWithoutLabel = formInputs.length - inputsWithLabel.length;
  
  // Check for heading structure
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const headingLevels = headings.map(h => parseInt(h.tagName.substring(1)));
  const hasProperHeadingStructure = headingLevels.length > 0 && headingLevels.includes(1);
  
  // Check for color contrast issues (simplified)
  const potentialContrastIssues = estimateContrastIssues();
  
  // Check for ARIA attributes
  const elementsWithAria = document.querySelectorAll('[aria-*]').length;
  
  // Calculate accessibility score
  let accessibilityScore = 100;
  
  if (imagesWithoutAlt > 0) accessibilityScore -= Math.min(20, imagesWithoutAlt * 2);
  if (inputsWithoutLabel > 0) accessibilityScore -= Math.min(20, inputsWithoutLabel * 5);
  if (!hasProperHeadingStructure) accessibilityScore -= 15;
  if (potentialContrastIssues > 0) accessibilityScore -= Math.min(20, potentialContrastIssues * 5);
  
  return {
    images: {
      total: images.length,
      withAlt: imagesWithAlt.length,
      withoutAlt: imagesWithoutAlt
    },
    forms: {
      inputs: formInputs.length,
      withLabel: inputsWithLabel.length,
      withoutLabel: inputsWithoutLabel
    },
    headings: {
      structure: hasProperHeadingStructure,
      levels: headingLevels
    },
    contrast: {
      potentialIssues: potentialContrastIssues
    },
    aria: {
      count: elementsWithAria
    },
    score: Math.max(0, Math.min(100, accessibilityScore))
  };
}

/**
 * Estimate potential contrast issues (simplified)
 * @returns {number} - Number of potential contrast issues
 */
function estimateContrastIssues() {
  // This is a simplified approach that looks for potentially problematic
  // color combinations by examining inline styles and computed styles
  let issues = 0;
  
  // Check elements with text content
  const textElements = Array.from(document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, label'));
  
  for (const element of textElements) {
    const computedStyle = window.getComputedStyle(element);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;
    
    // Very basic check for light text on light background or dark text on dark background
    if (isLightColor(color) && isLightColor(backgroundColor)) {
      issues++;
    } else if (!isLightColor(color) && !isLightColor(backgroundColor)) {
      issues++;
    }
  }
  
  return issues;
}

/**
 * Very basic check if a color is "light"
 * @param {string} color - CSS color value
 * @returns {boolean} - True if color is light
 */
function isLightColor(color) {
  // Extract RGB values from the color string
  let r, g, b;
  
  if (color.startsWith('rgb') || color.startsWith('rgba')) {
    const values = color.replace(/rgba?\(|\)/g, '').split(',');
    r = parseInt(values[0]);
    g = parseInt(values[1]);
    b = parseInt(values[2]);
  } else if (color.startsWith('#')) {
    const hex = color.substring(1);
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    // Can't determine, assume it's not light
    return false;
  }
  
  // Calculate perceived brightness using the formula:
  // (0.299*R + 0.587*G + 0.114*B)
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
  
  // Threshold of 125 (out of 255) is a simple way to distinguish light vs dark
  return brightness > 125;
}

/**
 * Analyze mobile responsiveness
 * @returns {Object} - Mobile analysis results
 */
function analyzeMobile() {
  // Check viewport meta tag
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  const hasViewport = viewportMeta !== null;
  const viewport = hasViewport ? viewportMeta.getAttribute('content') : '';
  const hasResponsiveViewport = viewport.includes('width=device-width') && viewport.includes('initial-scale=1');
  
  // Look for media queries in stylesheets
  let mediaQueryCount = 0;
  try {
    for (const sheet of document.styleSheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (const rule of rules) {
          if (rule.type === CSSRule.MEDIA_RULE) {
            mediaQueryCount++;
          }
        }
      } catch (e) {
        // Skip inaccessible stylesheets (CORS restrictions)
      }
    }
  } catch (e) {
    // Couldn't access stylesheets
  }
  
  // Check for fixed widths
  const elementsWithFixedWidth = document.querySelectorAll('[style*="width"][style*="px"]').length;
  
  // Check for touch-friendly elements
  const smallButtons = Array.from(document.querySelectorAll('button, a.button, input[type="button"], .btn')).filter(el => {
    const rect = el.getBoundingClientRect();
    return rect.width < 40 || rect.height < 40;
  }).length;
  
  // Calculate mobile score
  let mobileScore = 100;
  
  if (!hasResponsiveViewport) mobileScore -= 30;
  if (mediaQueryCount === 0) mobileScore -= 20;
  if (elementsWithFixedWidth > 5) mobileScore -= 15;
  if (smallButtons > 0) mobileScore -= Math.min(20, smallButtons * 2);
  
  return {
    viewport: {
      exists: hasViewport,
      isResponsive: hasResponsiveViewport,
      value: viewport
    },
    mediaQueries: mediaQueryCount,
    fixedWidths: elementsWithFixedWidth,
    smallTargets: smallButtons,
    score: Math.max(0, Math.min(100, mobileScore))
  };
}