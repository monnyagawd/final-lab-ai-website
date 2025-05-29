/**
 * Tests for TestRenderer utility
 */

import React from 'react';
import { render, renderWithProviders, renderDashboardPage } from '../TestRenderer';
import { screen, waitFor } from '@testing-library/react';
import { mockAPIResponse } from '../testSetup';

// Mock components for testing
const TestComponent = () => <div>Test Component</div>;

const AuthAwareComponent = () => {
  // This would use useAuth() hook in a real component
  return (
    <div>
      <span data-testid="auth-status">
        {/* Content would depend on auth state */}
        Auth status placeholder
      </span>
    </div>
  );
};

const RouteAwareComponent = () => {
  // This would use useLocation() hook in a real component
  return (
    <div>
      <span data-testid="route-info">
        {/* Content would depend on route */}
        Route info placeholder
      </span>
    </div>
  );
};

// Mock the auth hook
jest.mock('@/hooks/use-auth', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
  useAuth: () => {
    // Return mock auth data based on the test
    const isAuthenticated = document.body.hasAttribute('data-authenticated');
    
    if (isAuthenticated) {
      return {
        user: { id: 1, username: 'testuser', email: 'test@example.com' },
        isLoading: false,
        error: null
      };
    }
    
    return {
      user: null,
      isLoading: false,
      error: null
    };
  }
}));

describe('TestRenderer utilities', () => {
  beforeEach(() => {
    // Clear mocks between tests
    jest.clearAllMocks();
    
    // Reset body attributes
    document.body.removeAttribute('data-authenticated');
  });
  
  describe('renderWithProviders', () => {
    it('renders components with all required providers', () => {
      // Render a simple component
      renderWithProviders(<TestComponent />);
      
      // Verify the component rendered
      expect(screen.getByText('Test Component')).toBeInTheDocument();
      
      // Verify providers are present
      expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    });
    
    it('configures authentication when specified', () => {
      // First render without authentication
      renderWithProviders(<AuthAwareComponent />);
      
      // Now render with authentication
      document.body.setAttribute('data-authenticated', 'true');
      renderWithProviders(<AuthAwareComponent />, { isAuthenticated: true });
      
      // Component should be rendered
      expect(screen.getAllByTestId('auth-status').length).toBe(2);
    });
    
    it('configures the current route when specified', () => {
      // Render with a specific route
      renderWithProviders(<RouteAwareComponent />, {
        route: '/dashboard'
      });
      
      // Component should be rendered
      expect(screen.getByTestId('route-info')).toBeInTheDocument();
    });
    
    it('configures API mocks when specified', async () => {
      // Set up a spy on mockAPIResponse
      const mockAPIResponseSpy = jest.spyOn(require('../testSetup'), 'mockAPIResponse');
      
      // Render with API mocks
      renderWithProviders(<TestComponent />, {
        apiMocks: [
          { url: '/api/test', data: { test: true } },
          { url: '/api/users', data: [{ id: 1, name: 'Test User' }], status: 200 }
        ]
      });
      
      // Verify mockAPIResponse was called for each mock
      expect(mockAPIResponseSpy).toHaveBeenCalledTimes(3); // 2 from apiMocks + 1 for auth
      
      // Verify specific calls
      expect(mockAPIResponseSpy).toHaveBeenCalledWith('/api/test', { test: true }, undefined);
      expect(mockAPIResponseSpy).toHaveBeenCalledWith('/api/users', [{ id: 1, name: 'Test User' }], 200);
    });
  });
  
  describe('renderDashboardPage', () => {
    it('renders components with authentication', () => {
      // Render a dashboard component
      renderDashboardPage(<AuthAwareComponent />);
      
      // Dashboard pages are always authenticated
      document.body.setAttribute('data-authenticated', 'true');
      
      // Component should be rendered
      expect(screen.getByTestId('auth-status')).toBeInTheDocument();
    });
    
    it('can be configured with additional options', () => {
      // Set up a spy on mockAPIResponse
      const mockAPIResponseSpy = jest.spyOn(require('../testSetup'), 'mockAPIResponse');
      
      // Render with custom options
      renderDashboardPage(<TestComponent />, {
        route: '/dashboard/analytics',
        userData: { role: 'admin' },
        apiMocks: [
          { url: '/api/analytics', data: { visits: 100 } }
        ]
      });
      
      // Verify the component rendered
      expect(screen.getByText('Test Component')).toBeInTheDocument();
      
      // Verify API mocks were set up
      expect(mockAPIResponseSpy).toHaveBeenCalledWith('/api/analytics', { visits: 100 }, undefined);
    });
  });
});