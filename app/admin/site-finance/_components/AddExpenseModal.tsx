"use client";

import { useState, useEffect, useMemo } from "react";
import { PROJECTS, PAYMENT_METHODS, EXPENSE_CATEGORIES, SITE_LOCATIONS } from "@/app/admin/_lib/site-finance-data";

interface FormData {
  location: string;
  project: string;
  date: string;
  category: string;
  subcategory: string;
  description: string;
  amount: string;
  currency: string;
  exchangeRate: string;
  paymentMethod: string;
  paidBy: string;
  receipt: File | null;
  notes: string;
}

interface LocationConfig {
  id: string;
  name: string;
  country: string;
  currency: string;
  currencySymbol: string;
  reportingCurrency: string;
  reportingCurrencySymbol: string;
  defaultExchangeRate: number;
}

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  defaultLocation?: LocationConfig;
}

export default function AddExpenseModal({ isOpen, onClose, onSubmit, defaultLocation }: AddExpenseModalProps) {
  const [formData, setFormData] = useState<FormData>({
    location: defaultLocation?.id || "monrovia",
    project: "buchanan",
    date: new Date().toISOString().split("T")[0],
    category: "Labour",
    subcategory: "Weekly Labour",
    description: "",
    amount: "",
    currency: defaultLocation?.currency || "USD",
    exchangeRate: String(defaultLocation?.defaultExchangeRate || 102),
    paymentMethod: "Cash",
    paidBy: "Project Manager",
    receipt: null,
    notes: "",
  });

  const subcategories = EXPENSE_CATEGORIES[formData.category as keyof typeof EXPENSE_CATEGORIES] || [];

  // Get the currently selected location config
  const selectedLocation = useMemo(() => 
    SITE_LOCATIONS.find(loc => loc.id === formData.location) || defaultLocation,
    [formData.location, defaultLocation]
  );

  // Available currencies for the selected location
  const availableCurrencies = useMemo(() => {
    if (!selectedLocation) return [{ code: "USD", symbol: "$", label: "USD ($) - Local" }];
    return [
      { code: selectedLocation.currency, symbol: selectedLocation.currencySymbol, label: `${selectedLocation.currency} (${selectedLocation.currencySymbol}) - Local` },
      { code: selectedLocation.reportingCurrency, symbol: selectedLocation.reportingCurrencySymbol, label: `${selectedLocation.reportingCurrency} (${selectedLocation.reportingCurrencySymbol}) - Reporting` },
    ];
  }, [selectedLocation]);

  // Auto-update currency and exchange rate when location changes
  useEffect(() => {
    if (selectedLocation) {
      setFormData(prev => ({
        ...prev,
        currency: selectedLocation.currency,
        exchangeRate: String(selectedLocation.defaultExchangeRate),
      }));
    }
  }, [formData.location, selectedLocation]);

  // Standardized rate display: always show as "1 USD = X INR" (or similar)
  const getRateDisplay = () => {
    if (!selectedLocation) return "";
    
    const local = selectedLocation.currency;
    const reporting = selectedLocation.reportingCurrency;
    const rate = Number(formData.exchangeRate);
    
    if (local === "USD" && reporting === "INR") {
      return `1 USD = ${rate} INR`;
    } else if (local === "INR" && reporting === "USD") {
      return `1 USD = ${rate} INR`;
    } else if (local === "USD") {
      return `1 USD = ${rate} ${reporting}`;
    } else if (reporting === "USD") {
      return `1 USD = ${rate} ${local}`;
    }
    return `1 ${local} = ${rate} ${reporting}`;
  };

  // Calculate equivalent based on selected currency
  const calculateEquivalent = () => {
    if (!formData.amount || !formData.exchangeRate || !selectedLocation) return 0;
    const amount = Number(formData.amount);
    const rate = Number(formData.exchangeRate);
    
    if (formData.currency === selectedLocation.currency) {
      // Converting from local to reporting currency
      return amount * rate;
    } else {
      // Converting from reporting to local currency
      return amount / rate;
    }
  };

  const equivalent = calculateEquivalent();
  const isLocalCurrency = formData.currency === selectedLocation?.currency;
  const equivalentSymbol = isLocalCurrency 
    ? (selectedLocation?.reportingCurrencySymbol || "₹") 
    : (selectedLocation?.currencySymbol || "$");
  const equivalentLabel = isLocalCurrency 
    ? `${selectedLocation?.reportingCurrency || "INR"} Equivalent` 
    : `${selectedLocation?.currency || "USD"} Equivalent`;

  const currentCurrency = availableCurrencies.find(c => c.code === formData.currency);
  const currencySymbol = currentCurrency?.symbol || selectedLocation?.currencySymbol || "$";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "category") {
        updated.subcategory = (EXPENSE_CATEGORIES[value as keyof typeof EXPENSE_CATEGORIES] || [])[0] || "";
      }
      return updated;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, receipt: e.target.files?.[0] || null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, equivalentValue: equivalent });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Expense</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Location</label>
                <select name="location" value={formData.location} onChange={handleChange}>
                  {SITE_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name} ({loc.country})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Project</label>
                <select name="project" value={formData.project} onChange={handleChange}>
                  {PROJECTS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  {Object.keys(EXPENSE_CATEGORIES).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Subcategory</label>
                <select name="subcategory" value={formData.subcategory} onChange={handleChange}>
                  {subcategories.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Weekly labour payment"
                  required
                />
              </div>

              <div className="form-group">
                <label>Amount ({currencySymbol})</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="1,745"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Currency</label>
                <select name="currency" value={formData.currency} onChange={handleChange}>
                  {availableCurrencies.map((c) => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Only show Exchange Rate and Equivalent when entering LOCAL currency */}
              {isLocalCurrency && (
                <>
                  <div className="form-group">
                    <label>Exchange Rate</label>
                    <input
                      type="number"
                      name="exchangeRate"
                      value={formData.exchangeRate}
                      onChange={handleChange}
                      placeholder={String(selectedLocation?.defaultExchangeRate || 102)}
                      step="0.01"
                      required
                      min="0.0001"
                    />
                    <small className="rate-display">{getRateDisplay()}</small>
                  </div>

                  <div className="form-group">
                    <label>{equivalentLabel}</label>
                    <div className="calculated-value">
                      {equivalent > 0 ? `${equivalentSymbol}${equivalent.toLocaleString(isLocalCurrency ? "en-IN" : "en-US")}` : `${equivalentSymbol}0`}
                    </div>
                    <small className="equiv-hint">
                      Auto-calculated: {formData.amount ? `${formData.currency} ${Number(formData.amount).toLocaleString()} = ${equivalentSymbol}${equivalent.toLocaleString()}` : "Enter amount to see conversion"}
                    </small>
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Payment Method</label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Paid By</label>
                <input
                  type="text"
                  name="paidBy"
                  value={formData.paidBy}
                  onChange={handleChange}
                  placeholder="Project Manager"
                />
              </div>

              <div className="form-group full-width">
                <label>Receipt</label>
                <input type="file" name="receipt" onChange={handleFileChange} accept=".pdf,.jpg,.png" />
                {formData.receipt && <span className="file-name">{formData.receipt.name}</span>}
              </div>

              <div className="form-group full-width">
                <label>Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}