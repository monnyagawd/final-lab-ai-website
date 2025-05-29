/**
 * Test renderer component
 * Provides a standardized way to render components with all providers in tests
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Router } from 'wouter';
import { createTestQueryClient } from './testSetup';
import { AuthProvider } from '@/hooks/use-auth';
import { mockAPIResponse, generateMockUser } from './testSetup';

interface TestRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  isAuthenticated?: boolean;
  userData?: Record<string, any>;
  apiMocks?: Array<{
    url: string | RegExp;
    data: any;
    status?: number;
  }>;
}

/**
 * Custom render function that wraps the component with all necessary providers
 * @param ui Component to render
 * @param options Rendering options
 * @returns RenderResult with additional helper methods
 */
export function renderWithProviders(
  ui: ReactElement,
  options: TestRenderOptions = {}
): RenderResult {
  const {
    route = '/',
    isAuthenticated = false,
    userData,
    apiMocks = [],
    ...renderOptions
  } = options;

  // Create a fresh query client for each test
  const queryClient = createTestQueryClient();

  // Setup authentication mocks if needed
  if (isAuthenticated) {
    const mockUser = userData ? generateMockUser(userData) : generateMockUser();
    mockAPIResponse('/api/user', mockUser);
  } else {
    mockAPIResponse('/api/user', { message: 'Not authenticated' }, 401);
  }

  // Setup any additional API mocks provided
  apiMocks.forEach(mock => {
    mockAPIResponse(mock.url, mock.data, mock.status || 200);
  });

  // Define a custom wrapper with all providers
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Mock the current route
    const navigate = (to: string) => console.log(`Navigation to: ${to}`);
    const hookReturn = [route, navigate] as const;

    return (
      <Router hook={() => hookReturn}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </Router>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Custom render function specifically for testing pages that use the dashboard layout
 * @param ui Component to render
 * @param options Rendering options
 * @returns RenderResult with additional helper methods
 */
export function renderDashboardPage(
  ui: ReactElement,
  options: TestRenderOptions = {}
): RenderResult {
  // Dashboard pages should always be authenticated
  return renderWithProviders(ui, {
    isAuthenticated: true,
    ...options
  });
}

export * from '@testing-library/react';
export { renderWithProviders as render };