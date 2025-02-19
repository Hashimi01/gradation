//  VoteForm.js
"use client"
import React from 'react';
import { Vote } from 'lucide-react';

const VoteForm = ({ newVote, setNewVote, handleSubmit, loading }) => (
  <form className="glass p-6 rounded-2xl mb-12 max-w-2xl mx-auto" onSubmit={handleSubmit}>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">رقم الطالب</label>
        <input
  type="text"
  value={newVote.id}
  onChange={(e) => setNewVote({ ...newVote, id: e.target.value })}
  className="w-full p-3 rounded-lg bg-white/5 border border-purple-500/20 focus:border-purple-500 transition-colors"
  required
  placeholder="مثال: c-21454"
  pattern="^c-\d{5}$"
  title="يجب أن يكون رقم الطالب بالصيغة: c-xxxxx"
/>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">الاسم</label>
        <input
          type="text"
          value={newVote.name}
          onChange={(e) => setNewVote({ ...newVote, name: e.target.value })}
          className="w-full p-3 rounded-lg bg-white/5 border border-purple-500/20 focus:border-purple-500 transition-colors"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">التخصص</label>
        <select
          value={newVote.fliere}
          onChange={(e) => setNewVote({ ...newVote, fliere: e.target.value })}
          className="w-full p-3 rounded-lg bg-white/5 border border-purple-500/20 focus:border-purple-500 transition-colors"
          required
        >
          <option value="">اختر تخصصك</option>
          <option value="DAII">DAII</option>
          <option value="MIAGE">MIAGE</option>
          <option value="TSER">TSER</option>
          <option value="EEA">EEA</option>
          <option value="PF">PF</option>
          <option value="SP">SP</option>
          <option value="CHIMIE">CHIMIE</option>
          <option value="MI">MI</option>
          <option value="MA">MA</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">اسم الدفعة المقترح</label>
        <input
          type="text"
          value={newVote.vote}
          onChange={(e) => setNewVote({ ...newVote, vote: e.target.value })}
          className="w-full p-3 rounded-lg bg-white/5 border border-purple-500/20 focus:border-purple-500 transition-colors"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            جاري الإرسال...
          </>
        ) : (
          <>
            <Vote className="w-5 h-5" />
            تصويت
          </>
        )}
      </button>
    </div>
  </form>
);

export default VoteForm;
