'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar } from '@/components/Sidebar';
import {
  getLeadSubmissions,
  toggleLeadProcessed,
  deleteLeadSubmission,
  type LeadSubmissionItem,
} from './actions';
import {
  Inbox,
  Mail,
  Search,
  RefreshCw,
  Download,
  CheckCircle2,
  Clock,
  Trash2,
  Building2,
  MapPin,
  Phone,
  Tag,
  X,
  ExternalLink,
  AlertCircle,
  Users,
  MessageSquare,
} from 'lucide-react';

type FilterTab = 'ALL' | 'CONTACT' | 'NEWSLETTER_ESQ' | 'EVENT_GBC' | 'PENDING';

const FORM_TYPE_META: Record<string, { label: string; bg: string; color: string; border: string }> = {
  CONTACT: { label: 'Contact Inquiry', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  NEWSLETTER_ESQ: { label: 'Newsletter', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  EVENT_GBC: { label: 'GBC Event', bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff' },
};

function getFormMeta(formType: string) {
  return (
    FORM_TYPE_META[formType] || {
      label: formType,
      bg: '#f1f5f9',
      color: '#475569',
      border: '#cbd5e1',
    }
  );
}

function escapeCsvCell(value: string | null | undefined): string {
  const raw = String(value ?? '');
  // Prevent CSV formula injection in Excel/Sheets
  const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}

function formatDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadSubmissionItem[]>([]);
  const [userRole, setUserRole] = useState<'super_admin' | 'editor'>('editor');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<LeadSubmissionItem | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getLeadSubmissions();
    if (res.success) {
      setLeads(res.leads);
      if (res.role) setUserRole(res.role);
    } else {
      setError(res.error || 'Could not load leads.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const counts = useMemo(() => {
    let contact = 0;
    let newsletter = 0;
    let gbc = 0;
    let pending = 0;
    for (const lead of leads) {
      if (lead.formType === 'CONTACT') contact++;
      else if (lead.formType === 'NEWSLETTER_ESQ') newsletter++;
      else if (lead.formType === 'EVENT_GBC') gbc++;
      if (!lead.isProcessed) pending++;
    }
    return { total: leads.length, contact, newsletter, gbc, pending };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return leads.filter((lead) => {
      if (activeTab === 'PENDING' && lead.isProcessed) return false;
      if (activeTab !== 'ALL' && activeTab !== 'PENDING' && lead.formType !== activeTab) {
        return false;
      }
      if (!q) return true;
      return (
        (lead.fullName || '').toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        (lead.company || '').toLowerCase().includes(q) ||
        (lead.category || '').toLowerCase().includes(q) ||
        (lead.location || '').toLowerCase().includes(q) ||
        (lead.message || '').toLowerCase().includes(q)
      );
    });
  }, [leads, activeTab, searchQuery]);

  const handleToggleProcessed = async (lead: LeadSubmissionItem) => {
    setBusyId(lead.id);
    const nextState = !lead.isProcessed;
    const res = await toggleLeadProcessed(lead.id, nextState);
    if (res.success) {
      setLeads((prev) =>
        prev.map((item) => (item.id === lead.id ? { ...item, isProcessed: nextState } : item)),
      );
      setSelectedLead((prev) =>
        prev && prev.id === lead.id ? { ...prev, isProcessed: nextState } : prev,
      );
    } else if (res.error) {
      setError(res.error);
    }
    setBusyId(null);
  };

  const handleDelete = async (lead: LeadSubmissionItem) => {
    if (!window.confirm(`Delete submission from ${lead.email}? This cannot be undone.`)) {
      return;
    }
    setBusyId(lead.id);
    const res = await deleteLeadSubmission(lead.id);
    if (res.success) {
      setLeads((prev) => prev.filter((item) => item.id !== lead.id));
      if (selectedLead?.id === lead.id) setSelectedLead(null);
    } else if (res.error) {
      setError(res.error);
    }
    setBusyId(null);
  };

  const handleExportCsv = () => {
    const headers = [
      'Date',
      'Status',
      'Form Type',
      'Full Name',
      'Email',
      'Phone',
      'Company',
      'Location',
      'Category',
      'Message',
    ];
    const rows = filteredLeads.map((l) => [
      escapeCsvCell(l.createdAt),
      escapeCsvCell(l.isProcessed ? 'Handled' : 'Pending'),
      escapeCsvCell(getFormMeta(l.formType).label),
      escapeCsvCell(l.fullName),
      escapeCsvCell(l.email),
      escapeCsvCell(l.phone),
      escapeCsvCell(l.company),
      escapeCsvCell(l.location),
      escapeCsvCell(l.category),
      escapeCsvCell(l.message),
    ]);
    const csv = [headers.map(escapeCsvCell).join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `envint-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const buildMailtoHref = (lead: LeadSubmissionItem) => {
    const subject = encodeURIComponent(
      `Re: ${lead.category ? `${lead.category} — ` : ''}Your Inquiry with Envint`,
    );
    const greeting = lead.fullName ? `Hi ${lead.fullName},\n\n` : 'Hello,\n\n';
    const body = encodeURIComponent(
      `${greeting}Thank you for reaching out to Envint.\n\nBest regards,\nEnvint Team`,
    );
    return `mailto:${encodeURIComponent(lead.email)}?subject=${subject}&body=${body}`;
  };

  const tabs: Array<{ id: FilterTab; label: string; count: number }> = [
    { id: 'ALL', label: 'All Submissions', count: counts.total },
    { id: 'CONTACT', label: 'Contact (/connect)', count: counts.contact },
    { id: 'NEWSLETTER_ESQ', label: 'Newsletter', count: counts.newsletter },
    { id: 'EVENT_GBC', label: 'GBC Event', count: counts.gbc },
    { id: 'PENDING', label: 'Pending Review', count: counts.pending },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar currentPath="/leads" />

      <main style={{ flex: 1, padding: '36px 44px', maxWidth: '1320px', minWidth: 0 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#0f172a',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Inbox size={26} color="#3079bd" />
              <span>Leads &amp; Inquiries</span>
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.92rem', margin: '4px 0 0' }}>
              Review contact form submissions from <code>/connect/</code>, newsletter signups, and event inquiries.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={fetchLeads}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: loading ? 'wait' : 'pointer',
              }}
            >
              <RefreshCw size={15} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={filteredLeads.length === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#004E35',
                color: '#ffffff',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: filteredLeads.length === 0 ? 'not-allowed' : 'pointer',
                opacity: filteredLeads.length === 0 ? 0.6 : 1,
              }}
            >
              <Download size={15} />
              <span>Export CSV ({filteredLeads.length})</span>
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '0.88rem',
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Summary KPI Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {[
            { label: 'Total Submissions', value: counts.total, icon: Inbox, color: '#3079bd' },
            { label: 'Pending Review', value: counts.pending, icon: Clock, color: '#d97706' },
            { label: 'Contact Inquiries', value: counts.contact, icon: MessageSquare, color: '#004E35' },
            { label: 'Newsletter Signups', value: counts.newsletter, icon: Users, color: '#45b653' },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                    {card.label}
                  </div>
                  <div
                    style={{
                      fontSize: '1.65rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginTop: '4px',
                    }}
                  >
                    {loading ? '—' : card.value}
                  </div>
                </div>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: `${card.color}15`,
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={20} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter Bar + Search */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {tabs.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      border: active ? '1px solid #3079bd' : '1px solid #e2e8f0',
                      backgroundColor: active ? '#eff6ff' : '#ffffff',
                      color: active ? '#1d4ed8' : '#475569',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{tab.label}</span>
                    <span
                      style={{
                        backgroundColor: active ? '#dbeafe' : '#f1f5f9',
                        color: active ? '#1e40af' : '#64748b',
                        padding: '1px 7px',
                        borderRadius: '999px',
                        fontSize: '0.74rem',
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={{ position: 'relative', minWidth: '250px', flex: '0 1 300px' }}>
              <Search
                size={15}
                color="#94a3b8"
                style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, company, message..."
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 34px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#64748b', fontSize: '0.92rem' }}>
              Loading lead submissions...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#64748b', fontSize: '0.92rem' }}>
              No submissions match the current filter.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Type</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Contact</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Organization &amp; Topic</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Message</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Received</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => {
                    const meta = getFormMeta(lead.formType);
                    const isBusy = busyId === lead.id;
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: lead.isProcessed ? '#ffffff' : '#fffdf5',
                          cursor: 'pointer',
                        }}
                      >
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '3px 9px',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              backgroundColor: lead.isProcessed ? '#f0fdf4' : '#fef3c7',
                              color: lead.isProcessed ? '#15803d' : '#b45309',
                              border: `1px solid ${lead.isProcessed ? '#bbf7d0' : '#fde68a'}`,
                            }}
                          >
                            {lead.isProcessed ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                            {lead.isProcessed ? 'Handled' : 'Pending'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 9px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              backgroundColor: meta.bg,
                              color: meta.color,
                              border: `1px solid ${meta.border}`,
                            }}
                          >
                            {meta.label}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>
                            {lead.fullName || '—'}
                          </div>
                          <div style={{ color: '#3079bd', fontSize: '0.8rem', marginTop: '2px' }}>
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div style={{ color: '#64748b', fontSize: '0.76rem', marginTop: '2px' }}>
                              {lead.phone}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ color: '#1e293b', fontWeight: 500 }}>
                            {lead.company || '—'}
                          </div>
                          {lead.category && (
                            <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '2px' }}>
                              {lead.category}
                            </div>
                          )}
                        </td>
                        <td
                          style={{
                            padding: '12px 16px',
                            maxWidth: '280px',
                            color: '#475569',
                          }}
                        >
                          <div
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {lead.message || '—'}
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', color: '#64748b', fontSize: '0.8rem' }}>
                          {formatDateTime(lead.createdAt)}
                        </td>
                        <td
                          style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <a
                              href={buildMailtoHref(lead)}
                              title="Reply via Email"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '30px',
                                height: '30px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                color: '#3079bd',
                              }}
                            >
                              <Mail size={14} />
                            </a>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleToggleProcessed(lead)}
                              title={lead.isProcessed ? 'Mark as Pending' : 'Mark as Handled'}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '30px',
                                height: '30px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: lead.isProcessed ? '#f0fdf4' : '#ffffff',
                                color: lead.isProcessed ? '#15803d' : '#64748b',
                                cursor: isBusy ? 'wait' : 'pointer',
                              }}
                            >
                              <CheckCircle2 size={14} />
                            </button>
                            {userRole === 'super_admin' && (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleDelete(lead)}
                                title="Delete Submission"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '6px',
                                  border: '1px solid #fecaca',
                                  backgroundColor: '#fff5f5',
                                  color: '#dc2626',
                                  cursor: isBusy ? 'wait' : 'pointer',
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedLead && (
        <div
          onClick={() => setSelectedLead(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                padding: '18px 22px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                  {selectedLead.fullName || selectedLead.email}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                  {getFormMeta(selectedLead.formType).label} • {formatDateTime(selectedLead.createdAt)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  fontSize: '0.86rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                  <Mail size={15} color="#3079bd" />
                  <a href={buildMailtoHref(selectedLead)} style={{ color: '#3079bd', fontWeight: 600 }}>
                    {selectedLead.email}
                  </a>
                </div>
                {selectedLead.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                    <Phone size={15} color="#64748b" />
                    <span>{selectedLead.phone}</span>
                  </div>
                )}
                {selectedLead.company && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                    <Building2 size={15} color="#64748b" />
                    <span>{selectedLead.company}</span>
                  </div>
                )}
                {selectedLead.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                    <MapPin size={15} color="#64748b" />
                    <span>{selectedLead.location}</span>
                  </div>
                )}
                {selectedLead.category && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                    <Tag size={15} color="#64748b" />
                    <span>{selectedLead.category}</span>
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                  Message
                </div>
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '14px',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    color: '#1e293b',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {selectedLead.message || 'No message provided.'}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '8px',
                  borderTop: '1px solid #e2e8f0',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  type="button"
                  disabled={busyId === selectedLead.id}
                  onClick={() => handleToggleProcessed(selectedLead)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: selectedLead.isProcessed ? '#f0fdf4' : '#ffffff',
                    color: selectedLead.isProcessed ? '#15803d' : '#334155',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <CheckCircle2 size={15} />
                  <span>{selectedLead.isProcessed ? 'Marked as Handled (Reopen)' : 'Mark as Handled'}</span>
                </button>

                <a
                  href={buildMailtoHref(selectedLead)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#3079bd',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <Mail size={15} />
                  <span>Reply via Email</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
