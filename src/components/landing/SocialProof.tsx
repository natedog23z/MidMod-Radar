import React from 'react'

export const SocialProof = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Mid-century listings sell 18% faster than ordinary homes.
          </h2>
          <p className="text-xl text-gray-600">Don't miss the drop.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">45,000</div>
            <p className="text-gray-600">MCM sales/yr in U.S.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">42</div>
            <p className="text-gray-600">States with active subscribers</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">2.3×</div>
            <p className="text-gray-600">Faster alerts vs MLS emails</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-[#F5F5F2] rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={`https://i.pravatar.cc/80?img=${i}`}
                  alt="Customer"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-bold">Sarah Mitchell</h3>
                  <p className="text-sm text-gray-600">Eichler Owner</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Bought my Eichler in days, thanks Radar! The instant alerts
                made all the difference in this competitive market."
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 