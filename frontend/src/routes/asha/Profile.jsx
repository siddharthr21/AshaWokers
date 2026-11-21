import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { apiFetch } from '../../utils/api';
import { useTx } from '../../context/TranslationContext';
import DailyReportModal from '../../components/DailyReportModal';

export default function Profile() {
  const { user, docId, logout } = useAuthStore();
  const [profileData, setProfileData] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const tx = useTx();

  useEffect(() => {
    if (!docId) return;
    apiFetch(`/api/ashas/${docId}`)
      .then(data => { if (data) setProfileData(data); })
      .catch(console.error);
  }, [docId]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#D8D4B0] p-6 text-center">
       <div className="w-24 h-24 bg-[#02343F] border-2 border-[#F0EDCC]/40 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl text-[#F0EDCC] font-bold shadow-md">
         {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
       </div>
       <h2 className="text-2xl font-bold text-[#02343F] mb-1">{user?.displayName || tx('ASHA Worker', 'asha_worker')}</h2>
       <p className="text-[#02343F]/70 text-sm mb-6">{user?.phoneNumber}</p>
       
       <div className="space-y-3 mb-8 text-left border-t border-[#D8D4B0] pt-6">
          <div className="flex justify-between items-center py-2">
             <span className="text-[#02343F]/75 font-medium text-sm">{tx('Assigned PHC', 'assigned_phc')}</span>
             <span className="font-semibold text-[#02343F] text-sm">{profileData?.phc || 'Shirur Rural'}</span>
          </div>
          <div className="flex justify-between items-center py-2">
             <span className="text-[#02343F]/75 font-medium text-sm">{tx('Coverage Area', 'coverage_area')}</span>
             <span className="font-semibold text-[#02343F] text-sm">{profileData?.village || 'Pimple Jagtap'}</span>
          </div>
       </div>

       {/* Daily Report Section */}
       <div className="mb-8 text-left border-t border-[#D8D4B0] pt-6">
          <h3 className="text-[#02343F] font-bold mb-3">{tx('Activity & Reports', 'activity_reports')}</h3>
          <button 
            onClick={() => setShowReportModal(true)}
            className="w-full py-3 bg-[#FAF8EA] border border-[#02343F]/30 text-[#02343F] hover:bg-[#F0EDCC] rounded-xl font-bold flex items-center justify-center space-x-2 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined">description</span>
            <span>{tx('Download Daily Report', 'download_daily_report')}</span>
          </button>
       </div>

       <button onClick={handleLogout} className="w-full py-3 border border-[#E24B4A] text-[#791F1F] rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-[#FCEBEB] transition-colors mb-4">
          <span className="material-symbols-outlined">logout</span>
          <span>{tx('Log Out', 'log_out')}</span>
       </button>

       <DailyReportModal 
         isOpen={showReportModal} 
         onClose={() => setShowReportModal(false)} 
         ashaId={docId} 
       />
    </div>
  );
}
