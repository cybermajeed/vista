import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Products");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { profile } = useAuthStore();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentEntity, setCurrentEntity] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    setLoading(true);
    let result;
    if (activeTab === "Products") {
      result = await supabase.from("products").select(`*, categories(name)`);
    } else if (activeTab === "Categories") {
      result = await supabase.from("categories").select("*");
    } else if (activeTab === "Orders") {
      result = await supabase
        .from("orders")
        .select("*, profiles(first_name, last_name, email)");
    }

    if (result && !result.error) {
      setData(result.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleOpenModal = (mode: "add" | "edit", entity: any = null) => {
    setModalMode(mode);
    setCurrentEntity(entity);
    if (mode === "edit" && entity) {
      setFormData(entity);
    } else {
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile?.role !== "admin") {
      alert("You must be an admin to perform this action.");
      return;
    }

    let error;
    if (activeTab === "Products") {
      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/ /g, "-"),
        base_price: parseFloat(formData.base_price),
        pricing_unit: formData.pricing_unit || "piece",
        is_active: formData.is_active !== undefined ? formData.is_active : true,
      };

      if (modalMode === "add") {
        const res = await supabase.from("products").insert([payload]);
        error = res.error;
      } else {
        const res = await supabase
          .from("products")
          .update(payload)
          .eq("id", currentEntity.id);
        error = res.error;
      }
    } else if (activeTab === "Categories") {
      const payload = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/ /g, "-"),
        description: formData.description,
      };
      if (modalMode === "add") {
        const res = await supabase.from("categories").insert([payload]);
        error = res.error;
      } else {
        const res = await supabase
          .from("categories")
          .update(payload)
          .eq("id", currentEntity.id);
        error = res.error;
      }
    }

    if (error) {
      alert("Error saving: " + error.message);
    } else {
      setIsModalOpen(false);
      fetchData();
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (!error) fetchData();
  };

  return (
    <div className="min-h-screen bg-canvas py-section px-md md:px-lg animate-fade-in relative">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row gap-xl">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 animate-slide-up">
          <Card className="p-lg sticky top-24">
            <h2 className="text-heading-4 text-ink-deep mb-lg px-xs font-serif">
              Admin Control
            </h2>
            <div className="flex flex-col gap-xs">
              {["Products", "Categories", "Orders"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-left px-md py-sm rounded-md transition-colors text-body-sm-medium ${
                    activeTab === tab
                      ? "bg-surface-pricing-featured text-brand-accent font-bold"
                      : "text-slate bg-transparent hover:bg-surface-soft hover:text-ink"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 animate-slide-up animate-delay-100">
          <div className="flex justify-between items-center mb-lg">
            <h1 className="text-display-lg text-ink-deep font-serif">
              {activeTab}
            </h1>
            {(activeTab === "Products" || activeTab === "Categories") && (
              <Button variant="primary" onClick={() => handleOpenModal("add")}>
                Add New {activeTab === "Products" ? "Product" : "Category"}
              </Button>
            )}
          </div>

          <Card className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-surface text-body-sm-medium text-slate border-b border-hairline-soft">
                  {activeTab === "Products" && (
                    <>
                      <th className="p-md font-medium">Product Name</th>
                      <th className="p-md font-medium">Category</th>
                      <th className="p-md font-medium">Base Price</th>
                      <th className="p-md font-medium">Status</th>
                      <th className="p-md font-medium text-right">Actions</th>
                    </>
                  )}
                  {activeTab === "Categories" && (
                    <>
                      <th className="p-md font-medium">Category Name</th>
                      <th className="p-md font-medium">Slug</th>
                      <th className="p-md font-medium text-right">Actions</th>
                    </>
                  )}
                  {activeTab === "Orders" && (
                    <>
                      <th className="p-md font-medium">Order ID</th>
                      <th className="p-md font-medium">Customer</th>
                      <th className="p-md font-medium">Total</th>
                      <th className="p-md font-medium">Status</th>
                      <th className="p-md font-medium text-right">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="text-body-sm text-ink divide-y divide-hairline-soft">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-md text-center py-xl text-slate"
                    >
                      Loading data...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-md text-center py-xl text-slate"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-surface-soft/50 transition-colors"
                    >
                      {activeTab === "Products" && (
                        <>
                          <td className="p-md font-medium">{item.name}</td>
                          <td className="p-md">
                            {item.categories?.name || "-"}
                          </td>
                          <td className="p-md">
                            ₹{item.base_price} / {item.pricing_unit}
                          </td>
                          <td className="p-md">
                            <Badge
                              variant={
                                item.is_active ? "success" : "tag-yellow"
                              }
                            >
                              {item.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="p-md text-right">
                            <button
                              onClick={() => handleOpenModal("edit", item)}
                              className="text-brand-accent hover:underline"
                            >
                              Edit
                            </button>
                          </td>
                        </>
                      )}
                      {activeTab === "Categories" && (
                        <>
                          <td className="p-md font-medium">{item.name}</td>
                          <td className="p-md">{item.slug}</td>
                          <td className="p-md text-right">
                            <button
                              onClick={() => handleOpenModal("edit", item)}
                              className="text-brand-accent hover:underline"
                            >
                              Edit
                            </button>
                          </td>
                        </>
                      )}
                      {activeTab === "Orders" && (
                        <>
                          <td className="p-md font-medium">
                            {item.id.slice(0, 8)}...
                          </td>
                          <td className="p-md">
                            {item.profiles?.first_name || item.profiles?.email}
                          </td>
                          <td className="p-md font-medium text-ink-deep">
                            ₹{item.total_amount}
                          </td>
                          <td className="p-md">
                            <Badge
                              variant={
                                item.status === "delivered"
                                  ? "success"
                                  : "tag-yellow"
                              }
                            >
                              {item.status
                                ? item.status.toUpperCase()
                                : "UNKNOWN"}
                            </Badge>
                          </td>
                          <td className="p-md text-right flex justify-end gap-sm">
                            <select
                              className="text-xs border rounded px-2 py-1 bg-transparent"
                              value={item.status}
                              onChange={(e) =>
                                updateOrderStatus(item.id, e.target.value)
                              }
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      {/* Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-ink-deep/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-xl relative shadow-4">
            <h2 className="text-heading-3 font-serif mb-lg">
              {modalMode === "add" ? "Add" : "Edit"} {activeTab.slice(0, -1)}
            </h2>

            <form onSubmit={handleSave} className="space-y-md">
              {activeTab === "Products" && (
                <>
                  <div>
                    <label className="block text-body-sm-medium text-slate mb-xs">
                      Product Name
                    </label>
                    <Input
                      required
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-md">
                    <div>
                      <label className="block text-body-sm-medium text-slate mb-xs">
                        Base Price (₹)
                      </label>
                      <Input
                        type="number"
                        required
                        value={formData.base_price || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            base_price: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-body-sm-medium text-slate mb-xs">
                        Pricing Unit
                      </label>
                      <Input
                        placeholder="e.g. sqft, piece"
                        required
                        value={formData.pricing_unit || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pricing_unit: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-sm mt-sm">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.is_active !== false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-brand-accent focus:ring-brand-accent border-hairline-strong rounded"
                    />
                    <label htmlFor="isActive" className="text-body-sm text-ink">
                      Product is active and visible
                    </label>
                  </div>
                </>
              )}

              {activeTab === "Categories" && (
                <>
                  <div>
                    <label className="block text-body-sm-medium text-slate mb-xs">
                      Category Name
                    </label>
                    <Input
                      required
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-body-sm-medium text-slate mb-xs">
                      Description
                    </label>
                    <Input
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-sm pt-lg border-t border-hairline-soft mt-xl">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
