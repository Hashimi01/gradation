"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Vote, CheckCircle2, BarChart3 } from 'lucide-react';
import { db } from "../firebase/firebase"; // تأكد من المسار الصحيح
import { collection, getDocs } from "firebase/firestore";
import { fetchData, getVotes, getVoteStatistics, addVote } from "../firebase/firebase-operations";

const VoteList = () => {
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing database connection...');
        const testData = await fetchData('votes');
        console.log('Test result:', testData);
      } catch (error) {
        console.error('Connection test failed:', error);
      }
    };

    testConnection();
  }, []);

    const [votes, setVotes] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [loading, setLoading] = useState(true);
    const [newVote, setNewVote] = useState({
      id: '',
      name: '',
      fliere: '',
      vote: ''
    });
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  
    // أضف هذا الكود هنا للاختبار
    useEffect(() => {
      const testFirebase = async () => {
        try {
          const testDoc = await getDocs(collection(db, 'votes'));
          console.log('Test successful:', testDoc);
        } catch (error) {
          console.error('Firebase test failed:', error);
        }
      };
      testFirebase();
    }, []);
  
    // باقي الكود الموجود...

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [votesData, statsData] = await Promise.all([
          getVotes(),
          getVoteStatistics()
        ]);
        setVotes(votesData);
        setStatistics(statsData);
      } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addVote(newVote);
      setSubmitStatus({ 
        type: 'success', 
        message: 'تم إضافة تصويتك بنجاح! شكراً لمشاركتك' 
      });
      
      // تحديث البيانات
      const [updatedVotes, updatedStats] = await Promise.all([
        getVotes(),
        getVoteStatistics()
      ]);
      setVotes(updatedVotes);
      setStatistics(updatedStats);
      
      // إعادة تعيين النموذج
      setNewVote({ id: '', name: '', fliere: '', vote: '' });
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: error.message || 'حدث خطأ أثناء إضافة التصويت' 
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
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
        <motion.div
          className="text-center mb-20"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            ✨ شارك باقتراحك! ✨
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            ساهم في اختيار اسم دفعتنا وكن جزءاً من صنع التاريخ
          </p>
        </motion.div>

        {/* إحصائيات التصويت */}
        {!loading && Object.keys(statistics).length > 0 && (
          <motion.div
            variants={itemVariants}
            className="glass p-6 rounded-2xl mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              إحصائيات التصويت
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(statistics).map(([name, count]) => (
                <div
                  key={name}
                  className="bg-white/5 p-4 rounded-lg"
                >
                  <h3 className="font-medium text-lg mb-2">{name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400">{count} صوت</span>
                    <div className="w-24 bg-purple-900/30 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{
                          width: `${(count / votes.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* نموذج التصويت */}
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
                onChange={(e) => setNewVote({ ...newVote, id: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/5 border border-purple-500/20 focus:border-purple-500 transition-colors"
                required
                placeholder="مثال: c-21454"
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
                              <option value='EEA' > EEA</option>
                              <option value='PF'> PF</option>
                              <option value='SP' >SP </option>
                              <option value='CHIMIE'>CHIMIE </option>
                              <option value='MI' >MI </option>
                              <option value='MA'>MA </option>
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

        {/* قائمة التصويتات الأخيرة */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            آخر التصويتات
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="glass p-6 rounded-2xl hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
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
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default VoteList;