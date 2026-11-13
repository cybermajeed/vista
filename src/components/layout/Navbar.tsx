import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { Menu, X, Sparkles } from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemCount = useCartStore((state) => state.items.length);
  const { user, profile, signOut } = useAuthStore();
  const isAdmin = profile?.role === "admin";

  return (
    <header className="bg-canvas border-b border-hairline-soft h-16 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between px-md md:px-lg">
        <div className="flex items-center gap-xl">
          <Link to="/" className="flex items-center gap-sm">
            <div className="w-8 h-8 bg-brand-yellow rounded-sm flex items-center justify-center font-bold text-primary">
              V
            </div>
            <span className="text-body-md-medium font-bold text-ink-deep">
              VISTA
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-md">
            {!isAdmin && (
              <>
                <Link
                  to="/visualizer"
                  className="flex items-center gap-1 text-body-sm-medium text-brand-accent hover:text-accent-pressed transition-colors font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Visualizer</span>
                </Link>
                <Link
                  to="/catalogue"
                  className="text-body-sm-medium text-ink hover:text-brand-accent transition-colors"
                >
                  Catalogue
                </Link>
                <Link
                  to="/catalogue?category=wood"
                  className="text-body-sm-medium text-ink hover:text-brand-accent transition-colors"
                >
                  Wood
                </Link>
                <Link
                  to="/catalogue?category=glass"
                  className="text-body-sm-medium text-ink hover:text-brand-accent transition-colors"
                >
                  Glass
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-md">
          {!isAdmin && (
            <Link
              to="/cart"
              className="text-body-sm-medium text-ink hover:text-brand-accent transition-colors"
            >
              Cart ({cartItemCount})
            </Link>
          )}
          {user && (
            <Link
              to={isAdmin ? "/admin" : "/dashboard"}
              className="text-body-sm-medium text-ink hover:text-brand-accent transition-colors"
            >
              {isAdmin ? "Admin Panel" : "Dashboard"}
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-md relative group">
              <Link to="/profile" className="flex items-center gap-sm">
                <div className="w-8 h-8 rounded-full bg-brand-yellow/20 border border-brand-yellow flex items-center justify-center">
                  <span className="text-body-sm-medium text-brand-accent">
                    {profile?.first_name?.charAt(0).toUpperCase() ||
                      user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-body-sm-medium text-ink hidden lg:block">
                  {profile?.first_name || "My Account"}
                </span>
              </Link>
              <Button variant="secondary" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/signin">
              <Button variant="primary">Get started</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-md">
          {!isAdmin && (
            <Link
              to="/cart"
              className="text-body-sm-medium text-ink hover:text-brand-accent transition-colors"
            >
              Cart ({cartItemCount})
            </Link>
          )}
          <button
            className="text-ink bg-transparent focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-canvas border-b border-hairline-soft shadow-4 py-md px-lg flex flex-col gap-md">
          {!isAdmin && (
            <>
              <Link
                to="/visualizer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-body-md-medium text-brand-accent font-semibold"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Visualizer</span>
              </Link>
              <Link
                to="/catalogue"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-body-md-medium text-ink"
              >
                Catalogue
              </Link>
              <Link
                to="/catalogue?category=wood"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-body-md-medium text-ink"
              >
                Wood
              </Link>
              <Link
                to="/catalogue?category=glass"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-body-md-medium text-ink"
              >
                Glass
              </Link>
            </>
          )}
          {user && (
            <Link
              to={isAdmin ? "/admin" : "/dashboard"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-body-md-medium text-ink"
            >
              {isAdmin ? "Admin Panel" : "Dashboard"}
            </Link>
          )}
          {user ? (
            <Button
              variant="secondary"
              className="w-full justify-center"
              onClick={() => {
                signOut();
                setIsMobileMenuOpen(false);
              }}
            >
              Sign Out
            </Button>
          ) : (
            <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full justify-center">
                Get started
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
