import React from 'react'
import { Link } from 'react-router-dom'

export const Footer = () => {
  const links = {
    styles: [
      'Ranch House',
      'Organic Modernism',
      'International Style',
      'Desert Modern',
      'Brutalist',
      'Case Study',
    ],
    architects: [
      'Richard Neutra',
      'Frank Lloyd Wright',
      'John Lautner',
      'Craig Ellwood',
      'A. Quincy Jones',
      'William Krisel',
    ],
  }
  return (
    <footer className="bg-[#101010] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-bold mb-6">Styles</h3>
            <ul className="space-y-3">
              {links.styles.map((style) => (
                <li key={style}>
                  <Link
                    to={`/browse`}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {style}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-6">Architects</h3>
            <ul className="space-y-3">
              {links.architects.map((architect) => (
                <li key={architect}>
                  <Link
                    to={`/browse`}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {architect}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-6">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/60">
          <p>© 2024 MidMod Radar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 