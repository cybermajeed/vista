import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useAuthStore } from "../store/authStore";
import { supabase } from "../lib/supabase";

export function Dashboard() {
  const { user, profile, signOut, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate("/signin");
      return;
    }

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
      setLoadingOrders(false);
    };

    fetchOrders();
  }, [user, isLoading, navigate]);

  if (isLoading || loadingOrders) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas py-section px-md md:px-lg animate-fade-in">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-display-lg text-ink-deep mb-lg font-serif">
          Welcome, {profile?.first_name || user?.email?.split("@")[0]}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-xl">
          <div className="lg:col-span-1">
            <Card className="p-xl space-y-md">
              <Link
                to="/dashboard"
                className="block text-body-md-medium text-brand-accent"
              >
                Order History
              </Link>
              <Link
                to="/wishlist"
                className="block text-body-md text-slate hover:text-ink transition-colors"
              >
                Wishlist
              </Link>
              <Link
                to="/profile"
                className="block text-body-md text-slate hover:text-ink transition-colors"
              >
                Profile Settings
              </Link>
              <button
                onClick={() => signOut()}
                className="text-body-md text-slate bg-transparent hover:text-red-500 mt-xl block transition-colors"
              >
                Sign Out
              </button>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-heading-3 text-ink-deep mb-md font-serif">
              Recent Orders
            </h2>

            {orders.length === 0 ? (
              <Card className="p-xl text-center text-slate">
                <p>You have no recent orders.</p>
                <Link
                  to="/catalogue"
                  className="text-brand-accent mt-sm inline-block"
                >
                  Browse catalogue
                </Link>
              </Card>
            ) : (
              <div className="space-y-md">
                {orders.map((order) => (
                  <Card key={order.id} className="p-xl animate-slide-up">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md border-b border-hairline-soft pb-md mb-md">
                      <div>
                        <span className="text-caption-bold text-slate block mb-xxs">
                          ORDER ID
                        </span>
                        <span className="text-body-md-medium text-ink-deep">
                          {order.id.slice(0, 8)}...
                        </span>
                      </div>
                      <div>
                        <span className="text-caption-bold text-slate block mb-xxs">
                          DATE PLACED
                        </span>
                        <span className="text-body-md text-ink">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-caption-bold text-slate block mb-xxs">
                          TOTAL AMOUNT
                        </span>
                        <span className="text-body-md-medium text-ink">
                          ₹{order.total_amount.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "success"
                              : "tag-yellow"
                          }
                        >
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
