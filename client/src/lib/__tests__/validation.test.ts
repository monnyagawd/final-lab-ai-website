/**
 * Tests for validation utilities
 */

import { z } from 'zod';
import {
  ValidationPatterns,
  ValidationSchemas,
  validateForm,
  formatZodErrors,
  createContactFormSchema,
  createLoginFormSchema,
  createRegistrationFormSchema,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  formatPhoneNumber
} from '../validation';

describe('Validation utilities', () => {
  describe('ValidationPatterns', () => {
    it('validates usernames correctly', () => {
      const { USERNAME } = ValidationPatterns;
      
      // Valid usernames
      expect('user123').toMatch(USERNAME);
      expect('User_123').toMatch(USERNAME);
      expect('test-user').toMatch(USERNAME);
      
      // Invalid usernames
      expect('ab').not.toMatch(USERNAME); // Too short
      expect('user@123').not.toMatch(USERNAME); // Invalid character
      expect('a'.repeat(31)).not.toMatch(USERNAME); // Too long
    });
    
    it('validates passwords correctly', () => {
      const { PASSWORD } = ValidationPatterns;
      
      // Valid passwords
      expect('Password123').toMatch(PASSWORD);
      expect('Secure@123').toMatch(PASSWORD);
      
      // Invalid passwords
      expect('password').not.toMatch(PASSWORD); // No uppercase, no number
      expect('PASSWORD123').not.toMatch(PASSWORD); // No lowercase
      expect('Password').not.toMatch(PASSWORD); // No number
      expect('Pass1').not.toMatch(PASSWORD); // Too short
    });
    
    it('validates emails correctly', () => {
      const { EMAIL } = ValidationPatterns;
      
      // Valid emails
      expect('user@example.com').toMatch(EMAIL);
      expect('john.doe123@company-name.co.uk').toMatch(EMAIL);
      
      // Invalid emails
      expect('invalid-email').not.toMatch(EMAIL);
      expect('user@').not.toMatch(EMAIL);
      expect('@example.com').not.toMatch(EMAIL);
    });
    
    it('validates phone numbers correctly', () => {
      const { PHONE } = ValidationPatterns;
      
      // Valid phone numbers
      expect('(123) 456-7890').toMatch(PHONE);
      expect('123-456-7890').toMatch(PHONE);
      expect('123.456.7890').toMatch(PHONE);
      expect('1234567890').toMatch(PHONE);
      expect('+1 (123) 456-7890').toMatch(PHONE);
      
      // Invalid phone numbers
      expect('123-456').not.toMatch(PHONE); // Too short
      expect('abcdefghij').not.toMatch(PHONE); // Non-numeric
    });
    
    it('validates URLs correctly', () => {
      const { URL } = ValidationPatterns;
      
      // Valid URLs
      expect('https://example.com').toMatch(URL);
      expect('http://subdomain.example.co.uk/path').toMatch(URL);
      expect('example.com').toMatch(URL);
      
      // Invalid URLs
      expect('invalid url').not.toMatch(URL);
      expect('http://').not.toMatch(URL);
    });
  });
  
  describe('ValidationSchemas', () => {
    it('validates username schema correctly', () => {
      const { username } = ValidationSchemas;
      
      // Valid username
      expect(username.safeParse('validuser').success).toBe(true);
      
      // Invalid username
      const result = username.safeParse('a');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 3 characters');
      }
    });
    
    it('validates email schema correctly', () => {
      const { email } = ValidationSchemas;
      
      // Valid email
      expect(email.safeParse('user@example.com').success).toBe(true);
      
      // Invalid email
      const result = email.safeParse('invalid-email');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid email');
      }
    });
    
    it('validates price schema correctly', () => {
      const { price } = ValidationSchemas;
      
      // Valid prices
      expect(price.safeParse(19.99).success).toBe(true);
      expect(price.safeParse('19.99').success).toBe(true);
      expect(price.safeParse('19').success).toBe(true);
      
      // Invalid prices
      expect(price.safeParse(-10).success).toBe(false);
      expect(price.safeParse('abc').success).toBe(false);
    });
  });
  
  describe('validateForm function', () => {
    it('validates correct data successfully', () => {
      const schema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        age: z.number().int().positive()
      });
      
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      };
      
      const result = validateForm(schema, validData);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
      expect(result.errors).toBeUndefined();
    });
    
    it('returns validation errors for invalid data', () => {
      const schema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        age: z.number().int().positive()
      });
      
      const invalidData = {
        name: 'J', // Too short
        email: 'invalid-email',
        age: -5 // Not positive
      };
      
      const result = validateForm(schema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.errors).toBeDefined();
      
      // Check specific errors
      expect(result.errors).toHaveProperty('name');
      expect(result.errors).toHaveProperty('email');
      expect(result.errors).toHaveProperty('age');
    });
  });
  
  describe('formatZodErrors function', () => {
    it('formats Zod errors correctly', () => {
      const schema = z.object({
        name: z.string().min(2),
        email: z.string().email()
      });
      
      const result = schema.safeParse({ name: 'a', email: 'invalid' });
      
      if (!result.success) {
        const formattedErrors = formatZodErrors(result.error.format());
        
        expect(formattedErrors).toHaveProperty('name');
        expect(formattedErrors).toHaveProperty('email');
        expect(typeof formattedErrors.name).toBe('string');
        expect(typeof formattedErrors.email).toBe('string');
      } else {
        fail('Schema validation should have failed');
      }
    });
  });
  
  describe('Form schema creators', () => {
    it('creates a valid contact form schema', () => {
      const schema = createContactFormSchema();
      
      // Valid data
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message with sufficient length.'
      };
      
      expect(schema.safeParse(validData).success).toBe(true);
      
      // Invalid data
      const invalidData = {
        name: 'J', // Too short
        email: 'invalid-email',
        message: 'Short' // Too short
      };
      
      expect(schema.safeParse(invalidData).success).toBe(false);
    });
    
    it('creates a valid login form schema', () => {
      const schema = createLoginFormSchema();
      
      // Valid data
      const validData = {
        username: 'validuser',
        password: 'Password123'
      };
      
      expect(schema.safeParse(validData).success).toBe(true);
      
      // Invalid data
      const invalidData = {
        username: 'a', // Too short
        password: 'pass' // Too short, no uppercase, no number
      };
      
      expect(schema.safeParse(invalidData).success).toBe(false);
    });
    
    it('creates a valid registration schema with password confirmation', () => {
      const schema = createRegistrationFormSchema();
      
      // Valid data with matching passwords
      const validData = {
        username: 'validuser',
        email: 'user@example.com',
        password: 'Password123',
        confirmPassword: 'Password123'
      };
      
      expect(schema.safeParse(validData).success).toBe(true);
      
      // Invalid data with non-matching passwords
      const invalidData = {
        username: 'validuser',
        email: 'user@example.com',
        password: 'Password123',
        confirmPassword: 'DifferentPassword123'
      };
      
      expect(schema.safeParse(invalidData).success).toBe(false);
    });
  });
  
  describe('Validation helper functions', () => {
    it('validates emails correctly with isValidEmail', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
    });
    
    it('validates phone numbers correctly with isValidPhone', () => {
      expect(isValidPhone('(123) 456-7890')).toBe(true);
      expect(isValidPhone('123-456')).toBe(false);
    });
    
    it('validates URLs correctly with isValidUrl', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('invalid url')).toBe(false);
    });
    
    it('formats phone numbers correctly', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
      expect(formatPhoneNumber('11234567890')).toBe('+1 (123) 456-7890');
      
      // Handles already formatted numbers
      expect(formatPhoneNumber('(123) 456-7890')).toBe('(123) 456-7890');
      
      // Returns original for unrecognized formats
      expect(formatPhoneNumber('12345')).toBe('12345');
    });
  });
});