"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Vote, CheckCircle2, BarChart3 } from 'lucide-react';
import { getVotes, getRatings, addVote, updateRatingAtIndex } from "../firebase/firebase-operations";
import { sendMessage } from "./chatApi";

const initialVoteState = { id: '', name: '', fliere: '', vote: '' };

const VoteList = () => {
  const [votes, setVotes] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [newVote, setNewVote] = useState(initialVoteState);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [votesData, ratingsData] = await Promise.all([getVotes(), getRatings()]);
      
      if (votesData && Array.isArray(votesData)) {
        setVotes(votesData);
      }
      
      if (ratingsData && Array.isArray(ratingsData)) {
        setRatings(ratingsData);
      }
    } catch (error) {
      console.error('🚨 خطأ في جلب البيانات:', error);
      setError('حدث خطأ في جلب البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleAnalyze = useCallback(async () => {
    if (votes.length === 0) {
      setError("⚠️ لا توجد بيانات لتحليلها.");
      return;
    }

    setAnalyzing(true);
    setError("");

    try {
      const message = `ما هو المعنى الأكثر شمولًا بين هذه الأسماء المقترحة للدفعة؟ ${JSON.stringify(votes)}`;
      const response = await sendMessage(message);
      
      let parsedContent;
      try {
        parsedContent = Array.isArray(response.content) 
          ? response.content 
          : JSON.parse(response.content || "[]");
      } catch (parseError) {
        throw new Error("❌ تنسيق البيانات غير صالح");
      }

      if (!Array.isArray(parsedContent)) {
        throw new Error("⚠️ البيانات المستلمة غير صالحة");
      }

      const updatePromises = parsedContent.map(({ المعنى, العدد }, i) =>
        updateRatingAtIndex(i, المعنى, العدد)
      );

      await Promise.all(updatePromises);
      setRatings(parsedContent);
      setError("");
    } catch (err) {
      console.error("🚨 خطأ أثناء تحليل البيانات:", err);
      setError(err.message || "⚠️ حدث خطأ أثناء تحليل البيانات.");
    } finally {
      setAnalyzing(false);
    }
  }, [votes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitStatus({ type: '', message: '' });

    try {
      const { id, name, fliere, vote } = newVote;
      
      if (!id?.trim() || !name?.trim() || !fliere?.trim() || !vote?.trim()) {
        throw new Error('⚠️ يرجى ملء جميع الحقول المطلوبة.');
      }

      // تحقق من صحة رقم الطالب
      if (!/^c-\d{5}$/i.test(id.trim())) {
        throw new Error('⚠️ رقم الطالب غير صالح. يجب أن يكون بالصيغة: c-xxxxx');
      }

      await addVote(newVote);
      setSubmitStatus({ type: 'success', message: '✅ تم إضافة تصويتك بنجاح!' });
      setNewVote(initialVoteState);
      
      await loadInitialData();
      await handleAnalyze();
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: error.message || '❌ حدث خطأ أثناء إضافة التصويت.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const totalVotes = ratings.reduce((sum, item) => sum + (item.العدد || 0), 0);

  const specialties = [
    { value: "DAII", label: "DAII" },
    { value: "MIAGE", label: "MIAGE" },
    { value: "TSER", label: "TSER" },
    { value: "EEA", label: "EEA" },
    { value: "PF", label: "PF" },
    { value: "SP", label: "SP" },
    { value: "CHIMIE", label: "CHIMIE" },
    { value: "MI", label: "MI" },
    { value: "MA", label: "MA" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 px-4 md:px-0">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="text-center mb-20" variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            ✨ شارك باقتراحك! ✨
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            ساهم في اختيار اسم دفعتنا وكن جزءاً من صنع التاريخ
          </p>
        </motion.div>

        {!loading && ratings.length > 0 && (
          <motion.div variants={itemVariants} className="glass p-6 rounded-2xl mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                إحصائيات التصويت
              </h2>
              <button
                onClick={handleAnalyze}
                disabled={analyzing || loading}
                className="py-2 px-4 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                {analyzing ? 'جاري التحليل...' : 'تحليل التصويتات'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ratings.map((rating, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">{rating.المعنى}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400">
                      {rating.العدد} صوت
                    </span>
                    <div className="w-24 bg-purple-900/30 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{
                          width: `${totalVotes ? (rating.العدد / totalVotes) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/20 text-red-200 flex items-center gap-2">
                <Vote className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}
          </motion.div>
        )}

        <motion.form
          variants={itemVariants}
          className="glass p-6 rounded-2xl mb-12 max-w-2xl mx-auto"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">رقم الطالب</label>
              <input
                type="text"
                value={newVote.id}
                onChange={(e) => setNewVote(prev => ({ ...prev, id: e.target.value }))}
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
                onChange={(e) => setNewVote(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 rounded-lg bg-white/5 border border-purple-500/20 focus:border-purple-500 transition-colors"
                required
                minLength={2}
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">التخصص</label>
              <select
                value={newVote.fliere}
                onChange={(e) => setNewVote(prev => ({ ...prev, fliere: e.target.value }))}
                className="w-full p-3 rounded-lg bg-white/5 border border-purple-500/20 focus:border-purple-500 transition-colors"
                required
              >
                <option value="">اختر تخصصك</option>
                {specialties.map(specialty => (
                  <option key={specialty.value} value={specialty.value}>
                    {specialty.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">اسم الدفعة المقترح</label>
              <input
                type="text"
                value={newVote.vote}
                onChange={(e) => setNewVote(prev => ({ ...prev, vote: e.target.value }))}
                className="w-full p-3 rounded-lg bg-white/5 border border-purple-500/20 focus:border-purple-500 transition-colors"
                required
                minLength={2}
                maxLength={100}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
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

          {submitStatus.message && (
            <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
              submitStatus.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
            }`}>
              {submitStatus.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              ) : (
                <Vote className="w-5 h-5 flex-shrink-0" />
              )}
              {submitStatus.message}
            </div>
          )}
        </motion.form>

        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            آخر التصويتات
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-96 overflow-y-auto">
            {loading ? (
              <div className="col-span-3 text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto" />
              </div>
            ) : votes.length === 0 ? (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-400">لا توجد تصويتات حتى الآن. كن أول المصوتين!</p>
              </div>
            ) : (
              votes.map((vote, index) => (
                <div
                  key={index}
                  className="glass p-6 rounded-2xl hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 max-h-56 w-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-ellipsis overflow-hidden">
                          {vote.name}
                        </h3>
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
                        <p className="text-lg font-medium break-words">{vote.vote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default VoteList;