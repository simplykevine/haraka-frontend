"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { PanelLeft, PanelRight, Plus, MessageSquare, LogOut, MoreVertical, Edit3, Trash2, User } from "lucide-react";
import { useThemeSafe } from "@/app/context/ThemeContext";

export default function Sidebar({
  conversations,
  selectedConversationId,
  setSelectedConversationId,
  onAddChat,
  onLogout,
  isMobile,
  showSidebar,
  setShowSidebar,
  onRenameConversation,
  onDeleteConversation,
  conversationError,
  setConversationError,
}: {
  conversations: { conversation_id: number; title: string; created_at: string }[];
  selectedConversationId: number | null;
  setSelectedConversationId: (id: number | null) => void;
  onAddChat: () => void;
  onLogout: () => void;
  isMobile: boolean;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  onRenameConversation: (id: number, title: string) => void;
  onDeleteConversation: (id: number) => void;
  conversationError?: string | null;
  setConversationError?: (v: string | null) => void;
}) {
  const { theme } = useThemeSafe();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const sidebarBg = theme === 'light' ? 'bg-blue-50' : 'bg-[#001533]';
  const sidebarText = theme === 'light' ? 'text-gray-900' : 'text-white';
  const collapsedBg = theme === 'light' ? 'bg-blue-100' : 'bg-[#001533]';
  const buttonBg = theme === 'light' ? 'bg-blue-200 hover:bg-blue-300' : 'bg-blue-900/70 hover:bg-[#003366]';
  const buttonText = theme === 'light' ? 'text-gray-900' : 'text-white';
  const activeItemBg = theme === 'light' ? 'bg-blue-300' : 'bg-[#003366]';
  const hoverItemBg = theme === 'light' ? 'hover:bg-blue-200' : 'hover:bg-[#003366]';
  const inputBg = theme === 'light' ? 'bg-blue-100' : 'bg-gray-700';
  const inputBorder = theme === 'light' ? 'border-blue-400' : 'border-cyan-400';
  const inputText = theme === 'light' ? 'text-gray-900' : 'text-white';
  const menuBg = theme === 'light' ? 'bg-blue-100' : 'bg-gray-800';
  const menuBorder = theme === 'light' ? 'border-blue-300' : 'border-gray-600';
  const menuHover = theme === 'light' ? 'hover:bg-blue-200' : 'hover:bg-gray-700';
  const logoutBorderColor = theme === 'light' ? 'border-blue-400' : 'border-cyan-500';
  const logoutTextColor = theme === 'light' ? 'text-blue-600' : 'text-cyan-400';
  const logoutHover = theme === 'light' ? 'hover:bg-blue-100' : 'hover:bg-cyan-500/10';
  const profileBorderColor = theme === 'light' ? 'border-blue-400' : 'border-blue-500';
  const profileTextColor = theme === 'light' ? 'text-blue-600' : 'text-blue-400';
  const profileHover = theme === 'light' ? 'hover:bg-blue-100' : 'hover:bg-blue-500/10';
  const secondaryText = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const emptyStateText = theme === 'light' ? 'text-gray-500' : 'text-gray-500';
  const errorBg = theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-50';
  const errorText = theme === 'light' ? 'text-yellow-900' : 'text-[#001533]';
  const errorDismiss = theme === 'light' ? 'text-yellow-700' : 'text-[#6484b1]';
  const modalBg = theme === 'light' ? 'bg-blue-100' : 'bg-gray-800';
  const modalText = theme === 'light' ? 'text-gray-900' : 'text-white';
  const confirmButtonBg = theme === 'light' ? 'bg-blue-300 hover:bg-blue-400' : 'bg-blue-600 hover:bg-blue-700';
  const cancelButtonBg = theme === 'light' ? 'bg-gray-300 hover:bg-gray-400' : 'bg-gray-600 hover:bg-gray-700';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const handleStartEdit = (id: number, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
    setMenuOpenId(null);
  };

  const handleSaveEdit = (id: number) => {
    if (editTitle.trim() && editTitle.trim() !== conversations.find(c => c.conversation_id === id)?.title) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle("");
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      onDeleteConversation(id);
    }
    setMenuOpenId(null);
  };

  const collapsedSidebar = (
    <div className={`h-full w-20 flex flex-col ${collapsedBg} ${sidebarText} transition-colors`}>
      <div className="flex flex-col items-center flex-1 pt-4">
        <button className={`mb-6 ${sidebarText} p-2 transition-colors`} onClick={() => setIsCollapsed(false)} aria-label="Expand Sidebar">
          <PanelRight size={24} />
        </button>
        <button className={`${buttonBg} ${buttonText} rounded-full p-2 my-2 transition-colors`} onClick={onAddChat} aria-label="Add Chat">
          <Plus size={20} />
        </button>
        <button
          className={`${buttonBg} ${buttonText} rounded-full p-2 my-2 transition-colors ${
            conversations.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => conversations.length > 0 && setSelectedConversationId(conversations[0].conversation_id)}
          aria-label="Conversations"
        >
          <MessageSquare size={20} />
        </button>
      </div>
      <div className="pb-4 flex justify-center">
        <button
          className={`bg-transparent border ${logoutBorderColor} ${logoutTextColor} rounded-full p-2 ${logoutHover} transition-colors`}
          onClick={() => setShowLogoutConfirm(true)}
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );

  const expandedSidebar = (
    <div className={`h-full w-72 flex flex-col ${sidebarBg} ${sidebarText} p-4 transition-colors`}>
      <div className="flex items-center justify-between mb-6">
        <Image src="/images/zeno-logo-icon.png" alt="Zeno Logo" width={40} height={40} />
        <button className={`${sidebarText} p-2 cursor-pointer transition-colors`} onClick={() => setIsCollapsed(true)} aria-label="Collapse Sidebar">
          <PanelLeft size={24} />
        </button>
      </div>
      {conversationError && (
        <div className={`${errorBg} ${errorText} px-4 py-2 rounded mb-3 text-center transition-colors`}>
          {conversationError}
          {setConversationError && (
            <button
              className={`ml-2 text-lg ${errorDismiss} underline transition-colors`}
              onClick={() => setConversationError(null)}
            >
              Dismiss
            </button>
          )}
        </div>
      )}
      <button
        className={`w-full ${buttonBg} ${buttonText} py-3 px-2 rounded-full flex items-center justify-center space-x-2 mb-6 cursor-pointer transition-colors`}
        onClick={onAddChat}
        aria-label="Add a new chat"
      >
        <Plus className="w-5 h-5" />
        <span>Add a new chat</span>
      </button>
      <h3 className={`text-sm ${secondaryText} mb-4 transition-colors`}>Conversations</h3>
      <div className="flex-1 overflow-y-auto pb-4 scrollbar-hide">
        {conversations.length === 0 ? (
          <div className={`${emptyStateText} text-center mt-8 transition-colors`}>No conversations yet</div>
        ) : (
          conversations.map((c) => (
            <div
              key={c.conversation_id}
              className={`p-3 rounded-lg mb-3 flex items-center justify-between transition-colors cursor-pointer relative ${
                selectedConversationId === c.conversation_id ? activeItemBg : hoverItemBg
              }`}
              onClick={() => {
                if (editingId === null) {
                  setSelectedConversationId(c.conversation_id);
                  if (isMobile) setShowSidebar(false);
                }
              }}
              title={c.title || "Untitled Conversation"}
              role="button"
              aria-label={c.title || "Untitled Conversation"}
            >
              {editingId === c.conversation_id ? (
                <div className="flex items-center w-full">
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleSaveEdit(c.conversation_id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(c.conversation_id);
                      else if (e.key === 'Escape') {
                        setEditingId(null);
                        setEditTitle("");
                      }
                    }}
                    className={`${inputBg} ${inputText} px-2 py-1 rounded border ${inputBorder} focus:outline-none focus:ring-1 focus:ring-cyan-400 flex-1 mr-2 transition-colors`}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center min-w-0">
                    <MessageSquare className="mr-2 flex-shrink-0" size={18} />
                    <span className={`truncate max-w-[140px] font-medium transition-colors`}>{c.title || "Untitled Conversation"}</span>
                  </div>
                  <button
                    className={`p-1 ${menuHover} rounded-full ml-2 flex-shrink-0 cursor-pointer transition-colors`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === c.conversation_id ? null : c.conversation_id);
                    }}
                    aria-label="Conversation options"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {menuOpenId === c.conversation_id && (
                    <div
                      ref={menuRef}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${menuBg} border ${menuBorder} rounded-md shadow-lg z-10 min-w-[120px] whitespace-nowrap transition-colors`}
                    >
                      <button
                        className={`block w-full text-left mt-4 px-3 py-2 text-sm ${menuHover} flex items-center cursor-pointer transition-colors`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(c.conversation_id, c.title);
                        }}
                      >
                        <Edit3 size={14} className="mr-2" />
                        Rename
                      </button>
                      <button
                        className={`block cursor-pointer w-full text-left px-3 py-2 text-sm ${menuHover} flex items-center ${theme === 'light' ? 'text-red-600' : 'text-red-400'} transition-colors`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(c.conversation_id);
                        }}
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
      <div className="pt-4 space-y-2">
        <button
          className={`w-full bg-transparent border ${profileBorderColor} ${profileTextColor} py-2 px-4 rounded-full flex items-center justify-center space-x-2 ${profileHover} cursor-pointer transition-colors`}
          onClick={() => window.location.href = "/profile"}
          aria-label="Go to Profile"
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
        
        <button
          className={`w-full bg-transparent border ${logoutBorderColor} ${logoutTextColor} py-2 px-4 rounded-full flex items-center justify-center space-x-2 ${logoutHover} cursor-pointer transition-colors`}
          onClick={() => setShowLogoutConfirm(true)}
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${modalBg} p-6 rounded-xl max-w-sm w-full text-center transition-colors`}>
            <h3 className={`text-xl font-semibold ${modalText} mb-2 transition-colors`}>Confirm Logout</h3>
            <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-4 transition-colors`}>Are you sure you want to logout?</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className={`${cancelButtonBg} ${modalText} px-4 py-2 rounded-md cursor-pointer transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className={`${confirmButtonBg} text-white px-4 py-2 rounded-md cursor-pointer transition-colors`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {isMobile && showSidebar ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex">
          {isCollapsed ? collapsedSidebar : expandedSidebar}
        </div>
      ) : isCollapsed ? collapsedSidebar : expandedSidebar}
    </>
  );
}