// "use client"
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Users, Vote, CheckCircle2, BarChart3 } from 'lucide-react';
// import { getVotes, getRatings, addVote } from "../firebase/firebase-operations";

// const VoteList = () => {
//   const [votes, setVotes] = useState([]);
//   const [ratings, setRatings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [newVote, setNewVote] = useState({
//     id: '',
//     name: '',
//     fliere: '',
//     vote: ''
//   });
//   const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         duration: 0.5,
//         ease: "easeOut"
//       }
//     }
//   };

//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         setLoading(true);
//         const [votesData, ratingsData] = await Promise.all([
//           getVotes(),
//           getRatings()
//         ]);
        
//           if (votesData) setVotes(votesData);
//           //باقي الكود

// ms=`ما هو المعنى الأكثر شمولًا اي "انه يشمل معنى اغلبية اسماء الدفعة المقترحة وهنا اعني نسبة مؤوية كبيرة" بين هذه الأسماء؟ ثم أعطني الاسم الذي يعبر عنه مع عدد الأسماء التي تشترك في نفس المعنى. : ${votes}\n على الجواب ان يكون كالتالي مثلا : المعنى 15 , اي انه جملة من معنى وعدد فقط 
// انتباه مهم على المعنى ان يشمل اغلب الاسماء اي اكثر من 37%
// انتباه آخر اجب بالمعنى والعدد فقط على شكل json
// انتباه اخير قد يكون المعنا من 2 كلمة الى 3 كحد اقصى 
// ##### مهم جدا ارسل كود jison ب الثلاث معاني الاكثر ةرتبهم من الاكثر الى الاقل شمولية
 
// مثلا : [
//   {"المعنى": "", "العدد":},
//   {"المعنى": "", "العدد":},
//   {"المعنى": "", "العدد":}
// ]
// `