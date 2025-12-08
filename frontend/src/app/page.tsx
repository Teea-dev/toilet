"use client";
import Link from "next/link";
import { MapPin, Clock, Star, Users, Accessibility, Navigation, CheckCircle, ArrowRight } from "lucide-react";

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Never Wonder Where to Go
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              Again
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            The smart toilet finder for University of Ibadan students. 
            Find clean, accessible restrooms instantly with real-time availability and detailed information.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="/app" 
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Find Toilets Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
              <div className="text-gray-600">Campus Locations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">Real-time</div>
              <div className="text-gray-600">Availability</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">Free to Use</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Interactive Campus Map",
      description: "Visual map with color-coded toilet markers showing real-time availability status",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Smart Opening Hours",
      description: "Automatically calculates if toilets are open based on current time and day of week",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Cleanliness Ratings",
      description: "See cleanliness ratings and detailed descriptions from other students",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: <Accessibility className="w-8 h-8" />,
      title: "Accessibility Info",
      description: "Clear indicators for wheelchair-accessible facilities and gender-specific options",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Navigation className="w-8 h-8" />,
      title: "Distance Tracking",
      description: "Find the nearest toilets with accurate distance calculations from your location",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Student Community",
      description: "Built by students, for students - with real campus insights and updates",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to Know
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive toilet finder gives you all the information you need to make the best choice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Allow Location Access",
      description: "Grant permission for precise location tracking to find toilets near you",
      icon: <MapPin className="w-6 h-6" />
    },
    {
      number: "02", 
      title: "View Real-Time Map",
      description: "See all campus toilets with color-coded availability status on the interactive map",
      icon: <Navigation className="w-6 h-6" />
    },
    {
      number: "03",
      title: "Get Detailed Info",
      description: "Tap any toilet marker to see cleanliness ratings, accessibility info, and opening hours",
      icon: <CheckCircle className="w-6 h-6" />
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting started is simple - just follow these three easy steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {step.number}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Never Wonder Again?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of UI students who use our app daily to find clean, accessible toilets across campus
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/app"
            className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Start Finding Toilets
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
}