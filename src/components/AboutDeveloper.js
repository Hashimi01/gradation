"use client"
import React from "react";
import { Code, HeartHandshake, ExternalLink } from "lucide-react";

const AboutDeveloper = () => (
  <div className="glass p-6 rounded-2xl mt-12">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
      <Code className="w-6 h-6 text-purple-400" />
      حول المبرمج
    </h2>
    <p className="text-gray-300 leading-relaxed mb-4">
      تم برمجة هذا الموقع بواسطة 
      <strong> أحد طلاب تخصص <span dir="ltr">DAII</span></strong> 
      (تطوير التطبيقات الذكية والذكاء الاصطناعي).
    </p>
    <p className="text-gray-300 leading-relaxed mb-4">
      يتميز المبرمج بخبرة في تقنيات الويب الحديثة مثل:
      <ul className="list-disc list-inside text-gray-400 mt-2">
        <li><span dir="ltr">React.js</span></li>
        <li><span dir="ltr">Next.js</span></li>
        <li><span dir="ltr">Firebase</span></li>
      </ul>
    </p>
    <p className="text-gray-300 leading-relaxed mb-4">
      هدف المشروع هو <strong>تسهيل عملية التصويت</strong> وتقديم تجربة مستخدم مبتكرة وحديثة.
    </p>
    <div className="mt-6 flex items-center gap-2">
      <HeartHandshake className="w-5 h-5 text-purple-400" />
      <span className="text-sm text-gray-400">
        شكرًا لاستخدامك هذا الموقع! نأمل أن يقدم لك تجربة مميزة.
      </span>
    </div>

    {/* رابط الموقع الشخصي */}
    <div className="mt-6">
      <a
        href="https://profill-puce.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        <ExternalLink className="w-5 h-5" />
        زيارة الموقع الشخصي
      </a>
    </div>
  </div>
);

export default AboutDeveloper;
