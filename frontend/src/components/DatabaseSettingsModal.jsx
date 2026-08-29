import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Key,
  Shield,
  X,
  Layers,
  Sparkles
} from 'lucide-react';

export default function DatabaseSettingsModal({
  isOpen,
  onClose,
  dbStatus,
  onReconnect,
  onShowToast
}) {
  if (!isOpen) return null;

  const [dbType, setDbType] = useState('mysql');
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState(3306);
  const [dbName, setDbName] = useState('hospital_db');
  const [user, setUser] = useState('root');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (e) => {
    e.preventDefault();
    setIsConnecting(true);
    try {
      const res = await onReconnect({
        type: dbType,
        host,
        port: parseInt(port),
        dbName,
        user,
        password,
      });

      if (res?.connected) {
        onShowToast(`Successfully connected to ${res.activeDbType}!`, 'success');
      } else {
        onShowToast(`Could not connect: ${res?.lastError || 'Unknown error'}`, 'error');
      }
    } catch (err) {
      onShowToast(`Connection error: ${err.message}`, 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/60">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">JDBC Database Settings</h3>
              <p className="text-xs text-slate-500">Live Java Database Connectivity status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Live DB Status Card */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Active Connection
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                dbStatus?.connected
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {dbStatus?.connected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Connected
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Disconnected
                </>
              )}
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Database Engine:</span>
              <span className="font-bold text-teal-300">{dbStatus?.activeDbType || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">JDBC Driver:</span>
              <span className="font-mono text-[11px] text-slate-300">{dbStatus?.driver || 'com.mysql.cj.jdbc.Driver'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Connection URL:</span>
              <span className="font-mono text-[11px] text-slate-300 truncate max-w-[240px]">
                {dbStatus?.activeDbUrl || 'jdbc:...'}
              </span>
            </div>
            {dbStatus?.lastError && (
              <div className="pt-2 mt-2 border-t border-slate-800 text-[11px] text-rose-400">
                Notice: {dbStatus.lastError}
              </div>
            )}
          </div>
        </div>

        {/* Reconfigure / Connect Form */}
        <form onSubmit={handleConnect} className="space-y-4 text-xs">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Configure / Switch JDBC Target
          </h4>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Database Type</label>
            <select
              value={dbType}
              onChange={(e) => setDbType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500 font-semibold"
            >
              <option value="mysql">MySQL 8.0 (Local / Remote)</option>
              <option value="sqlite">SQLite (Embedded / Zero-Config File)</option>
            </select>
          </div>

          {dbType === 'mysql' && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Host / Server</label>
                  <input
                    type="text"
                    required
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Port</label>
                  <input
                    type="number"
                    required
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Database Name</label>
                <input
                  type="text"
                  required
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Enter MySQL password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isConnecting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
              <span>{isConnecting ? 'Testing JDBC Connection...' : 'Test & Connect DB'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
