/**
 * Validation utilities for Lab AI frontend
 * This module provides form and input validation helpers
 */

import { z } from "zod";

/**
 * Common validation patterns
 */
export const ValidationPatterns = {
  // Username: Alphanumeric with underscores and hyphens, 3-30 characters
  USERNAME: /^[a-zA-Z0-9_-]{3,30}$/,
  
  // Password: At least 8 characters, one uppercase, one lowercase, one number
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  
  // Email: Standard email format
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // Phone: Various formats (US-centric)
  PHONE: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
  
  // URL: Valid URL with protocol
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  
  // Postal code: US or Canadian format
  POSTAL_CODE: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$|^\d{5}(-\d{4})?$/,
  
  // Credit card number
  CREDIT_CARD: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/,
  
  // Hexadecimal color code
  HEX_COLOR: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
  
  // Date in YYYY-MM-DD format
  DATE_ISO: /^\d{4}-\d{2}-\d{2}$/,
  
  // Time in HH:MM format
  TIME_24HR: /^([01]\d|2[0-3]):([0-5]\d)$/,
  
  // Social media username
  SOCIAL_USERNAME: /^[@]?[a-zA-Z0-9_.]{1,30}$/
};

/**
 * Common Zod schema definitions for reuse in forms
 */
export const ValidationSchemas = {
  // User information
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(ValidationPatterns.USERNAME, "Username can only contain letters, numbers, underscores, and hyphens"),
  
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(ValidationPatterns.PASSWORD, "Password must include at least one uppercase letter, one lowercase letter, and one number"),
  
  email: z
    .string()
    .email("Invalid email address"),
  
  phone: z
    .string()
    .regex(ValidationPatterns.PHONE, "Invalid phone number format"),
  
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  
  // Website and company
  url: z
    .string()
    .url("Invalid URL format"),
  
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name cannot exceed 100 characters"),
  
  // Social media
  socialAccount: z
    .string()
    .regex(ValidationPatterns.SOCIAL_USERNAME, "Invalid social media username format"),
  
  // Dates and times
  date: z
    .string()
    .regex(ValidationPatterns.DATE_ISO, "Invalid date format, expected YYYY-MM-DD"),
  
  time: z
    .string()
    .regex(ValidationPatterns.TIME_24HR, "Invalid time format, expected HH:MM"),
  
  // E-commerce related
  price: z
    .number()
    .nonnegative("Price must be a positive number")
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").transform(Number)),
  
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .nonnegative("Quantity must be a positive number")
    .or(z.string().regex(/^\d+$/, "Quantity must be a whole number").transform(Number)),
  
  sku: z
    .string()
    .min(3, "SKU must be at least 3 characters")
    .max(50, "SKU cannot exceed 50 characters"),
  
  // General
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
};

/**
 * Convert Zod validation errors to a flat format
 * @param zodErrors Zod error format object
 * @returns Simplified error object with field keys and error messages
 */
export function formatZodErrors(zodErrors: z.ZodFormattedError<any>): Record<string, string> {
  const errors: Record<string, string> = {};
  
  // Process root errors
  if (zodErrors._errors && zodErrors._errors.length > 0) {
    errors._form = zodErrors._errors.join(', ');
  }
  
  // Process field errors - this approach avoids the typing issue
  for (const [key, value] of Object.entries(zodErrors)) {
    if (key !== '_errors' && typeof value === 'object' && value !== null) {
      const fieldError = (value as any)._errors?.[0];
      if (fieldError) {
        errors[key] = fieldError;
      }
    }
  }
  
  return errors;
}

/**
 * Validate form input against schema
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validation result object
 */
export function validateForm<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: boolean; data?: z.infer<T>; errors?: Record<string, string> } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: formatZodErrors(error.format())
      };
    }
    return { 
      success: false, 
      errors: { _form: 'Validation failed' } 
    };
  }
}

/**
 * Create a reusable form schema for common form patterns
 * @param additionalFields Additional schema fields to add
 * @returns A Zod schema for the form
 */
export function createUserFormSchema(additionalFields: z.ZodRawShape = {}) {
  return z.object({
    username: ValidationSchemas.username,
    email: ValidationSchemas.email,
    firstName: ValidationSchemas.name,
    lastName: ValidationSchemas.name,
    ...additionalFields
  });
}

/**
 * Create a login form schema
 * @returns A Zod schema for login forms
 */
export function createLoginFormSchema() {
  return z.object({
    username: ValidationSchemas.username,
    password: ValidationSchemas.password,
    rememberMe: z.boolean().optional()
  });
}

/**
 * Create a registration form schema
 * @returns A Zod schema for registration forms
 */
export function createRegistrationFormSchema() {
  return z.object({
    username: ValidationSchemas.username,
    email: ValidationSchemas.email,
    password: ValidationSchemas.password,
    confirmPassword: z.string()
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });
}

/**
 * Create a contact form schema
 * @returns A Zod schema for contact forms
 */
export function createContactFormSchema() {
  return z.object({
    name: ValidationSchemas.name,
    email: ValidationSchemas.email,
    phone: ValidationSchemas.phone.optional(),
    message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message is too long")
  });
}

/**
 * Create a product form schema
 * @returns A Zod schema for product forms
 */
export function createProductFormSchema() {
  return z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    sku: ValidationSchemas.sku,
    price: ValidationSchemas.price,
    quantity: ValidationSchemas.quantity,
    description: ValidationSchemas.description,
    category: z.string().optional(),
    imageUrl: z.string().url("Invalid image URL").optional()
  });
}

/**
 * Create an appointment form schema
 * @returns A Zod schema for appointment forms
 */
export function createAppointmentFormSchema() {
  return z.object({
    fullName: ValidationSchemas.name,
    email: ValidationSchemas.email,
    phone: ValidationSchemas.phone.optional(),
    appointmentDate: ValidationSchemas.date,
    appointmentTime: ValidationSchemas.time,
    projectType: z.string().min(1, "Please select a project type"),
    projectDetails: z.string().min(10, "Please provide more details about your project")
  });
}

/**
 * Validate email address
 * @param email Email address to validate
 * @returns True if email is valid
 */
export function isValidEmail(email: string): boolean {
  return ValidationSchemas.email.safeParse(email).success;
}

/**
 * Validate phone number
 * @param phone Phone number to validate
 * @returns True if phone number is valid
 */
export function isValidPhone(phone: string): boolean {
  return ValidationSchemas.phone.safeParse(phone).success;
}

/**
 * Validate URL
 * @param url URL to validate
 * @returns True if URL is valid
 */
export function isValidUrl(url: string): boolean {
  return ValidationSchemas.url.safeParse(url).success;
}

/**
 * Format phone number to standard format
 * @param phone Phone number to format
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const digits = phone.replace(/\D/g, '');
  
  // Format according to length
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  // If we can't format nicely, return the original
  return phone;
}