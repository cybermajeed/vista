import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuthStore } from "../store/authStore";

export function SignIn() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  React.useEffect(() => {
    if (user && !isLoading) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div className="min-h-screen bg-canvas flex items-center justify-center">Loading...</div>;
  }
  
  if (user) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        });
        if (signUpError) throw signUpError;
        alert("Sign up successful! You are now signed in.");
        navigate("/dashboard");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-md animate-fade-in">
      <div className="bg-surface-soft p-xl rounded-xxxl shadow-3 max-w-md w-full border border-hairline-soft">
        <h2 className="text-heading-2 text-ink-deep mb-lg text-center font-serif">
          {isSignUp ? "Create an Account" : "Welcome to VISTA"}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-md rounded-md mb-lg text-body-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-md">
          {isSignUp && (
            <div className="grid grid-cols-2 gap-md">
              <div>
                <label className="block text-body-sm-medium text-slate mb-xs">
                  First Name
                </label>
                <Input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-body-sm-medium text-slate mb-xs">
                  Last Name
                </label>
                <Input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-body-sm-medium text-slate mb-xs">
              Email
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-body-sm-medium text-slate mb-xs">
              Password
            </label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-lg"
            disabled={loading}
          >
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>

        <div className="mt-xl text-center">
          <p className="text-body-sm text-slate">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="ml-xs text-brand-accent font-medium hover:underline focus:outline-none"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
