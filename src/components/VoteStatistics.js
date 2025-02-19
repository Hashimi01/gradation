"use client";
import React from 'react';
import { BarChart3 } from 'lucide-react';

const VoteStatistics = ({ ratings, totalVotes, handleAnalyze, analyzing, loading }) => {
    // إضافة التحقق من البيانات
    const validRatings = Array.isArray(ratings) ? ratings : [];
    
    return (
      <div className="glass p-6 rounded-2xl mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            إحصائيات التصويت
          </h2>
          {/* إضافة زر التحليل */}
          <button
            onClick={handleAnalyze}
            disabled={analyzing || loading}
            className="py-2 px-4 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            {analyzing ? 'جاري التحليل...' : 'تحليل التصويتات'}
          </button>
        </div>

      {/* عرض رسالة عند عدم توفر إحصائيات */}
      {validRatings.length === 0 ? (
        <p className="text-gray-400 text-center">لا توجد إحصائيات متاحة بعد.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {validRatings.map((rating, index) => (
            <div key={index} className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">{rating.المعنى}</h3>
              <div className="flex items-center justify-between">
                <span className="text-purple-400">{rating.العدد} صوت</span>
                <div className="w-24 bg-purple-900/30 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${totalVotes > 0 ? (rating.العدد / totalVotes) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoteStatistics;
