import React from 'react'
import { Search, Bell, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

export const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Browse verified homes',
      description: 'Filter by style and location',
      color: '#FF6B4A',
      link: '/browse'
    },
    {
      icon: Bell,
      title: 'Get SMS alerts',
      description: 'Never miss a new listing',
      color: '#D5B887',
      link: '/home'
    },
    {
      icon: Lock,
      title: 'Lock your favorite',
      description: '48-hour exclusive access',
      color: '#101010',
      link: '/home'
    },
  ]
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Desktop Arrow Path */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none">
            <svg
              width="100%"
              height="50"
              viewBox="0 0 1200 50"
              fill="none"
              className="w-full scale-110"
              preserveAspectRatio="none"
            >
              <path
                d="M0 25H400L500 5L600 45L700 5L800 45L1200 25"
                stroke="#E5E5E5"
                strokeWidth="2"
                strokeDasharray="6 6"
                className="opacity-50"
              />
            </svg>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <Link to={step.link} className="block h-full">
                  <div className="bg-white rounded-2xl p-8 h-full border border-gray-100 hover:shadow-md transition-shadow">
                    {/* Number Badge */}
                    <div
                      className="absolute -top-5 -left-2 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white"
                      style={{
                        backgroundColor: step.color,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="pt-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <step.icon
                          className="w-6 h-6"
                          style={{
                            color: step.color,
                          }}
                        />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>
                  </div>
                </Link>
                {/* Mobile Arrow */}
                {index < steps.length - 1 && (
                  <div className="md:hidden absolute -bottom-8 left-1/2 -translate-x-1/2">
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                      <path
                        d="M12 16L23.547 0.5H0.453054L12 16Z"
                        fill="#E5E5E5"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 