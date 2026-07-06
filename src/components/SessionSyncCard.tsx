import React, { useState } from 'react';
import { Cloud, Copy, Check, RefreshCw, Users, ArrowRight, ShieldCheck } from 'lucide-react';

interface SessionSyncCardProps {
  sessionId: string;
  onSessionIdChange: (newId: string) => void;
  isSyncing: boolean;
}

export const SessionSyncCard: React.FC<SessionSyncCardProps> = ({
  sessionId,
  onSessionIdChange,
  isSyncing,
}) => {
  const [newSessionInput, setNewSessionInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleJoinOrCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = newSessionInput.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (sanitized) {
      onSessionIdChange(sanitized);
      setNewSessionInput('');
      setIsEditing(false);
    }
  };

  return (
    <div id="session-sync-card" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-4 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/40 dark:bg-indigo-950/5 rounded-bl-full pointer-events-none" />
      
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Cloud className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
              Sincronización en la Nube Activa
              <span className={`inline-flex w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-400 animate-spin' : 'bg-emerald-500'}`} />
            </h4>
            <p className="text-[11px] text-slate-400 font-medium">Tus movimientos se guardan seguros en tiempo real</p>
          </div>
        </div>
      </div>

      {/* Code Display or Join Input */}
      {!isEditing ? (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Código de Tu Sesión Familiar</span>
            <span className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
              {sessionId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <button
              onClick={handleCopyCode}
              className="flex-1 sm:flex-none py-2 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold border border-slate-200/60 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              title="Copiar código para compartir"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>

            {/* Change Session Trigger */}
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 sm:flex-none py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-500/10"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Unirse / Cambiar</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleJoinOrCreate} className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              Ingresá un Código de Sesión (Ej: FAMILIA-SAGARRA)
            </label>
            <input
              type="text"
              required
              placeholder="Ej: FAMILIA-1234, GASTOS-LEO"
              value={newSessionInput}
              onChange={(e) => setNewSessionInput(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white uppercase font-mono tracking-wider"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 py-1.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/55 dark:border-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm shadow-indigo-500/10"
            >
              <span>Conectar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* Cloud explanation */}
      <div className="flex flex-col gap-2.5 bg-slate-50/50 dark:bg-slate-800/10 p-3.5 rounded-xl border border-dashed border-slate-100 dark:border-slate-800/50">
        <div className="flex items-start gap-2 text-2xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p className="leading-normal">
            <strong>¿Cómo funciona?</strong> Podés ingresar el mismo código en el celular de tu pareja, tablet o computadora. Cualquier ingreso o gasto que cargue cualquiera se reflejará instantáneamente en todos los dispositivos conectados.
          </p>
        </div>
        <div className="h-px bg-slate-100 dark:bg-slate-800/30 w-full" />
        <div className="text-2xs text-slate-500 dark:text-slate-400 leading-normal bg-indigo-50/20 dark:bg-indigo-950/10 p-2.5 rounded-lg border border-indigo-100/30 dark:border-indigo-950/30">
          💡 <strong>¡Creá tu propio código memorable!</strong> No estás obligado a usar el código aleatorio. Hacé clic en <strong>"Unirse / Cambiar"</strong>, ingresá un código personalizado y fácil de recordar (como <code>FAMILIA-SAGARRA</code> o <code>LEO-GASTOS</code>) y conectalo. De esta manera, siempre que entres desde cualquier celular o computadora, tus movimientos estarán guardados y listos.
        </div>
      </div>
    </div>
  );
};

export default SessionSyncCard;
