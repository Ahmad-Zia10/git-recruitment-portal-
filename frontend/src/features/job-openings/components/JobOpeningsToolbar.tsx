import React from 'react';

interface JobOpeningsToolbarProps {
  search: string;
  status: string;
  hiringType: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onHiringTypeChange: (value: string) => void;
}

export const JobOpeningsToolbar: React.FC<JobOpeningsToolbarProps> = ({
  search,
  status,
  hiringType,
  onSearchChange,
  onStatusChange,
  onHiringTypeChange,
}) => (
  <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 mb-6 flex flex-wrap items-center gap-4">
    <div className="flex-1 min-w-[300px] relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
        search
      </span>
      <input
        className="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary transition-all text-body-md"
        placeholder="Search by Requirement, Client or ID..."
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
    <div className="flex items-center gap-3">
      <div className="relative">
        <select
          className="appearance-none bg-white border border-outline-variant rounded-lg pl-4 pr-10 py-2 text-body-md focus:ring-2 focus:ring-primary-container/20 focus:border-primary cursor-pointer"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">Status: All</option>
          <option value="open">Open</option>
          <option value="on_hold">On Hold</option>
          <option value="filled">Filled</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
          expand_more
        </span>
      </div>
      <div className="relative">
        <select
          className="appearance-none bg-white border border-outline-variant rounded-lg pl-4 pr-10 py-2 text-body-md focus:ring-2 focus:ring-primary-container/20 focus:border-primary cursor-pointer"
          value={hiringType}
          onChange={(e) => onHiringTypeChange(e.target.value)}
        >
          <option value="">Hiring Type: All</option>
          <option value="permanent">Permanent</option>
          <option value="contract">Contract</option>
          <option value="fixed_term">Fixed Term</option>
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
          expand_more
        </span>
      </div>
      <button
        type="button"
        className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant"
        title="More Filters"
      >
        <span className="material-symbols-outlined">filter_list</span>
      </button>
    </div>
  </div>
);
