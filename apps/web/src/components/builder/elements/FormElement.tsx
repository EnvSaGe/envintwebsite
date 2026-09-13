'use client';

import React, { useState } from 'react';
import { BuilderNode } from '@envint/shared';

export function FormElement({ node }: { node: BuilderNode }) {
  const content = node.content || {};
  const isGbc = content.formType === 'gbc' || (content.action && content.action.includes('gbc'));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const body: Record<string, any> = Object.fromEntries(data.entries());

    // Normalize field names so API accepts both camelCase and snake_case
    if (!body.fullName && body.full_name) body.fullName = body.full_name;
    if (!body.company && body.organization) body.company = body.organization;
    if (!body.category && body.service_interest) body.category = body.service_interest;

    try {
      const endpoint = content.action || (isGbc ? '/api/forms/gbc' : '/api/forms/contact');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Submission failed. Please try again.');
      }

      setSubmitted(true);
      form.reset();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please reach out to connect@envintglobal.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        data-builder-id={node.id}
        style={{
          padding: '40px 24px',
          textAlign: 'center',
          backgroundColor: '#F7FBF9',
          borderRadius: '16px',
          border: '1px solid #C3D9CE',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✓</div>
        <h3
          style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '24px',
            color: '#004E35',
            fontWeight: 500,
            marginBottom: '8px',
          }}
        >
          Thank you for connecting with us!
        </h3>
        <p
          style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '16px',
            color: '#4B5563',
            margin: 0,
          }}
        >
          Our advisory team has received your message and will revert within 24 hours.
        </p>
      </div>
    );
  }

  if (isGbc) {
    return (
      <form
        data-builder-id={node.id}
        onSubmit={handleSubmit}
        action={content.action || '/api/forms/gbc'}
        method="POST"
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}
      >
        <div style={{ display: 'none' }} aria-hidden="true">
          <input type="text" name="website_hp" tabIndex={-1} autoComplete="off" />
        </div>

        {errorMsg && (
          <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#FEF2F2', border: '1px solid #F87171', color: '#991B1B', fontSize: '14px' }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          <div>
            <label htmlFor="gbc-fullName" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#393939', marginBottom: '6px' }}>
              Full Name *
            </label>
            <input
              type="text"
              id="gbc-fullName"
              name="fullName"
              required
              placeholder="Your name"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', backgroundColor: '#FFFFFF' }}
            />
          </div>
          <div>
            <label htmlFor="gbc-company" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#393939', marginBottom: '6px' }}>
              Organization *
            </label>
            <input
              type="text"
              id="gbc-company"
              name="company"
              required
              placeholder="Your organization"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', backgroundColor: '#FFFFFF' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          <div>
            <label htmlFor="gbc-email" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#393939', marginBottom: '6px' }}>
              Email *
            </label>
            <input
              type="email"
              id="gbc-email"
              name="email"
              required
              placeholder="you@company.com"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', backgroundColor: '#FFFFFF' }}
            />
          </div>
          <div>
            <label htmlFor="gbc-phone" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#393939', marginBottom: '6px' }}>
              Phone Number
            </label>
            <input
              type="tel"
              id="gbc-phone"
              name="phone"
              placeholder="+91 ..."
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', backgroundColor: '#FFFFFF' }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '14px',
            marginTop: '8px',
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '1rem',
            fontWeight: 500,
            backgroundColor: '#004E35',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? 'Connecting...' : 'Connect with Us'}
        </button>
      </form>
    );
  }

  return (
    <form
      data-builder-id={node.id}
      onSubmit={handleSubmit}
      action={content.action || '/api/forms/contact'}
      method="POST"
      style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%' }}
    >
      <div style={{ display: 'none' }} aria-hidden="true">
        <input type="text" name="website_hp" tabIndex={-1} autoComplete="off" />
      </div>

      {errorMsg && (
        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#FEF2F2', border: '1px solid #F87171', color: '#991B1B', fontSize: '14px' }}>
          {errorMsg}
        </div>
      )}

      {/* Row 1: Full Name & Location */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        <div>
          <label
            htmlFor={`fn_${node.id}`}
            style={{
              display: 'block',
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: '18px',
              fontWeight: 400,
              color: '#686868',
              marginBottom: '6px',
            }}
          >
            Full Name
          </label>
          <input
            type="text"
            id={`fn_${node.id}`}
            name="fullName"
            required
            style={{
              width: '100%',
              padding: '10px 0',
              border: 'none',
              borderBottom: '1px solid #cbd5e1',
              outline: 'none',
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: '16px',
              backgroundColor: 'transparent',
            }}
          />
        </div>

        <div>
          <label
            htmlFor={`loc_${node.id}`}
            style={{
              display: 'block',
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: '18px',
              fontWeight: 400,
              color: '#686868',
              marginBottom: '6px',
            }}
          >
            Location
          </label>
          <input
            type="text"
            id={`loc_${node.id}`}
            name="location"
            style={{
              width: '100%',
              padding: '10px 0',
              border: 'none',
              borderBottom: '1px solid #cbd5e1',
              outline: 'none',
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: '16px',
              backgroundColor: 'transparent',
            }}
          />
        </div>
      </div>

      {/* Row 2: Email & Phone Number */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        <div>
          <label
            htmlFor={`em_${node.id}`}
            style={{
              display: 'block',
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: '18px',
              fontWeight: 400,
              color: '#686868',
              marginBottom: '6px',
            }}
          >
            Email
          </label>
          <input
            type="email"
            id={`em_${node.id}`}
            name="email"
            required
            style={{
              width: '100%',
              padding: '10px 0',
              border: 'none',
              borderBottom: '1px solid #cbd5e1',
              outline: 'none',
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: '16px',
              backgroundColor: 'transparent',
            }}
          />
        </div>

        <div>
          <label
            htmlFor={`ph_${node.id}`}
            style={{
              display: 'block',
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: '18px',
              fontWeight: 400,
              color: '#686868',
              marginBottom: '6px',
            }}
          >
            Phone Number
          </label>
          <input
            type="tel"
            id={`ph_${node.id}`}
            name="phone"
            style={{
              width: '100%',
              padding: '10px 0',
              border: 'none',
              borderBottom: '1px solid #cbd5e1',
              outline: 'none',
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: '16px',
              backgroundColor: 'transparent',
            }}
          />
        </div>
      </div>

      {/* Row 3: Organization */}
      <div>
        <label
          htmlFor={`org_${node.id}`}
          style={{
            display: 'block',
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '18px',
            fontWeight: 400,
            color: '#686868',
            marginBottom: '6px',
          }}
        >
          Organization
        </label>
        <input
          type="text"
          id={`org_${node.id}`}
          name="company"
          style={{
            width: '100%',
            padding: '10px 0',
            border: 'none',
            borderBottom: '1px solid #cbd5e1',
            outline: 'none',
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '16px',
            backgroundColor: 'transparent',
          }}
        />
      </div>

      {/* Row 4: How we can help? */}
      <div>
        <label
          htmlFor={`cat_${node.id}`}
          style={{
            display: 'block',
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '18px',
            fontWeight: 400,
            color: '#686868',
            marginBottom: '6px',
          }}
        >
          How we can help?
        </label>
        <select
          id={`cat_${node.id}`}
          name="category"
          defaultValue=""
          style={{
            width: '100%',
            padding: '10px 0',
            border: 'none',
            borderBottom: '1px solid #cbd5e1',
            outline: 'none',
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '16px',
            backgroundColor: 'transparent',
            color: '#393939',
          }}
        >
          <option value="" disabled>—Please choose an option—</option>
          <option value="Services">Services</option>
          <option value="Jobs">Jobs</option>
          <option value="Feedback">Feedback</option>
          <option value="Others">Others</option>
        </select>
      </div>

      {/* Row 5: Message */}
      <div>
        <label
          htmlFor={`msg_${node.id}`}
          style={{
            display: 'block',
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '18px',
            fontWeight: 400,
            color: '#686868',
            marginBottom: '6px',
          }}
        >
          Message
        </label>
        <textarea
          id={`msg_${node.id}`}
          name="message"
          rows={3}
          required
          style={{
            width: '100%',
            padding: '10px 0',
            border: 'none',
            borderBottom: '1px solid #cbd5e1',
            outline: 'none',
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '16px',
            resize: 'vertical',
            backgroundColor: 'transparent',
          }}
        />
      </div>

      {/* Row 6: Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '16px',
          marginTop: '10px',
          fontFamily: '"Neue Montreal", sans-serif',
          fontSize: '18px',
          fontWeight: 500,
          backgroundColor: '#004E35',
          color: '#ffffff',
          border: 'none',
          borderRadius: '9999px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 15px rgba(0,78,53,0.2)',
          opacity: isSubmitting ? 0.7 : 1,
          transition: 'background-color 0.2s ease',
        }}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
