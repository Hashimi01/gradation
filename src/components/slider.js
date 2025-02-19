"use client"
import React from "react"
import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards, Autoplay } from 'swiper/modules' // ✅ إصلاح الخطأ
import { Brain, Shield, MousePointerClick, Sparkles } from 'lucide-react'
import 'swiper/css'
import 'swiper/css/effect-cards'

export default function About() {
    const features = [
        {
            icon: <Brain className="w-6 h-6 text-purple-400" />,
            title: "ذكاء اصطناعي",
            description: "اول موقع موريتاني يستخدم الذكاء الصناعي في تحليل البيانات"
        },
        {
            icon: <Shield className="w-6 h-6 text-purple-400" />,
            title: "آمن وسريع",
            description: "حماية كاملة لبياناتك مع سرعة فائقة في الأداء"
        },
        {
            icon: <MousePointerClick className="w-6 h-6 text-purple-400" />,
            title: "سهل الاستخدام",
            description: "واجهة بسيطة وسهلة الاستخدام لجميع المستخدمين"
        },
        {
            icon: <Sparkles className="w-6 h-6 text-purple-400" />,
            title: "إبداع بلا حدود",
            description: "يمكنك اضافة لمستك الابداعية بكل حرية"
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

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
    }

    return (
        <section className=" py-20 px-4 md:px-0">
            <motion.div 
                className="max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {/* Hero Section */}
                <motion.div 
                    className="text-center mb-20"
                    variants={itemVariants}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                        ✨ صوتك يصنع الفرق! 🎓 ✨
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        كن جزءًا من تاريخ دفعتنا! 🤩 شارك بإبداعك واقترح اسمًا مميزًا يعكس روحنا وإنجازاتنا. 
                        ✨ لا تفوت الفرصة لتترك بصمتك في اسم يظل خالدًا للأجيال القادمة! 🚀🔥
                    </p>
                </motion.div>

                {/* Features Section */}
                <div className="mt-20">
                    <motion.h2 
                        className="text-3xl font-bold text-center mb-12 gradient-text"
                        variants={itemVariants}
                    >
                        ميزات الموقع
                    </motion.h2>

                    <div className="grid grid-cols-1">
                        {/* Swiper Section */}
                        <motion.div
                            variants={itemVariants}
                            className="w-full max-w-xl h-36 mx-auto"
                        >
                            <Swiper
                                effect="cards"
                                grabCursor={true}
                                modules={[EffectCards, Autoplay]} // ✅ إصلاح الخطأ
                                autoplay={{ delay: 3000, disableOnInteraction: false }} // ✅ تشغيل التبديل التلقائي
                                className="w-full"
                            >
                                {features.map((feature, index) => (
                                    <SwiperSlide key={index} className="glass p-8 rounded-2xl">
                                        <div className="text-center">
                                            <div className="mb-4 flex justify-center">{feature.icon}</div>
                                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                            <p className="text-gray-400">{feature.description}</p>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
