import React, { useState } from 'react';
import {
  createApplicationFormDefaults,
  createApplicationFormSchema,
  type CreateApplicationFormValues,
} from '../../../schemas/application.schema';
import { useCreateApplication } from '../hooks/useCreateApplication';
import { useAllocationOptions } from '../hooks/useAllocationOptions';
import { getValidationErrorMessage } from '../../../lib/errors';
import { ErrorAlert } from '../../../components/feedback/ErrorAlert';

interface AllocationFormModalProps {
  onClose: () => void;
}

export const AllocationFormModal: React.FC<AllocationFormModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<CreateApplicationFormValues>(
    createApplicationFormDefaults
  );
  const [validationError, setValidationError] = useState('');

  const { jobs, candidates, isLoading: optionsLoading } = useAllocationOptions();
  const createApplication = useCreateApplication(onClose);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const parsed = createApplicationFormSchema.safeParse(formData);
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? 'Invalid form data');
      return;
    }

    createApplication.mutate(parsed.data);
  };

  const errorMessage =
    validationError ||
    (createApplication.isError
      ? getValidationErrorMessage(createApplication.error, 'Failed to create allocation')
      : '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant sticky top-0 bg-surface-container-lowest z-10">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">New Allocation</h2>
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
            <label className="block text-sm font-medium text-on-surface mb-1">
              Requirement / Job Opening *
            </label>
            <select
              required
              value={formData.job_opening_id}
              onChange={(e) => setFormData({ ...formData, job_opening_id: e.target.value })}
              disabled={optionsLoading}
              className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white disabled:opacity-60"
            >
              <option value="">Select a requirement...</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.role?.title} at {job.company?.name} ({job.location})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Candidate *</label>
            <select
              required
              value={formData.candidate_id}
              onChange={(e) => setFormData({ ...formData, candidate_id: e.target.value })}
              disabled={optionsLoading}
              className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white disabled:opacity-60"
            >
              <option value="">Select a candidate...</option>
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.full_name} ({candidate.current_role || 'No Role'},{' '}
                  {candidate.exp_years} yrs exp)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Expected Availability
            </label>
            <input
              type="date"
              value={formData.expected_availability ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, expected_availability: e.target.value })
              }
              className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Notes</label>
            <textarea
              value={formData.notes ?? ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
              disabled={createApplication.isPending || optionsLoading}
              className="px-6 py-2 bg-primary text-on-primary font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {createApplication.isPending ? 'Allocating...' : 'Allocate Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
