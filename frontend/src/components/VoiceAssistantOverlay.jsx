import React, { useState } from 'react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';

export default function VoiceAssistantOverlay({ moduleType, onDataReceived }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleData = (fields) => {
    setIsOpen(false);
    onDataReceived(fields);
  };
  
  const { isRecording, isProcessing, transcript, startRecording, stopRecording } = useVoiceRecorder(moduleType, handleData);

  const toggleOverlay = () => {
    if (isRecording) stopRecording();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        type="button"
        onClick={toggleOverlay}
        className="fixed bottom-24 right-6 w-[72px] h-[72px] bg-[#02343F] text-[#F0EDCC] border-2 border-[#F0EDCC]/40 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(2,52,63,0.35)] hover:scale-105 active:scale-95 transition-transform z-40"
      >
        <span className="material-symbols-outlined text-4xl">mic</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 backdrop-blur-sm">
           <div className="bg-[#FAF8EA] border border-[#D8D4B0] rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 pb-12 shadow-2xl animate-slide-up flex flex-col items-center">
              <div className="w-12 h-1 bg-[#D8D4B0] rounded-full mb-6 sm:hidden"></div>
              
              <h3 className="text-xl font-bold text-[#02343F] mb-2">Asha Vaani Voice Assistant</h3>
              <p className="text-sm text-[#02343F]/75 text-center mb-8 font-medium">
                 {isProcessing ? 'Processing your speech with AI...' : 
                  isRecording ? 'Listening... Speak clearly in Hindi, Kannada or English' : 
                  'Tap the microphone to start speaking'}
              </p>

              {isProcessing ? (
                 <div className="w-24 h-24 rounded-full bg-[#F0EDCC] border border-[#D8D4B0] flex items-center justify-center animate-pulse mb-8">
                    <span className="material-symbols-outlined text-[#02343F] text-4xl animate-spin">refresh</span>
                 </div>
              ) : (
                 <button 
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-28 h-28 rounded-full flex items-center justify-center mb-8 shadow-lg transition-all
                       ${isRecording ? 'bg-[#FCEBEB] text-[#E24B4A] shadow-[#E24B4A]/30 scale-110 animate-pulse' : 'bg-[#02343F] text-[#F0EDCC] shadow-[#02343F]/30 border-2 border-[#F0EDCC]/30'}
                    `}
                 >
                    <span className="material-symbols-outlined text-5xl">
                       {isRecording ? 'stop' : 'mic'}
                    </span>
                 </button>
              )}

              <button 
                 type="button"
                 onClick={toggleOverlay} 
                 disabled={isProcessing}
                 className="w-full py-3 text-[#5F5E5A] font-medium border border-[#D3D1C7] rounded-xl hover:bg-gray-50 disabled:opacity-50"
              >
                 Cancel
              </button>
           </div>
        </div>
      )}
    </>
  );
}
