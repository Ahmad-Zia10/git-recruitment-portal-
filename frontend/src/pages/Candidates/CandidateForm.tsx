import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/client';

interface CandidateFormProps {
  onClose: () => void;
}

export const CandidateForm: React.FC<CandidateFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    exp_years: 0,
    currency: 'GBP',
    expected_day_rate: '',
    availability_status: 'immediate' as 'immediate' | 'notice_period' | 'not_looking' | 'open_to_opportunities',
    preferred_location: '',
    source: 'linkedin' as 'referral' | 'linkedin' | 'job_board' | 'direct' | 'agency',
    skills: '', // comma-separated primary skills
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: any = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        exp_years: Number(formData.exp_years),
        currency: formData.currency,
        availability_status: formData.availability_status,
        preferred_location: formData.preferred_location || undefined,
        source: formData.source,
      };

      if (formData.expected_day_rate !== '') {
        payload.expected_day_rate = Number(formData.expected_day_rate);
      }

      // 1. Create the Candidate
      const response = await apiClient.post('/candidates', payload);
      const candidateId = response.data.data.id;

      // 2. Add Skills if specified
      if (formData.skills.trim()) {
        const skillsList = formData.skills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);

        for (const skill of skillsList) {
          try {
            await apiClient.post(`/candidates/${candidateId}/skills`, {
              skill,
              is_primary: true,
              proficiency: 'intermediate',
            });
          } catch (skillErr) {
            console.error(`Failed to add skill: ${skill}`, skillErr);
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardAggregates'] });
      onClose();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const fieldErrors = Object.entries(err.response.data.errors)
          .map(([field, msgs]: any) => `${field}: ${msgs.join(', ')}`)
          .join(' | ');
        setError(`Validation failed: ${fieldErrors}`);
      } else {
        setError(err.response?.data?.message || 'Failed to create candidate');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant sticky top-0 bg-surface-container-lowest z-10">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Add New Candidate</h2>
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
            <label className="block text-sm font-medium text-on-surface mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="john@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="+44 7700 900001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Experience (Years) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.exp_years}
                onChange={e => setFormData({ ...formData, exp_years: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Availability Status *</label>
              <select
                value={formData.availability_status}
                onChange={e => setFormData({ ...formData, availability_status: e.target.value as any })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value="immediate">Immediate</option>
                <option value="notice_period">On Notice Period</option>
                <option value="open_to_opportunities">Open to Opportunities</option>
                <option value="not_looking">Not Looking</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-on-surface mb-1">Currency *</label>
              <select
                value={formData.currency}
                onChange={e => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-on-surface mb-1">Expected Day Rate</label>
              <input
                type="number"
                min="0"
                value={formData.expected_day_rate}
                onChange={e => setFormData({ ...formData, expected_day_rate: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g. 500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Preferred Location</label>
              <input
                type="text"
                value={formData.preferred_location}
                onChange={e => setFormData({ ...formData, preferred_location: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g. London, UK"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Source *</label>
              <select
                value={formData.source}
                onChange={e => setFormData({ ...formData, source: e.target.value as any })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value="linkedin">LinkedIn</option>
                <option value="referral">Referral</option>
                <option value="job_board">Job Board</option>
                <option value="direct">Direct</option>
                <option value="agency">Agency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Primary Skills (Comma separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={e => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="e.g. React, TypeScript, Node.js"
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
              {loading ? 'Adding...' : 'Add Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
