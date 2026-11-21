import { useState } from 'react';
import BaseModuleForm from '../../../components/BaseModuleForm';
import { useAuthStore } from '../../../stores/authStore';
import AadhaarLinkagePopup from '../../../components/AadhaarLinkagePopup';
import MalnutritionScannerWidget from '../../../components/widgets/MalnutritionScannerWidget';
import { apiFetch } from '../../../utils/api';

const FIELDS = [
  { id: 'child_name', label: 'Child Name / बच्चे का नाम', required: true, placeholder: 'Full name' },
  { id: 'mother_name', label: 'Mother Name / माँ का नाम', required: true },
  { id: 'age_months', label: 'Age (months) / उम्र (महीने)', type: 'number', required: true, placeholder: '0-60' },
  { id: 'gender', label: 'Gender / लिंग', type: 'select', required: true, options: [
    { value: 'Male', label: 'Male / लड़का' }, { value: 'Female', label: 'Female / लड़की' }
  ]},
  { id: 'weight_kg', label: 'Weight (kg)', type: 'number', required: true, placeholder: 'e.g. 8.5' },
  { id: 'height_cm', label: 'Height (cm)', type: 'number', required: true, placeholder: 'e.g. 72' },
  { id: 'muac_cm', label: 'Estimated MUAC (confirm with tape) (cm)', type: 'number', placeholder: 'e.g. 13.5' },
  { id: 'muac_color', label: 'Estimated MUAC (confirm with tape) Color Zone', type: 'select', options: [
    { value: 'GREEN', label: 'Green (≥13.5cm — Normal)' },
    { value: 'YELLOW', label: 'Yellow (12.5-13.4cm — MAM)' },
    { value: 'RED', label: 'Red (<12.5cm — SAM)' }
  ]},
  { id: 'malnutritionGrade', label: 'AI Visual Malnutrition Grade', type: 'select', options: [
    { value: 'NORMAL', label: 'Normal' },
    { value: 'YELLOW', label: 'MAM (Yellow)' },
    { value: 'RED', label: 'SAM (Red)' }
  ]},
  { id: 'feeding_status', label: 'Feeding Status', type: 'select', options: [
    { value: 'Exclusive Breastfeeding', label: 'Exclusive Breastfeeding' },
    { value: 'Complementary Feeding', label: 'Complementary Feeding' },
    { value: 'Family Food', label: 'Family Food' },
    { value: 'Bottle Feeding', label: 'Bottle Feeding' }
  ]},
  { id: 'immunization_up_to_date', label: 'Immunization up to date?', type: 'checkbox', checkboxLabel: 'All vaccines given as per schedule' },
  { id: 'illness_signs', label: 'Illness Signs (if any)', type: 'textarea', placeholder: 'Fever, diarrhoea, cough, oedema, etc.' },
  { id: 'referred_to_nrc', label: 'Referred to NRC?', type: 'checkbox', checkboxLabel: 'Child referred to Nutrition Rehabilitation Centre' },
];

// Grade config helper
const GRADE_CONFIG = {
  NORMAL: {
    bg: '#FAF8EA', border: '#02343F', text: '#02343F',
    icon: 'check_circle', label: 'Normal', badgeBg: '#02343F',
  },
  YELLOW: {
    bg: '#FFF8E1', border: '#FFCA28', text: '#7A5500',
    icon: 'warning', label: 'Moderate (MAM)', badgeBg: '#F0A500',
  },
  RED: {
    bg: '#FCEBEB', border: '#E24B4A', text: '#791F1F',
    icon: 'crisis_alert', label: 'Severe (SAM)', badgeBg: '#E24B4A',
  },
};

function ConfidenceBar({ value }) {
  const color = value >= 75 ? '#02343F' : value >= 50 ? '#F0A500' : '#E24B4A';
  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#777', marginBottom: '4px' }}>
        <span>AI Confidence</span>
        <span style={{ fontWeight: '700', color }}>{value}%</span>
      </div>
      <div style={{ background: '#E8E7E0', borderRadius: '100px', height: '6px', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, background: color, height: '100%', borderRadius: '100px', transition: 'width 0.8s ease' }} />
      </div>
    </div>
  );
}

export default function ChildGrowth() {
  const [prefillData, setPrefillData] = useState(null);
  const [hasParents, setHasParents] = useState(true);
  const [showLinkagePopup, setShowLinkagePopup] = useState(false);
  const [linkageData, setLinkageData] = useState(null);
  const [linkageConfirmedData, setLinkageConfirmedData] = useState(null);
  const { user } = useAuthStore();

  const handleAadhaarEntered = async (last4) => {
    if (!hasParents) return; // skip if orphan

    try {
      const result = await apiFetch('/api/members/check-linkage', {
        method: 'POST',
        body: JSON.stringify({ aadhaar_last4: last4, module_type: 'child_growth' })
      });
      if (result.match_found) {
        setLinkageData(result);
        setShowLinkagePopup(true);
      }
    } catch (err) {
      console.log('Linkage check skipped (offline or error)', err);
    }
  };

  const handleConfirmLinkage = () => {
    setShowLinkagePopup(false);
    setLinkageConfirmedData(linkageData);
  };

  const handleRejectLinkage = () => {
    setShowLinkagePopup(false);
    setLinkageConfirmedData(null);
  };

  const handleAfterSubmit = async (docId) => {
    if (linkageConfirmedData && hasParents) {
      try {
        await apiFetch('/api/members/confirm-linkage', {
          method: 'POST',
          body: JSON.stringify({
            record_collection: 'children',
            record_id: docId,
            household_id: linkageConfirmedData.household_id,
            member_id: linkageConfirmedData.member_id
          })
        });
      } catch (err) {
        console.error('Linkage confirmation failed', err);
      }
    }
  };

  const handleSubmit = async (formData) => {
    const resolvedAshaId = localStorage.getItem('ashaId') || user?.uid;
    const resolvedHouseholdId = linkageConfirmedData?.household_id || formData.household_id || prefillData?._prefill_household_id || null;
    const resolvedMemberId = linkageConfirmedData?.member_id || prefillData?._prefill_member_id || formData.household_member_id || null;

    const payload = {
      moduleKey: 'child_growth',
      householdId: resolvedHouseholdId,
      householdMemberId: resolvedMemberId,
      ashaId: resolvedAshaId,
      referredToNrc: formData.referred_to_nrc === true || formData.referred_to_nrc === 'true',
      data: formData,
    };

    const result = await apiFetch('/api/surveySubmissions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (linkageConfirmedData && result) {
      await handleAfterSubmit(result.id || result.uuid);
    }
    return result;
  };

  return (
    <div className="space-y-4">
      {/* ── AI Malnutrition Scan Card ── */}
      <MalnutritionScannerWidget
        prefillData={prefillData}
        onGradeConfirmed={(payload) => {
          setPrefillData((prev) => ({
            ...prev,
            ...payload,
          }));
        }}
      />

      {/* ── Orphan Toggle ── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D3D1C7]">
        <label className="block text-sm font-medium mb-3 text-[#5F5E5A]">
          Does this child have parents or a guardian?
        </label>
        <div className="flex bg-gray-100 p-1 rounded-xl w-max mb-3">
          <button 
            type="button" 
            onClick={() => setHasParents(true)} 
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${hasParents ? 'bg-white shadow text-[#1A1A18]' : 'text-[#5F5E5A]'}`}>
            Yes
          </button>
          <button 
            type="button" 
            onClick={() => setHasParents(false)} 
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${!hasParents ? 'bg-white shadow text-[#1A1A18]' : 'text-[#5F5E5A]'}`}>
            No
          </button>
        </div>
        
        {!hasParents && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
            <span className="material-symbols-outlined text-blue-600 text-lg mt-0.5">info</span>
            <p className="text-sm text-blue-800 font-medium">
              This child will be registered as an independent record. No family linkage required.
            </p>
          </div>
        )}
      </div>

      {/* ── Regular Form ── */}
      <BaseModuleForm
        title="Child Growth / बाल विकास एवं पोषण"
        moduleIcon="child_care"
        collectionName="children"
        moduleName="child_growth"
        fields={FIELDS}
        initialValues={prefillData}
        onFormChange={setPrefillData}
        onSubmit={handleSubmit}
        showAadhaar={hasParents}
        aadhaarPersonLabel="Child / बालक"
        onAadhaarScanned={handleAadhaarEntered}
        afterSubmit={handleAfterSubmit}
        extraData={{
          isOrphan: !hasParents,
          hasParents: hasParents,
          ...( !hasParents ? { familyLinkageSkipped: true } : {} )
        }}
      />

      <AadhaarLinkagePopup
        isOpen={showLinkagePopup}
        memberName={linkageData?.member_name}
        familyHeadName={linkageData?.family_head}
        moduleType="Child Growth"
        onConfirm={handleConfirmLinkage}
        onReject={handleRejectLinkage}
        onClose={handleRejectLinkage}
      />
    </div>
  );
}


