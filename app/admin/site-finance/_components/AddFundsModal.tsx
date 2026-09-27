"use client";

import { useState, useEffect, useMemo } from "react";
import { SITE_LOCATIONS } from "@/app/admin/_lib/site-finance-data";
import { PAYMENT_METHODS } from "@/app/admin/_lib/site-finance-data";

interface FormData {
  location: string;
  date: string;
  amount: string;
  currency: string;
  exchangeRate: string;
  paymentMethod: string;
  sentBy: string;
  reference: string;
  notes: string;
  attachment: File | null;
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

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  defaultLocation?: LocationConfig;
}

export default function AddFundsModal({ isOpen, onClose, onSubmit, defaultLocation }: AddFundsModalProps) {
  const [formData, setFormData] = useState<FormData>({
    location: defaultLocation?.id || "monrovia",
    date: new Date().toISOString().split("T")[0],
    amount: "",
    currency: defaultLocation?.currency || "USD",
    exchangeRate: String(defaultLocation?.defaultExchangeRate || 102),
    paymentMethod: "Bank Transfer",
    sentBy: "Company / Head Office",
    reference: "",
    notes: "Site funding",
    attachment: null,
  });

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

  // Auto-update exchange rate and currency when location changes
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, attachment: e.target.files?.[0] || null }));
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
          <h3>Add Site Funds</h3>
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
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="2,930"
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
                <label>Sent By</label>
                <input
                  type="text"
                  name="sentBy"
                  value={formData.sentBy}
                  onChange={handleChange}
                  placeholder="Company / Head Office"
                />
              </div>

              <div className="form-group">
                <label>Reference Number</label>
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  placeholder="TRX-0025"
                />
              </div>

              <div className="form-group full-width">
                <label>Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} />
              </div>

              <div className="form-group full-width">
                <label>Attachment (Bank Receipt)</label>
                <input type="file" name="attachment" onChange={handleFileChange} accept=".pdf,.jpg,.png" />
                {formData.attachment && <span className="file-name">{formData.attachment.name}</span>}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Funds
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}