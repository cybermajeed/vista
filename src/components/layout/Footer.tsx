import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-footer-bg text-on-dark py-section px-xxl">
      <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-xl">
        <div className="col-span-2">
          <div className="flex items-center gap-sm mb-md">
            <div className="w-8 h-8 bg-brand-yellow rounded-sm flex items-center justify-center font-bold text-primary">V</div>
            <span className="text-body-md-medium font-bold">VISTA</span>
          </div>
          <p className="text-on-dark-muted text-body-sm">
            Visual Interior Selection & Trade Application.
          </p>
        </div>
        
        <div>
          <h4 className="text-body-md-medium mb-sm">Catalogue</h4>
          <ul className="space-y-xxs">
            <li><Link to="/catalogue?category=wood" className="text-on-dark-muted hover:text-on-dark text-body-sm transition-colors">Wood</Link></li>
            <li><Link to="/catalogue?category=glass" className="text-on-dark-muted hover:text-on-dark text-body-sm transition-colors">Glass</Link></li>
            <li><Link to="/catalogue?category=wallpaper" className="text-on-dark-muted hover:text-on-dark text-body-sm transition-colors">Wallpaper</Link></li>
            <li><Link to="/catalogue?category=lighting" className="text-on-dark-muted hover:text-on-dark text-body-sm transition-colors">Lighting</Link></li>
            <li><Link to="/catalogue?category=flooring" className="text-on-dark-muted hover:text-on-dark text-body-sm transition-colors">Flooring</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-body-md-medium mb-sm">Company</h4>
          <ul className="space-y-xxs">
            <li><Link to="/about" className="text-on-dark-muted hover:text-on-dark text-body-sm transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="text-on-dark-muted hover:text-on-dark text-body-sm transition-colors">Contact</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
