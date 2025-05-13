import React from 'react'
import { Link } from 'react-router-dom'

export const StyleTiles = () => {
  const styles = [
    {
      name: 'International Style',
      count: 124,
    },
    {
      name: 'Desert Modernism',
      count: 74,
    },
    {
      name: 'Organic Modernism',
      count: 92,
    },
    {
      name: 'California Modern',
      count: 156,
    },
    {
      name: 'Brutalist',
      count: 43,
    },
    {
      name: 'Post-War Modern',
      count: 187,
    },
    {
      name: 'Mid-Century Ranch',
      count: 243,
    },
    {
      name: 'Googie',
      count: 28,
    },
    {
      name: 'Case Study House',
      count: 19,
    },
    {
      name: 'Usonian',
      count: 67,
    },
    {
      name: 'New Formalism',
      count: 35,
    },
    {
      name: 'Streamline Moderne',
      count: 51,
    },
  ]
  return (
    <section className="py-24 bg-[#F5F5F2]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Explore by Architectural Style
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {styles.map((style, index) => (
            <Link
              key={index}
              to="/browse"
              className="group relative overflow-hidden rounded-xl bg-white p-6 text-left transition-shadow hover:shadow-lg block"
            >
              <h3 className="font-medium mb-1">{style.name}</h3>
              <p className="text-sm text-gray-600">{style.count} listings</p>
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 