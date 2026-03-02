import { useState, useCallback } from 'react';

/**
 * Lightweight form validation hook for admin forms.
 *
 * Usage:
 *   const { errors, validate, clearError, clearErrors } = useFormValidation();
 *
 *   // Define rules per form:
 *   const rules = {
 *     name:  v => !v?.trim() && 'Name is required',
 *     email: v => {
 *       if (!v?.trim()) return 'Email is required';
 *       if (!/\S+@\S+\.\S+/.test(v)) return 'Enter a valid email';
 *     },
 *     country: v => !v && 'Please select a country',
 *   };
 *
 *   const onSubmit = (e) => {
 *     e.preventDefault();
 *     if (!validate(form, rules)) return;
 *     crud.handleSubmit(form);
 *   };
 *
 *   <Input label="Name" error={errors.name} ... />
 */
export default function useFormValidation() {
  const [errors, setErrors] = useState({});

  /** Validate form data against rules. Returns true if valid. */
  const validate = useCallback((data, rules) => {
    const newErrors = {};
    for (const [field, rule] of Object.entries(rules)) {
      const msg = rule(data[field], data);
      if (msg) newErrors[field] = msg;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  /** Clear a single field error (call onChange to remove error as user types). */
  const clearError = useCallback((field) => {
    setErrors(prev => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  /** Clear all errors (e.g. when modal closes). */
  const clearErrors = useCallback(() => setErrors({}), []);

  return { errors, validate, clearError, clearErrors };
}
