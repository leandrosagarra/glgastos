import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Transaction } from '../types';
import { Send, Sparkles, RefreshCw, AlertCircle, Bot, User, HelpCircle, ArrowRight } from 'lucide-react';
import Markdown from 'react-markdown';

interface AiChatbotProps {
  transactions: Transaction[];
}

export const AiChatbot: React.FC<AiChatbotProps> = ({ transactions }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '¡Hola! Soy tu **Asistente Financiero Familiar con IA**.\n\nPuedo analizar todos los movimientos que cargues (ingresos y egresos) y darte consejos útiles sobre tu presupuesto o responder preguntas como:\n- *¿En qué gasté más este mes?*\n- *¿Qué gastos fijos tengo registrados?*\n- *¿Qué gastos variables puedo recortar para ahorrar?*\n- *¿Cuánto me queda disponible?*\n\n¿En qué te puedo ayudar hoy?',
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserInput('');
    setIsLoading(true);
    setError('');

    try {
      const chatHistory = [...messages, userMsg];
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory.map((m) => ({ role: m.role, content: m.content })),
          transactions,
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo comunicar con el asistente de IA. Verificá tu clave API.');
      }

      const data = await response.json();
      if (data.success && data.answer) {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-assistant`,
            role: 'assistant',
            content: data.answer,
            timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error(data.error || 'Ocurrió un error al generar la respuesta.');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div id="ai-chatbot-panel" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-[520px] overflow-hidden">
      
      {/* Bot Header */}
      <div className="p-4 border-b border-slate-50 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500 text-white rounded-xl shadow-sm shadow-indigo-500/20">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-display text-slate-800 dark:text-white flex items-center gap-1.5">
              Asistente Financiero IA
              <span className="inline-flex w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">Analista en tiempo real</span>
          </div>
        </div>
        <div className="text-[10px] font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
          <Sparkles className="w-2.5 h-2.5" />
          <span>Gemini 3.5</span>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar circle */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                isUser 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700' 
                  : 'bg-indigo-500 text-white'
              }`}>
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1">
                <div className={`p-3 rounded-2xl text-xs leading-relaxed border shadow-2xs ${
                  isUser
                    ? 'bg-slate-900 text-white border-slate-900 rounded-tr-none'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-200 border-slate-100/80 dark:border-slate-800/60 rounded-tl-none'
                }`}>
                  <div className="markdown-body">
                    <Markdown>{m.content}</Markdown>
                  </div>
                </div>
                <span className={`block text-[9px] text-slate-400 ${isUser ? 'text-right' : 'text-left'}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 mr-auto max-w-[85%]">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl rounded-tl-none border border-slate-100/80 dark:border-slate-800/60 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
              <span className="text-[11px] text-slate-500 font-medium">Analizando movimientos...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 rounded-xl text-2xs flex items-start gap-1.5 border border-red-100/50 dark:border-red-900/10">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Questions (Horizontally Scrollable) */}
      <div className="px-4 py-2 bg-slate-50/30 dark:bg-slate-800/10 border-t border-slate-50 dark:border-slate-800/60 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none shrink-0 select-none">
        <button
          onClick={() => handleQuickQuestion('¿En qué estoy gastando más este mes?')}
          className="px-2.5 py-1 text-[10px] font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 border border-slate-200/55 dark:border-slate-700/65 rounded-full transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-2xs"
        >
          <HelpCircle className="w-3 h-3 text-slate-400" />
          ¿En qué gasté más?
        </button>
        <button
          onClick={() => handleQuickQuestion('¿Cuánto me queda disponible?')}
          className="px-2.5 py-1 text-[10px] font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 border border-slate-200/55 dark:border-slate-700/65 rounded-full transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-2xs"
        >
          <HelpCircle className="w-3 h-3 text-slate-400" />
          ¿Cuánto queda disponible?
        </button>
        <button
          onClick={() => handleQuickQuestion('¿Qué gastos fijos tengo este mes?')}
          className="px-2.5 py-1 text-[10px] font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 border border-slate-200/55 dark:border-slate-700/65 rounded-full transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-2xs"
        >
          <HelpCircle className="w-3 h-3 text-slate-400" />
          ¿Qué gastos fijos tengo?
        </button>
        <button
          onClick={() => handleQuickQuestion('¿Qué puedo recortar para ahorrar?')}
          className="px-2.5 py-1 text-[10px] font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 border border-slate-200/55 dark:border-slate-700/65 rounded-full transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-2xs"
        >
          <HelpCircle className="w-3 h-3 text-slate-400" />
          ¿Qué puedo recortar?
        </button>
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(userInput);
        }}
        className="p-3 border-t border-slate-50 dark:border-slate-800/80 flex gap-2 items-center bg-white dark:bg-slate-900 shrink-0"
      >
        <input
          type="text"
          id="chat-user-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Preguntale algo a la IA..."
          disabled={isLoading}
          className="flex-1 py-2 px-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white transition-all"
        />
        <button
          type="submit"
          id="btn-chat-send"
          disabled={!userInput.trim() || isLoading}
          className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-sm shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
export default AiChatbot;
