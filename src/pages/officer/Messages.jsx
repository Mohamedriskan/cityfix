import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { messageService } from '../../services/messageService';
import { PageHeader } from '../../components/common/PageHeader';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { LoadingState } from '../../components/common/LoadingState';
import { MessageSquare, Send, Hash } from 'lucide-react';

export const Messages = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  const chatEndRef = useRef(null);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await messageService.getConversations();
      setConversations(data || []);
      if (data && data.length > 0 && !data.find(c => c.id === activeChatId)) {
        setActiveChatId(data[0].id);
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatId, conversations]);

  const activeChat = conversations.find(c => c.id === activeChatId) || null;

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || !activeChat) return;

    const text = inputVal.trim();
    setSending(true);
    try {
      const resp = await messageService.sendMessage(activeChat.id, text);
      const newMsg = {
        id: resp.messageId || Date.now(),
        senderId: currentUser?.id,
        senderName: currentUser?.name || 'Officer',
        text,
        timestamp: new Date().toISOString(),
      };

      setConversations(prev => prev.map(chat => {
        if (chat.id === activeChat.id) {
          return {
            ...chat,
            lastMessage: text,
            lastUpdated: new Date().toISOString(),
            messages: [...(chat.messages || []), newMsg],
          };
        }
        return chat;
      }));

      // Notify the citizen that the officer sent them a message
      try {
        await addNotification(
          activeChat.citizenId,
          activeChat.ticketId,
          null,
          `Officer ${currentUser?.name || ''}: ${text}`.trim(),
          'info'
        );
      } catch (notifErr) {
        console.error('Failed to notify citizen:', notifErr);
      }

      setInputVal('');
      setToastType('success');
      setToastMsg('Message sent to citizen successfully.');
    } catch (err) {
      setToastType('error');
      setToastMsg(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 text-left h-[82vh]">
        <PageHeader
          title="Dialogue Operations Console"
          subtitle="Secure message line for communicating dispatch details to citizens."
          breadcrumbs={[{ label: 'Operations Chat', link: '/officer/messages' }]}
          className="mb-0 border-none pb-0"
        />
        <LoadingState message="Loading conversation threads..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left h-[82vh]">
      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
      )}

      <PageHeader
        title="Dialogue Operations Console"
        subtitle="Secure message line for communicating dispatch details to citizens."
        breadcrumbs={[{ label: 'Operations Chat', link: '/officer/messages' }]}
        className="mb-0 border-none pb-0"
      />

      {conversations.length === 0 ? (
        <div className="flex-1 glass-panel rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-2xl flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center gap-3 select-none p-8">
            <MessageSquare className="w-10 h-10 text-slate-300 animate-pulse" />
            <p className="text-sm font-bold text-slate-500">No active conversations</p>
            <p className="text-xs text-slate-400">
              Conversation threads will appear here when citizens report issues or query updates.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 glass-panel rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-2xl flex divide-x divide-slate-200/50 dark:divide-slate-800/50 flex-col md:flex-row">
          <div className="w-full md:w-80 md:shrink-0 flex flex-col h-56 md:h-full bg-slate-50/30 dark:bg-slate-900/10">
            <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-100/30 dark:bg-slate-950/20 select-none">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                Active Conversations
              </h4>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col divide-y divide-slate-100 dark:divide-slate-800/30">
              {conversations.map((chat) => {
                const isActive = chat.id === activeChatId;
                return (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`p-3.5 text-left cursor-pointer transition-all duration-200 flex items-start gap-3 select-none ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-blue/10 to-brand-purple/10 border-l-4 border-l-brand-blue'
                        : 'hover:bg-slate-100/40 dark:hover:bg-slate-800/20'
                    }`}
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(chat.citizenName || 'Citizen')}`}
                      alt="Citizen avatar"
                      className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 bg-white"
                    />
                    <div className="flex-1 flex flex-col gap-0.5 overflow-hidden text-left">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {chat.citizenName}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium">
                          {new Date(chat.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-brand-blue uppercase flex items-center gap-0.5 mt-0.5">
                        <Hash className="w-2.5 h-2.5" />
                        {chat.ticketId || '—'}
                      </span>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-1">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-1 flex flex-col h-[55vh] md:h-full bg-white/20 dark:bg-slate-900/10">
            {activeChat ? (
              <>
                <div className="px-6 py-3.5 border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-100/30 dark:bg-slate-950/20 flex items-center justify-between select-none">
                  <div className="flex items-center gap-3 text-left">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeChat.citizenName || 'Citizen')}`}
                      alt="Citizen"
                      className="w-9 h-9 rounded-xl border bg-white"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 dark:text-white">
                        {activeChat.citizenName}
                      </span>
                      <span className="text-[10px] font-bold text-brand-blue uppercase flex items-center gap-0.5">
                        Ticket ID: {activeChat.ticketId || '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                  {(activeChat.messages || []).map((msg, idx) => {
                    const isCurrentUser = msg.senderId === currentUser?.id;
                    return (
                      <div
                        key={msg.id ?? idx}
                        className={`flex flex-col max-w-[70%] text-left ${
                          isCurrentUser ? 'self-end items-end' : 'self-start items-start'
                        }`}
                      >
                        <span className="text-[10px] text-slate-400 font-bold mb-1 select-none">
                          {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm font-medium ${
                            isCurrentUser
                              ? 'bg-gradient-to-tr from-brand-blue to-brand-purple text-white rounded-tr-none'
                              : 'glass-panel text-slate-800 dark:text-slate-200 rounded-tl-none border-slate-200/60 dark:border-slate-800/80'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-100/30 dark:bg-slate-950/20 flex gap-3 items-center"
                >
                  <Input
                    placeholder={`Send message to ${(activeChat.citizenName || 'Citizen').split(' ')[0]}...`}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="text-xs"
                  />
                  <Button type="submit" variant="gradient" icon={Send} className="px-4.5 py-2" disabled={sending} isLoading={sending}>
                    {sending ? 'Sending...' : 'Send'}
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 select-none">
                <MessageSquare className="w-10 h-10 text-slate-300 animate-pulse" />
                <p className="text-sm font-bold text-slate-500">Select a conversation thread</p>
                <p className="text-xs text-slate-400">Queries filed by citizens will appear in the sidebar.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Messages;