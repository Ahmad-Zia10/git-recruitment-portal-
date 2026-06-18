import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/client';

interface AllocationFormProps {
  onClose: () => void;
}

export const AllocationForm: React.FC<AllocationFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    job_opening_id: '',
    candidate_id: '',
    expected_availability: '',
    notes: '',
  });

  // Fetch open requirements
  const { data: jobsData } = useQuery({
    queryKey: ['jobOpenings', 'open-list'],
    queryFn: async () => {
      const response = await apiClient.get('/job-openings', { params: { status: 'open', limit: 100 } });
      return response.data.data.data || [];
    },
  });

  // Fetch active candidates
  const { data: candidatesData } = useQuery({
    queryKey: ['candidates', 'active-list'],
    queryFn: async () => {
      const response = await apiClient.get('/candidates', { params: { status: 'active', limit: 100 } });
      return response.data.data.data || [];
    },
  });

  const jobs = jobsData || [];
  const candidates = candidatesData || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: any = {
        job_opening_id: formData.job_opening_id,
        candidate_id: formData.candidate_id,
        status: 'shortlisted',
      };

      if (formData.expected_availability) {
        payload.expected_availability = new Date(formData.expected_availability).toISOString();
      }
      if (formData.notes) {
        payload.notes = formData.notes;
      }

      await apiClient.post('/applications', payload);
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardAggregates'] });
      onClose();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const fieldErrors = Object.entries(err.response.data.errors)
          .map(([field, msgs]: any) => `${field}: ${msgs.join(', ')}`)
          .join(' | ');
        setError(`Validation failed: ${fieldErrors}`);
      } else {
        setError(err.response?.data?.message || 'Failed to create allocation');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant sticky top-0 bg-surface-container-lowest z-10">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">New Allocation</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-surface-variant/20 rounded-full transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-error-container text-on-error-container rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Requirement / Job Opening *</label>
            <select
              required
              value={formData.job_opening_id}
              onChange={e => setFormData({ ...formData, job_opening_id: e.target.value })}
              className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
            >
              <option value="">Select a requirement...</option>
              {jobs.map((j: any) => (
                <option key={j.id} value={j.id}>
                  {j.role?.title} at {j.company?.name} ({j.location})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Resource / Candidate *</label>
            <select
              required
              value={formData.candidate_id}
              onChange={e => setFormData({ ...formData, candidate_id: e.target.value })}
              className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
            >
              <option value="">Select a candidate...</option>
              {candidates.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.current_role || 'No Role'}, {c.exp_years} yrs exp)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Expected Availability</label>
            <input
              type="date"
              value={formData.expected_availability}
              onChange={e => setFormData({ ...formData, expected_availability: e.target.value })}
              className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none h-24 resize-none"
              placeholder="Add details about this allocation..."
            />
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-on-surface-variant font-semibold hover:bg-surface-variant/10 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-on-primary font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Allocating...' : 'Allocate Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
