import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuthStore } from "../store/authStore";
import { supabase } from "../lib/supabase";

export function Profile() {
  const { user, profile, isLoading, initialize } = useAuthStore();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate("/signin");
      return;
    }
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
    }
  }, [user, profile, isLoading, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully!" });
      // Refresh global state
      initialize();
    }
    setSaving(false);
  };

  const handleMakeAdmin = async () => {
    if (!user) return;
    const confirm = window.confirm(
      "This will upgrade your account to an Admin. Are you sure?",
    );
    if (!confirm) return;

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", user.id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text: "You are now an Admin! You can access the Admin Panel.",
      });
      initialize();
    }
    setSaving(false);
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas py-section px-md md:px-lg animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-lg">
          <h1 className="text-display-lg text-ink-deep font-serif">
            Your Profile
          </h1>
          {profile.role === "admin" ? (
            <span className="bg-success-accent/10 text-success-accent px-md py-xs rounded-full text-body-sm-medium border border-success-accent/20">
              Admin Account
            </span>
          ) : (
            <Button
              variant="secondary"
              onClick={handleMakeAdmin}
              disabled={saving}
            >
              Upgrade to Admin
            </Button>
          )}
        </div>

        <Card className="p-xl">
          {message && (
            <div
              className={`p-md rounded-md mb-lg text-body-sm-medium ${message.type === "success" ? "bg-success-accent/10 text-success-accent" : "bg-brand-red-dark/10 text-brand-red-dark"}`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-md">
            <div>
              <label className="block text-body-sm-medium text-slate mb-xs">
                Email
              </label>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-surface-soft cursor-not-allowed text-slate"
              />
              <p className="text-caption text-slate mt-xs">
                Email cannot be changed directly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div>
                <label className="block text-body-sm-medium text-slate mb-xs">
                  First Name
                </label>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-body-sm-medium text-slate mb-xs">
                  Last Name
                </label>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="pt-md border-t border-hairline-soft flex justify-end">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
