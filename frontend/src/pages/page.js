'use client';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">🚀 AI Builder</h1>
          <div className="space-x-4">
            <a href="/login" className="px-6 py-2 text-indigo-600 hover:bg-indigo-50 rounded">Login</a>
            <a href="/signup" className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Sign Up</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6 text-gray-900">
          Build Websites & Apps with AI
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create fully functional websites and mobile apps instantly using AI. No coding required. From idea to live in minutes.
        </p>
        <div className="space-x-4">
          <a href="/signup" className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
            Start Free Trial →
          </a>
          <a href="#features" className="inline-block px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50">
            Learn More
          </a>
        </div>
        <p className="text-gray-500 mt-4">✅ 7-day free trial • No credit card required</p>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-16">Powerful Features</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="text-xl font-bold mb-3">AI Generation</h4>
              <p className="text-gray-600">AI reads your idea and generates complete websites, apps, code, and designs instantly.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="text-xl font-bold mb-3">Drag & Drop Editor</h4>
              <p className="text-gray-600">Customize everything with our intuitive drag-and-drop editor. No coding skills needed.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-4xl mb-4">🚀</div>
              <h4 className="text-xl font-bold mb-3">One-Click Deploy</h4>
              <p className="text-gray-600">Publish instantly with SSL, CDN, and custom domain. Your site goes live immediately.</p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-xl font-bold mb-3">Analytics Dashboard</h4>
              <p className="text-gray-600">Track visitors, conversions, and get insights with built-in analytics.</p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="text-xl font-bold mb-3">Enterprise Security</h4>
              <p className="text-gray-600">Banking-grade security with encryption, 2FA, and automatic backups.</p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg">
              <div className="text-4xl mb-4">💾</div>
              <h4 className="text-xl font-bold mb-3">Export Source Code</h4>
              <p className="text-gray-600">Download complete source code with frontend, backend, and database setup.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-16">Simple Pricing</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h4 className="text-xl font-bold mb-4">Free</h4>
              <p className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-600">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li>✅ Limited Pages (5)</li>
                <li>✅ Basic AI Generations</li>
                <li>❌ Source Code Export</li>
                <li>❌ Custom Domain</li>
              </ul>
              <button className="w-full py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-indigo-600 text-white p-8 rounded-lg border-2 border-indigo-600 transform scale-105">
              <p className="text-sm mb-2">MOST POPULAR</p>
              <h4 className="text-xl font-bold mb-4">Pro</h4>
              <p className="text-4xl font-bold mb-6">$29<span className="text-lg">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li>✅ Unlimited Pages</li>
                <li>✅ Unlimited AI Generations</li>
                <li>✅ Source Code Export</li>
                <li>✅ Custom Domain</li>
              </ul>
              <button className="w-full py-2 bg-white text-indigo-600 rounded hover:bg-gray-100 font-semibold">
                Start Free Trial
              </button>
            </div>

            {/* Business Plan */}
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h4 className="text-xl font-bold mb-4">Business</h4>
              <p className="text-4xl font-bold mb-6">$99<span className="text-lg text-gray-600">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li>✅ Everything in Pro</li>
                <li>✅ Multi-App Creation</li>
                <li>✅ Team Collaboration</li>
                <li>✅ Priority Support</li>
              </ul>
              <button className="w-full py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6">Ready to Build?</h3>
          <p className="text-lg mb-8">Start your free 7-day trial now. No credit card required.</p>
          <a href="/signup" className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 font-semibold">
            Start Building Now →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">GitHub</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p>&copy; 2024 AI Builder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
