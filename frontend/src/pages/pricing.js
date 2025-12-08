import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Pricing() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: '₹',
      description: 'Get started with AI',
      features: [
        '7 free AI generations per month',
        'Basic content generation',
        'Email support',
        'Basic project management',
        'Community access'
      ],
      cta: 'Get Started',
      color: 'gray'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 500,
      currency: '₹',
      description: 'For growing creators',
      badge: 'MOST POPULAR',
      features: [
        'Unlimited AI generations',
        'Advanced content generation',
        'Code generation & website builder',
        'Priority email & chat support',
        'Advanced project management',
        'Custom API access',
        'Analytics dashboard',
        'Export in multiple formats'
      ],
      cta: 'Subscribe Now',
      color: 'indigo'
    },
    {
      id: 'business',
      name: 'Business',
      price: 1000,
      currency: '₹',
      description: 'For enterprises',
      features: [
        'Everything in Pro, plus:',
        'Unlimited AI generations with priority',
        'Dedicated account manager',
        '24/7 phone & email support',
        'Team collaboration (5+ users)',
        'Advanced security & compliance',
        'Bulk API quota',
        'Custom integrations',
        'White-label options',
        'SLA guarantee'
      ],
      cta: 'Contact Sales',
      color: 'purple'
    }
  ];

  const handleSubscribe = async (planId) => {
    if (planId === 'free') {
      router.push('/dashboard');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/v1/auth/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Subscription successful!');
        router.push('/dashboard');
      } else {
        alert(data.message || 'Subscription failed');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      gray: 'border-gray-200 hover:shadow-md',
      indigo: 'border-indigo-500 ring-2 ring-indigo-500 hover:shadow-xl',
      purple: 'border-purple-200 hover:shadow-lg'
    };
    return colors[color];
  };

  const getButtonClasses = (color) => {
    const colors = {
      gray: 'bg-gray-500 hover:bg-gray-600',
      indigo: 'bg-indigo-600 hover:bg-indigo-700',
      purple: 'bg-purple-600 hover:bg-purple-700'
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Choose the perfect plan for your AI-powered projects
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 text-sm font-medium text-gray-400 hover:text-white border border-gray-400 rounded-lg hover:border-white transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-slate-800 rounded-2xl border-2 p-8 transition-all ${getColorClasses(plan.color)}`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Name & Description */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">{plan.name}</h2>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-white">{plan.currency}{plan.price}</span>
                  {plan.price > 0 && <span className="text-gray-400 ml-2">/month</span>}
                </div>
                {plan.price === 0 && (
                  <p className="text-gray-400 text-sm mt-2">Forever free with limited features</p>
                )}
              </div>

              {/* Features */}
              <div className="mb-8 space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${getButtonClasses(plan.color)}`}
              >
                {plan.cta}
              </button>

              {/* Comparison Note */}
              {plan.id === 'free' && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  No credit card required • Cancel anytime
                </p>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h3>
          
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-2">Can I upgrade or downgrade anytime?</h4>
              <p className="text-gray-400">Yes! You can change your plan at any time. Changes take effect immediately.</p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-400">We accept all major credit cards, debit cards, and digital wallets (Google Pay, Apple Pay, etc.)</p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-2">Do you offer refunds?</h4>
              <p className="text-gray-400">Yes! We offer a 7-day money-back guarantee for all paid plans. No questions asked.</p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-2">Is there a contract?</h4>
              <p className="text-gray-400">No contracts! You can cancel your subscription at any time without penalties.</p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-2">What if I need more features?</h4>
              <p className="text-gray-400">Contact our sales team at support@aibuilder.com for custom enterprise solutions.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to get started?</h3>
            <p className="text-indigo-100 mb-8 text-lg">Join thousands of creators building amazing projects with AI</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
