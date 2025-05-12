import React from 'react';
interface WhyLockSheetProps {
  isOpen: boolean;
  onClose: () => void;
}
export const WhyLockSheet = ({
  isOpen,
  onClose
}: WhyLockSheetProps) => {
  if (!isOpen) return null;
  return <>
      <div className="fixed inset-0 bg-black/20 z-40 transition-opacity" onClick={onClose} />
      <div className={`
        fixed bottom-0 left-0 right-0 
        bg-white rounded-t-[20px] 
        p-6 z-50 
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        max-h-[90vh] overflow-y-auto
      `}>
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
        <h3 className="text-xl font-bold mb-4 text-[#101010]">Why Lock?</h3>
        <div className="space-y-4 mb-8">
          <p className="flex items-start gap-3 text-[#4C4C4C]">
            <span className="text-[#FF6B4A] text-xl">•</span>
            <span>Instant SMS the moment the home lists</span>
          </p>
          <p className="flex items-start gap-3 text-[#4C4C4C]">
            <span className="text-[#FF6B4A] text-xl">•</span>
            <span>Everyone else waits 48 h</span>
          </p>
          <p className="flex items-start gap-3 text-[#4C4C4C]">
            <span className="text-[#FF6B4A] text-xl">•</span>
            <span>Only 1 lock per house</span>
          </p>
        </div>
        <button onClick={onClose} className="w-full bg-black text-white font-medium rounded-full py-4">
          Got it
        </button>
      </div>
    </>;
};