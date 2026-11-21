import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { apiFetch } from '../../utils/api';
import { useTx } from '../../context/TranslationContext';

// Status i18n key map — instant offline translation via JSON
const STATUS_I18N = {
  'Pending': 'pending',
  'pending': 'pending',
  'Admitted': 'admitted',
  'admitted': 'admitted',
  'Discharged': 'discharged',
  'discharged': 'discharged',
  'Follow-up Due': 'follow_up_due',
  'follow_up_due': 'follow_up_due',
  'Rejected': 'rejected',
  'rejected': 'rejected',
  'Awaiting Verification': 'awaiting_supervisor_verification',
  'awaiting_verification': 'awaiting_supervisor_verification',
  'Closed': 'closed_supervisor_verified',
  'closed': 'closed_supervisor_verified',
  'All': 'all',
};

// ─── Status config (matching allowed database status values) ──
const STATUS_CONFIG = {
  'Pending':        { label: 'Pending Review', color: '#BA7517', bg: '#FAEEDA', icon: 'pending_actions' },
  'pending':        { label: 'Pending Review', color: '#BA7517', bg: '#FAEEDA', icon: 'pending_actions' },
  'Admitted':       { label: 'Admitted',        color: '#185FA5', bg: '#E6F1FB', icon: 'local_hospital' },
  'admitted':       { label: 'Admitted',        color: '#185FA5', bg: '#E6F1FB', icon: 'local_hospital' },
  'Discharged':     { label: 'Discharged',      color: '#02343F', bg: '#FAF8EA', icon: 'home' },
  'discharged':     { label: 'Discharged',      color: '#02343F', bg: '#FAF8EA', icon: 'home' },
  'Follow-up Due':  { label: 'Follow-up Due',   color: '#E24B4A', bg: '#FCEBEB', icon: 'calendar_today' },
  'follow_up_due':  { label: 'Follow-up Due',   color: '#E24B4A', bg: '#FCEBEB', icon: 'calendar_today' },
  'Rejected':       { label: 'Rejected',         color: '#E24B4A', bg: '#FCEBEB', icon: 'cancel' },
  'rejected':       { label: 'Rejected',         color: '#E24B4A', bg: '#FCEBEB', icon: 'cancel' },
  'Awaiting Verification': { label: 'Awaiting Verification', color: '#B45309', bg: '#FEF3C7', icon: 'hourglass_top' },
  'awaiting_verification': { label: 'Awaiting Verification', color: '#B45309', bg: '#FEF3C7', icon: 'hourglass_top' },
  'Closed':         { label: 'Closed (Verified)', color: '#334155', bg: '#F1F5F9', icon: 'verified' },
  'closed':         { label: 'Closed (Verified)', color: '#334155', bg: '#F1F5F9', icon: 'verified' },
};

const EDITABLE_STATUS_OPTIONS = [
  'Pending',
  'Admitted',
  'Discharged',
  'Follow-up Due',
  'Rejected'
];

const RISK_CONFIG = {
  CRITICAL: { color: '#E24B4A', bg: '#FCEBEB' },
  HIGH:     { color: '#BA7517', bg: '#FAEEDA' },
  MEDIUM:   { color: '#185FA5', bg: '#E6F1FB' },
  LOW:      { color: '#02343F', bg: '#FAF8EA' },
};

// ─── Supervisor "Verify & Close" Modal with Required Clinical Evidence ────────
const VerifyAndCloseModal = ({ referral, onClose, onClosed }) => {
  const [evidence, setEvidence] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const tx = useTx();

  const handleClose = async () => {
    if (evidence.trim().length < 10) {
      setError('Clinical evidence note is mandatory and must be at least 10 characters.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const res = await apiFetch(`/api/referrals/${referral.id}/close`, {
        method: 'POST',
        body: JSON.stringify({ evidence: evidence.trim() })
      });

      if (onClosed) {
        onClosed(res?.referral || { ...referral, status: 'closed' });
      }
      onClose();
    } catch (e) {
      console.error('[VerifyAndCloseModal] closure error:', e);
      setError(e?.message || 'Failed to verify and close referral. Supervisor authorization and evidence are required.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 550,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '24px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 25px 65px rgba(0,0,0,0.25)',
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: '#02343F', fontSize: '24px' }}>verified</span>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1A1A18', margin: 0 }}>
              {tx('Verify & Close Care Loop')}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px' }}>
          <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>
            {referral.childName}
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
            Assigned ASHA: <strong>{referral.ashaName || referral.ashaId}</strong> &middot; Current status: <strong>{referral.status}</strong>
          </p>
        </div>

        <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '10px', padding: '10px 12px', marginBottom: '16px', fontSize: '12px', color: '#92400E', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>shield</span>
          <span>
            <strong>Supervisor Clinical Guardrail:</strong> No care loop can close without supervisor verification and recorded clinical evidence.
          </span>
        </div>

        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
          {tx('Clinical Evidence Note')} <span style={{ color: '#E24B4A' }}>*</span>
        </label>
        <textarea
          value={evidence}
          onChange={e => setEvidence(e.target.value)}
          placeholder="e.g. Discharge summary #NRC-4812 verified. Child weight stabilized at 9.8 kg, MUAC improved to 128mm. In-person follow-up confirmed with mother on Nov 19."
          rows={4}
          style={{
            width: '100%', padding: '12px',
            border: '1.5px solid #CBD5E1', borderRadius: '10px',
            fontSize: '13px', resize: 'vertical', outline: 'none',
            fontFamily: 'inherit', marginBottom: '4px',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '11px', color: evidence.trim().length >= 10 ? '#16A34A' : '#64748B' }}>
          <span>Minimum 10 characters required</span>
          <span>{evidence.trim().length} / 10 chars</span>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px',
              background: '#fff', border: '1px solid #CBD5E1',
              borderRadius: '12px', color: '#475569', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
            }}
          >Cancel</button>
          <button
            onClick={handleClose}
            disabled={saving || evidence.trim().length < 10}
            style={{
              flex: 2, padding: '12px',
              background: evidence.trim().length >= 10 ? '#02343F' : '#94A3B8',
              border: 'none', borderRadius: '12px',
              color: '#fff', fontWeight: '700',
              cursor: (saving || evidence.trim().length < 10) ? 'not-allowed' : 'pointer',
              fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}
          >
            {saving ? (
              <>{tx('Verifying & Closing…')}</>
            ) : (
              <><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified</span> {tx('Verify & Close Referral')}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Admin review modal ───────────────────────────────────────────────────────
const ReviewModal = ({ referral, onClose, onUpdated }) => {
  const [status,  setStatus]  = useState(referral.status  || 'Pending');
  const [nrcName, setNrcName] = useState(referral.nrcName || '');
  const [notes,   setNotes]   = useState(referral.notes   || '');
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [childData, setChildData] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [bookNgo, setBookNgo] = useState(false);
  const [ngoId, setNgoId] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('10:00');
  const tx = useTx();

  useEffect(() => {
    if (referral.childId) {
      apiFetch(`/api/children/${referral.childId}`)
        .then(data => setChildData(data))
        .catch(e => console.warn('[ReviewModal] failed to fetch child data', e));
    }
    apiFetch('/api/ngos')
      .then(data => setNgos(data || []))
      .catch(e => console.warn('[ReviewModal] failed to fetch NGOs', e));
  }, [referral.childId]);

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        status,
        nrcName: nrcName || null,
        notes: notes || null,
      };
      const res = await apiFetch(`/api/referrals/${referral.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      
      if (bookNgo && ngoId && apptDate) {
        await apiFetch('/api/appointments/book-referral', {
          method: 'POST',
          body: JSON.stringify({
            ngoId,
            referralId: referral.id,
            scheduledDate: apptDate,
            scheduledTime: apptTime
          })
        });
      }
      
      if (onUpdated) {
        onUpdated(res || { ...referral, ...payload });
      }
      onClose();
    } catch (e) {
      console.error('[Referrals] update error:', e);
      setError('Failed to update. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const rCfg = RISK_CONFIG[referral.riskLevel] || RISK_CONFIG.LOW;
  const sCfg = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '24px',
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          animation: 'fadeIn 0.2s ease-out',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <style>{`@keyframes fadeIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }`}</style>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A18' }}>{tx('Review NRC Referral')}</h3>
            <p style={{ fontSize: '13px', color: '#777' }}>{tx('Submitted by ASHA')}: <strong>{referral.ashaName || referral.ashaId}</strong></p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}><span className="material-symbols-outlined">close</span></button>
        </div>

        {/* Child info card */}
        <div style={{ background: rCfg.bg, borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontWeight: '700', fontSize: '16px', color: '#1A1A18' }}>{referral.childName}</p>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                {referral.village && <><span className="material-symbols-outlined text-[14px] align-middle">location_on</span> {referral.village} &middot; </>}Referred: {referral.referredDate || 'N/A'}
              </p>
              <p style={{ fontSize: '13px', color: rCfg.color, fontWeight: '600', marginTop: '6px' }}>
                {tx(referral.reason)}
              </p>
            </div>
            {referral.riskLevel && (
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  background: rCfg.color, color: '#fff',
                  fontSize: '11px', fontWeight: '700',
                  padding: '3px 10px', borderRadius: '20px',
                }}>{tx(referral.riskLevel, referral.riskLevel?.toLowerCase())}</span>
                {referral.riskScore && (
                  <p style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Score: {referral.riskScore}/100</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Status selector */}
        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '8px', textTransform: 'uppercase' }}>
          {tx('Update Status')}
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
          {EDITABLE_STATUS_OPTIONS.map(key => {
            const cfg = STATUS_CONFIG[key];
            return (
              <button
                key={key}
                onClick={() => setStatus(key)}
                style={{
                  padding: '8px 4px',
                  borderRadius: '10px',
                  border: `2px solid ${status.toLowerCase() === key.toLowerCase() ? cfg.color : '#D3D1C7'}`,
                  background: status.toLowerCase() === key.toLowerCase() ? cfg.bg : '#fff',
                  color: status.toLowerCase() === key.toLowerCase() ? cfg.color : '#777',
                  fontSize: '11px',
                  fontWeight: status.toLowerCase() === key.toLowerCase() ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{cfg.icon}</span>
                {tx(cfg.label, STATUS_I18N[key])}
              </button>
            );
          })}
        </div>

        {/* NRC Name */}
        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '6px', textTransform: 'uppercase' }}>
          {tx('NRC Facility Name')}
        </label>
        <input
          type="text"
          value={nrcName}
          onChange={e => setNrcName(e.target.value)}
          placeholder="e.g., District Hospital NRC, Solapur"
          style={{
            width: '100%', padding: '10px 12px',
            border: '1px solid #D3D1C7', borderRadius: '10px',
            fontSize: '13px', outline: 'none',
            fontFamily: 'inherit', marginBottom: '16px',
            boxSizing: 'border-box',
          }}
        />

        {/* Notes */}
        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '6px', textTransform: 'uppercase' }}>
          {tx('Notes (optional)')}
        </label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Admission details, follow-up instructions, or rejection reason…"
          rows={3}
          style={{
            width: '100%', padding: '10px 12px',
            border: '1px solid #D3D1C7', borderRadius: '10px',
            fontSize: '13px', resize: 'none', outline: 'none',
            fontFamily: 'inherit', marginBottom: '16px',
            boxSizing: 'border-box',
          }}
        />

        {error && <p style={{ color: '#E24B4A', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px',
              background: '#fff', border: '1px solid #D3D1C7',
              borderRadius: '12px', color: '#555', cursor: 'pointer', fontSize: '14px',
            }}
          >Cancel</button>
          <button
            onClick={save}
            disabled={saving}
            style={{
              flex: 2, padding: '12px',
              background: sCfg.color,
              border: 'none', borderRadius: '12px',
              color: '#fff', fontWeight: '700',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? tx('Saving…') : <><span className="material-symbols-outlined" style={{fontSize: '14px', verticalAlign: 'middle', marginRight: '4px'}}>{sCfg.icon}</span> {tx('Save')} — {tx(sCfg.label, STATUS_I18N[status])}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Referrals admin page ────────────────────────────────────────────────
export default function Referrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('All');
  const [reviewing, setReviewing] = useState(null);
  const [closingReferral, setClosingReferral] = useState(null);
  const tx = useTx();

  const { headId } = useAuthStore();

  useEffect(() => {
    const fetchReferrals = async () => {
      const resolvedHeadId = headId || localStorage.getItem('headId');
      if (!resolvedHeadId) { setLoading(false); return; }

      try {
        const data = await apiFetch('/api/referrals');
        const docs = data.map(d => ({ id: d.id, ...d }));
        // Sort newest first
        docs.sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.referredDate || 0).getTime();
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.referredDate || 0).getTime();
          return tb - ta;
        });
        setReferrals(docs);
      } catch (err) {
        console.error('[Referrals] Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [headId]);

  const FILTERS = ['All', 'Awaiting Verification', 'Pending', 'Admitted', 'Discharged', 'Follow-up Due', 'Closed'];
  const isMatchStatus = (rStatus, target) => {
    if (!rStatus) return false;
    const rLower = rStatus.toLowerCase();
    const tLower = target.toLowerCase();
    if (tLower === 'awaiting verification') return rLower.includes('awaiting');
    if (tLower === 'closed') return rLower === 'closed';
    if (tLower === 'follow-up due') return rLower.includes('follow');
    return rLower === tLower;
  };

  const filtered = filter === 'All' ? referrals : referrals.filter(r => isMatchStatus(r.status, filter));
  const pendingCount = referrals.filter(r => isMatchStatus(r.status, 'Pending')).length;
  const awaitingCount = referrals.filter(r => isMatchStatus(r.status, 'Awaiting Verification')).length;

  return (
    <div style={{ padding: '24px', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1A1A18' }}>{tx('NRC Referrals', 'referrals')}</h1>
          {awaitingCount > 0 && (
            <span style={{
              background: '#B45309', color: '#fff',
              fontSize: '12px', fontWeight: '700',
              padding: '2px 10px', borderRadius: '20px',
              display: 'inline-flex', alignItems: 'center', gap: '4px'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>hourglass_top</span>
              {awaitingCount} {tx('awaiting verification')}
            </span>
          )}
          {pendingCount > 0 && (
            <span style={{
              background: '#E24B4A', color: '#fff',
              fontSize: '12px', fontWeight: '700',
              padding: '2px 10px', borderRadius: '20px',
            }}>{pendingCount} {tx('pending', 'pending')}</span>
          )}
        </div>
        <p style={{ fontSize: '13px', color: '#777', marginTop: '4px' }}>
          {tx('Review NRC admission requests and verify completed care loop closures with clinical evidence')}
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {FILTERS.map(f => {
          const sCfg = f !== 'All' ? STATUS_CONFIG[f] : null;
          const count = f === 'All' ? referrals.length : referrals.filter(r => isMatchStatus(r.status, f)).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 14px',
                borderRadius: '20px',
                border: `1px solid ${filter === f ? (sCfg?.color || '#02343F') : '#D3D1C7'}`,
                background: filter === f ? (sCfg?.bg || '#FAF8EA') : '#fff',
                color: filter === f ? (sCfg?.color || '#02343F') : '#555',
                fontSize: '12px', fontWeight: filter === f ? '700' : '500',
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {sCfg ? <><span className="material-symbols-outlined" style={{fontSize: '14px', verticalAlign: 'middle', marginRight: '4px'}}>{sCfg.icon}</span> {tx(f, STATUS_I18N[f])}</> : tx(f, STATUS_I18N[f])} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              background: '#F5F4EF', borderRadius: '14px',
              height: '120px', marginBottom: '12px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
          <style>{`@keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: '#F5F4EF', borderRadius: '16px',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '40px', marginBottom: '12px', color: '#888' }}>assignment</span>
          <p style={{ fontWeight: '600', color: '#1A1A18' }}>
            {tx('No referrals')} {filter !== 'All' ? `${tx('with status')} "${tx(filter, STATUS_I18N[filter])}"` : tx('yet')}
          </p>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '6px' }}>
            {tx('Referrals submitted from the Priority List will appear here')}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map(r => {
            const sCfg = STATUS_CONFIG[r.status] || STATUS_CONFIG['Pending'];
            const rCfg = RISK_CONFIG[r.riskLevel] || {};
            const isClosed = (r.status || '').toLowerCase() === 'closed';
            const isAwaiting = (r.status || '').toLowerCase().includes('awaiting');

            return (
              <div
                key={r.id}
                style={{
                  background: '#fff',
                  border: isAwaiting ? '2px solid #F59E0B' : '1px solid #E8E6DF',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{ fontWeight: '700', fontSize: '15px', color: '#1A1A18' }}>{r.childName}</h3>
                      {r.riskLevel && (
                        <span style={{
                          background: rCfg.bg, color: rCfg.color,
                          fontSize: '10px', fontWeight: '700',
                          padding: '2px 8px', borderRadius: '8px',
                        }}>{tx(r.riskLevel, r.riskLevel?.toLowerCase())}</span>
                      )}
                    </div>
                    {r.village && (
                      <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}><span className="material-symbols-outlined" style={{fontSize: '14px', verticalAlign: 'middle'}}>location_on</span> {r.village}</p>
                    )}
                    <p style={{ fontSize: '13px', color: rCfg.color || '#555', fontWeight: '600', marginBottom: '4px' }}>
                      {tx(r.reason)}
                    </p>
                  </div>

                  {/* Status badge */}
                  <div style={{ textAlign: 'right', marginLeft: '12px', flexShrink: 0 }}>
                    <span style={{
                      background: sCfg.bg, color: sCfg.color,
                      fontSize: '11px', fontWeight: '700',
                      padding: '4px 10px', borderRadius: '20px',
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      marginBottom: '4px', whiteSpace: 'nowrap',
                    }}>
                      <span className="material-symbols-outlined" style={{fontSize: '14px'}}>{sCfg.icon}</span> {tx(sCfg.label, STATUS_I18N[r.status])}
                    </span>
                    <p style={{ fontSize: '10px', color: '#aaa', margin: 0 }}>
                      {r.referredDate || (r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'short'}) : '')}
                    </p>
                  </div>
                </div>

                {/* Meta row */}
                <div style={{
                  display: 'flex', gap: '8px', flexWrap: 'wrap',
                  background: '#F5F4EF', borderRadius: '8px',
                  padding: '8px 12px', marginBottom: '12px',
                  fontSize: '12px', color: '#666',
                }}>
                  <span><span className="material-symbols-outlined" style={{fontSize: '14px', verticalAlign: 'middle'}}>medical_services</span> <strong>{r.ashaName || r.ashaId}</strong></span>
                  {r.nrcName && <span>&middot; <span className="material-symbols-outlined" style={{fontSize: '14px', verticalAlign: 'middle'}}>local_hospital</span> <strong>{r.nrcName}</strong></span>}
                  {r.riskScore && <span>· Score: <strong style={{ color: rCfg.color }}>{r.riskScore}/100</strong></span>}
                </div>

                {/* Notes */}
                {r.notes && (
                  <div style={{
                    background: '#FAEEDA', borderRadius: '8px',
                    padding: '8px 12px', marginBottom: '12px',
                    fontSize: '12px', color: '#666',
                  }}>
                    <span className="material-symbols-outlined" style={{fontSize: '14px', verticalAlign: 'middle'}}>edit_note</span> {r.notes ? tx(r.notes) : ''}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  {!isClosed ? (
                    <>
                      <button
                        onClick={() => setReviewing(r)}
                        style={{
                          flex: 1, padding: '10px',
                          background: '#F5F4EF',
                          color: '#475569',
                          border: '1px solid #D3D1C7',
                          borderRadius: '10px',
                          fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                        }}
                      >
                        <span className="material-symbols-outlined" style={{fontSize: '16px'}}>edit</span>
                        {tx('Update Status / NRC')}
                      </button>

                      <button
                        onClick={() => setClosingReferral(r)}
                        style={{
                          flex: 1, padding: '10px',
                          background: isAwaiting ? '#02343F' : '#fff',
                          color: isAwaiting ? '#fff' : '#02343F',
                          border: '1.5px solid #02343F',
                          borderRadius: '10px',
                          fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                          boxShadow: isAwaiting ? '0 2px 8px rgba(2,52,63,0.25)' : 'none'
                        }}
                      >
                        <span className="material-symbols-outlined" style={{fontSize: '16px'}}>verified</span>
                        {isAwaiting ? tx('Verify & Close (Action Required)') : tx('Verify & Close')}
                      </button>
                    </>
                  ) : (
                    <div style={{
                      width: '100%', padding: '10px 14px',
                      background: '#F1F5F9', border: '1px solid #CBD5E1',
                      borderRadius: '10px', color: '#334155',
                      fontSize: '13px', fontWeight: '600',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#16A34A' }}>verified</span>
                      <span>{tx('Care Loop Closed — Supervisor Verified with Evidence')}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review modal */}
      {reviewing && (
        <ReviewModal
          referral={reviewing}
          onClose={() => setReviewing(null)}
          onUpdated={(updatedRef) => {
            setReferrals(prev => prev.map(r => r.id === updatedRef.id ? { ...r, ...updatedRef } : r));
          }}
        />
      )}

      {/* Verify & Close modal */}
      {closingReferral && (
        <VerifyAndCloseModal
          referral={closingReferral}
          onClose={() => setClosingReferral(null)}
          onClosed={(updatedRef) => {
            setReferrals(prev => prev.map(r => r.id === updatedRef.id ? { ...r, ...updatedRef } : r));
          }}
        />
      )}
    </div>
  );
}
