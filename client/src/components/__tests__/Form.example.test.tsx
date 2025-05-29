/**
 * Example form tests
 * Shows how to use the form testing utilities
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { 
  fillAndSubmitForm, 
  expectValidationErrors,
  testFormValidation 
} from '../../lib/FormTestUtils';
import { createContactFormSchema } from '../../lib/validation';

// Example component with a form - this would be an actual component in your app
function ContactForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    // Validate with schema
    const schema = createContactFormSchema();
    const result = schema.safeParse(data);
    
    if (!result.success) {
      // Extract error messages
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const path = issue.path.join('.');
        formattedErrors[path] = issue.message;
      });
      
      setErrors(formattedErrors);
      return;
    }
    
    // Clear errors and submit
    setErrors({});
    onSubmit(data);
  };
  
  return (
    <form onSubmit={handleSubmit} data-testid="contact-form">
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" />
        {errors.name && <span role="alert">{errors.name}</span>}
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" />
        {errors.email && <span role="alert">{errors.email}</span>}
      </div>
      
      <div>
        <label htmlFor="phone">Phone (optional)</label>
        <input id="phone" name="phone" type="tel" />
        {errors.phone && <span role="alert">{errors.phone}</span>}
      </div>
      
      <div>
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={5} />
        {errors.message && <span role="alert">{errors.message}</span>}
      </div>
      
      <button type="submit">Send Message</button>
    </form>
  );
}

describe('Form Testing Example', () => {
  it('demonstrates successful form submission', async () => {
    // Create a mock for the submit handler
    const handleSubmit = jest.fn();
    
    // Render the form component
    render(<ContactForm onSubmit={handleSubmit} />);
    
    // Fill out the form and submit
    await fillAndSubmitForm({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      message: 'This is a test message that is long enough to pass validation.'
    });
    
    // Verify that the form was submitted with the correct data
    expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      message: 'This is a test message that is long enough to pass validation.'
    }));
  });
  
  it('demonstrates validation error handling', async () => {
    // Create a mock for the submit handler
    const handleSubmit = jest.fn();
    
    // Render the form component
    render(<ContactForm onSubmit={handleSubmit} />);
    
    // Fill out the form with invalid data and submit
    await fillAndSubmitForm({
      name: 'Jo', // Too short
      email: 'invalid-email', // Invalid email format
      phone: 'not-a-phone', // Invalid phone format
      message: 'Short' // Too short message
    });
    
    // Verify that validation errors are displayed
    await expectValidationErrors({
      name: 'at least 2 characters',
      email: 'Invalid email address',
      phone: 'Invalid phone number',
      message: 'at least 10 characters'
    });
    
    // Verify that the form was not submitted
    expect(handleSubmit).not.toHaveBeenCalled();
  });
  
  it('demonstrates testing schema validation directly', () => {
    const schema = createContactFormSchema();
    
    testFormValidation(schema, [
      {
        // Valid data
        input: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          message: 'This is a test message that is long enough.'
        },
        valid: true
      },
      {
        // Invalid data
        input: {
          name: 'J', // Too short
          email: 'not-an-email',
          message: 'Short' // Too short
        },
        valid: false,
        errors: {
          name: 'at least 2 characters',
          email: 'Invalid email',
          message: 'at least 10 characters'
        }
      },
      {
        // Optional phone field with invalid format
        input: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '1234', // Invalid format
          message: 'This is a test message that is long enough.'
        },
        valid: false,
        errors: {
          phone: 'Invalid phone'
        }
      }
    ]);
  });
});