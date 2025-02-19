"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, TrendingUp, ThumbsUp } from 'lucide-react';
import { getRatings, updateRatingCount, subscribeToData } from '../firebase/firebase-operations';

const Rating = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votedRatings, setVotedRatings] = useState({});

  const fetchRatings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRatings();
      setRatings(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching ratings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedVotes = localStorage.getItem('votedRatings');
    if (savedVotes) {
      setVotedRatings(JSON.parse(savedVotes));
    }

    const unsubscribe = subscribeToData('rating', (data) => {
      if (data) {
        const formattedData = Object.entries(data).map(([id, ratingData]) => ({
          id,
          ...ratingData
        })).sort((a, b) => b.العدد - a.العدد);
        setRatings(formattedData);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleVote = async (ratingId) => {
    if (votedRatings[ratingId]) return;

    try {
      setLoading(true);
      await updateRatingCount(ratingId, 1);
      const newVotedRatings = { ...votedRatings, [ratingId]: true };
      setVotedRatings(newVotedRatings);
      localStorage.setItem('votedRatings', JSON.stringify(newVotedRatings));
      await fetchRatings();
    } catch (err) {
      setError(err.message);
      console.error('Error voting:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 md:px-0">
      <motion.div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">✨ تقييم المقترحات ✨</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            شارك في تقييم المعاني المقترحة الاكثر شمولا لاسم الدفعة
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            </div>
          ) : ratings.map((rating) => (
            <motion.div key={rating.id} className="glass p-6 rounded-2xl hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <BadgeCheck className="w-6 h-6 text-purple-400" />
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-purple-400">{rating.العدد}</span>
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">{rating.المعنى}</h3>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleVote(rating.id)}
                disabled={votedRatings[rating.id]}
                className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                  votedRatings[rating.id] ? 'bg-purple-500/20 text-purple-300 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90'
                } transition-all duration-300`}
              >
                <ThumbsUp className="w-4 h-4" />
                {votedRatings[rating.id] ? 'تم التصويت' : 'تصويت'}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Rating;
