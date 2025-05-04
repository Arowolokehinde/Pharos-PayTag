"use client";

import { FC, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    ChevronDown,
    X,
    MessageCircle,
    Bot,
    User,
    Paperclip,
    Mic,
    Loader,
    Sparkles,
    CheckCircle,
    Clock,
    Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChatMessage {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    status: 'sending' | 'sent' | 'seen' | 'error';
}

interface SuggestionItem {
    text: string;
    icon?: JSX.Element;
}

const ElegantChatbot: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "welcome",
            content: "Hello! Welcome to RealPayTag customer support. How can I assist you with our decentralized finance solutions today?",
            sender: 'bot',
            timestamp: new Date(),
            status: 'seen'
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const suggestions: SuggestionItem[] = [
        { text: "How do I create a PayTag?", icon: <Tag className="w-3 h-3" /> },
        { text: "What are the transaction fees?", icon: <Clock className="w-3 h-3" /> },
        { text: "How to convert to airtime?", icon: <Sparkles className="w-3 h-3" /> },
        { text: "Is my wallet secure?", icon: <CheckCircle className="w-3 h-3" /> }
    ];

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            content: message,
            sender: 'user',
            timestamp: new Date(),
            status: 'sending'
        };

        setMessages(prev => [...prev, userMessage]);
        setMessage("");
        simulateBotResponse(userMessage.id);
    };

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    const simulateBotResponse = (replyToId: string) => {
        // Update status of original message
        setTimeout(() => {
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === replyToId ? { ...msg, status: 'sent' } : msg
                )
            );
        }, 500);

        // Show typing indicator
        setIsTyping(true);

        // Simulate bot response after delay
        setTimeout(() => {
            setIsTyping(false);

            // Update the status of the user message to 'seen'
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === replyToId ? { ...msg, status: 'seen' } : msg
                )
            );

            // Generate appropriate response based on user message
            const userMessageContent = messages.find(msg => msg.id === replyToId)?.content.toLowerCase() || '';
            let botResponse = "";

            if (userMessageContent.includes("paytag") || userMessageContent.includes("tag")) {
                botResponse = "PayTags are human-readable identifiers for your wallet address, similar to an email address or username. You can create one from your dashboard by clicking on 'Create PayTag' and following the verification steps.";
            } else if (userMessageContent.includes("fee") || userMessageContent.includes("transaction")) {
                botResponse = "Our transaction fees are significantly lower than traditional payment providers. For standard transactions, we charge 0.5% with a cap of $5 per transaction. For enterprise users, we offer custom fee structures.";
            } else if (userMessageContent.includes("airtime") || userMessageContent.includes("convert")) {
                botResponse = "Converting your RPSC tokens to airtime is easy! Navigate to the 'Conversions' tab on your dashboard, select your telecom provider, enter your phone number, and specify the amount you wish to convert.";
            } else if (userMessageContent.includes("secure") || userMessageContent.includes("security") || userMessageContent.includes("wallet")) {
                botResponse = "Your RealPayTag wallet is secured with bank-grade encryption and multi-signature protection. We implement industry-leading security protocols and regular audits to ensure your assets are protected at all times.";
            } else {
                botResponse = "Thank you for your message. Our team is available to help with all your RealPayTag needs. Is there anything specific about our decentralized payment solutions you'd like to learn more about?";
            }

            const newBotMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: botResponse,
                sender: 'bot',
                timestamp: new Date(),
                status: 'sent'
            };

            setMessages(prev => [...prev, newBotMessage]);
        }, 2000);
    };

    const handleSuggestionClick = (text: string) => {
        setMessage(text);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            {/* Main Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="mb-4 w-full sm:w-96 overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col relative"
                        style={{
                            maxHeight: "600px",
                            borderRadius: "28px 28px 28px 5px",
                            boxShadow: "0 20px 30px -10px rgba(14, 165, 233, 0.2), 0 10px 15px -5px rgba(20, 184, 166, 0.15)"
                        }}
                    >
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-t-2xl flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-semibold">PayTag Assistant</h3>
                                    <div className="flex items-center text-xs text-white/80">
                                        <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                                        Online
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={toggleChat}
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className="flex items-end max-w-[80%] group">
                                        {msg.sender === 'bot' && (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white mr-2 flex-shrink-0">
                                                <Bot className="w-4 h-4" />
                                            </div>
                                        )}
                                        <div
                                            className={`rounded-2xl px-4 py-3 ${msg.sender === 'bot'
                                                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-sm shadow-sm'
                                                    : 'bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-br-sm'
                                                }`}
                                        >
                                            <div className="text-sm">{msg.content}</div>
                                            <div className="mt-1 text-right">
                                                <span className={`text-[10px] ${msg.sender === 'bot' ? 'text-slate-500 dark:text-slate-400' : 'text-white/80'}`}>
                                                    {formatTime(msg.timestamp)}
                                                    {msg.sender === 'user' && (
                                                        <span className="ml-1">
                                                            {msg.status === 'sending' && <Loader className="inline w-2 h-2 animate-spin" />}
                                                            {msg.status === 'sent' && <CheckCircle className="inline w-2 h-2" />}
                                                            {msg.status === 'seen' && (
                                                                <div className="inline-flex">
                                                                    <CheckCircle className="inline w-2 h-2" />
                                                                    <CheckCircle className="inline w-2 h-2 -ml-1" />
                                                                </div>
                                                            )}
                                                            {msg.status === 'error' && <X className="inline w-2 h-2 text-red-500" />}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        {msg.sender === 'user' && (
                                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 ml-2 flex-shrink-0">
                                                <User className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex items-end max-w-[80%]">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white mr-2 flex-shrink-0">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="rounded-2xl px-4 py-3 bg-white dark:bg-slate-800 rounded-bl-sm shadow-sm">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce" style={{ animationDelay: "600ms" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggested Questions */}
                        {messages.length <= 2 && (
                            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Suggested questions:</p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestions.map((suggestion, i) => (
                                        <Badge
                                            key={i}
                                            className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/40 dark:text-blue-400 text-xs py-1 px-2.5"
                                            onClick={() => handleSuggestionClick(suggestion.text)}
                                        >
                                            {suggestion.icon && <span className="mr-1">{suggestion.icon}</span>}
                                            {suggestion.text}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Message Input */}
                        <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-full text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700"
                                    onClick={handleFileUpload}
                                >
                                    <Paperclip className="w-4 h-4" />
                                </Button>
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 absolute right-1 top-1/2 transform -translate-y-1/2"
                                    >
                                        <Mic className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Button
                                    type="submit"
                                    className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white p-0 flex items-center justify-center"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>

                        {/* Powered by Label */}
                        <div className="absolute bottom-full right-0 mb-2">
                            <Badge className="bg-gradient-to-r from-blue-600/10 to-teal-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs backdrop-blur-sm">
                                Powered by RealPayTag AI
                            </Badge>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleChat}
                className="relative flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg"
                style={{
                    borderRadius: isOpen ? "18px 18px 5px 18px" : "18px 18px 18px 5px",
                    boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.3), 0 8px 10px -6px rgba(20, 184, 166, 0.2)"
                }}
            >
                {isOpen ? (
                    <ChevronDown className="w-6 h-6" />
                ) : (
                    <MessageCircle className="w-6 h-6" />
                )}

                {!isOpen && messages.length > 1 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] font-bold">
                        1
                    </span>
                )}
            </motion.button>
        </div>
    );
};

export default ElegantChatbot;