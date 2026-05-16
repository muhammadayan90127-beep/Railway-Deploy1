import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { useSendChatMessage } from '@workspace/api-client-react';
import VisitingCard from './VisitingCard';

interface ChatMessage { role: 'user' | 'assistant'; content: string; }

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! Welcome to MH Interior Design. How can I assist you with your space today?' }
  ]);
  const [input, setInput] = useState('');
  const sendChat = useSendChatMessage();

  const handleSend = async (messageText: string) => {
    if (!messageText.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setInput('');
    try {
      const response = await sendChat.mutateAsync({ data: { message: messageText, history: messages } });
      setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting right now. Please try calling us!' }]);
    }
  };

  const quickReplies = ["What services do you offer?", "Book a free consultation", "Interior budget estimate"];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ duration: 0.2 }}
            className="absolute bottom-32 right-0 w-[350px] sm:w-[400px] h-[500px] bg-card/95 backdrop-blur-xl border border-border shadow-2xl flex flex-col overflow-hidden"
            data-testid="chat-panel"
          >
            <div className="bg-background border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-foreground">MH Assistant</h3>
                  <span className="text-[10px] uppercase tracking-wider text-primary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Online
                  </span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-foreground/50 hover:text-foreground transition-colors"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-muted' : 'bg-primary/20'}`}>
                    {msg.role === 'user' ? <User size={14} className="text-foreground/70" /> : <Bot size={14} className="text-primary" />}
                  </div>
                  <div className={`p-3 text-sm font-sans max-w-[80%] rounded-xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted/50 border border-border text-foreground rounded-tl-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {sendChat.isPending && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center"><Bot size={14} className="text-primary" /></div>
                  <div className="p-3 text-sm font-sans bg-muted/50 border border-border text-foreground rounded-xl rounded-tl-sm flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-primary" /> Typing...
                  </div>
                </div>
              )}
            </div>

            {messages.length === 1 && (
              <div className="p-4 pt-0 flex flex-wrap gap-2">
                {quickReplies.map((reply, idx) => (
                  <button key={idx} onClick={() => handleSend(reply)} className="text-xs font-sans border border-primary/30 text-primary px-3 py-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">{reply}</button>
                ))}
              </div>
            )}

            <div className="p-4 bg-background border-t border-border">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex items-center gap-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-muted/50 border border-border text-sm font-sans px-4 py-2 focus:outline-none focus:border-primary transition-colors text-foreground" />
                <button type="submit" disabled={!input.trim() || sendChat.isPending} className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visiting Card button — ABOVE chat button */}
      <VisitingCard />

      {/* Chat toggle button */}
      <button onClick={() => setIsOpen(!isOpen)} className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300" data-testid="chat-toggle">
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};
