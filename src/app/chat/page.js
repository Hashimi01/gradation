// src/app/chat/page.js
"use client";
import Chat from "@/components/Chat";

export default function ChatPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center w-full pt-24">
                    <Chat />
                </div>
            </div>
        </main>
    );
}