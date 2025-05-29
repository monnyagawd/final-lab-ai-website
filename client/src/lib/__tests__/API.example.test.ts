/**
 * Example API tests to demonstrate how to use the API test utilities
 * 
 * NOTE: This is an example file and not meant to be run as actual tests.
 * Use this as a template for creating real API tests.
 */

import { 
  testQuerySuccess, 
  testQueryError, 
  testMutationSuccess,
  testUseQueryHook,
  setupCommonAPIMocks
} from '../APITestUtils';
import { 
  generateMockUser, 
  generateMockAppointment,
  mockAPIError
} from '../testSetup';
import { APIError, ValidationError } from '../errorHandling';

describe('API Tests Examples', () => {
  // Set up common API mocks for all tests
  beforeAll(() => {
    setupCommonAPIMocks();
  });
  
  describe('Authentication API', () => {
    it('demonstrates how to test a successful login', async () => {
      const loginData = { username: 'testuser', password: 'TestPass123' };
      const mockUser = generateMockUser();
      
      await testMutationSuccess(
        '/api/login',
        loginData,
        mockUser,
        {
          // Validate that the response contains expected user properties
          validateResponse: (data) => {
            expect(data).toHaveProperty('id');
            expect(data).toHaveProperty('username');
            expect(data).toHaveProperty('email');
          }
        }
      );
    });
    
    it('demonstrates how to test a login with invalid credentials', async () => {
      await testQueryError(
        '/api/login',
        { 
          message: 'Invalid username or password', 
          status: 401 
        },
        {
          expectedErrorType: 'authentication',
          // Custom validation for the thrown error
          validateError: (error) => {
            expect(error.message).toContain('Invalid username or password');
          }
        }
      );
    });
  });
  
  describe('User Profile API', () => {
    it('demonstrates how to test fetching user profile', async () => {
      const mockUser = generateMockUser();
      
      await testQuerySuccess(
        '/api/user',
        mockUser,
        {
          // Custom validation logic
          validateResponse: (data) => {
            expect(data.id).toBe(mockUser.id);
            expect(data.username).toBe(mockUser.username);
            expect(data.email).toBe(mockUser.email);
          }
        }
      );
    });
    
    it('demonstrates how to test updating user profile', async () => {
      const updateData = { 
        firstName: 'Updated', 
        lastName: 'Name',
        companyName: 'New Company' 
      };
      
      const mockUser = generateMockUser(updateData);
      
      await testMutationSuccess(
        '/api/user',
        updateData,
        mockUser,
        {
          method: 'PATCH', // Use PATCH for updates
          validateRequest: (body) => {
            // Verify specific properties in the request body
            expect(body.firstName).toBe(updateData.firstName);
            expect(body.lastName).toBe(updateData.lastName);
          }
        }
      );
    });
  });
  
  describe('Appointments API', () => {
    it('demonstrates how to test creating an appointment', async () => {
      const appointmentData = {
        fullName: 'Test Client',
        email: 'client@example.com',
        projectType: 'Website Development',
        projectDetails: 'Building a new site',
        appointmentDate: '2025-06-15',
        appointmentTime: '14:30'
      };
      
      const mockAppointment = generateMockAppointment();
      
      await testMutationSuccess(
        '/api/appointments',
        appointmentData,
        mockAppointment
      );
    });
    
    it('demonstrates how to test validation error handling', async () => {
      await testQueryError(
        '/api/appointments',
        { 
          message: 'Validation failed', 
          status: 422,
          data: {
            errors: {
              email: ['Invalid email format'],
              appointmentDate: ['Date must be in the future']
            }
          }
        },
        {
          expectedErrorType: 'validation',
          validateError: (error) => {
            // Check specific validation error details
            if (error instanceof ValidationError) {
              expect(error.errors).toHaveProperty('email');
              expect(error.errors).toHaveProperty('appointmentDate');
            }
          }
        }
      );
    });
  });
  
  describe('React Query Integration', () => {
    it('demonstrates how to test a useQuery hook setup', () => {
      const mockAppointments = [generateMockAppointment(), generateMockAppointment()];
      
      testUseQueryHook(
        '/api/appointments',
        mockAppointments
      );
      
      // The query data should now be cached in queryClient
      // This would be used in combination with the TestRenderer
      // to test components using the useQuery hook
    });
  });
});