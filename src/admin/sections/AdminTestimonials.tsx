import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star, Quote, X, Check, Search } from 'lucide-react';
import { db } from '../../utils/db';
import type { TestimonialItem } from '../../utils/db';

const colorOptions = [
    { label: 'Cyan Blue', value: '#00c6ff', bg: '#e0f7fc' },
    { label: 'Purple Violet', value: '#7c3aed', bg: '#f3e8ff' },
    { label: 'Amber Gold', value: '#f59e0b', bg: '#fef3c7' },
    { label: 'Emerald Green', value: '#4ade80', bg: '#dcfce7' },
    { label: 'Rose Red', value: '#f43f5e', bg: '#ffe4e6' },
    { label: 'Soft Lavender', value: '#a78bfa', bg: '#ede9fe' },
];

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        rating: 5,
        text: '',
        color: '#00c6ff',
    });

    useEffect(() => {
        loadData();
        window.addEventListener('local-db-updated', loadData);
        return () => window.removeEventListener('local-db-updated', loadData);
    }, []);

    const loadData = () => {
        setTestimonials(db.getTestimonials());
    };

    const getInitials = (name: string) => {
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const handleOpenAdd = () => {
        setFormData({
            name: '',
            role: '',
            rating: 5,
            text: '',
            color: '#00c6ff',
        });
        setIsAddModalOpen(true);
    };

    const handleOpenEdit = (item: TestimonialItem) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            role: item.role,
            rating: item.rating || 5,
            text: item.text,
            color: item.color || '#00c6ff',
        });
    };

    const handleSaveNew = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.text.trim()) return;

        const newItem: TestimonialItem = {
            id: `t-${Date.now()}`,
            name: formData.name.trim(),
            role: formData.role.trim() || 'Valued Customer',
            rating: Number(formData.rating),
            text: formData.text.trim(),
            initials: getInitials(formData.name),
            color: formData.color,
        };

        const updated = [newItem, ...testimonials];
        db.saveTestimonials(updated);
        setIsAddModalOpen(false);
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem || !formData.name.trim() || !formData.text.trim()) return;

        const updated = testimonials.map((t) => {
            if (t.id === editingItem.id) {
                return {
                    ...t,
                    name: formData.name.trim(),
                    role: formData.role.trim() || 'Valued Customer',
                    rating: Number(formData.rating),
                    text: formData.text.trim(),
                    initials: getInitials(formData.name),
                    color: formData.color,
                };
            }
            return t;
        });

        db.saveTestimonials(updated);
        setEditingItem(null);
    };

    const handleDelete = (id: string) => {
        const updated = testimonials.filter((t) => t.id !== id);
        db.saveTestimonials(updated);
        setDeletingId(null);
    };

    const filteredTestimonials = testimonials.filter(
        (t) =>
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-section">
            {/* Panel Box */}
            <div className="admin-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                {/* Header */}
                <div className="admin-panel__header" style={{ padding: '1.25rem 1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h2 className="admin-panel__title" style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                            Customers Say Reviews ({testimonials.length})
                        </h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleOpenAdd}
                            style={{
                                background: '#0099ff',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.55rem 1.1rem',
                                fontSize: '0.88rem',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0, 153, 255, 0.25)',
                                transition: 'all 0.2s',
                            }}
                        >
                            <Plus size={16} strokeWidth={2.5} /> Add Customer Review
                        </button>
                    </div>
                </div>

                {/* Filter Search Bar */}
                <div style={{ padding: '0.75rem 1.75rem 1.25rem 1.75rem', borderBottom: '1px solid var(--admin-border)' }}>
                    <div className="admin-search-input" style={{ maxWidth: '380px' }}>
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search customer, area or review..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr style={{ background: 'var(--admin-surface-2)' }}>
                                <th style={{ width: '220px', paddingLeft: '1.75rem' }}>CUSTOMER</th>
                                <th style={{ width: '200px' }}>ROLE / AREA</th>
                                <th style={{ width: '140px' }}>RATING</th>
                                <th>REVIEW MESSAGE</th>
                                <th style={{ width: '180px', textAlign: 'right', paddingRight: '1.75rem' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTestimonials.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--admin-text-muted)' }}>
                                        No customer reviews found.
                                    </td>
                                </tr>
                            ) : (
                                filteredTestimonials.map((item) => {
                                    const cardColor = item.color || '#00c6ff';
                                    const initials = item.initials || getInitials(item.name);
                                    const rating = item.rating || 5;

                                    return (
                                        <tr key={item.id}>
                                            {/* CUSTOMER */}
                                            <td style={{ paddingLeft: '1.75rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                                    <div
                                                        style={{
                                                            width: '38px',
                                                            height: '38px',
                                                            borderRadius: '50%',
                                                            border: `2px solid ${cardColor}`,
                                                            background: `${cardColor}15`,
                                                            color: cardColor,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: '700',
                                                            fontSize: '0.82rem',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {initials}
                                                    </div>
                                                    <strong style={{ fontSize: '0.92rem', color: 'var(--admin-text)' }}>
                                                        {item.name}
                                                    </strong>
                                                </div>
                                            </td>

                                            {/* ROLE / AREA */}
                                            <td>
                                                <span style={{ fontSize: '0.88rem', color: 'var(--admin-text-secondary)' }}>
                                                    {item.role}
                                                </span>
                                            </td>

                                            {/* RATING */}
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <div style={{ display: 'flex', gap: '2px' }}>
                                                        {Array.from({ length: rating }).map((_, si) => (
                                                            <Star key={si} size={13} fill={cardColor} color={cardColor} />
                                                        ))}
                                                    </div>
                                                    <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>
                                                        ({rating}/5)
                                                    </span>
                                                </div>
                                            </td>

                                            {/* REVIEW MESSAGE */}
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', maxWidth: '480px' }}>
                                                    <Quote size={16} style={{ color: cardColor, flexShrink: 0, marginTop: '2px', opacity: 0.7 }} />
                                                    <span
                                                        style={{
                                                            fontSize: '0.86rem',
                                                            color: 'var(--admin-text-secondary)',
                                                            lineHeight: 1.45,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                        }}
                                                    >
                                                        {item.text}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* ACTIONS */}
                                            <td style={{ textAlign: 'right', paddingRight: '1.75rem' }}>
                                                <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button
                                                        onClick={() => handleOpenEdit(item)}
                                                        style={{
                                                            background: 'transparent',
                                                            border: '1px solid var(--admin-border)',
                                                            borderRadius: '6px',
                                                            padding: '0.35rem 0.75rem',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 600,
                                                            color: 'var(--admin-text-secondary)',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.35rem',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.15s',
                                                        }}
                                                    >
                                                        <Edit2 size={13} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingId(item.id)}
                                                        style={{
                                                            background: 'rgba(239, 68, 68, 0.08)',
                                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                                            borderRadius: '6px',
                                                            padding: '0.35rem 0.75rem',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 600,
                                                            color: '#ef4444',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.35rem',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.15s',
                                                        }}
                                                    >
                                                        <Trash2 size={13} /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit Modal */}
            {(isAddModalOpen || editingItem) && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '540px' }}>
                        <div className="admin-modal-header">
                            <h3>{editingItem ? 'Edit Customer Review' : 'Add New Customer Review'}</h3>
                            <button
                                className="admin-btn admin-btn--ghost admin-btn--sm"
                                onClick={() => {
                                    setIsAddModalOpen(false);
                                    setEditingItem(null);
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={editingItem ? handleSaveEdit : handleSaveNew}>
                            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label className="admin-form-label">Customer Profile Name *</label>
                                    <input
                                        type="text"
                                        className="admin-form-input"
                                        placeholder="e.g. Rafiqul Islam"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label className="admin-form-label">Role / Area</label>
                                        <input
                                            type="text"
                                            className="admin-form-input"
                                            placeholder="e.g. Home User, Mirpur"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="admin-form-label">Rating (1 to 5 Stars)</label>
                                        <select
                                            className="admin-form-input"
                                            value={formData.rating}
                                            onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                                        >
                                            <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                                            <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                                            <option value={3}>3 Stars ⭐⭐⭐</option>
                                            <option value={2}>2 Stars ⭐⭐</option>
                                            <option value={1}>1 Star ⭐</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="admin-form-label">Review Message *</label>
                                    <textarea
                                        className="admin-form-input"
                                        rows={4}
                                        placeholder="Write what the customer says about your service..."
                                        value={formData.text}
                                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="admin-form-label">Avatar & Star Color Theme</label>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                                        {colorOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color: opt.value })}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    padding: '0.35rem 0.65rem',
                                                    borderRadius: '6px',
                                                    border: formData.color === opt.value ? `2px solid ${opt.value}` : '1px solid var(--admin-border)',
                                                    background: formData.color === opt.value ? `${opt.value}20` : 'transparent',
                                                    color: 'var(--admin-text-main)',
                                                    cursor: 'pointer',
                                                    fontSize: '0.78rem',
                                                }}
                                            >
                                                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: opt.value }} />
                                                {opt.label}
                                                {formData.color === opt.value && <Check size={12} color={opt.value} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn--ghost"
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        setEditingItem(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn admin-btn--primary">
                                    {editingItem ? 'Save Changes' : 'Add Customer Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingId && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '400px' }}>
                        <div className="admin-modal-header">
                            <h3>Confirm Delete</h3>
                            <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setDeletingId(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="admin-modal-body">
                            <p style={{ color: 'var(--admin-text-secondary)', lineHeight: 1.5 }}>
                                Are you sure you want to delete this customer review? This action will immediately remove it from the home page.
                            </p>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn--ghost" onClick={() => setDeletingId(null)}>
                                Cancel
                            </button>
                            <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(deletingId)}>
                                Delete Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
