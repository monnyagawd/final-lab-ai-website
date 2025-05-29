/**
 * Lab AI Analytics Tracking Script
 * 
 * This script is injected into pages for tracking user behavior.
 * It runs in the page context and communicates with the content script.
 */

(function() {
  // Configuration (will be set via custom event from content script)
  let config = {
    trackingId: null,
    websiteId: null,
    initialized: false
  };
  
  // Session data
  const sessionData = {
    id: generateSessionId(),
    startTime: new Date().toISOString(),
    referrer: document.referrer,
    landingPage: window.location.href,
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    deviceType: detectDeviceType(),
    browserName: detectBrowserName(),
    events: []
  };
  
  // Wait for initialization from content script
  document.addEventListener('labai_init', function(e) {
    if (e.detail && e.detail.trackingId && e.detail.websiteId) {
      config.trackingId = e.detail.trackingId;
      config.websiteId = e.detail.websiteId;
      config.initialized = true;
      
      // Start tracking
      initialize();
    }
  });
  
  /**
   * Initialize the tracker
   */
  function initialize() {
    // Track page view
    trackEvent('page_view', {
      title: document.title,
      url: window.location.href,
      referrer: document.referrer
    });
    
    // Set up event tracking
    setupEventTracking();
    
    // Expose global tracking API
    window.labaiTracker = {
      trackEvent,
      trackPageView: () => trackEvent('page_view', {
        title: document.title,
        url: window.location.href
      }),
      trackConversion: (value, currency, transactionId) => trackEvent('conversion', {
        value,
        currency: currency || 'USD',
        transactionId
      }),
      trackFormSubmission: (formId, formData) => trackEvent('form_submission', {
        formId,
        formData
      })
    };
    
    // Log that tracking is active
    console.log(`Lab AI Analytics tracking active. Tracking ID: ${config.trackingId}`);
  }
  
  /**
   * Track an event
   * @param {string} eventType - Type of event
   * @param {Object} eventData - Event data
   */
  function trackEvent(eventType, eventData) {
    if (!config.initialized) return;
    
    const event = {
      type: eventType,
      data: eventData,
      timestamp: new Date().toISOString(),
      trackingId: config.trackingId,
      websiteId: config.websiteId,
      sessionId: sessionData.id,
      url: window.location.href
    };
    
    // Add to session events
    sessionData.events.push(event);
    
    // Send to content script
    window.postMessage({
      source: 'labai_tracker',
      action: 'trackEvent',
      event: event
    }, '*');
  }
  
  /**
   * Set up event tracking
   */
  function setupEventTracking() {
    // Track clicks
    document.addEventListener('click', function(e) {
      const target = e.target;
      const clickData = {
        elementType: target.tagName.toLowerCase(),
        innerText: target.innerText ? target.innerText.substring(0, 100) : '',
        id: target.id || '',
        className: target.className || '',
        href: target.href || ''
      };
      
      trackEvent('click', clickData);
    });
    
    // Track form submissions
    document.addEventListener('submit', function(e) {
      const form = e.target;
      
      // Don't track sensitive forms
      if (containsSensitiveFields(form)) {
        return;
      }
      
      const formData = {
        formId: form.id || '',
        formAction: form.action || '',
        formMethod: form.method || '',
        formFields: Array.from(form.elements)
          .filter(el => el.name && !isSensitiveField(el))
          .map(el => el.name)
      };
      
      trackEvent('form_submit', formData);
    });
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden') {
        trackEvent('page_hide', { time: new Date().toISOString() });
      } else {
        trackEvent('page_show', { time: new Date().toISOString() });
      }
    });
    
    // Track page unload
    window.addEventListener('beforeunload', function() {
      // Calculate time on page
      const endTime = new Date();
      const startTime = new Date(sessionData.startTime);
      const timeOnPage = (endTime - startTime) / 1000; // in seconds
      
      trackEvent('page_exit', {
        timeOnPage,
        sessionDuration: timeOnPage
      });
    });
    
    // Track scroll depth
    let maxScrollPercentage = 0;
    window.addEventListener('scroll', function() {
      // Throttle scroll events
      if (window.scrollY === 0) return;
      
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolledPercentage = Math.round((window.scrollY / scrollableHeight) * 100);
      
      // Only track if we've scrolled deeper
      if (scrolledPercentage > maxScrollPercentage && scrolledPercentage % 25 === 0) {
        maxScrollPercentage = scrolledPercentage;
        trackEvent('scroll_depth', { depth: scrolledPercentage });
      }
    }, { passive: true });
  }
  
  /**
   * Check if a form contains sensitive fields
   * @param {HTMLFormElement} form - Form to check
   * @returns {boolean} - True if sensitive
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
   * Check if a field is sensitive
   * @param {HTMLElement} field - Field to check
   * @returns {boolean} - True if sensitive
   */
  function isSensitiveField(field) {
    if (!field.name && !field.id) return false;
    
    const name = (field.name || field.id).toLowerCase();
    const type = (field.type || '').toLowerCase();
    
    // Check field type
    if (type === 'password' || type === 'email' || type === 'tel') {
      return true;
    }
    
    // Check field name patterns
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
   * Generate a session ID
   * @returns {string} - Session ID
   */
  function generateSessionId() {
    // Check for existing session ID in sessionStorage
    const existingId = sessionStorage.getItem('labai_session_id');
    if (existingId) {
      return existingId;
    }
    
    // Generate a new ID
    const newId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    
    // Save to sessionStorage
    sessionStorage.setItem('labai_session_id', newId);
    
    return newId;
  }
  
  /**
   * Detect device type
   * @returns {string} - Device type
   */
  function detectDeviceType() {
    const ua = navigator.userAgent;
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) {
      return /iPad|Tablet/i.test(ua) ? 'tablet' : 'mobile';
    }
    return 'desktop';
  }
  
  /**
   * Detect browser name
   * @returns {string} - Browser name
   */
  function detectBrowserName() {
    const ua = navigator.userAgent;
    
    if (ua.includes('Firefox/')) {
      return 'Firefox';
    } else if (ua.includes('Edge/') || ua.includes('Edg/')) {
      return 'Edge';
    } else if (ua.includes('Chrome/') && !ua.includes('Chromium/')) {
      return 'Chrome';
    } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
      return 'Safari';
    } else if (ua.includes('MSIE ') || ua.includes('Trident/')) {
      return 'Internet Explorer';
    } else if (ua.includes('Opera/') || ua.includes('OPR/')) {
      return 'Opera';
    }
    
    return 'Unknown';
  }
})();