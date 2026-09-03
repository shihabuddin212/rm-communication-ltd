import { useState } from 'react';
import {
    Mail, Phone, User, Calendar, Tag, Trash2,
    CheckCheck, MessageSquare, X, ChevronDown, ChevronUp,
    Search, Filter, StickyNote, Save, RotateCcw, Plus, Pencil, Send
} from 'lucide-react';
import { useDataStore } from '../../hooks/useDataStore';
import type { MessageItem } from '../../utils/db';

const subjectLabels: Record<string, string> = {
    'new-connection': 'New Connection',
    'services-solutions': 'Service & Solutions',
    'technical-support': 'Technical Support',
    'billing': 'Billing Query',
    'corporate': 'Corporate Package',
    'newsletter': 'Newsletter Subscription',
    'other': 'Other',
};

const statusConfig: Record<MessageItem['status'], { label: string; color: string; bg: string }> = {
    unread: { label: 'Unread', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
    read: { label: 'Read', color: 'var(--admin-text-muted)', bg: 'rgba(148,163,184,0.1)' },
    replied: { label: 'Replied', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
    resolved: { label: 'Resolved', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
};

const emptyForm = () => ({
    name: '',
    email: '',
    phone: '',
    subject: 'new-connection',
    message: '',
    status: 'unread' as MessageItem['status'],
    notes: '',
});

export default function AdminMessages() {
    const { messages, updateMessages } = useDataStore();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<MessageItem['status'] | 'all'>('all');
    const [filterSubject, setFilterSubject] = useState<string>('all');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Modal state for Add/Edit
    const [modalOpen, setModalOpen] = useState(false);
    const [editingMsg, setEditingMsg] = useState<MessageItem | null>(null);
    const [form, setForm] = useState(emptyForm());

    // Inline Notes state
    const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
    const [noteDraft, setNoteDraft] = useState('');

    // Filter messages
    const filtered = messages.filter(msg => {
        const matchesSearch =
            msg.name.toLowerCase().includes(search.toLowerCase()) ||
            msg.email.toLowerCase().includes(search.toLowerCase()) ||
            msg.message.toLowerCase().includes(search.toLowerCase()) ||
            msg.subject.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'all' || msg.status === filterStatus;
        const matchesSubject = filterSubject === 'all' ||
            (filterSubject === 'newsletter' ? msg.subject === 'newsletter' : msg.subject !== 'newsletter');
        return matchesSearch && matchesStatus && matchesSubject;
    });

    const unreadCount = messages.filter(m => m.status === 'unread').length;
    const newsletterCount = messages.filter(m => m.subject === 'newsletter').length;

    const updateStatus = (id: string, status: MessageItem['status']) => {
        const updated = messages.map(m => m.id === id ? { ...m, status } : m);
        updateMessages(updated);
    };

    const saveInlineNotes = (id: string) => {
        const updated = messages.map(m => m.id === id ? { ...m, notes: noteDraft } : m);
        updateMessages(updated);
        setEditingNotesId(null);
    };

    const deleteMessage = (id: string) => {
        const updated = messages.filter(m => m.id !== id);
        updateMessages(updated);
        if (expandedId === id) setExpandedId(null);
        setDeleteConfirm(null);
    };

    const toggleExpand = (id: string, msg: MessageItem) => {
        if (expandedId === id) {
            setExpandedId(null);
            setEditingNotesId(null);
        } else {
            setExpandedId(id);
            // Auto-mark as read on open if unread
            if (msg.status === 'unread') updateStatus(id, 'read');
        }
    };

    const markAllRead = () => {
        const updated = messages.map(m => m.status === 'unread' ? { ...m, status: 'read' as const } : m);
        updateMessages(updated);
    };

    // Modal Action Handlers
    const openAddModal = () => {
        setEditingMsg(null);
        setForm(emptyForm());
        setModalOpen(true);
    };

    const openEditModal = (msg: MessageItem, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setEditingMsg(msg);
        setForm({
            name: msg.name,
            email: msg.email,
            phone: msg.phone || '',
            subject: msg.subject || 'new-connection',
            message: msg.message,
            status: msg.status,
            notes: msg.notes || '',
        });
        setModalOpen(true);
    };

    const handleSaveForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

        let updated: MessageItem[];
        if (editingMsg) {
            updated = messages.map(m => m.id === editingMsg.id ? {
                ...m,
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                subject: form.subject,
                message: form.message.trim(),
                status: form.status,
                notes: form.notes.trim() || undefined,
            } : m);
        } else {
            const newMsg: MessageItem = {
                id: `msg-${Date.now()}`,
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim() || '—',
                subject: form.subject,
                message: form.message.trim(),
                date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                status: form.status,
                notes: form.notes.trim() || undefined,
            };
            updated = [newMsg, ...messages];
        }

        updateMessages(updated);
        setModalOpen(false);
        setEditingMsg(null);
        setForm(emptyForm());
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--admin-text-primary)', marginBottom: '0.25rem' }}>
                        Messages &amp; Newsletter Subscriptions
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span>{messages.length} total messages</span>
                        {unreadCount > 0 && (
                            <span style={{ background: 'rgba(251,191,36,0.18)', color: '#fbbf24', padding: '0.1rem 0.5rem', borderRadius: '99px', fontWeight: 700, fontSize: '0.78rem' }}>
                                {unreadCount} unread
                            </span>
                        )}
                        {newsletterCount > 0 && (
                            <span style={{ background: 'rgba(167,139,250,0.18)', color: '#c084fc', padding: '0.1rem 0.5rem', borderRadius: '99px', fontWeight: 700, fontSize: '0.78rem' }}>
                                {newsletterCount} newsletter emails
                            </span>
                        )}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {unreadCount > 0 && (
                        <button
                            className="admin-btn admin-btn--ghost admin-btn--sm"
                            onClick={markAllRead}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                            <CheckCheck size={14} /> Mark All Read
                        </button>
                    )}
                    <button
                        className="admin-btn admin-btn--primary admin-btn--sm"
                        onClick={openAddModal}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                        <Plus size={14} /> Add Message
                    </button>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search by name, email, subject or message content..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.25rem',
                            background: 'var(--admin-bg-card)', border: '1px solid var(--admin-border)',
                            borderRadius: '8px', color: 'var(--admin-text-primary)', fontSize: '0.875rem',
                        }}
                    />
                </div>

                {/* Category Filter */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Tag size={14} style={{ color: 'var(--admin-text-muted)' }} />
                    <select
                        value={filterSubject}
                        onChange={e => setFilterSubject(e.target.value)}
                        style={{
                            padding: '0.55rem 0.75rem', background: 'var(--admin-bg-card)',
                            border: '1px solid var(--admin-border)', borderRadius: '8px',
                            color: 'var(--admin-text-primary)', fontSize: '0.875rem', cursor: 'pointer',
                        }}
                    >
                        <option value="all">All Categories</option>
                        <option value="contact">Contact Messages</option>
                        <option value="newsletter">Newsletter Emails</option>
                    </select>
                </div>

                {/* Status Filter */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Filter size={14} style={{ color: 'var(--admin-text-muted)' }} />
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value as MessageItem['status'] | 'all')}
                        style={{
                            padding: '0.55rem 0.75rem', background: 'var(--admin-bg-card)',
                            border: '1px solid var(--admin-border)', borderRadius: '8px',
                            color: 'var(--admin-text-primary)', fontSize: '0.875rem', cursor: 'pointer',
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
            </div>

            {/* Message List */}
            {filtered.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '3rem', background: 'var(--admin-bg-card)',
                    border: '1px solid var(--admin-border)', borderRadius: '12px',
                    color: 'var(--admin-text-muted)'
                }}>
                    <MessageSquare size={32} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
                    <p style={{ fontWeight: 600 }}>No messages found</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Try adjusting your search or filter options</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filtered.map(msg => {
                        const isExpanded = expandedId === msg.id;
                        const sc = statusConfig[msg.status];
                        const isNewsletter = msg.subject === 'newsletter';

                        return (
                            <div
                                key={msg.id}
                                style={{
                                    background: 'var(--admin-bg-card)', border: '1px solid var(--admin-border)',
                                    borderRadius: '12px', overflow: 'hidden',
                                    borderLeft: isNewsletter
                                        ? '3px solid #c084fc'
                                        : msg.status === 'unread' ? '3px solid #fbbf24' : '3px solid transparent',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {/* Message Row Header */}
                                <div
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                        padding: '1rem 1.25rem', cursor: 'pointer',
                                        flexWrap: 'wrap'
                                    }}
                                    onClick={() => toggleExpand(msg.id, msg)}
                                >
                                    {/* Avatar */}
                                    <div style={{
                                        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                                        background: isNewsletter
                                            ? 'linear-gradient(135deg, #a78bfa, #c084fc)'
                                            : 'linear-gradient(135deg, var(--admin-accent), #7c3aed)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#fff', fontWeight: 700, fontSize: '0.9rem'
                                    }}>
                                        {isNewsletter ? <Send size={16} /> : msg.name.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontWeight: msg.status === 'unread' ? 700 : 600, color: 'var(--admin-text-primary)', fontSize: '0.9rem' }}>
                                                {msg.name}
                                            </span>
                                            <span style={{
                                                fontSize: '0.72rem', fontWeight: 600, padding: '0.1rem 0.5rem',
                                                borderRadius: '99px', color: sc.color, background: sc.bg,
                                                border: `1px solid ${sc.color}33`
                                            }}>
                                                {sc.label}
                                            </span>
                                            <span style={{
                                                fontSize: '0.72rem', fontWeight: 600, padding: '0.1rem 0.5rem',
                                                borderRadius: '99px',
                                                color: isNewsletter ? '#c084fc' : 'var(--admin-accent)',
                                                background: isNewsletter ? 'rgba(192,132,252,0.1)' : 'rgba(0,198,255,0.08)',
                                                border: isNewsletter ? '1px solid rgba(192,132,252,0.3)' : '1px solid rgba(0,198,255,0.2)'
                                            }}>
                                                {subjectLabels[msg.subject] || msg.subject}
                                            </span>
                                        </div>
                                        <p style={{
                                            fontSize: '0.82rem', color: 'var(--admin-text-muted)',
                                            marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap', maxWidth: '500px'
                                        }}>
                                            {msg.message}
                                        </p>
                                    </div>

                                    {/* Date & Toggle */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                                        <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                                            {msg.date}
                                        </span>
                                        {isExpanded ? <ChevronUp size={16} style={{ color: 'var(--admin-text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--admin-text-muted)' }} />}
                                    </div>
                                </div>

                                {/* Expanded Detail Panel */}
                                {isExpanded && (
                                    <div style={{
                                        borderTop: '1px solid var(--admin-border)',
                                        padding: '1.25rem',
                                        background: 'rgba(0,0,0,0.04)',
                                        display: 'flex', flexDirection: 'column', gap: '1.25rem'
                                    }}>
                                        {/* Contact Details Grid */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                                            {[
                                                { icon: User, label: 'Sender', value: msg.name },
                                                { icon: Mail, label: 'Email', value: msg.email },
                                                { icon: Phone, label: 'Phone', value: msg.phone || '—' },
                                                { icon: Calendar, label: 'Received Date', value: msg.date },
                                                { icon: Tag, label: 'Subject Category', value: subjectLabels[msg.subject] || msg.subject },
                                            ].map(({ icon: Icon, label, value }) => (
                                                <div key={label} style={{
                                                    background: 'var(--admin-bg-card)', borderRadius: '8px',
                                                    padding: '0.6rem 0.85rem', border: '1px solid var(--admin-border)'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--admin-text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                                                        <Icon size={12} /> {label}
                                                    </div>
                                                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--admin-text-primary)', wordBreak: 'break-word' }}>{value}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Full Message */}
                                        <div style={{
                                            background: 'var(--admin-bg-card)', borderRadius: '8px',
                                            padding: '1rem', border: '1px solid var(--admin-border)'
                                        }}>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <MessageSquare size={12} /> Message Content
                                            </p>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--admin-text-primary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                                {msg.message}
                                            </p>
                                        </div>

                                        {/* Admin Notes */}
                                        <div style={{
                                            background: 'var(--admin-bg-card)', borderRadius: '8px',
                                            padding: '1rem', border: '1px solid var(--admin-border)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                    <StickyNote size={12} /> Private Admin Notes
                                                </p>
                                                {editingNotesId !== msg.id && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setEditingNotesId(msg.id); setNoteDraft(msg.notes || ''); }}
                                                        style={{ fontSize: '0.75rem', color: 'var(--admin-accent)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                                    >
                                                        ✏️ Edit Note
                                                    </button>
                                                )}
                                            </div>
                                            {editingNotesId === msg.id ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    <textarea
                                                        value={noteDraft}
                                                        onChange={e => setNoteDraft(e.target.value)}
                                                        rows={3}
                                                        placeholder="Write your private admin notes here..."
                                                        onClick={e => e.stopPropagation()}
                                                        style={{
                                                            width: '100%', padding: '0.6rem 0.75rem', resize: 'vertical',
                                                            background: 'var(--admin-bg)', border: '1px solid var(--admin-border)',
                                                            borderRadius: '6px', color: 'var(--admin-text-primary)', fontSize: '0.875rem',
                                                        }}
                                                    />
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); saveInlineNotes(msg.id); }}
                                                            className="admin-btn admin-btn--primary admin-btn--sm"
                                                            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                                                        >
                                                            <Save size={13} /> Save Note
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setEditingNotesId(null); }}
                                                            className="admin-btn admin-btn--ghost admin-btn--sm"
                                                            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                                                        >
                                                            <X size={13} /> Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p style={{ fontSize: '0.875rem', color: msg.notes ? 'var(--admin-text-primary)' : 'var(--admin-text-muted)', fontStyle: msg.notes ? 'normal' : 'italic' }}>
                                                    {msg.notes || 'No notes added. Click Edit Note to add private records.'}
                                                </p>
                                            )}
                                        </div>

                                        {/* Action Bar (Status toggle, Edit modal trigger, Reply, Delete) */}
                                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginRight: '0.25rem' }}>Set Status:</span>
                                            {(['unread', 'read', 'replied', 'resolved'] as const).map(s => {
                                                const cfg = statusConfig[s];
                                                return (
                                                    <button
                                                        key={s}
                                                        onClick={() => updateStatus(msg.id, s)}
                                                        style={{
                                                            padding: '0.3rem 0.75rem', borderRadius: '99px', cursor: 'pointer',
                                                            fontSize: '0.78rem', fontWeight: 600,
                                                            border: msg.status === s ? `1.5px solid ${cfg.color}` : '1px solid var(--admin-border)',
                                                            background: msg.status === s ? cfg.bg : 'transparent',
                                                            color: msg.status === s ? cfg.color : 'var(--admin-text-muted)',
                                                            transition: 'all 0.15s ease',
                                                        }}
                                                    >
                                                        {cfg.label}
                                                    </button>
                                                );
                                            })}

                                            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {/* Edit Message Button */}
                                                <button
                                                    onClick={(e) => openEditModal(msg, e)}
                                                    className="admin-btn admin-btn--ghost admin-btn--sm"
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                                                >
                                                    <Pencil size={13} /> Edit Message
                                                </button>

                                                {/* Email Reply */}
                                                <a
                                                    href={`mailto:${msg.email}`}
                                                    onClick={e => e.stopPropagation()}
                                                    className="admin-btn admin-btn--ghost admin-btn--sm"
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                                                >
                                                    <Mail size={13} /> Reply Email
                                                </a>

                                                {/* Delete Button */}
                                                {deleteConfirm === msg.id ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        <span style={{ fontSize: '0.78rem', color: '#f87171' }}>Delete message?</span>
                                                        <button
                                                            onClick={e => { e.stopPropagation(); deleteMessage(msg.id); }}
                                                            style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                                                        >
                                                            Yes, Delete
                                                        </button>
                                                        <button
                                                            onClick={e => { e.stopPropagation(); setDeleteConfirm(null); }}
                                                            style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'transparent', color: 'var(--admin-text-muted)', border: '1px solid var(--admin-border)', cursor: 'pointer', fontSize: '0.78rem' }}
                                                        >
                                                            <RotateCcw size={11} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={e => { e.stopPropagation(); setDeleteConfirm(msg.id); }}
                                                        className="admin-btn admin-btn--ghost admin-btn--sm"
                                                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}
                                                    >
                                                        <Trash2 size={13} /> Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Summary Footer */}
            {filtered.length > 0 && (
                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--admin-text-muted)', paddingTop: '0.5rem' }}>
                    Showing {filtered.length} of {messages.length} messages
                </div>
            )}

            {/* Add / Edit Message Modal */}
            {modalOpen && (
                <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="admin-modal admin-modal--wide" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal__header">
                            <h3 className="admin-modal__title">
                                {editingMsg ? 'Edit Message' : 'Add New Message'}
                            </h3>
                            <button className="admin-modal__close" onClick={() => setModalOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveForm}>
                            <div className="admin-modal__body">
                                <div className="admin-form-row">
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Full Name / Sender *</label>
                                        <input
                                            type="text"
                                            className="admin-form-input"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            placeholder="Sender name"
                                            required
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Email Address *</label>
                                        <input
                                            type="email"
                                            className="admin-form-input"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            placeholder="email@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="admin-form-row">
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Phone Number</label>
                                        <input
                                            type="text"
                                            className="admin-form-input"
                                            value={form.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })}
                                            placeholder="01XXXXXXXXX"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Subject Category *</label>
                                        <select
                                            className="admin-form-input admin-form-select"
                                            value={form.subject}
                                            onChange={e => setForm({ ...form, subject: e.target.value })}
                                            required
                                        >
                                            <option value="new-connection">New Connection</option>
                                            <option value="services-solutions">Service & Solutions</option>
                                            <option value="technical-support">Technical Support</option>
                                            <option value="billing">Billing Query</option>
                                            <option value="corporate">Corporate Package</option>
                                            <option value="newsletter">Newsletter Subscription</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="admin-form-row">
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Status *</label>
                                        <select
                                            className="admin-form-input admin-form-select"
                                            value={form.status}
                                            onChange={e => setForm({ ...form, status: e.target.value as MessageItem['status'] })}
                                            required
                                        >
                                            <option value="unread">Unread</option>
                                            <option value="read">Read</option>
                                            <option value="replied">Replied</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-form-label">Message Content *</label>
                                    <textarea
                                        className="admin-form-input"
                                        rows={4}
                                        value={form.message}
                                        onChange={e => setForm({ ...form, message: e.target.value })}
                                        placeholder="Write message details..."
                                        required
                                        style={{ resize: 'vertical' }}
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-form-label">Private Admin Notes</label>
                                    <textarea
                                        className="admin-form-input"
                                        rows={2}
                                        value={form.notes}
                                        onChange={e => setForm({ ...form, notes: e.target.value })}
                                        placeholder="Optional internal administrative notes..."
                                        style={{ resize: 'vertical' }}
                                    />
                                </div>
                            </div>
                            <div className="admin-modal__footer">
                                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn admin-btn--primary">
                                    <Save size={14} /> {editingMsg ? 'Update Message' : 'Save Message'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
