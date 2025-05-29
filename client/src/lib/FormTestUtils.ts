/**
 * Form testing utilities for Lab AI
 * This module provides utilities for testing forms and validation
 */

import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { z } from 'zod';
import { validateForm } from './validation';

interface FieldConfig {
  label?: string;
  name?: string;
  testId?: string;
  placeholder?: string;
  type?: string;
}

interface FormTestOptions {
  submitButtonText?: string;
  waitForValidation?: boolean;
  debug?: boolean;
}

/**
 * Find a form field by various selectors
 * @param config Field configuration
 * @returns HTML element
 */
export function findFormField(config: FieldConfig): HTMLElement {
  const { label, name, testId, placeholder, type = 'text' } = config;
  
  // Try to find by test ID first
  if (testId) {
    const element = screen.queryByTestId(testId);
    if (element) return element;
  }
  
  // Then try to find by label
  if (label) {
    const element = screen.queryByLabelText(label, { exact: false });
    if (element) return element;
  }
  
  // Then try to find by placeholder
  if (placeholder) {
    const element = screen.queryByPlaceholderText(placeholder);
    if (element) return element;
  }
  
  // Finally try to find by name or type
  if (name) {
    const element = screen.queryByRole('textbox', { name: new RegExp(name, 'i') });
    if (element) return element;
  }
  
  // For select elements
  if (type === 'select') {
    const element = screen.queryByRole('combobox');
    if (element) return element;
  }
  
  // For checkbox or radio
  if (type === 'checkbox' || type === 'radio') {
    const element = screen.queryByRole(type);
    if (element) return element;
  }
  
  throw new Error(`Could not find form field: ${JSON.stringify(config)}`);
}

/**
 * Fill out a form field
 * @param config Field configuration
 * @param value Value to set
 */
export async function fillFormField(config: FieldConfig, value: string | boolean): Promise<void> {
  const field = findFormField(config);
  
  // Handle different field types
  if (field.tagName === 'SELECT') {
    await userEvent.selectOptions(field, value as string);
  } else if (field.getAttribute('type') === 'checkbox' || field.getAttribute('type') === 'radio') {
    const checked = value === true || value === 'true' || value === '1';
    await userEvent.click(field);
    
    // Verify the state was set correctly
    if (checked) {
      expect(field).toBeChecked();
    } else {
      expect(field).not.toBeChecked();
    }
  } else if (field.getAttribute('type') === 'file') {
    const file = new File(['test file content'], value as string, { type: 'text/plain' });
    await userEvent.upload(field, file);
  } else {
    // Clear the field first
    await userEvent.clear(field);
    
    // Then type the new value
    if (value) {
      await userEvent.type(field, value as string);
    }
    
    // Verify the value was set
    expect(field).toHaveValue(value);
  }
}

/**
 * Submit a form
 * @param buttonText Text of the submit button
 * @returns Promise that resolves when the form is submitted
 */
export async function submitForm(buttonText = 'Submit'): Promise<void> {
  // Try to find the submit button
  const submitButton = screen.queryByRole('button', { name: new RegExp(buttonText, 'i') })
    || screen.queryByText(new RegExp(buttonText, 'i'))
    || screen.queryByRole('button', { type: 'submit' });
  
  if (!submitButton) {
    throw new Error(`Could not find submit button with text: ${buttonText}`);
  }
  
  // Click the button
  await userEvent.click(submitButton);
}

/**
 * Fill out and submit a form
 * @param formData Form data to fill
 * @param options Form test options
 * @returns Promise that resolves when the form is submitted
 */
export async function fillAndSubmitForm(
  formData: Record<string, string | boolean>,
  options: FormTestOptions = {}
): Promise<void> {
  const { submitButtonText = 'Submit', waitForValidation = true, debug = false } = options;
  
  // Fill each field
  for (const [fieldName, value] of Object.entries(formData)) {
    try {
      // Try different ways to find the field
      await fillFormField({ name: fieldName }, value);
    } catch (error) {
      try {
        // Try by label if name fails
        await fillFormField({ label: fieldName }, value);
      } catch (innerError) {
        try {
          // Try by test ID if label fails
          await fillFormField({ testId: fieldName }, value);
        } catch (finalError) {
          if (debug) {
            console.error(`Failed to fill form field: ${fieldName}`, finalError);
          }
          throw new Error(`Could not find form field: ${fieldName}`);
        }
      }
    }
  }
  
  // Submit the form
  await submitForm(submitButtonText);
  
  // Wait for validation to complete if needed
  if (waitForValidation) {
    await waitFor(() => {
      // This will allow any pending validation or state updates to complete
      expect(true).toBe(true);
    });
  }
}

/**
 * Assert that validation errors are displayed
 * @param errors Expected validation errors
 */
export async function expectValidationErrors(errors: Record<string, string>): Promise<void> {
  await waitFor(() => {
    for (const [field, message] of Object.entries(errors)) {
      const regex = new RegExp(message, 'i');
      const errorElement = screen.queryByText(regex);
      
      if (!errorElement) {
        // Try to find by aria-describedby which is used by many form libraries
        const fieldElement = screen.queryByLabelText(field, { exact: false })
          || screen.queryByTestId(field)
          || screen.queryByPlaceholderText(field);
        
        if (fieldElement) {
          const describedBy = fieldElement.getAttribute('aria-describedby');
          if (describedBy) {
            const errorId = describedBy.split(' ')[0];
            const errorByRef = document.getElementById(errorId);
            if (errorByRef) {
              expect(errorByRef.textContent).toMatch(regex);
              continue;
            }
          }
        }
        
        throw new Error(`Validation error not found: ${field} - ${message}`);
      }
      
      expect(errorElement).toBeInTheDocument();
    }
  });
}

/**
 * Test form validation with Zod schema
 * @param schema Zod schema for validation
 * @param testCases Test cases with input data and expected results
 */
export function testFormValidation<T extends z.ZodType>(
  schema: T,
  testCases: Array<{
    input: Record<string, any>;
    valid: boolean;
    errors?: Record<string, string>;
  }>
): void {
  testCases.forEach(({ input, valid, errors }) => {
    const result = validateForm(schema, input);
    
    expect(result.success).toBe(valid);
    
    if (!valid && errors) {
      // Check that each expected error is present
      for (const [field, message] of Object.entries(errors)) {
        const fieldErrors = result.errors?.[field];
        expect(fieldErrors).toBeDefined();
        expect(fieldErrors).toMatch(new RegExp(message, 'i'));
      }
    }
  });
}

/**
 * Helper to test form submission in a component
 * @param renderComponent Function to render the component with the form
 * @param formData Form data to fill
 * @param onSubmitMock Mock for the submit function to verify it's called
 * @param options Form test options
 */
export async function testFormSubmission(
  renderComponent: () => void,
  formData: Record<string, string | boolean>,
  onSubmitMock: jest.Mock,
  options: FormTestOptions = {}
): Promise<void> {
  // Render the component
  renderComponent();
  
  // Fill and submit the form
  await fillAndSubmitForm(formData, options);
  
  // Verify that the onSubmit was called with the right data
  await waitFor(() => {
    expect(onSubmitMock).toHaveBeenCalled();
    
    // Get the first argument passed to the mock
    const submittedData = onSubmitMock.mock.calls[0][0];
    
    // Verify each field matches what we submitted
    for (const [field, value] of Object.entries(formData)) {
      expect(submittedData[field]).toEqual(value);
    }
  });
}