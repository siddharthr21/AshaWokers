import { useState, useEffect, useMemo } from 'react';
import { apiFetch } from '../../utils/api';
import { useTx } from '../../context/TranslationContext';

// Reminder drafts in EN, MR, HI - Strictly generic, no personal names, protecting privacy
const REMINDER_TEMPLATES = {
  appointment: {
    title: {
      en: 'Upcoming Health Appointment',
      hi: 'आगामी स्वास्थ्य जांच',
      kn: 'ಮುಂಬರುವ ಆರೋಗ್ಯ ತಪಾಸಣೆ',
      mr: 'आगामी आरोग्य तपासणी'
    },
    text: {
      en: (date) => `Namaste. This is a gentle reminder from the community health team regarding your child's scheduled health check-up on ${date}. Please visit your nearest health center or contact your ASHA worker. Healthy children build healthy families.`,
      hi: (date) => `नमस्ते। यह आपके बच्चे के ${date} को निर्धारित स्वास्थ्य जांच के संदर्भ में स्वास्थ्य केंद्र से स्मरण संदेश है। कृपया निकटतम स्वास्थ्य केंद्र जाएं या अपनी आशा कार्यकर्ता से संपर्क करें।`,
      kn: (date) => `ನಮಸ್ಕಾರ. ನಿಮ್ಮ ಮಗುವಿನ ${date} ರಂದು ನಿಗದಿಪಡಿಸಲಾದ ಆರೋಗ್ಯ ತಪಾಸಣೆಯ ಕುರಿತು ಇದು ಆರೋಗ್ಯ ಕೇಂದ್ರದ ನೆನಪೋಲೆ ಸಂದೇಶವಾಗಿದೆ. ದಯವಿಟ್ಟು ಹತ್ತಿರದ ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ ಅಥವಾ ನಿಮ್ಮ ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ.`,
      mr: (date) => `नमस्ते. आपल्या बालकाच्या ${date} रोजीच्या नियोजित आरोग्य तपासणीबाबत हे आरोग्य केंद्राकडून स्मरणपत्र आहे. कृपया जवळच्या आरोग्य केंद्रास भेट द्या किंवा आपल्या आशा कार्यकर्त्यांशी संपर्क साधा.`
    }
  },
  overdue: {
    title: {
      en: 'Missed Follow-Up Care',
      hi: 'छूटी हुई स्वास्थ्य जांच',
      kn: 'ತಪ್ಪಿದ ಆರೋಗ್ಯ ತಪಾಸಣೆ',
      mr: 'चुकलेली तपासणी पाठपुरावा'
    },
    text: {
      en: (date) => `Namaste. We noticed your child missed a health follow-up scheduled for ${date}. Regular check-ups are essential for healthy growth and recovery. Please visit your health center or contact your ASHA worker at the earliest.`,
      hi: (date) => `नमस्ते। आपके बच्चे की ${date} की स्वास्थ्य जांच छूट गई है। नियमित जांच बच्चे के पोषण और विकास के लिए आवश्यक है। कृपया शीघ्र ही अपने स्वास्थ्य केंद्र जाएं या आशा दीदी से संपर्क करें।`,
      kn: (date) => `ನಮಸ್ಕಾರ. ನಿಮ್ಮ ಮಗುವಿನ ${date} ರಂದು ನಿಗದಿಯಾಗಿದ್ದ ಆರೋಗ್ಯ ತಪಾಸಣೆ ತಪ್ಪಿರುವುದನ್ನು ನಾವು ಗಮನಿಸಿದ್ದೇವೆ. ಮಗುವಿನ ಆರೋಗ್ಯಕರ ಬೆಳವಣಿಗೆಗೆ ನಿಯಮಿತ ತಪಾಸಣೆ ಅಗತ್ಯ. ದಯವಿಟ್ಟು ಶೀಘ್ರದಲ್ಲೇ ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ ಅಥವಾ ನಿಮ್ಮ ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ.`,
      mr: (date) => `नमस्ते. आपल्या बालकाची ${date} रोजीची आरोग्य तपासणी पूर्ण झालेली नाही. नियमित तपासणी बालकाच्या निरोगी वाढीसाठी अत्यंत महत्त्वाची आहे. कृपया लवकरात लवकर आरोग्य केंद्रास भेट द्या किंवा आशा दीदींशी संपर्क साधा.`
    }
  },
  nutrition: {
    title: {
      en: 'NRC Nutrition Follow-Up',
      hi: 'पोषण केंद्र फॉलो-अप',
      kn: 'NRC ಪೌಷ್ಠಿಕಾಂಶ ತಪಾಸಣೆ',
      mr: 'पोषण केंद्र पाठपुरावा'
    },
    text: {
      en: () => `Namaste. Your child's nutritional care follow-up is due. Regular nutrition monitoring helps your child grow strong and active. Please consult your ASHA worker today for guidance and support.`,
      hi: () => `नमस्ते। आपके बच्चे की पोषण जांच नियत है। नियमित पोषण जांच से बच्चा स्वस्थ और मजबूत बनता है। कृपया आज ही अपनी आशा दीदी से संपर्क करें।`,
      kn: () => `ನಮಸ್ಕಾರ. ನಿಮ್ಮ ಮಗುವಿನ ಪೌಷ್ಠಿಕಾಂಶ ಆರೈಕೆ ತಪಾಸಣೆಯ ಸಮಯವಾಗಿದೆ. ನಿಯಮಿತ ತಪಾಸಣೆಯು ಮಗುವಿನ ಸದೃಢ ಬೆಳವಣಿಗೆಗೆ ಸಹಕಾರಿಯಾಗಿದೆ. ದಯವಿಟ್ಟು ಇಂದು ನಿಮ್ಮ ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ.`,
      mr: () => `नमस्ते. आपल्या बालकाची पोषण तपासणी बाकी आहे. नियमित तपासणीमुळे बाळ सुदृढ आणि निरोगी राहते. कृपया आजच आपल्या आशा कार्यकर्त्यांशी चर्चा करा.`
    }
  }
};

export default function CareLoop() {
  const tx = useTx();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, HIGH_RISK, NO_APPOINTMENT, OVERDUE, AWAITING_VERIFICATION
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [reminderLang, setReminderLang] = useState('en');
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    loadCareLoopData();
  }, []);

  const loadCareLoopData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/api/admin/care-loop');
      setCases(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[CareLoop] Error fetching care loop data:', err);
      setError(err.message || 'Failed to load Care Loop data');
    } finally {
      setLoading(false);
    }
  };

  // Metrics summary
  const metrics = useMemo(() => {
    const total = cases.length;
    const highRisk = cases.filter(c => c.ruleBasedDropOffRisk === 'HIGH').length;
    const noAppointment = cases.filter(c => !c.appointmentExists).length;
    const overdue = cases.filter(c => c.overdueDays > 0).length;
    const awaitingVerification = cases.filter(c => c.status === 'awaiting_verification').length;
    return { total, highRisk, noAppointment, overdue, awaitingVerification };
  }, [cases]);

  // Filtered cases
  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      // Filter tab
      if (activeFilter === 'HIGH_RISK' && c.ruleBasedDropOffRisk !== 'HIGH') return false;
      if (activeFilter === 'NO_APPOINTMENT' && c.appointmentExists) return false;
      if (activeFilter === 'OVERDUE' && (!c.overdueDays || c.overdueDays <= 0)) return false;
      if (activeFilter === 'AWAITING_VERIFICATION' && c.status !== 'awaiting_verification') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesChild = c.childName?.toLowerCase().includes(q) || c.childId?.toLowerCase().includes(q);
        const matchesAsha = c.owner?.name?.toLowerCase().includes(q);
        const matchesVillage = c.village?.toLowerCase().includes(q);
        const matchesReason = c.reason?.toLowerCase().includes(q);
        const matchesNrc = c.nrcName?.toLowerCase().includes(q);
        if (!matchesChild && !matchesAsha && !matchesVillage && !matchesReason && !matchesNrc) return false;
      }
      return true;
    });
  }, [cases, activeFilter, searchQuery]);

  const handleCopyReminder = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const getTargetDate = (c) => {
    if (c.appointmentScheduledAt) return c.appointmentScheduledAt.split('T')[0];
    if (c.followUpDueDate) return c.followUpDueDate;
    return 'scheduled date';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#02343F] text-3xl">sync_saved_locally</span>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              {tx('Care Loop Coordination', 'care_loop')}
            </h1>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Desktop supervisor oversight for active referrals, deterministic drop-off risk, and family follow-up.
          </p>
        </div>

        <button
          onClick={loadCareLoopData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition shadow-sm"
        >
          <span className={`material-symbols-outlined text-lg ${loading ? 'animate-spin' : ''}`}>refresh</span>
          Refresh Cases
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div 
          onClick={() => setActiveFilter('ALL')}
          className={`p-4 rounded-xl border cursor-pointer transition ${activeFilter === 'ALL' ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Cases</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.total}</p>
          <p className="text-xs text-slate-500 mt-1">Open referrals in care loop</p>
        </div>

        <div 
          onClick={() => setActiveFilter('HIGH_RISK')}
          className={`p-4 rounded-xl border cursor-pointer transition ${activeFilter === 'HIGH_RISK' ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-200' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">High Drop-Off Risk</p>
            <span className="material-symbols-outlined text-rose-600 text-lg">warning</span>
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-1">{metrics.highRisk}</p>
          <p className="text-xs text-rose-600/80 mt-1">Rule-based alert flagged</p>
        </div>

        <div 
          onClick={() => setActiveFilter('NO_APPOINTMENT')}
          className={`p-4 rounded-xl border cursor-pointer transition ${activeFilter === 'NO_APPOINTMENT' ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-200' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">No Appointment</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{metrics.noAppointment}</p>
          <p className="text-xs text-amber-600/80 mt-1">Pending NRC/clinic booking</p>
        </div>

        <div 
          onClick={() => setActiveFilter('OVERDUE')}
          className={`p-4 rounded-xl border cursor-pointer transition ${activeFilter === 'OVERDUE' ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-200' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-700">Overdue Follow-ups</p>
          <p className="text-2xl font-bold text-orange-700 mt-1">{metrics.overdue}</p>
          <p className="text-xs text-orange-600/80 mt-1">Passed due checkup date</p>
        </div>

        <div 
          onClick={() => setActiveFilter('AWAITING_VERIFICATION')}
          className={`p-4 rounded-xl border cursor-pointer transition ${activeFilter === 'AWAITING_VERIFICATION' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Awaiting Verification</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{metrics.awaitingVerification}</p>
          <p className="text-xs text-blue-600/80 mt-1">Closure request pending</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: 'All Cases' },
            { id: 'HIGH_RISK', label: 'High Drop-Off Risk' },
            { id: 'NO_APPOINTMENT', label: 'No Appointment' },
            { id: 'OVERDUE', label: 'Overdue Follow-up' },
            { id: 'AWAITING_VERIFICATION', label: 'Awaiting Verification' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeFilter === f.id ? 'bg-[#02343F] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by child, ASHA, village..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#02343F]/20 focus:border-[#02343F]"
          />
        </div>
      </div>

      {/* Main Table for Desktop (1280px+ optimized) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 text-center text-slate-500">
            <span className="material-symbols-outlined animate-spin text-4xl text-[#02343F] mb-2">progress_activity</span>
            <p className="text-sm font-medium">Loading Care Loop Coordination View...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600 bg-rose-50/50">
            <span className="material-symbols-outlined text-4xl mb-2">error</span>
            <p className="text-sm font-medium">{error}</p>
            <button onClick={loadCareLoopData} className="mt-4 px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs">
              Retry
            </button>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">check_circle</span>
            <p className="text-base font-semibold text-slate-700">No cases match the selected filters</p>
            <p className="text-xs text-slate-500 mt-1">All referrals in this filter category have closed or progressed cleanly.</p>
          </div>
        ) : (
          <div className="overflow-x-auto min-w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Case / Child</th>
                  <th className="py-3.5 px-4">Assigned ASHA</th>
                  <th className="py-3.5 px-4">Days Active</th>
                  <th className="py-3.5 px-4">Referral Status</th>
                  <th className="py-3.5 px-4">Appointment</th>
                  <th className="py-3.5 px-4">Overdue Days</th>
                  <th className="py-3.5 px-4">Rule-Based Drop-Off Risk</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                {filteredCases.map(c => {
                  const isHighRisk = c.ruleBasedDropOffRisk === 'HIGH';
                  const isMediumRisk = c.ruleBasedDropOffRisk === 'MEDIUM';

                  return (
                    <tr 
                      key={c.id} 
                      className={`hover:bg-slate-50/80 transition cursor-pointer ${selectedCase?.id === c.id ? 'bg-emerald-50/40' : ''}`}
                      onClick={() => setSelectedCase(c)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{c.childName}</div>
                        <div className="text-[11px] text-slate-500">
                          {c.village ? `${c.village} • ` : ''}ID: {c.id.substring(0, 8)}...
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{c.owner?.name || 'Unassigned'}</div>
                        <div className="text-[11px] text-slate-500">Frontline Worker</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium">{c.daysSinceFlagged} days</div>
                        <div className="text-[11px] text-slate-400">
                          {c.referredDate ? c.referredDate.split('T')[0] : 'Recently'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          c.status === 'awaiting_verification' ? 'bg-amber-100 text-amber-800' :
                          c.status === 'admitted' ? 'bg-blue-100 text-blue-800' :
                          c.status === 'closed' ? 'bg-emerald-100 text-emerald-800' :
                          c.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {c.status === 'awaiting_verification' ? 'Awaiting Verification' :
                           c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1) : 'Pending'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {c.appointmentExists ? (
                          <div>
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                              <span className="material-symbols-outlined text-xs">event_available</span>
                              {c.appointmentStatus || 'Booked'}
                            </span>
                            <div className="text-[11px] text-slate-500">
                              {c.appointmentScheduledAt ? c.appointmentScheduledAt.split('T')[0] : 'Scheduled'}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded">
                            <span className="material-symbols-outlined text-xs">event_busy</span>
                            None Booked
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {c.overdueDays > 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800">
                            {c.overdueDays} days late
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">On track</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isHighRisk ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                            isMediumRisk ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            <span className="material-symbols-outlined text-xs">
                              {isHighRisk ? 'report' : isMediumRisk ? 'warning' : 'check_circle'}
                            </span>
                            {c.ruleBasedDropOffRisk} RISK
                          </span>
                          {c.reasons && c.reasons.length > 0 && (
                            <span className="text-[10px] text-slate-500 max-w-xs truncate" title={c.reasons.join(', ')}>
                              {c.reasons[0]} {c.reasons.length > 1 ? `(+${c.reasons.length - 1} more)` : ''}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCase(c);
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-[#02343F] hover:text-white text-slate-700 rounded-lg text-xs font-medium transition inline-flex items-center gap-1 shadow-sm"
                        >
                          <span>Review</span>
                          <span className="material-symbols-outlined text-xs">chevron_right</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over Detail Drawer */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end transition-opacity">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-y-auto border-l border-slate-200 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400">clinical_notes</span>
                  <h2 className="text-xl font-bold">{selectedCase.childName}</h2>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    selectedCase.ruleBasedDropOffRisk === 'HIGH' ? 'bg-rose-500 text-white' :
                    selectedCase.ruleBasedDropOffRisk === 'MEDIUM' ? 'bg-amber-500 text-slate-900' :
                    'bg-emerald-500 text-white'
                  }`}>
                    {selectedCase.ruleBasedDropOffRisk} DROP-OFF RISK
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Case ID: {selectedCase.id} • Village: {selectedCase.village || 'Field Area'} • ASHA: {selectedCase.owner?.name || 'Unassigned'}
                </p>
              </div>
              <button 
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-white transition p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">
              {/* Explainable Drop-Off Risk Card */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-700 text-lg">policy</span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Rule-Based Drop-Off Evaluation (Non-Predictive)
                  </h3>
                </div>
                <p className="text-xs text-slate-600">
                  Asha Vaani evaluates deterministic rule violations rather than statistical predictions to ensure fully transparent clinical coordination.
                </p>
                {selectedCase.reasons && selectedCase.reasons.length > 0 ? (
                  <ul className="mt-2 space-y-1.5">
                    {selectedCase.reasons.map((r, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-medium text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                        <span className="material-symbols-outlined text-sm text-rose-600">priority_high</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
                    <span>No drop-off risk factors identified. Care progression is on track.</span>
                  </div>
                )}
              </div>

              {/* Family Reminder Drafts (WhatsApp / Copy) */}
              <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-800 text-xl">chat</span>
                    <h3 className="text-sm font-bold text-emerald-950">
                      Family Reminder Drafts
                    </h3>
                  </div>
                  {/* Language Toggle */}
                  <div className="flex bg-white rounded-lg p-0.5 border border-slate-200 text-xs font-medium shadow-sm">
                    {['en', 'hi', 'kn'].map(l => (
                      <button
                        key={l}
                        onClick={() => setReminderLang(l)}
                        className={`px-3 py-1 rounded capitalize transition font-bold ${reminderLang === l ? 'bg-[#02343F] text-[#F0EDCC]' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        {l === 'en' ? 'EN' : l === 'hi' ? 'हिंदी' : 'ಕನ್ನಡ'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                  <strong>Human-in-the-loop:</strong> Asha Vaani drafts reminder messages only (excluding sensitive names). A human supervisor or worker must review the draft and click Send.
                </div>

                {/* Templates */}
                <div className="space-y-3">
                  {Object.entries(REMINDER_TEMPLATES).map(([key, tpl]) => {
                    const targetDate = getTargetDate(selectedCase);
                    const draftText = typeof tpl.text === 'function' 
                      ? tpl.text(targetDate)[reminderLang] 
                      : typeof tpl.text[reminderLang] === 'function' 
                        ? tpl.text[reminderLang](targetDate) 
                        : tpl.text[reminderLang]();

                    const isCopied = copiedKey === key;
                    const waUrl = `https://wa.me/?text=${encodeURIComponent(draftText)}`;

                    return (
                      <div key={key} className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{tpl.title[reminderLang]}</span>
                          <span className="text-[10px] text-slate-400 uppercase">Generic Template</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded border border-slate-100">
                          "{draftText}"
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => handleCopyReminder(draftText, key)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition inline-flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs">
                              {isCopied ? 'check' : 'content_copy'}
                            </span>
                            {isCopied ? 'Copied!' : 'Copy'}
                          </button>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium transition inline-flex items-center gap-1 shadow-sm"
                          >
                            <span className="material-symbols-outlined text-xs">send</span>
                            Open WhatsApp
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Case Care Timeline */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-700 text-xl">timeline</span>
                  <h3 className="text-sm font-bold text-slate-900">Care Pathway Timeline</h3>
                </div>

                <div className="border-l-2 border-slate-200 pl-4 space-y-4 ml-2">
                  {/* Referral Creation */}
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                    <p className="text-xs font-bold text-slate-800">Referral Created</p>
                    <p className="text-xs text-slate-500">
                      Reason: {selectedCase.reason} • Referred on {selectedCase.referredDate ? selectedCase.referredDate.split('T')[0] : 'Recent'}
                    </p>
                  </div>

                  {/* Appointments Timeline */}
                  {selectedCase.appointments && selectedCase.appointments.length > 0 && selectedCase.appointments.map(a => (
                    <div key={a.id} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white" />
                      <p className="text-xs font-bold text-slate-800">
                        Appointment: {a.ngoName || 'Health Center'}
                      </p>
                      <p className="text-xs text-slate-500">
                        Scheduled for: {a.scheduledAt ? a.scheduledAt.split('T')[0] : 'TBD'} • Status: {a.status}
                      </p>
                    </div>
                  ))}

                  {/* Visits Timeline */}
                  {selectedCase.visits && selectedCase.visits.length > 0 && selectedCase.visits.map(v => (
                    <div key={v.id} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                      <p className="text-xs font-bold text-slate-800">ASHA Home Visit</p>
                      <p className="text-xs text-slate-500">
                        Date: {v.visitDate || 'Recent'} • MUAC: {v.muacMm ? `${v.muacMm} mm` : 'N/A'} • Weight: {v.weightKg ? `${v.weightKg} kg` : 'N/A'}
                      </p>
                      {v.notes && <p className="text-xs text-slate-600 mt-0.5 italic">"{v.notes}"</p>}
                    </div>
                  ))}

                  {/* EditHistory Audit Trail */}
                  {selectedCase.history && selectedCase.history.length > 0 && selectedCase.history.map(h => (
                    <div key={h.id} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-white" />
                      <p className="text-xs font-bold text-purple-900">
                        Audit Log: {h.fieldName} modified
                      </p>
                      <p className="text-xs text-slate-500">
                        {h.editedAt ? h.editedAt.split('T')[0] : 'Recent'} • Reason: {h.reason || 'Verification record'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
