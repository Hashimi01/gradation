// src/app/firebase/firebase-operations.js
"use client"
import { get, ref, set, push, onValue, update, orderByKey, query } from "firebase/database";
import { database } from "./firebase";

// Helper function to handle database errors
const handleDatabaseError = (error, operation) => {
  console.error(`Error in ${operation}:`, error);
  throw new Error(`Failed to ${operation}: ${error.message}`);
};

// Helper function to subscribe to real-time updates
export const subscribeToData = (path, callback) => {
  const dbRef = ref(database, path);
  return onValue(dbRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      callback(data);
    } else {
      callback(null);
    }
  }, (error) => handleDatabaseError(error, 'subscribe to data'));
};

// Fetch data with real-time updates
export const fetchData = async (path) => {
  try {
    const dbRef = ref(database, path);
    const snapshot = await get(dbRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    handleDatabaseError(error, 'fetch data');
  }
};

// Get votes with real-time updates
export const getVotes = async () => {
  try {
    const votes = await fetchData('votes');
    if (!votes) return [];
    
    return Object.entries(votes).map(([id, data]) => ({
      id,
      ...data
    })).sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp if available
  } catch (error) {
    handleDatabaseError(error, 'get votes');
  }
};

// Add new vote with duplicate check
export const addVote = async (voteData) => {
  try {
    const votes = await fetchData('votes');
    
    // Check for duplicate student ID
    if (votes) {
      const hasVoted = Object.values(votes).some(vote => vote.id === voteData.id);
      if (hasVoted) {
        throw new Error('لقد قمت بالتصويت مسبقاً');
      }
    }

    const votesRef = ref(database, 'votes');
    const newVote = {
      ...voteData,
      timestamp: Date.now(), // Add timestamp for sorting
    };
    
    await push(votesRef, newVote);
    return true;
  } catch (error) {
    handleDatabaseError(error, 'add vote');
  }
};

// Get vote statistics with real-time calculation
export const getVoteStatistics = async () => {
  try {
    const votes = await fetchData('votes');
    if (!votes) return {};

    const statistics = Object.values(votes).reduce((acc, vote) => {
      acc[vote.vote] = (acc[vote.vote] || 0) + 1;
      return acc;
    }, {});

    // Sort by vote count in descending order
    return Object.entries(statistics)
      .sort(([, a], [, b]) => b - a)
      .reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value
      }), {});
  } catch (error) {
    handleDatabaseError(error, 'get vote statistics');
  }
};

// Get ratings with real-time updates
export const getRatings = async () => {
  try {
    const ratings = await fetchData('rating');
    if (!ratings) return [];

    return Object.entries(ratings).map(([id, data]) => ({
      id,
      ...data
    })).sort((a, b) => b.العدد - a.العدد); // Sort by count
  } catch (error) {
    handleDatabaseError(error, 'get ratings');
  }
};

// Update rating count with proper error handling
export const updateRatingCount = async (ratingId, incrementValue) => {
  try {
    const ratingRef = ref(database, `rating/${ratingId}`);
    const snapshot = await get(ratingRef);
    
    if (!snapshot.exists()) {
      throw new Error('Rating not found');
    }

    const currentCount = snapshot.val().العدد || 0;
    await update(ratingRef, {
      العدد: currentCount + incrementValue,
      lastUpdated: Date.now()
    });
    
    return true;
  } catch (error) {
    handleDatabaseError(error, 'update rating count');
  }
};

export const updateRatingAtIndex = async (index, newMeaning, newCount) => {
  try {
    const ratingsRef = ref(database, 'rating');
    const snapshot = await get(ratingsRef);

    if (!snapshot.exists()) {
      throw new Error('Ratings not found');
    }

    const ratings = snapshot.val();
    const keys = Object.keys(ratings); // الحصول على المفاتيح الفعلية

    if (index < 0 || index >= keys.length) {
      throw new Error('Index out of bounds');
    }

    const ratingKey = keys[index]; // الحصول على المفتاح بناءً على الفهرس
    const ratingRef = ref(database, `rating/${ratingKey}`);

    await update(ratingRef, {
      المعنى: newMeaning,
      العدد: newCount
    });

    return true;
  } catch (error) {
    console.error('Error updating rating at index:', error);
    return false;
  }
};
