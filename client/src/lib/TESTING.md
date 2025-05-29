# Lab AI Testing Infrastructure

This document provides an overview of the testing infrastructure and guidelines for writing tests for the Lab AI application.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Test Organization](#test-organization)
3. [Component Testing](#component-testing)
4. [API Testing](#api-testing)
5. [Form Testing](#form-testing)
6. [Mocking](#mocking)
7. [Test Examples](#test-examples)

## Getting Started

The Lab AI testing infrastructure is built on top of Jest and React Testing Library. To run tests:

```sh
npm run test       # Run all tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Test Organization

Tests are organized following these conventions:

- **Component Tests**: Place next to the component itself in a `__tests__` folder or with `.test.tsx` suffix
- **API Tests**: Place in the `lib/__tests__` directory
- **Utility Tests**: Place next to the utility file with `.test.ts` suffix

## Component Testing

Use the `TestRenderer.tsx` utilities to render components with all necessary providers:

```tsx
import { render, screen, waitFor } from '@/lib/TestRenderer';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  it('renders correctly', async () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('works with authenticated user', async () => {
    render(<YourComponent />, {
      isAuthenticated: true, 
      userData: { firstName: 'Test', role: 'admin' }
    });
    
    // Test authenticated state
  });
});
```

## API Testing

Use the API test utilities to test API integrations:

```ts
import { testQuerySuccess, testQueryError, testMutationSuccess } from '@/lib/APITestUtils';
import { generateMockUser } from '@/lib/testSetup';

describe('User API', () => {
  it('fetches user profile', async () => {
    const mockUser = generateMockUser();
    
    await testQuerySuccess('/api/user', mockUser, {
      validateResponse: (data) => {
        expect(data.id).toBe(mockUser.id);
        expect(data.username).toBe(mockUser.username);
      }
    });
  });

  it('handles validation errors', async () => {
    await testQueryError('/api/user', 
      { message: 'Invalid data', status: 422, data: { errors: { email: ['Invalid format'] } } },
      { expectedErrorType: 'validation' }
    );
  });
});
```

## Form Testing

Test forms with the form testing utilities:

```tsx
import { fillAndSubmitForm, expectValidationErrors } from '@/lib/FormTestUtils';
import { render } from '@testing-library/react';
import ContactForm from '../ContactForm';

describe('ContactForm', () => {
  it('submits valid data', async () => {
    const handleSubmit = jest.fn();
    render(<ContactForm onSubmit={handleSubmit} />);
    
    await fillAndSubmitForm({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message'
    });
    
    expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
      name: 'John Doe',
      email: 'john@example.com'
    }));
  });

  it('shows validation errors', async () => {
    const handleSubmit = jest.fn();
    render(<ContactForm onSubmit={handleSubmit} />);
    
    await fillAndSubmitForm({
      name: 'a', // too short
      email: 'invalid',
      message: 'short' // too short
    });
    
    await expectValidationErrors({
      name: 'at least 2 characters',
      email: 'Invalid email',
      message: 'at least 10 characters'
    });
    
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
```

## Mocking

The test setup includes various mock utilities:

```ts
import { 
  setupTest, 
  mockAPIResponse, 
  mockFetch, 
  mockWindowProperties,
  generateMockUser,
  mockHttpResponse,
  mockLocalStorage
} from '@/lib/testSetup';

describe('YourTest', () => {
  // Mock setup
  let cleanup: () => void;
  
  beforeEach(() => {
    cleanup = setupTest();
    
    // Setup specific mocks
    mockAPIResponse('/api/user', generateMockUser());
    mockWindowProperties({ location: { href: 'https://example.com' } });
  });
  
  afterEach(() => {
    if (cleanup) cleanup();
  });
  
  // Your tests here
});
```

## Test Examples

Look at the example test files to see how to structure your tests:

- Component test example: `components/__tests__/ComponentTest.example.tsx`
- API test example: `lib/__tests__/API.example.test.ts`
- Form test example: `components/__tests__/Form.example.test.tsx`

## Best Practices

1. **Keep tests focused**: Each test should verify one specific behavior
2. **Use descriptive test names**: The test name should describe what it's testing
3. **Avoid test interdependence**: Tests should not depend on other tests
4. **Mock external dependencies**: API calls, browser APIs, etc.
5. **Test user interactions**: Click, type, etc.
6. **Test error states**: Not just the happy path
7. **Keep tests fast**: Avoid unnecessary complexity

## Troubleshooting

- **Test fails with element not found**: Use `screen.debug()` to see the rendered HTML
- **Async issues**: Use `waitFor(() => expect(...))` for async operations
- **Test timeout**: Increase timeout with `jest.setTimeout(10000)`
- **Mock issues**: Check mock setup and use `console.log` to debug