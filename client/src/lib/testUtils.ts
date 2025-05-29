/**
 * Test utilities for Lab AI frontend testing
 * This module provides utility functions for unit and integration tests
 */

/**
 * Mock query client responses for testing
 * @param queryKey Query key to mock
 * @param data Data to return for this query
 * @returns Mocked query response
 */
export function mockQueryResponse(queryKey: string | string[], data: any) {
  return {
    queryKey,
    data,
    isLoading: false,
    isError: false,
    error: null,
    status: 'success',
    isPending: false,
    isSuccess: true
  };
}

/**
 * Mock error query responses for testing error states
 * @param queryKey Query key to mock
 * @param error Error to return
 * @returns Mocked error query response
 */
export function mockQueryError(queryKey: string | string[], error: Error) {
  return {
    queryKey,
    data: undefined,
    isLoading: false,
    isError: true,
    error,
    status: 'error',
    isPending: false,
    isSuccess: false
  };
}

/**
 * Mock loading query responses for testing loading states
 * @param queryKey Query key to mock
 * @returns Mocked loading query response
 */
export function mockQueryLoading(queryKey: string | string[]) {
  return {
    queryKey,
    data: undefined,
    isLoading: true,
    isError: false,
    error: null,
    status: 'loading',
    isPending: true,
    isSuccess: false
  };
}

/**
 * Generate mock user data for testing
 * @param overrides Object with properties to override default values
 * @returns Mock user object
 */
export function generateMockUser(overrides: Record<string, any> = {}) {
  return {
    id: 1,
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    stripeCustomerId: 'cus_test123',
    createdAt: new Date().toISOString(),
    role: 'customer',
    companyName: 'Test Company',
    websiteName: 'Test Website',
    ...overrides
  };
}

/**
 * Generate mock appointment data for testing
 * @param overrides Object with properties to override default values
 * @returns Mock appointment object
 */
export function generateMockAppointment(overrides: Record<string, any> = {}) {
  return {
    id: 1,
    fullName: 'Test Client',
    email: 'client@example.com',
    projectType: 'Website Development',
    projectDetails: 'Building a new e-commerce website for my business',
    appointmentDate: '2025-06-15',
    appointmentTime: '14:30',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Generate mock product data for testing
 * @param overrides Object with properties to override default values
 * @returns Mock product object
 */
export function generateMockProduct(overrides: Record<string, any> = {}) {
  return {
    id: 1,
    name: 'Test Product',
    price: '29.99',
    sku: 'TEST-001',
    quantity: 100,
    description: 'This is a test product for testing purposes',
    category: 'Test Category',
    imageUrl: 'https://example.com/test-product.jpg',
    createdAt: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Generate mock social media account data for testing
 * @param overrides Object with properties to override default values
 * @returns Mock social media account object
 */
export function generateMockSocialAccount(overrides: Record<string, any> = {}) {
  return {
    id: 1,
    userId: 1,
    platform: 'instagram',
    accountName: 'testacc',
    accountId: 'testacc123',
    followers: '5000',
    following: '1000',
    engagement: '3.5',
    growthRate: '2.1',
    followersHistory: JSON.stringify([
      { date: '2025-04-01', count: '4800' },
      { date: '2025-04-15', count: '4900' },
      { date: '2025-05-01', count: '5000' }
    ]),
    ...overrides
  };
}

/**
 * Generate mock website analytics data for testing
 * @param overrides Object with properties to override default values
 * @returns Mock website analytics object
 */
export function generateMockWebsiteAnalytics(overrides: Record<string, any> = {}) {
  return {
    id: 1,
    userId: 1,
    pageViews: '1250',
    uniqueVisitors: '750',
    bounceRate: '35.2',
    avgTimeOnSite: '2.5',
    topReferrers: JSON.stringify([
      { source: 'google.com', visits: 350 },
      { source: 'facebook.com', visits: 200 },
      { source: 'instagram.com', visits: 150 }
    ]),
    devicesBreakdown: JSON.stringify({
      desktop: 65,
      mobile: 30,
      tablet: 5
    }),
    conversionRate: '3.8',
    ...overrides
  };
}

/**
 * Generate mock order data for testing
 * @param overrides Object with properties to override default values
 * @returns Mock order object
 */
export function generateMockOrder(overrides: Record<string, any> = {}) {
  return {
    id: 1,
    userId: 1,
    orderNumber: 'ORD-10001',
    status: 'processing',
    totalAmount: '129.99',
    items: [
      { id: 1, productId: 1, name: 'Test Product', quantity: 2, price: '29.99' },
      { id: 2, productId: 2, name: 'Another Product', quantity: 1, price: '69.99' }
    ],
    shippingAddress: {
      street: '123 Test St',
      city: 'Testville',
      state: 'TS',
      zipCode: '12345',
      country: 'US'
    },
    paymentMethod: 'credit_card',
    createdAt: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Generate mock HTTP response for testing fetch API calls
 * @param data Response data
 * @param status HTTP status code
 * @returns Mock Response object
 */
export function mockHttpResponse(data: any, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  } as Response;
}

/**
 * Mock localStorage for testing
 * @returns Mocked localStorage object
 */
export function mockLocalStorage() {
  const store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => {
        delete store[key];
      });
    },
    key: (i: number) => Object.keys(store)[i] || null,
    length: Object.keys(store).length
  };
}

/**
 * Wait for a specific timeout
 * Useful for testing async operations
 * @param ms Milliseconds to wait
 * @returns Promise that resolves after the specified time
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create fake event object for testing form events
 * @param values Values for the event
 * @returns Mock event object
 */
export function createMockEvent(values: Record<string, any> = {}) {
  return {
    preventDefault: () => {},
    stopPropagation: () => {},
    target: { value: '', ...values },
    currentTarget: { value: '', ...values },
    ...values
  };
}

/**
 * Mock React Router's useLocation hook
 * @param path Current path
 * @returns Mocked location object
 */
export function mockUseLocation(path = '/') {
  const searchParams = path.includes('?') 
    ? path.split('?')[1]
    : '';
  
  return {
    pathname: path.split('?')[0],
    search: searchParams ? `?${searchParams}` : '',
    hash: '',
    state: null
  };
}