"use client";
import React, { useState, useEffect } from "react";
import { getVotes, getRatings, addVote } from "../firebase/firebase-operations";
import VoteForm from "./VoteForm";
import VoteStatistics from "./VoteStatistics";
import LastVotes from "./LastVotes";
import handleAnalyze from "./handleAnalyze";

const VoteList = () => {
  const [votes, setVotes] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [newVote, setNewVote] = useState({
    id: "",
    name: "",
    fliere: "",
    vote: "",
  });
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [votesData, ratingsData] = await Promise.all([
        getVotes(),
        getRatings(),
      ]);

      if (votesData) setVotes(votesData);
      if (ratingsData) setRatings(ratingsData);
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
      setError("حدث خطأ في جلب البيانات. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDataAndAnalyze = async () => {
      try {
        await loadInitialData();
        if (votes.length > 0) {
          await handleAnalyze(votes, setError, setRatings, setAnalyzing, loadInitialData);
        }
      } catch (error) {
        setError("حدث خطأ أثناء تحميل البيانات وتحليلها");
      }
    };
  
    fetchDataAndAnalyze();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!newVote.id || !newVote.name || !newVote.fliere || !newVote.vote) {
        throw new Error("يرجى ملء جميع الحقول المطلوبة");
      }

      await addVote(newVote);
      setSubmitStatus({
        type: "success",
        message: "تم إضافة تصويتك بنجاح! شكراً لمشاركتك",
      });

      await loadInitialData();
      setNewVote({ id: "", name: "", fliere: "", vote: "" });
      await handleAnalyze(votes, setError, setRatings, setAnalyzing, loadInitialData);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error.message || "حدث خطأ أثناء إضافة التصويت",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalVotes = Array.isArray(ratings)
    ? ratings.reduce((sum, item) => sum + (item.العدد || 0), 0)
    : 0;

  return (
    <section className="py-20 px-4 md:px-0">
      <VoteStatistics
        ratings={ratings}
        totalVotes={totalVotes}
        handleAnalyze={() =>
          handleAnalyze(votes, setError, setRatings, setAnalyzing, loadInitialData)
        }
        analyzing={analyzing}
        loading={loading}
      />
      <VoteForm
        newVote={newVote}
        setNewVote={setNewVote}
        handleSubmit={handleSubmit}
        loading={loading}
      />

      <div id="votes">
        <LastVotes votes={votes} loading={loading} />
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-500/20 text-red-200">
          {error}
        </div>
      )}
    </section>
  );
};

export default VoteList;



// "use client";
// import React, { useState, useEffect } from "react";
// import { getVotes, getRatings, addVote } from "../firebase/firebase-operations";
// import VoteForm from "./VoteForm";
// import VoteStatistics from "./VoteStatistics";
// import LastVotes from "./LastVotes";
// import handleAnalyze from "./handleAnalyze";

// const VoteList = () => {
//   const [votes, setVotes] = useState([]);
//   const [ratings, setRatings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [analyzing, setAnalyzing] = useState(false);
//   const [error, setError] = useState("");
//   const [newVote, setNewVote] = useState({
//     id: "",
//     name: "",
//     fliere: "",
//     vote: "",
//   });
//   const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

//   const loadInitialData = async () => {
//     try {
//       setLoading(true);
//       const [votesData, ratingsData] = await Promise.all([
//         getVotes(),
//         getRatings(),
//       ]);

//       if (votesData) setVotes(votesData);
//       if (ratingsData) setRatings(ratingsData);
//     } catch (error) {
//       console.error("خطأ في جلب البيانات:", error);
//       setError("حدث خطأ في جلب البيانات. يرجى المحاولة مرة أخرى.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadInitialData();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       if (!newVote.id || !newVote.name || !newVote.fliere || !newVote.vote) {
//         throw new Error("يرجى ملء جميع الحقول المطلوبة");
//       }

//       await addVote(newVote);
//       setSubmitStatus({
//         type: "success",
//         message: "تم إضافة تصويتك بنجاح! شكراً لمشاركتك",
//       });

//       await loadInitialData();
//       setNewVote({ id: "", name: "", fliere: "", vote: "" });
//       await handleAnalyze(
//         votes,
//         setError,
//         setRatings,
//         setAnalyzing,
//         loadInitialData
//       );
//     } catch (error) {
//       setSubmitStatus({
//         type: "error",
//         message: error.message || "حدث خطأ أثناء إضافة التصويت",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalVotes = Array.isArray(ratings)
//   ? ratings.reduce((sum, item) => sum + (item.العدد || 0), 0)
//   : 0;



//   return (
//     <section className="py-20 px-4 md:px-0">
//     <VoteStatistics
//       ratings={ratings}
//       totalVotes={totalVotes}
//       handleAnalyze={() =>
//         handleAnalyze(votes, setError, setRatings, setAnalyzing, loadInitialData)
//       }
//       analyzing={analyzing}
//       loading={loading}
//     />
//     <VoteForm
//       newVote={newVote}
//       setNewVote={setNewVote}
//       handleSubmit={handleSubmit}
//       loading={loading}
//     />
    
//     {/* إضافة id إلى LastVotes */}
//     <div id="votes">
//       <LastVotes votes={votes} loading={loading} />
//     </div>
  
//     {error && (
//       <div className="mt-4 p-3 rounded-lg bg-red-500/20 text-red-200">
//         {error}
//       </div>
//     )}
//   </section>
  
//   );
// };

// export default VoteList;

