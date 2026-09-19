'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Image as ImageIcon, Search, Copy, Check, ExternalLink, Upload, Loader2, Trash2, X } from 'lucide-react';
import { fetchMediaAssets, updateMediaAltText, deleteMediaAsset, MediaItem } from './actions';

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAlt, setEditAlt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setAssets(await fetchMediaAssets());
    } catch {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);
    try {
      for (const file of Array.from(files)) {
        const presignRes = await fetch('/api/media/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
        });
        const presign = await presignRes.json();
        if (!presignRes.ok) throw new Error(presign.error || 'Presign failed');

        const putRes = await fetch(presign.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        if (!putRes.ok) throw new Error(`Upload failed for ${file.name}`);
      }
      await load();
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const saveAlt = async (id: string) => {
    await updateMediaAltText(id, editAlt);
    setEditingId(null);
    await load();
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.filename}" from the media library?`)) return;
    await deleteMediaAsset(item.id);
    await load();
  };

  const filtered = assets.filter(
    (a) =>
      a.filename.toLowerCase().includes(search.toLowerCase()) ||
      (a.altText || '').toLowerCase().includes(search.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar currentPath="/media" />

      <main style={{ flex: 1, padding: '40px 48px', maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', margin: 0 }}>
              Media Library & Assets
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '6px' }}>
              Upload images to S3 and manage alt text. Assets here are selectable in the Page Builder.
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              backgroundColor: '#3079bd',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow: '0 2px 8px rgba(48, 121, 189, 0.25)',
              cursor: uploading ? 'wait' : 'pointer',
              border: 'none',
            }}
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            <span>{uploading ? 'Uploading...' : 'Upload Images'}</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => {
            handleUpload(e.target.files);
            e.target.value = '';
          }}
        />

        {uploadError && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
            {uploadError}
          </div>
        )}

        {/* Search */}
        <div style={{ position: 'relative', width: '320px', marginBottom: '24px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search images by name or alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 38px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.88rem',
              backgroundColor: '#ffffff',
            }}
          />
        </div>

        {/* Assets Grid */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading media library...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            No uploaded assets yet. Click "Upload Images" to add your first asset.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {filtered.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ height: '150px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                  <img
                    src={item.url}
                    alt={item.altText || item.filename}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e: any) => {
                      e.target.style.opacity = '0.15';
                    }}
                  />
                </div>

                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a', wordBreak: 'break-word' }}>
                    {item.filename}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {formatSize(item.fileSizeBytes)} {formatSize(item.fileSizeBytes) && '• '}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>

                  {/* Alt text */}
                  {editingId === item.id ? (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        value={editAlt}
                        onChange={(e) => setEditAlt(e.target.value)}
                        placeholder="Alt text for accessibility & SEO"
                        style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                        autoFocus
                      />
                      <button onClick={() => saveAlt(item.id)} style={{ padding: '6px 8px', backgroundColor: '#3079bd', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        <Check size={14} />
                      </button>
                      <button onClick={() => setEditingId(null)} style={{ padding: '6px 8px', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditAlt(item.altText || '');
                      }}
                      style={{
                        textAlign: 'left',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#f8fafc',
                        border: '1px dashed #cbd5e1',
                        color: item.altText ? '#334155' : '#94a3b8',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                      }}
                    >
                      {item.altText ? `Alt: ${item.altText}` : '+ Add alt text'}
                    </button>
                  )}

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => copyUrl(item)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '6px',
                        borderRadius: '6px',
                        backgroundColor: copiedId === item.id ? '#ecfdf5' : '#f1f5f9',
                        color: copiedId === item.id ? '#047857' : '#334155',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                      }}
                    >
                      {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedId === item.id ? 'Copied!' : 'Copy URL'}</span>
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#f1f5f9',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <ExternalLink size={14} />
                    </a>

                    <button
                      onClick={() => handleDelete(item)}
                      title="Delete asset"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#fef2f2',
                        color: '#ef4444',
                        border: '1px solid #fecaca',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
