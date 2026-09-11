import { z } from 'zod';

export const ContentStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
export type ContentStatus = z.infer<typeof ContentStatusEnum>;

export const ContentFormatEnum = z.enum(['HTML', 'BLOCKS']);
export type ContentFormat = z.infer<typeof ContentFormatEnum>;

export const AdminRoleEnum = z.enum(['SUPER_ADMIN', 'EDITOR']);
export type AdminRole = z.infer<typeof AdminRoleEnum>;

export const ContactFormSchema = z.object({
  fullName: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').max(150, 'Email is too long'),
  phone: z.string().max(30, 'Phone is too long').optional().default(''),
  company: z.string().max(100, 'Company name is too long').optional().default(''),
  location: z.string().max(100, 'Location is too long').optional().default(''),
  category: z.enum(['Services', 'Jobs', 'Feedback', 'Others']).default('Services'),
  message: z.string().min(1, 'Message is required').max(2000, 'Message exceeds 2000 characters'),
  website_hp: z.string().max(0, 'Spam detected').optional().default(''),
});
export type ContactFormInput = z.infer<typeof ContactFormSchema>;

export const NewsletterFormSchema = z.object({
  email: z.string().email('Invalid email address').max(150, 'Email is too long'),
  website_hp: z.string().max(0, 'Spam detected').optional().default(''),
});
export type NewsletterFormInput = z.infer<typeof NewsletterFormSchema>;

export const GbcFormSchema = z.object({
  fullName: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').max(150, 'Email is too long'),
  company: z.string().max(100, 'Company name is too long').optional().default(''),
  phone: z.string().max(30, 'Phone is too long').optional().default(''),
  website_hp: z.string().max(0, 'Spam detected').optional().default(''),
});
export type GbcFormInput = z.infer<typeof GbcFormSchema>;

export const RevalidationPayloadSchema = z.object({
  tags: z.array(z.string()).default([]),
  paths: z.array(z.string()).default([]),
  nonce: z.string().min(8).max(64).optional(),
});
export type RevalidationPayload = z.infer<typeof RevalidationPayloadSchema>;

export const PreviewTokenPayloadSchema = z.object({
  slug: z.string(),
  contentType: z.string(),
  aud: z.literal('envint-web'),
  exp: z.number(),
  nonce: z.string(),
});
export type PreviewTokenPayload = z.infer<typeof PreviewTokenPayloadSchema>;
