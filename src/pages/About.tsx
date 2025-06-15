
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Shield, Bot, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-6 py-12 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
              About Finance Tracker
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Empowering individuals and families to take control of their financial future through 
              intelligent tracking, AI-powered insights, and comprehensive budgeting tools.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-16">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
                <CardTitle className="text-3xl font-bold text-center">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-lg text-slate-700 leading-relaxed text-center">
                  We believe that everyone deserves access to powerful financial tools that were once 
                  only available to professionals. Our mission is to democratize financial management 
                  by providing intelligent, easy-to-use tools that help you understand your money, 
                  make better decisions, and achieve your financial goals.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg w-fit mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Smart Analytics</h3>
                <p className="text-slate-600">
                  Advanced analytics and visualizations to help you understand your spending patterns.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Secure & Private</h3>
                <p className="text-slate-600">
                  Bank-level security with end-to-end encryption to keep your financial data safe.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg w-fit mx-auto mb-4">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">AI Assistant</h3>
                <p className="text-slate-600">
                  Get personalized financial advice and insights powered by artificial intelligence.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Community</h3>
                <p className="text-slate-600">
                  Join thousands of users on their journey to financial freedom and success.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Story Section */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Our Story
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Finance Tracker was born from a simple realization: managing personal finances shouldn't 
                be complicated or overwhelming. Our founders, having experienced the frustration of 
                juggling multiple spreadsheets and disconnected financial tools, set out to create a 
                unified platform that makes financial management intuitive and empowering.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Today, we're proud to serve thousands of users worldwide, helping them save money, 
                pay off debt, and build wealth through smart financial decisions. Our commitment to 
                innovation and user-centric design continues to drive us forward as we build the 
                future of personal finance management.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
