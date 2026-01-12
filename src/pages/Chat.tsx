import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send, Phone, MoreVertical, Lock, Sparkles } from 'lucide-react';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageBubble from '@/components/chat/MessageBubble';
import GuidedPrompts from '@/components/chat/GuidedPrompts';
import ReportDialog from '@/components/chat/ReportDialog';
import BoundarySheet from '@/components/chat/BoundarySheet';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface ChatPartner {
  id: string;
  pseudonym: string;
  journeyStage: string | null;
}

const VOICE_CALL_THRESHOLD = 20;

export default function Chat() {
  const { oderId } = useParams<{ oderId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [partner, setPartner] = useState<ChatPartner | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [myMessageCount, setMyMessageCount] = useState(0);
  const [partnerMessageCount, setPartnerMessageCount] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [showBoundary, setShowBoundary] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isVoiceCallUnlocked = myMessageCount >= VOICE_CALL_THRESHOLD && partnerMessageCount >= VOICE_CALL_THRESHOLD;
  const messagesUntilUnlock = Math.max(0, VOICE_CALL_THRESHOLD - Math.min(myMessageCount, partnerMessageCount));

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Load partner info and messages
  useEffect(() => {
    const loadChat = async () => {
      if (!user || !oderId) return;

      try {
        // Get partner profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('pseudonym')
          .eq('user_id', oderId)
          .maybeSingle();

        if (profileError) throw profileError;

        // Get journey stage
        const { data: journeyData } = await supabase
          .from('user_journey_stages')
          .select('stage')
          .eq('user_id', oderId)
          .maybeSingle();

        setPartner({
          id: oderId,
          pseudonym: profileData?.pseudonym || 'Unknown',
          journeyStage: journeyData?.stage || null,
        });

        // Generate conversation ID using database function
        const { data: convIdData, error: convIdError } = await supabase
          .rpc('get_conversation_id', { user1: user.id, user2: oderId });

        if (convIdError) throw convIdError;
        
        const convId = convIdData as string;
        setConversationId(convId);

        // Load existing messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', convId)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;

        setMessages(messagesData || []);
        
        // Count messages
        const myCount = (messagesData || []).filter(m => m.sender_id === user.id).length;
        const theirCount = (messagesData || []).filter(m => m.sender_id === oderId).length;
        setMyMessageCount(myCount);
        setPartnerMessageCount(theirCount);

        // Mark unread messages as read
        if (messagesData?.some(m => m.recipient_id === user.id && !m.read)) {
          await supabase
            .from('messages')
            .update({ read: true })
            .eq('recipient_id', user.id)
            .eq('sender_id', oderId);
        }
      } catch (error: any) {
        toast({
          title: 'Error loading chat',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, [user, oderId, toast]);

  // Subscribe to new messages
  useEffect(() => {
    if (!conversationId || !user) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages(prev => [...prev, newMsg]);
          
          if (newMsg.sender_id === user.id) {
            setMyMessageCount(prev => prev + 1);
          } else {
            setPartnerMessageCount(prev => prev + 1);
            // Mark as read
            supabase
              .from('messages')
              .update({ read: true })
              .eq('id', newMsg.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user || !oderId || !conversationId || sending) return;

    setSending(true);
    const content = newMessage.trim();
    setNewMessage('');

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          recipient_id: oderId,
          content,
        });

      if (error) throw error;
    } catch (error: any) {
      setNewMessage(content);
      toast({
        title: 'Error sending message',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setNewMessage(prompt);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading chat...</div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-inset animate-fade-in">
      {/* Header */}
      <ChatHeader
        partner={partner}
        isVoiceCallUnlocked={isVoiceCallUnlocked}
        messagesUntilUnlock={messagesUntilUnlock}
        onBack={() => navigate(-1)}
        onReport={() => setShowReport(true)}
        onBoundary={() => setShowBoundary(true)}
      />

      {/* Guided Prompts */}
      {messages.length < 5 && (
        <GuidedPrompts onSelect={handlePromptSelect} />
      )}

      {/* Messages */}
      <ScrollArea 
        ref={scrollRef}
        className="flex-1 px-4 py-2"
      >
        <div className="space-y-3 pb-4">
          {messages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-secondary" />
              <p className="text-sm">Start a conversation!</p>
              <p className="text-xs mt-1">Use the guided prompts above for ideas.</p>
            </div>
          )}
          
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender_id === user?.id}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Voice Call Progress */}
      {!isVoiceCallUnlocked && (
        <div className="px-4 py-2 bg-muted/50 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            <span>
              Voice calls unlock after {VOICE_CALL_THRESHOLD} messages each 
              ({Math.min(myMessageCount, partnerMessageCount)}/{VOICE_CALL_THRESHOLD})
            </span>
          </div>
          <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-secondary transition-all"
              style={{ 
                width: `${Math.min(100, (Math.min(myMessageCount, partnerMessageCount) / VOICE_CALL_THRESHOLD) * 100)}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            className="flex-1"
            maxLength={1000}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <ReportDialog
        open={showReport}
        onOpenChange={setShowReport}
        reportedUserId={oderId || ''}
      />
      
      <BoundarySheet
        open={showBoundary}
        onOpenChange={setShowBoundary}
        partnerId={oderId || ''}
      />
    </div>
  );
}
