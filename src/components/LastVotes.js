"use client"
import React from "react";
import { Users, Vote } from "lucide-react";

const LastVotes = ({ votes, loading }) => (
  <div className="">
    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
      <Users className="w-6 h-6 text-purple-400" />
      آخر التصويتات
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-96 overflow-y-auto">
      {loading ? (
        <div className="col-span-3 text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        </div>
      ) : votes.length === 0 ? (
        <div className="col-span-3 text-center py-10">
          <p className="text-gray-400">لا توجد تصويتات حتى الآن. كن أول المصوتين!</p>
        </div>
      ) : (
        votes.map((vote, index) => (
          <div
            key={index}
            className="glass p-6 rounded-2xl hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 max-h-48"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{vote.name}</h3>
                  <span className="text-sm text-gray-400">{vote.fliere}</span>
                </div>
              </div>
              <span className="text-sm bg-purple-500/20 px-3 py-1 rounded-full text-purple-300">
                {vote.id}
              </span>
            </div>
            <div className="mt-4 p-4 bg-white/5 rounded-lg">
              <div className="flex items-start gap-2">
                <Vote className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-sm text-gray-400">الاقتراح</span>
                  <p className="text-lg font-medium">{vote.vote}</p>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default LastVotes;
