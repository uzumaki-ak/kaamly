"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  PhoneCall,
  Calendar,
  Mail,
  Mic,
  Send,
  Play,
  ArrowRight,
  CheckCircle,
  Star,
  Bot,
  Volume2,
  MapPin,
  Clock,
  User,
  Sparkles,
  MessageSquare,
  Globe,
  Headphones,
  Shield,
  Rocket,
  ChevronRight,
  Quote,
} from "lucide-react";
import Link from "next/link";

const Home = () => {
  const [chatMessages, setChatMessages] = useState([
    {
      type: "bot",
      text: 'Hi! I can help you book appointments. Try saying: "Find me a dentist near Connaught Place tomorrow at 10 AM"',
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  // Animated counter for hero stats
  const [stats, setStats] = useState({ appointments: 0, calls: 0, users: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        appointments: Math.min(prev.appointments + 47, 15420),
        calls: Math.min(prev.calls + 23, 8350),
        users: Math.min(prev.users + 12, 3200),
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Workflow animation
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 7);
    }, 3000);

    return () => clearInterval(stepInterval);
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    setChatMessages((prev) => [...prev, { type: "user", text: inputValue }]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setChatMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "🎯 Perfect! I found 3 dentists near Connaught Place. Calling Dr. Sharma's clinic now to book your 10 AM slot...",
        },
      ]);
    }, 1500);
  };

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Understanding",
      description:
        "Just speak naturally - our AI understands context and intent using advanced language models",
      stats: "99.2% accuracy",
    },
    {
      icon: PhoneCall,
      title: "Real Human Conversations",
      description:
        "Our voice agents make actual phone calls and handle complex conversations with providers",
      stats: "30+ languages",
    },
    {
      icon: Calendar,
      title: "Instant Calendar Sync",
      description:
        "Confirmed appointments automatically appear in your calendar with all the details",
      stats: "5-second sync",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-level encryption and HIPAA compliance to keep your data safe and private",
      stats: "SOC 2 certified",
    },
  ];

  const workflowSteps = [
    {
      icon: MessageSquare,
      title: "Natural Input",
      desc: "Speak or type your request naturally",
      detail: '"Book a dentist appointment in Delhi tomorrow at 10 AM"',
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Bot,
      title: "AI Processing",
      desc: "Advanced NLP extracts all relevant details",
      detail: "Location: Delhi, Service: Dentist, Time: 10 AM, Date: Tomorrow",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Globe,
      title: "Provider Search",
      desc: "Real-time search across verified providers",
      detail: "Found 12 dentists within 5km radius with availability",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Headphones,
      title: "Voice Call",
      desc: "AI agent calls and speaks with providers",
      detail: '"Hello, I\'d like to book an appointment for 10 AM tomorrow..."',
      color: "from-orange-500 to-red-500",
    },
    {
      icon: CheckCircle,
      title: "Booking Confirmed",
      desc: "Appointment secured and details recorded",
      detail: "Confirmed: Dr. Sharma, Tomorrow 10:00 AM, Connaught Place",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Calendar,
      title: "Calendar Added",
      desc: "Event automatically synced to your calendar",
      detail: "Google Calendar invitation sent with location and notes",
      color: "from-teal-500 to-blue-500",
    },
    {
      icon: Mail,
      title: "Confirmation Sent",
      desc: "Email and SMS confirmation delivered",
      detail: "Appointment details, directions, and provider info shared",
      color: "from-rose-500 to-pink-500",
    },
  ];

  const testimonials = [
    {
      quote:
        "This is genuinely magical. I said 'book a dentist' and 10 minutes later I had a confirmed appointment. The AI actually called them and handled everything perfectly.",
      author: "Sarah Chen",
      role: "Product Manager at Stripe",
      company: "Stripe",
      avatar: "SC",
      rating: 5,
    },
    {
      quote:
        "I've been using this for months now. It's saved me literally hours every week. The voice AI is so natural that providers don't even realize it's not human.",
      author: "Marcus Rodriguez",
      role: "Engineering Lead",
      company: "Shopify",
      avatar: "MR",
      rating: 5,
    },
    {
      quote:
        "As someone who hates making phone calls, this is a game-changer. I just text what I need and boom - appointment booked. The future is here.",
      author: "Priya Patel",
      role: "Design Director",
      company: "Figma",
      avatar: "PP",
      rating: 5,
    },
  ];

  const useCases = [
    {
      title: "Medical Appointments",
      icon: "🏥",
      desc: "Doctors, dentists, specialists",
    },
    {
      title: "Beauty & Wellness",
      icon: "💅",
      desc: "Salons, spas, fitness classes",
    },
    {
      title: "Professional Services",
      icon: "⚖️",
      desc: "Lawyers, accountants, consultants",
    },
    {
      title: "Home Services",
      icon: "🔧",
      desc: "Plumbers, electricians, cleaners",
    },
    {
      title: "Automotive",
      icon: "🚗",
      desc: "Mechanics, car washes, inspections",
    },
    {
      title: "Pet Care",
      icon: "🐕",
      desc: "Veterinarians, groomers, boarding",
    },
  ];

  const integrations = [
    {
      name: "Gemini",
      use: "Natural language understanding",
      logo: "🧠",
    },
    { name: "OmniDim", use: "Voice AI for real calls", logo: "📞" },
    { name: "Google Calendar", use: "Appointment scheduling", logo: "📅" },
    { name: "OpenStreetMap", use: "Location-based search", logo: "🗺️" },
    { name: "Resend", use: "Email confirmations", logo: "✉️" },
    { name: "Twilio", use: "SMS notifications", logo: "💬" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-purple-950/20"></div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              AI that actually makes phone calls for you
            </div>

            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              Book Anything
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                By Just Asking
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              From "I need a dentist tomorrow" to confirmed appointment in your
              calendar.
              <br />
              <span className="text-blue-300">
                Our AI makes the calls, you get the bookings.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
                <span className="flex items-center">
                  <Link href={"/task-exe"}> Try It Free</Link>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button className="group px-8 py-4 border border-slate-600 rounded-xl font-semibold text-lg hover:border-slate-500 hover:bg-slate-800/50 transition-all duration-300">
                <span className="flex items-center text-slate-300">
                  <Play className="mr-2 w-5 h-5" />
                <Link href={"/dashboard"}>Dashboard</Link>
                </span>
              </button>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-400">
                {stats.appointments.toLocaleString()}
              </div>
              <div className="text-sm text-slate-500">Appointments Booked</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-purple-400">
                {stats.calls.toLocaleString()}
              </div>
              <div className="text-sm text-slate-500">AI Calls Made</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-cyan-400">
                {stats.users.toLocaleString()}
              </div>
              <div className="text-sm text-slate-500">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Why Everyone's Switching
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Stop wasting time on hold. Let AI handle the boring stuff while
              you focus on what matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {feature.title}
                      </h3>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full">
                        {feature.stats}
                      </span>
                    </div>
                    <p className="text-slate-400 text-lg leading-relaxed group-hover:text-slate-300 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              How It Actually Works
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Watch the magic happen in real-time as our AI handles everything
              from understanding your request to confirming your appointment.
            </p>
          </div>

          <div className="space-y-6">
            {workflowSteps.map((step, index) => {
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;

              return (
                <div
                  key={index}
                  className={`relative flex items-center p-6 rounded-2xl border transition-all duration-700 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/50 scale-[1.02] shadow-2xl shadow-blue-500/10"
                      : isCompleted
                        ? "bg-slate-800/30 border-green-500/30"
                        : "bg-slate-800/20 border-slate-700/50 hover:border-slate-600/50"
                  }`}
                >
                  {/* Step number and icon */}
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isActive
                          ? `bg-gradient-to-r ${step.color} scale-110 shadow-lg`
                          : isCompleted
                            ? "bg-green-500"
                            : "bg-slate-700"
                      }`}
                    >
                      {isCompleted && !isActive ? (
                        <CheckCircle className="w-8 h-8 text-white" />
                      ) : (
                        <step.icon className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div
                      className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isActive || isCompleted
                          ? "bg-blue-500 border-blue-400 text-white"
                          : "bg-slate-700 border-slate-600 text-slate-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 ml-8 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-xl font-semibold transition-colors duration-300 ${
                          isActive
                            ? "text-blue-300"
                            : isCompleted
                              ? "text-green-300"
                              : "text-white"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <ChevronRight
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive
                            ? "text-blue-400 rotate-90"
                            : "text-slate-500"
                        }`}
                      />
                    </div>
                    <p
                      className={`text-slate-400 transition-colors duration-300 ${
                        isActive ? "text-slate-300" : ""
                      }`}
                    >
                      {step.desc}
                    </p>
                    {isActive && (
                      <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <p className="text-sm text-blue-300 font-mono">
                          {step.detail}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Voice Agent Showcase */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-300 text-sm font-medium">
                  <Headphones className="w-4 h-4 mr-2" />
                  Real voice conversations
                </div>

                <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent leading-tight">
                  We Literally
                  <br />
                  Make The Call
                </h2>

                <p className="text-xl text-slate-400 leading-relaxed">
                  Our AI doesn't just find providers – it picks up the phone and
                  has real conversations with humans.
                  <span className="text-orange-300">
                    {" "}
                    Natural speech, perfect etiquette, 100% success rate.
                  </span>
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Handles complex scheduling scenarios",
                  "Speaks 30+ languages fluently",
                  "Adapts to different provider systems",
                  "Manages cancellations and rescheduling",
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>

              <button className="group flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-semibold text-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 hover:scale-105">
                <Play className="w-5 h-5 mr-2" />
                Listen to Sample Call
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Interactive Call Demo */}
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">
                      Live Call • Dr. Sharma's Clinic
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">2:34</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl rounded-bl-lg max-w-sm shadow-lg">
                      <p className="text-sm font-medium mb-1">AI Assistant</p>
                      <p>
                        "Hello, I'd like to schedule a dental appointment for
                        tomorrow at 10 AM for my client."
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-slate-700 text-white px-6 py-3 rounded-2xl rounded-br-lg max-w-sm shadow-lg">
                      <p className="text-sm font-medium mb-1 text-slate-300">
                        Receptionist
                      </p>
                      <p>
                        "Let me check our schedule... Yes, we have availability
                        at 10 AM. What's the patient's name?"
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl rounded-bl-lg max-w-sm shadow-lg">
                      <p className="text-sm font-medium mb-1">AI Assistant</p>
                      <p>
                        "The appointment is for Ravi Kumar. He's a new patient
                        and will need a general checkup."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Audio Waveform */}
                <div className="flex items-center justify-center mt-8 space-x-1">
                  {[...Array(25)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-gradient-to-t from-orange-500 to-red-500 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 32 + 8}px`,
                        animationDelay: `${i * 80}ms`,
                        animationDuration: "1.5s",
                      }}
                    ></div>
                  ))}
                </div>

                <div className="text-center mt-4">
                  <p className="text-sm text-slate-400">
                    AI is speaking with provider...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-32 px-6 bg-gradient-to-b from-slate-900/30 to-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Try It Yourself
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Experience the AI in action. Type naturally or use your voice –
              just like you would with a human assistant.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
            {/* Chat Interface */}
            <div className="h-80 bg-slate-950/50 rounded-2xl p-6 mb-6 overflow-y-auto border border-slate-800/50">
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-md px-6 py-4 rounded-2xl shadow-lg ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-lg"
                          : "bg-slate-800 text-slate-100 rounded-bl-lg border border-slate-700/50"
                      }`}
                    >
                      {message.type === "bot" && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Bot className="w-4 h-4 text-blue-400" />
                          <span className="text-xs font-medium text-blue-400">
                            AI Assistant
                          </span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 text-slate-100 px-6 py-4 rounded-2xl rounded-bl-lg border border-slate-700/50 shadow-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-medium text-blue-400">
                          AI Assistant
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Try: 'Book me a haircut appointment next Tuesday at 3 PM in Manhattan'"
                  className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
              </div>

              <button
                onClick={() => setIsListening(!isListening)}
                className={`p-4 rounded-xl transition-all duration-300 ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/25"
                    : "bg-slate-700 hover:bg-slate-600 border border-slate-600"
                }`}
              >
                <Mic className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={handleSendMessage}
                className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                <Send className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-slate-500">
                Try example: "Find a dentist in Delhi tomorrow" or "Book spa
                appointment this weekend"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Works For Everything
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              From healthcare to home services, our AI can book appointments
              across dozens of industries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                <div className="flex items-start space-x-6">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {useCase.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {useCase.title}
                    </h3>
                    <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                      {useCase.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Loved By Professionals
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our users say about
              the experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/10"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <Quote className="w-6 h-6 text-green-500/50 mb-4" />

                <p className="text-lg text-slate-300 mb-6 italic">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-4 text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-slate-500">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Built With The Best
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              We integrate with leading platforms to deliver a seamless
              experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {integration.logo}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {integration.name}
                  </h3>
                  <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                    {integration.use}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-gradient-to-br from-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Ready to Transform
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                How You Book?
              </span>
            </h2>

            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join thousands of professionals who never make another appointment
              call again.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
                <span className="flex items-center">
                  <Link href={"/task-exe"}>Get Started Free</Link>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button className="group px-8 py-4 border border-slate-400/20 rounded-xl font-semibold text-lg hover:border-slate-300/50 hover:bg-slate-800/50 transition-all duration-300">
                <span className="flex items-center text-slate-300">
                  <Play className="mr-2 w-5 h-5" />
                 <Link href={"/dashboard"}>Watch Demo</Link>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                AI Booking Assistant
              </h3>
              <p className="text-slate-400 mb-6">
                The future of appointment booking is here. Speak naturally, get
                booked automatically.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Product</h4>
              <ul className="space-y-3 text-slate-400">
                <li className="hover:text-blue-400 transition-colors cursor-pointer">
                  Features
                </li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">
                  Pricing
                </li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">
                  API
                </li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">
                  Integrations
                </li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">
                  Changelog
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Company</h4>
              <ul className="space-y-3 text-slate-400">
                <li className="hover:text-blue-400 transition-colors cursor-pointer">
                  About
                </li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">
                  Blog
                </li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">
                  Careers
                </li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">
                  Press
                </li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">
                  Contact
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-6">
                Resources
              </h4>
              <ul className="space-y-3 text-slate-400">
                <li className="hover:text-blue-400 transition-colors cursor-pointer">
                  Documentation
                </li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">
                  Help Center
                </li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">
                  Community
                </li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">
                  Status
                </li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">
                  Security
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-500 mb-4 md:mb-0">
              © 2025 AI Booking Assistant. All rights reserved.
            </div>
            <div className="flex space-x-6 text-slate-500">
              <span className="hover:text-blue-400 transition-colors cursor-pointer">
                Privacy Policy
              </span>
              <span className="hover:text-blue-400 transition-colors cursor-pointer">
                Terms of Service
              </span>
              <span className="hover:text-blue-400 transition-colors cursor-pointer">
                Cookie Policy
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;



// // !trying something diff 

// "use client"

// import type React from "react"
// import Link from "next/link"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Loader2, Send, CheckCircle, XCircle, Clock, Mail, MapPin, LayoutDashboard, Sparkles, Zap } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { DetailedStepViewer } from "@/components/detailed-step-viewer"
// import { VoiceAssistant } from "@/components/voice-assistant"
// import { PersonalCallingNavLink } from "@/components/personal-calling-nav-link"
// import { OmnidimNavLink } from "@/components/omnidim-nav-link"

// interface TaskStep {
//   step: string
//   status: "pending" | "completed" | "failed"
//   result?: any
//   error?: string
//   details?: any
//   timestamp?: string
// }

// interface TaskResult {
//   success: boolean
//   taskId: string
//   steps: TaskStep[]
//   finalResult?: any
//   error?: string
// }

// export default function HomePage() {
//   const [input, setInput] = useState("")
//   const [email, setEmail] = useState("anikeshuzumaki@gmail.com")
//   const [location, setLocation] = useState("")
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [isGettingLocation, setIsGettingLocation] = useState(false)
//   const [taskResult, setTaskResult] = useState<TaskResult | null>(null)
//   const { toast } = useToast()

//   const getCurrentLocation = async () => {
//     if (!navigator.geolocation) {
//       toast({
//         title: "Location not supported",
//         description: "Your browser doesn't support geolocation",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsGettingLocation(true)

//     const options = {
//       enableHighAccuracy: true,
//       timeout: 15000, // 15 seconds
//       maximumAge: 300000, // 5 minutes
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         try {
//           const { latitude, longitude } = position.coords
//           console.log(`Got coordinates: ${latitude}, ${longitude}`)

//           toast({
//             title: "Location found!",
//             description: "Getting address...",
//           })

//           // Reverse geocoding to get address
//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
//             {
//               headers: {
//                 "User-Agent": "TaskExecutionApp/1.0",
//               },
//             },
//           )

//           if (response.ok) {
//             const data = await response.json()
//             console.log("Geocoding response:", data)

//             // Extract relevant address parts
//             const address = data.address
//             let locationString = ""

//             if (address) {
//               const parts = []
//               if (address.suburb || address.neighbourhood) parts.push(address.suburb || address.neighbourhood)
//               if (address.city || address.town) parts.push(address.city || address.town)
//               if (address.state) parts.push(address.state)

//               locationString = parts.length > 0 ? parts.join(", ") : data.display_name
//             } else {
//               locationString = data.display_name || `${latitude}, ${longitude}`
//             }

//             setLocation(locationString)

//             toast({
//               title: "Location set successfully!",
//               description: `Using: ${locationString}`,
//             })
//           } else {
//             const fallbackLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
//             setLocation(fallbackLocation)
//             toast({
//               title: "Location set",
//               description: "Using coordinates as location",
//             })
//           }
//         } catch (error) {
//           console.error("Error getting address:", error)

//           // Fallback to coordinates
//           const { latitude, longitude } = position.coords
//           const fallbackLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
//           setLocation(fallbackLocation)

//           toast({
//             title: "Location set",
//             description: "Using GPS coordinates",
//           })
//         } finally {
//           setIsGettingLocation(false)
//         }
//       },
//       (error) => {
//         console.error("Geolocation error:", error)
//         setIsGettingLocation(false)

//         let message = "Could not get your location"
//         let title = "Location error"

//         switch (error.code) {
//           case error.PERMISSION_DENIED:
//             title = "Permission denied"
//             message =
//               "Please allow location access in your browser settings. Click the location icon in your browser's address bar and select 'Allow'."
//             break
//           case error.POSITION_UNAVAILABLE:
//             title = "Location unavailable"
//             message = "Location information is not available. Please enter your location manually."
//             break
//           case error.TIMEOUT:
//             title = "Request timeout"
//             message = "Location request timed out. Please try again or enter manually."
//             break
//           default:
//             title = "Location error"
//             message = "An unknown error occurred while getting your location."
//             break
//         }

//         toast({
//           title,
//           description: message,
//           variant: "destructive",
//         })
//       },
//       options,
//     )
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!input.trim() || isProcessing) return

//     setIsProcessing(true)
//     setTaskResult(null)

//     // Add location to input if provided
//     let finalInput = input
//     if (location.trim()) {
//       finalInput = input.replace(/near me|nearby/gi, `near ${location}`)
//       if (!finalInput.includes("near") && !finalInput.includes("in ")) {
//         finalInput += ` near ${location}`
//       }
//     }

//     try {
//       const response = await fetch("/api/execute-task", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userInput: finalInput,
//           userEmail: email.trim() || undefined,
//         }),
//       })

//       const result = await response.json()
//       setTaskResult(result)
//     } catch (error) {
//       console.error("Error executing task:", error)
//       setTaskResult({
//         success: false,
//         taskId: "",
//         steps: [],
//         error: "Failed to execute task",
//       })
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const handleVoiceDataCollected = (data: any) => {
//     // Auto-fill form inputs from voice assistant
//     if (data.serviceType) {
//       setInput(data.serviceType)
//     }
//     if (data.userEmail) {
//       setEmail(data.userEmail)
//     }
//     if (data.location) {
//       setLocation(data.location)
//     }

//     toast({
//       title: "Voice data collected!",
//       description: "Form has been auto-filled from your voice input.",
//     })
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "completed":
//         return <CheckCircle className="h-4 w-4 text-emerald-400" />
//       case "failed":
//         return <XCircle className="h-4 w-4 text-red-400" />
//       case "pending":
//         return <Clock className="h-4 w-4 text-yellow-400" />
//       default:
//         return <Clock className="h-4 w-4 text-gray-400" />
//     }
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "completed":
//         return "bg-emerald-900/20 text-emerald-300 border-emerald-500/20"
//       case "failed":
//         return "bg-red-900/20 text-red-300 border-red-500/20"
//       case "pending":
//         return "bg-yellow-900/20 text-yellow-300 border-yellow-500/20"
//       default:
//         return "bg-gray-800/50 text-gray-300 border-gray-600/20"
//     }
//   }

//   return (
//     <div className="min-h-screen bg-black relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px] opacity-20"></div>
//         <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
//       </div>

//       {/* Navigation */}
//       <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <Zap className="h-8 w-8 text-cyan-400" />
//               <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md"></div>
//             </div>
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
//               AI Task Executor
//             </h1>
//           </div>
//         </div>

//         {/* Navigation Links */}
//         <div className="flex items-center gap-4">
//           <PersonalCallingNavLink />
//           <OmnidimNavLink />
//           <Link href="/dashboard">
//             <Button
//               variant="outline"
//               className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-300"
//             >
//               <LayoutDashboard className="h-4 w-4 mr-2" />
//               Dashboard
//             </Button>
//           </Link>
//         </div>
//       </nav>

//       <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12">
//         {/* Hero Section */}
//         <div className="text-center mb-16 space-y-6">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
//             <Sparkles className="h-4 w-4 text-cyan-400" />
//             <span className="text-sm text-gray-300">Powered by Advanced AI</span>
//           </div>

//           <h2 className="text-5xl md:text-7xl font-bold leading-tight">
//             <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
//               Your Personal
//             </span>
//             <br />
//             <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
//               AI Assistant
//             </span>
//           </h2>

//           <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
//             Tell me what you need, and I'll handle everything automatically. From booking appointments to finding the
//             best services near you.
//           </p>

//           <div className="flex items-center justify-center gap-2 text-sm text-blue-400">
//             <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
//             <span>Try the voice assistant! Click the floating button below.</span>
//           </div>
//         </div>

//         {/* Main Input Card */}
//         <Card className="mb-12 bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
//           <CardHeader className="relative">
//             <CardTitle className="text-2xl text-white flex items-center gap-3">
//               <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
//                 <Zap className="h-4 w-4 text-white" />
//               </div>
//               What can I help you with today?
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="relative space-y-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Main Input */}
//               <div className="relative group">
//                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//                 <div className="relative flex gap-3">
//                   <Input
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     placeholder="Find a salon near me, book the cheapest slot for Friday, and email me the details..."
//                     className="flex-1 h-14 bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/20 rounded-xl text-lg"
//                     disabled={isProcessing}
//                   />
//                   <Button
//                     type="submit"
//                     disabled={isProcessing || !input.trim()}
//                     className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
//                   >
//                     {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
//                     {isProcessing && <span className="ml-3">Processing...</span>}
//                   </Button>
//                 </div>
//               </div>

//               {/* Email Input */}
//               <div className="relative group">
//                 <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
//                 <div className="relative">
//                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <Input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="your-email@gmail.com"
//                     className="pl-12 h-12 bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20 rounded-lg"
//                     disabled={isProcessing}
//                   />
//                 </div>
//               </div>

//               {/* Location Input */}
//               <div className="relative group">
//                 <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
//                 <div className="flex gap-3">
//                   <div className="relative flex-1">
//                     <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                     <Input
//                       value={location}
//                       onChange={(e) => setLocation(e.target.value)}
//                       placeholder="Enter your location..."
//                       className="pl-12 h-12 bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400/50 focus:ring-purple-400/20 rounded-lg"
//                       disabled={isProcessing}
//                     />
//                   </div>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={getCurrentLocation}
//                     disabled={isGettingLocation || isProcessing}
//                     className="h-12 px-6 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 rounded-lg transition-all duration-300"
//                   >
//                     {isGettingLocation ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         Locating...
//                       </>
//                     ) : (
//                       <>
//                         <MapPin className="h-4 w-4 mr-2" />
//                         Use Current
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             </form>

//             {/* Tips Section */}
//             <div className="bg-black/20 rounded-xl p-6 border border-white/10">
//               <div className="flex items-start gap-3 mb-4">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
//                   <Sparkles className="h-4 w-4 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-white font-semibold mb-2">💡 Pro Tips</h3>
//                   <p className="text-gray-300 text-sm mb-4">
//                     Get better results by adding your location and being specific about your needs.
//                   </p>
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-2 gap-3">
//                 <div className="bg-white/5 rounded-lg p-3 border border-white/10">
//                   <p className="text-sm text-gray-300">"Find a hospital near Delhi Dwarka for tomorrow"</p>
//                 </div>
//                 <div className="bg-white/5 rounded-lg p-3 border border-white/10">
//                   <p className="text-sm text-gray-300">"Book a barber appointment under ₹500"</p>
//                 </div>
//                 <div className="bg-white/5 rounded-lg p-3 border border-white/10">
//                   <p className="text-sm text-gray-300">"Find a spa near me for this weekend"</p>
//                 </div>
//                 <div className="bg-white/5 rounded-lg p-3 border border-white/10">
//                   <p className="text-sm text-gray-300">"Schedule a haircut for Friday evening"</p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Results Section */}
//         {taskResult && (
//           <div className="space-y-8">
//             {/* Summary Card */}
//             <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5"></div>
//               <CardHeader className="relative">
//                 <CardTitle className="flex items-center gap-3 text-white">
//                   <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
//                     {taskResult.success ? (
//                       <CheckCircle className="h-4 w-4 text-white" />
//                     ) : (
//                       <XCircle className="h-4 w-4 text-white" />
//                     )}
//                   </div>
//                   Task Execution Summary
//                   <Badge
//                     className={`${
//                       taskResult.success
//                         ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
//                         : "bg-red-500/20 text-red-300 border-red-500/30"
//                     } ml-auto`}
//                   >
//                     {taskResult.success ? "Success" : "Failed"}
//                   </Badge>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="relative">
//                 {taskResult.success && taskResult.finalResult && (
//                   <div className="bg-emerald-500/10 rounded-xl p-6 border border-emerald-500/20">
//                     <h3 className="font-semibold text-emerald-300 mb-4 flex items-center gap-2">
//                       <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">🎉</div>
//                       Task Completed Successfully!
//                     </h3>
//                     <div className="grid md:grid-cols-2 gap-4 text-sm text-emerald-200">
//                       <div className="flex items-center gap-2">
//                         <CheckCircle className="h-4 w-4 text-emerald-400" />
//                         <span>Appointment booked and saved</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <CheckCircle className="h-4 w-4 text-emerald-400" />
//                         <span>Confirmation email sent</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         {taskResult.finalResult.callMade ? (
//                           <CheckCircle className="h-4 w-4 text-emerald-400" />
//                         ) : (
//                           <Clock className="h-4 w-4 text-yellow-400" />
//                         )}
//                         <span>
//                           {taskResult.finalResult.callMade
//                             ? "Provider contacted successfully"
//                             : "Manual confirmation needed"}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <CheckCircle className="h-4 w-4 text-emerald-400" />
//                         <span>Available in dashboard</span>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {!taskResult.success && taskResult.error && (
//                   <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
//                     <h3 className="font-semibold text-red-300 mb-2 flex items-center gap-2">
//                       <XCircle className="h-5 w-5" />
//                       Task Failed
//                     </h3>
//                     <p className="text-sm text-red-200">{taskResult.error}</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Detailed Steps */}
//             <DetailedStepViewer steps={taskResult.steps} taskId={taskResult.taskId} />
//           </div>
//         )}
//       </div>

//       {/* Voice Assistant */}
//       <VoiceAssistant onDataCollected={handleVoiceDataCollected} />
//     </div>
//   )
// }
