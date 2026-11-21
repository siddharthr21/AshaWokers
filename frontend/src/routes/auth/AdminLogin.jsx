import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useConfigStore } from '../../utils/configStore';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const ngoFormNewUrl = useConfigStore(state => state.ngoFormNewUrl) || '#';
  const ngoFormExistingUrl = useConfigStore(state => state.ngoFormExistingUrl) || '#';

  const handleNgoAction = (url) => {
    if (url === '#') {
      toast.error('NGO form not configured. Contact admin.')
      return
    }
    window.open(url, '_blank')
    setShowNGOModal(false);
  };
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showNGOModal, setShowNGOModal] = useState(false);
  const navigate = useNavigate();
  const { login, getSupabase } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password, navigate);
    } catch (err) {
      console.error('[AdminLogin] Login error:', err);
      if (err.message && err.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Check the demo credentials below.');
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) { setError('Enter your email first'); return; }
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setResetSent(true);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex text-[#02343F] font-sans relative overflow-hidden bg-[#02343F]">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="flex-1 hidden lg:flex flex-col justify-center px-16 z-10 text-white">
        <img src="/logo.png?v=2" alt="Asha Vaani Logo" className="w-70 mb-4" onError={(e) => { e.target.style.display='none'; }} />
        <h1 className="text-6xl font-bold mb-6 text-[#F0EDCC]">Asha Vaani Supervisor</h1>
        <p className="text-2xl text-[#F0EDCC]/85 max-w-xl leading-relaxed">Manage your coverage area, monitor critical health alerts, and deploy dynamic surveys across the district.</p>
      </div>
      <div className="w-full lg:w-1/3 min-w-[400px] bg-[#F0EDCC] flex flex-col justify-center items-center py-12 px-8 z-10 relative shadow-[-20px_0_40px_rgba(2,52,63,0.3)]">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#02343F] rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-3 rotate-3 border border-[#F0EDCC]/30">
              <span className="material-symbols-outlined text-[#F0EDCC] text-3xl -rotate-3">shield_locked</span>
            </div>
            <h2 className="text-3xl font-bold mb-2 text-[#02343F]">Admin Portal</h2>
            <p className="text-[#02343F]/75 font-medium">Sign in with your admin credentials.</p>
          </div>

          {error && (
            <div className="mb-6 bg-[#FCEBEB] text-[#791F1F] p-4 rounded-xl border border-[#E24B4A] text-sm">
              <div className="flex items-start">
                <span className="material-symbols-outlined mr-2 flex-shrink-0">error</span>
                <p>{error}</p>
              </div>
            </div>
          )}

          {resetSent && (
            <div className="mb-6 bg-[#FAF8EA] text-[#02343F] p-4 rounded-xl border border-[#02343F]/40 text-sm font-semibold">
              Password reset email sent! Check your inbox.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#02343F]/80">Email Address</label>
              <input
                type="email"
                id="admin-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border-2 border-[#D8D4B0] rounded-xl focus:outline-none focus:border-[#02343F] focus:ring-2 focus:ring-[#02343F]/20 transition-all bg-white text-[#02343F]"
                placeholder="sunita.sharma@asha.gov.in"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#02343F]/80">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="admin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-12 border-2 border-[#D8D4B0] rounded-xl focus:outline-none focus:border-[#02343F] focus:ring-2 focus:ring-[#02343F]/20 transition-all bg-white text-[#02343F]"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#02343F]/60 hover:text-[#02343F]"
                >
                  <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="admin-login-btn"
              disabled={isLoading}
              className="w-full bg-[#02343F] text-[#F0EDCC] py-3.5 px-6 rounded-xl font-bold shadow-md hover:bg-[#012128] transition-all flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <>
                  <span className="material-symbols-outlined mr-2">login</span>
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          <button
            onClick={handleForgotPassword}
            className="w-full mt-3 text-sm text-[#02343F]/80 hover:text-[#02343F] font-medium transition-colors underline"
          >
            Forgot password?
          </button>

          {/* Demo Credentials
               IMPORTANT: These must match the actual seeded asha_heads row exactly.
               DB row: asha_heads WHERE email = 'admin@asha.gov.in'
               Auth:   Supabase auth.users id = 018cdf21-0b84-4a27-ab0a-2794585c2e0e
               If either the email or password shown here changes, update seed_demo_dataset.sql
               AND re-run scripts/fix-admin-password.js so auth and DB stay in sync. */}
          <div 
            onClick={() => {
              setEmail('admin@asha.gov.in');
              setPassword('Admin@123');
            }}
            className="mt-4 bg-[#FAF8EA] border border-[#02343F] rounded-xl p-4 cursor-pointer hover:bg-[#F0EDCC] transition-all"
            title="Click to auto-fill demo credentials"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-[#02343F] flex items-center">
                <span className="material-symbols-outlined text-[16px] align-middle mr-1">key</span> Demo Credentials
              </p>
              <span className="text-[10px] text-[#02343F] font-semibold bg-white border border-[#02343F]/20 px-2 py-0.5 rounded-full">Tap to autofill</span>
            </div>
            {/* Must match: asha_heads.email = 'admin@asha.gov.in' */}
            <p className="text-xs text-[#02343F] font-mono">Email: admin@asha.gov.in</p>
            {/* Must match: password set via scripts/fix-admin-password.js */}
            <p className="text-xs text-[#02343F] font-mono mt-1">Password: Admin@123</p>
          </div>

          <div className="mt-6 flex flex-col items-center gap-3 w-full">
            <button onClick={() => navigate('/login')} className="text-sm text-[#5F5E5A] hover:text-[#02343F] transition-colors underline">Return to ASHA Mobile App</button>
            
            <button
              onClick={() => setShowNGOModal(true)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #02343F',
                borderRadius: '8px',
                background: 'white',
                color: '#02343F',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              className="hover:bg-[#FAF8EA] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">business</span>
              NGO / Orphanage Portal
            </button>
          </div>
        </div>
      </div>

      {/* NGO Modal — shown when NGO button is clicked */}
      {showNGOModal && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.5)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000
        }}>
          <div style={{
            background:'white', borderRadius:'16px', padding:'24px',
            width:'320px', display:'flex', flexDirection:'column', gap:'12px'
          }}>
            <h3 style={{fontSize:'18px', fontWeight:600, margin:0, color:'#1A1A18'}}>NGO Portal</h3>
            <p style={{fontSize:'13px', color:'#666', margin:0}}>
              Are you registering a new NGO or managing an existing one?
            </p>

            <button
              onClick={() => handleNgoAction(ngoFormNewUrl)}
              style={{padding:'12px', background:'#02343F', color:'white', border:'none',
                      borderRadius:'8px', fontSize:'14px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span> Register New NGO
            </button>

            <button
              onClick={() => handleNgoAction(ngoFormExistingUrl)}
              style={{padding:'12px', background:'white', color:'#02343F',
                      border:'1px solid #02343F', borderRadius:'8px', fontSize:'14px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span> Already Registered NGO
            </button>

            <button
              onClick={() => setShowNGOModal(false)}
              style={{padding:'8px', background:'none', border:'none',
                      color:'#888', fontSize:'13px', cursor:'pointer'}}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
