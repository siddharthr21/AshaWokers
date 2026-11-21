import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { apiFetch, showToast } from "../../utils/api";

export default function AppointmentsList() {
  const navigate = useNavigate();
  const { docId } = useAuthStore();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!docId) return;
    let isUnmounted = false;
    
    const loadVisits = async () => {
      try {
        const data = await apiFetch(`/api/appointments/upcoming/${docId}`);
        if (!isUnmounted) {
          setVisits(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      } catch (err) {
        if (!isUnmounted) setLoading(false);
      }
    };
    
    loadVisits();
    return () => { isUnmounted = true; };
  }, [docId]);

  const handleCompleteVisit = async (visit) => {
    try {
      await apiFetch(`/api/appointments/${visit.id}/complete`, {
        method: 'PATCH',
        body: JSON.stringify({ 
          notes: 'Completed from appointments list',
          type: visit.type
        })
      });
      setVisits(prev => prev.filter(v => v.id !== visit.id));
      showToast('Visit marked as complete ✓', 'success');
    } catch (err) {
      showToast('Failed to complete visit', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EDCC] pb-24 text-[#02343F]">
      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-30 shadow-sm border-b border-[#D8D4B0] flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-[#F0EDCC]/30 active:scale-95 transition-all text-[#02343F]">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold text-[#02343F] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#02343F]">calendar_month</span>
          All Scheduled Visits
        </h1>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="material-symbols-outlined animate-spin text-3xl text-[#02343F]">refresh</span>
          </div>
        ) : visits.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-[#D8D4B0] text-center shadow-sm">
            <span className="material-symbols-outlined text-4xl text-[#02343F]/40 mb-2">event_available</span>
            <h3 className="font-bold text-[#02343F] mb-1">No Upcoming Visits</h3>
            <p className="text-sm text-[#02343F]/70">You don't have any visits scheduled for the future.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visits.map(visit => {
              const dateObj = new Date(visit.scheduledDate);
              const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
              
              return (
                <div key={visit.id} className="bg-white p-4 rounded-2xl shadow-sm border border-[#D8D4B0]">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-[#02343F] bg-[#FAF8EA] border border-[#D8D4B0] px-3 py-1 rounded-lg">
                      📅 {dateStr} at {visit.scheduledTime || 'TBD'}
                    </p>
                    <button 
                      onClick={() => handleCompleteVisit(visit)}
                      className="px-4 py-2 bg-[#02343F] text-[#F0EDCC] rounded-xl text-sm font-bold shadow-sm active:scale-95 hover:bg-[#012128] transition-colors whitespace-nowrap"
                    >
                      Done ✓
                    </button>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#02343F] text-lg mb-1 flex items-center gap-2">
                      {visit.targetName || 'Scheduled Visit'}
                      {visit.type === 'ngo' && (
                        <span className="bg-[#0288D1] text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">NGO</span>
                      )}
                    </h3>
                    <p className="text-sm text-[#5F5E5A] bg-gray-50 p-2 rounded-lg border border-gray-100 mb-2">{visit.purpose || 'Child health and nutrition support visit'}</p>
                    {(visit.ngoAddress || visit.address) && (
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(visit.ngoAddress || visit.address)}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-[#0288D1] flex items-center gap-1 mt-1 hover:underline w-max bg-[#E1F5FE] px-2 py-1 rounded-md font-medium"
                      >
                        <span className="material-symbols-outlined text-[16px]">map</span>
                        View Location in Map
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
