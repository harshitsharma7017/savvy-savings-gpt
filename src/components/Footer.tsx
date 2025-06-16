
import { Wallet, Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Auto Fund</h3>
                <p className="text-sm text-blue-200">Smart Financial Management</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Take control of your financial future with AI-powered insights and intelligent budgeting tools.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Features</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-blue-300 transition-colors">Transaction Tracking</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Budget Planning</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">AI Assistant</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Analytics Dashboard</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Support</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-blue-300 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © 2024 Finance Tracker. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-400" /> for better financial health
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
