import React from 'react';
import {
  resolveBinding,
  type BindingContext,
  type ContentBinding,
} from '@envint/shared';

interface BindingValueProps {
  binding: ContentBinding;
  context: BindingContext;
}

export function formatBindingValue(value: unknown, binding: ContentBinding): string {
  if (value === null || value === undefined) return '';
  if (binding.format === 'date') {
    const date = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(date.getTime())) return String(binding.fallback ?? '');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return String(binding.fallback ?? '');
}

export function BindingValue({ binding, context }: BindingValueProps) {
  return <>{formatBindingValue(resolveBinding(binding, context), binding)}</>;
}
