import React, { useState } from 'react';
import {
  createCandidateFormDefaults,
  createCandidateFormSchema,
  type CreateCandidateFormValues,
} from '../../../schemas/candidate.schema';
import { useCreateCandidate } from '../hooks/useCreateCandidate';
import { getValidationErrorMessage } from '../../../lib/errors';
import { ErrorAlert } from '../../../components/feedback/ErrorAlert';

interface CandidateFormModalProps {
  onClose: () => void;
}

export const CandidateFormModal: React.FC<CandidateFormModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<CreateCandidateFormValues>(createCandidateFormDefaults);
  const [validationError, setValidationError] = useState('');

  const createCandidate = useCreateCandidate(onClose);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const parsed = createCandidateFormSchema.safeParse(formData);
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? 'Invalid form data');
      return;
    }

    createCandidate.mutate(parsed.data);
  };

  const errorMessage =
    validationError ||
    (createCandidate.isError
      ? getValidationErrorMessage(createCandidate.error, 'Failed to create candidate')
      : '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant sticky top-0 bg-surface-container-lowest z-10">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Add New Candidate</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-surface-variant/20 rounded-full transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <ErrorAlert message={errorMessage} />

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="john@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="+44 7700 900001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Experience (Years) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.exp_years}
                onChange={(e) =>
                  setFormData({ ...formData, exp_years: Number(e.target.value) })
                }
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Availability Status *
              </label>
              <select
                value={formData.availability_status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availability_status: e.target
                      .value as CreateCandidateFormValues['availability_status'],
                  })
                }
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
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-on-surface mb-1">
                Expected Day Rate
              </label>
              <input
                type="number"
                min="0"
                value={formData.expected_day_rate ?? ''}
                onChange={(e) =>
                  setFormData({ ...formData, expected_day_rate: e.target.value })
                }
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g. 500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Preferred Location
              </label>
              <input
                type="text"
                value={formData.preferred_location ?? ''}
                onChange={(e) =>
                  setFormData({ ...formData, preferred_location: e.target.value })
                }
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g. London, UK"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Source *</label>
              <select
                value={formData.source}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    source: e.target.value as CreateCandidateFormValues['source'],
                  })
                }
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
            <label className="block text-sm font-medium text-on-surface mb-1">
              Primary Skills (Comma separated)
            </label>
            <input
              type="text"
              value={formData.skills ?? ''}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
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
              disabled={createCandidate.isPending}
              className="px-6 py-2 bg-primary text-on-primary font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {createCandidate.isPending ? 'Adding...' : 'Add Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
