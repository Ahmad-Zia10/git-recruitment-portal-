import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/client';

interface JobOpeningFormProps {
  onClose: () => void;
}

export const JobOpeningForm: React.FC<JobOpeningFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    company_id: '',
    role_id: '',
    status: 'open' as 'open' | 'on_hold' | 'filled' | 'cancelled',
    min_exp_years: 0,
    max_exp_years: 5,
    budget_min: '',
    budget_max: '',
    budget_currency: 'GBP',
    hiring_type: 'permanent' as 'contract' | 'permanent' | 'fixed_term',
    min_contract_months: '',
    expected_start_date: '',
    notice_period_buyback: false,
    no_of_positions: 1,
    location: '',
    work_mode: 'hybrid' as 'onsite' | 'remote' | 'hybrid',
    job_description: '',
    required_skills: '',
    nice_to_have_skills: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  });

  // Fetch companies for dropdown
  const { data: companiesData } = useQuery({
    queryKey: ['companies', 'active-list'],
    queryFn: async () => {
      const response = await apiClient.get('/companies', { params: { limit: 100 } });
      return response.data.data || [];
    },
  });

  // Fetch roles for dropdown
  const { data: rolesData } = useQuery({
    queryKey: ['roles', 'list'],
    queryFn: async () => {
      const response = await apiClient.get('/roles', { params: { limit: 100 } });
      return response.data.data || [];
    },
  });

  const companies = companiesData || [];
  const roles = rolesData || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: any = {
        company_id: formData.company_id,
        role_id: formData.role_id,
        status: formData.status,
        min_exp_years: Number(formData.min_exp_years),
        max_exp_years: Number(formData.max_exp_years),
        budget_currency: formData.budget_currency,
        hiring_type: formData.hiring_type,
        notice_period_buyback: formData.notice_period_buyback,
        no_of_positions: Number(formData.no_of_positions),
        location: formData.location,
        work_mode: formData.work_mode,
        priority: formData.priority,
        required_skills: formData.required_skills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
      };

      if (formData.budget_min !== '') payload.budget_min = Number(formData.budget_min);
      if (formData.budget_max !== '') payload.budget_max = Number(formData.budget_max);
      if (formData.min_contract_months !== '') payload.min_contract_months = Number(formData.min_contract_months);
      if (formData.expected_start_date) {
        payload.expected_start_date = new Date(formData.expected_start_date).toISOString();
      }
      if (formData.job_description) payload.job_description = formData.job_description;
      if (formData.nice_to_have_skills) {
        payload.nice_to_have_skills = formData.nice_to_have_skills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
      }

      await apiClient.post('/job-openings', payload);
      queryClient.invalidateQueries({ queryKey: ['jobOpenings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardAggregates'] });
      onClose();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const fieldErrors = Object.entries(err.response.data.errors)
          .map(([field, msgs]: any) => `${field}: ${msgs.join(', ')}`)
          .join(' | ');
        setError(`Validation failed: ${fieldErrors}`);
      } else {
        setError(err.response?.data?.message || 'Failed to create job opening');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant sticky top-0 bg-surface-container-lowest z-10">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Add New Requirement</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-surface-variant/20 rounded-full transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-error-container text-on-error-container rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Client / Company *</label>
              <select
                required
                value={formData.company_id}
                onChange={e => setFormData({ ...formData, company_id: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value="">Select a client...</option>
                {companies.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Role / Job Title *</label>
              <select
                required
                value={formData.role_id}
                onChange={e => setFormData({ ...formData, role_id: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value="">Select a role...</option>
                {roles.map((r: any) => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Hiring Type *</label>
              <select
                value={formData.hiring_type}
                onChange={e => setFormData({ ...formData, hiring_type: e.target.value as any })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value="permanent">Permanent</option>
                <option value="contract">Contract</option>
                <option value="fixed_term">Fixed Term</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Work Mode *</label>
              <select
                value={formData.work_mode}
                onChange={e => setFormData({ ...formData, work_mode: e.target.value as any })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g. London, UK or Remote"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">No. of Positions *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.no_of_positions}
                onChange={e => setFormData({ ...formData, no_of_positions: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Min Experience (Years) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.min_exp_years}
                onChange={e => setFormData({ ...formData, min_exp_years: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Max Experience (Years) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.max_exp_years}
                onChange={e => setFormData({ ...formData, max_exp_years: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Currency *</label>
              <select
                value={formData.budget_currency}
                onChange={e => setFormData({ ...formData, budget_currency: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-on-surface mb-1">Min Budget</label>
                <input
                  type="number"
                  min="0"
                  value={formData.budget_min}
                  onChange={e => setFormData({ ...formData, budget_min: e.target.value })}
                  className="w-full px-3 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface mb-1">Max Budget</label>
                <input
                  type="number"
                  min="0"
                  value={formData.budget_max}
                  onChange={e => setFormData({ ...formData, budget_max: e.target.value })}
                  className="w-full px-3 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Priority *</label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Expected Start Date</label>
              <input
                type="date"
                value={formData.expected_start_date}
                onChange={e => setFormData({ ...formData, expected_start_date: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            {formData.hiring_type === 'contract' && (
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Min Contract (Months)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.min_contract_months}
                  onChange={e => setFormData({ ...formData, min_contract_months: e.target.value })}
                  className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Status *</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value="open">Open</option>
                <option value="on_hold">On Hold</option>
                <option value="filled">Filled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="notice_period_buyback"
              checked={formData.notice_period_buyback}
              onChange={e => setFormData({ ...formData, notice_period_buyback: e.target.checked })}
              className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary"
            />
            <label htmlFor="notice_period_buyback" className="text-sm font-medium text-on-surface">Notice Period Buyback Allowed</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Required Skills * (Comma separated)</label>
            <input
              type="text"
              required
              value={formData.required_skills}
              onChange={e => setFormData({ ...formData, required_skills: e.target.value })}
              className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="e.g. React, TypeScript, Node.js"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Nice-to-Have Skills (Comma separated)</label>
            <input
              type="text"
              value={formData.nice_to_have_skills}
              onChange={e => setFormData({ ...formData, nice_to_have_skills: e.target.value })}
              className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="e.g. Docker, AWS"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Job Description</label>
            <textarea
              value={formData.job_description}
              onChange={e => setFormData({ ...formData, job_description: e.target.value })}
              className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none h-32 resize-none"
              placeholder="Describe the job opening roles & responsibilities..."
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
              {loading ? 'Adding...' : 'Add Requirement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
