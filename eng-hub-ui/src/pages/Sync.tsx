import React, { useState, useEffect } from 'react';
import { getSyncStatus, exportSync, importSync } from '../services/api';
import type { SyncStatus } from '../services/api';
import { RefreshCw, UploadCloud, DownloadCloud, AlertCircle, CheckCircle2 } from 'lucide-react';

const SyncPage: React.FC = () => {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<'export' | 'import' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const data = await getSyncStatus();
      setStatus(data);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to fetch sync status.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleExport = async () => {
    try {
      setActionLoading('export');
      setMessage(null);
      const res = await exportSync();
      setMessage({ type: 'success', text: res.message || 'Export successful.' });
      await fetchStatus(); // Refresh status after action
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to export.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleImport = async () => {
    try {
      setActionLoading('import');
      setMessage(null);
      const res = await importSync();
      setMessage({ type: 'success', text: res.message || 'Import successful.' });
      await fetchStatus(); // Refresh status after action
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to import.' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-mocha-text flex items-center gap-2">
          Sync Hub
        </h2>
        <button
          onClick={fetchStatus}
          disabled={loading || actionLoading !== null}
          className="text-mocha-sapphire hover:bg-mocha-sapphire/10 px-3 py-1.5 rounded transition-colors text-sm font-medium flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
          message.type === 'success' ? 'bg-mocha-green/10 text-mocha-green border border-mocha-green/20' : 'bg-mocha-rose/10 text-mocha-rose border border-mocha-rose/20'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-[#181825] border border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-mocha-sapphire/10 flex items-center justify-center mb-4">
            <UploadCloud className="w-8 h-8 text-mocha-sapphire" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-mocha-text">Export Memories</h3>
          <p className="text-gray-400 mb-6 flex-1">
            Package your local agent observations into a new chunk to share with the team.
          </p>
          <div className="bg-[#1e1e2e] rounded-lg p-4 w-full mb-6 border border-gray-800">
            <span className="text-2xl font-bold text-mocha-sapphire">{status?.LocalPending || 0}</span>
            <span className="text-sm text-gray-500 block uppercase tracking-wide font-semibold mt-1">Pending Export</span>
          </div>
          <button
            onClick={handleExport}
            disabled={loading || actionLoading !== null || !status || status.LocalPending === 0}
            className="w-full bg-mocha-sapphire text-mocha-base font-bold py-3 px-4 rounded-lg transition-colors hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {actionLoading === 'export' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
            Export to Team
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-[#181825] border border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-mocha-lavender/10 flex items-center justify-center mb-4">
            <DownloadCloud className="w-8 h-8 text-mocha-lavender" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-mocha-text">Import Memories</h3>
          <p className="text-gray-400 mb-6 flex-1">
            Fetch the latest chunks from your team and merge them into your local semantic database.
          </p>
          <div className="bg-[#1e1e2e] rounded-lg p-4 w-full mb-6 border border-gray-800">
            <span className="text-2xl font-bold text-mocha-lavender">{status?.RemotePending || 0}</span>
            <span className="text-sm text-gray-500 block uppercase tracking-wide font-semibold mt-1">Pending Import</span>
          </div>
          <button
            onClick={handleImport}
            disabled={loading || actionLoading !== null || !status || status.RemotePending === 0}
            className="w-full bg-mocha-lavender text-mocha-base font-bold py-3 px-4 rounded-lg transition-colors hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {actionLoading === 'import' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <DownloadCloud className="w-5 h-5" />}
            Import to Local
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyncPage;
