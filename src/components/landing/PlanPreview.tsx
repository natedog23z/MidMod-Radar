import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export const PlanPreview = () => {
  const plans = [
    {
      name: 'Free',
      benefit: 'Track up to 3 homes',
      features: ['Basic search filters', 'Email notifications'],
    },
    {
      name: 'Plus',
      benefit: 'Priority access',
      features: ['Instant SMS alerts', '6-hour exclusive locks', '25+ homes'],
    },
  ]
  return (
    <section className="py-16 bg-[#F5F5F2]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-xl p-8 flex flex-col ${plan.name === 'Plus' ? 'border-2 border-[#FF6B4A]' : 'border border-gray-100'}`}
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600">{plan.benefit}</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-[#D5B887] rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link 
                    to="/home"
                    className={`w-full inline-flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium ${
                      plan.name === 'Plus' 
                        ? 'bg-[#FF6B4A] text-white hover:bg-[#FF8B6A]' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    {plan.name === 'Free' ? 'Use Free Plan' : 'Get Started'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-end justify-center">
            <Link 
              to="/home"
              className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
            >
              Compare all plans
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-sm text-gray-600 mt-2">4 plans available</p>
          </div>
        </div>
      </div>
    </section>
  )
} 