import React from 'react';
import { LoadingState } from '../../../components/feedback/LoadingState';
import type { Company } from '../../../types/company.types';

interface ClientsTableProps {
  clients: Company[];
  isLoading: boolean;
  isError: boolean;
}

function statusBadgeClass(status: Company['status']) {
  if (status === 'active') return 'bg-green-100 text-green-800';
  if (status === 'prospect') return 'bg-blue-100 text-blue-800';
  return 'bg-gray-100 text-gray-800';
}

export const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  isLoading,
  isError,
}) => (
  <section className="flex-1 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col min-h-[400px]">
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-outline-variant bg-surface-container-low/30">
            <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Client Name
            </th>
            <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Industry
            </th>
            <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5}>
                <LoadingState />
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={5} className="p-8 text-center text-error">
                Failed to load clients
              </td>
            </tr>
          ) : clients.length === 0 ? (
            <tr>
              <td className="py-32" colSpan={5}>
                <div className="flex flex-col items-center justify-center text-center opacity-60">
                  <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
                    <span
                      className="material-symbols-outlined text-display-lg"
                      style={{ fontSize: '48px' }}
                    >
                      domain
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                    No clients found
                  </h3>
                </div>
              </td>
            </tr>
          ) : (
            clients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-outline-variant/50 hover:bg-surface-variant/5"
              >
                <td className="px-6 py-4">
                  <div className="font-body-md font-semibold text-on-surface">{client.name}</div>
                </td>
                <td className="px-6 py-4 font-body-md text-on-surface">
                  {client.industry ?? '—'}
                </td>
                <td className="px-6 py-4 font-body-md text-on-surface">
                  {[client.city, client.country].filter(Boolean).join(', ') || '—'}
                </td>
                <td className="px-6 py-4">
                  <div className="font-body-md text-on-surface">{client.contact_name ?? '—'}</div>
                  {client.contact_email && (
                    <div className="text-xs text-on-surface-variant">{client.contact_email}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusBadgeClass(client.status)}`}
                  >
                    {client.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
);
