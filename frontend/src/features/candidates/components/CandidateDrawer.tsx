import React from 'react';
import type { Candidate } from '../../../types/candidate.types';

interface CandidateDrawerProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CandidateDrawer: React.FC<CandidateDrawerProps> = ({
  candidate,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !candidate) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
        onClick={onClose}
        role="presentation"
      />
      <aside className="fixed right-0 top-0 h-screen w-full sm:w-[600px] bg-white shadow-2xl z-[70] flex flex-col border-l border-outline-variant transition-transform transform">
        <div className="p-6 border-b border-outline-variant flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-surface-container-low flex items-center justify-center overflow-hidden">
              <span
                className="material-symbols-outlined text-on-surface-variant"
                style={{ fontSize: '32px' }}
              >
                person
              </span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md">{candidate.full_name}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {candidate.current_role || 'No role'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex px-6 border-b border-outline-variant bg-surface-container-low/20 overflow-x-auto no-scrollbar">
          <button
            type="button"
            className="px-4 py-4 font-label-md text-label-md text-primary border-b-2 border-primary whitespace-nowrap"
          >
            Overview
          </button>
          <button
            type="button"
            className="px-4 py-4 font-label-md text-label-md text-on-surface-variant hover:text-primary whitespace-nowrap"
          >
            Skills
          </button>
          <button
            type="button"
            className="px-4 py-4 font-label-md text-label-md text-on-surface-variant hover:text-primary whitespace-nowrap"
          >
            Work History
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-background/50 custom-scrollbar">
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-on-surface mb-2">Contact Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-on-surface-variant block">Email</span>
                  <span>{candidate.email}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Phone</span>
                  <span>{candidate.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-outline-variant bg-white flex gap-4">
          <button
            type="button"
            className="flex-1 bg-primary text-white py-3 rounded-lg font-label-md text-label-md font-semibold hover:opacity-90"
          >
            Schedule Interview
          </button>
          <button
            type="button"
            className="px-6 py-3 border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-low"
          >
            Download CV
          </button>
        </div>
      </aside>
    </>
  );
};
