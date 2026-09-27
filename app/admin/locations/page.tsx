"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/src/lib/auth";
import {
  LocationData,
  getStoredLocations,
  saveLocations,
  formatCurrency,
  getCurrencyTotals,
} from "@/app/admin/_lib/locations-data";

export default function AdminLocationsPage() {
  const { isAuthenticated } = useRequireAuth("/admin/login");
  const [locations, setLocations] = useState<LocationData[]>(getStoredLocations);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCurrency, setNewCurrency] = useState("₹");
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);

  useEffect(() => {
    saveLocations(locations);
  }, [locations]);

  const countries = Array.from(
    new Set(locations.map((loc) => loc.country).filter(Boolean))
  );
  const cities = Array.from(new Set(locations.map((loc) => loc.name)));

  const filteredLocations = locations.filter((loc) => {
    if (activeCountry && loc.country !== activeCountry) return false;
    if (activeCity && loc.name !== activeCity) return false;
    return true;
  });

  const currencyTotals = getCurrencyTotals(filteredLocations);

  const clearFilters = () => {
    setActiveCountry(null);
    setActiveCity(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-redirect-msg">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addLocation = () => {
    if (!newName.trim()) return;
    const newLoc: LocationData = {
      id: newName.toLowerCase().replace(/\s+/g, "-"),
      name: newName,
      country: "",
      currency: newCurrency,
      received: 0,
      expenses: 0,
      projects: [],
      funds: [],
    };
    setLocations([newLoc, ...locations]);
    setNewName("");
    setNewCurrency("₹");
    setShowForm(false);
  };

  return (
    <>
      <div className="admin-locations-header">
        <h1>Locations</h1>
        <button className="admin-btn" onClick={() => setShowForm(!showForm)}>
          + Add Location
        </button>
      </div>

      {showForm && (
        <div className="admin-add-location-form">
          <h3>Add New Location</h3>
          <div className="admin-add-location-row">
            <input
              type="text"
              className="admin-input"
              placeholder="Location Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <select
              className="admin-input"
              value={newCurrency}
              onChange={(e) => setNewCurrency(e.target.value)}
            >
              <option value="₹">₹ INR</option>
              <option value="$">$ USD</option>
              <option value="€">€ EUR</option>
            </select>
          </div>
          <div className="admin-add-location-actions">
            <button
              className="admin-btn-secondary"
              onClick={() => {
                setShowForm(false);
                setNewName("");
              }}
            >
              Cancel
            </button>
            <button className="admin-btn" onClick={addLocation}>
              Save Location
            </button>
          </div>
        </div>
      )}

      {(activeCountry || activeCity) && (
        <div className="admin-expense-filters" style={{ marginBottom: "16px" }}>
          <span
            style={{
              fontSize: "12px",
              color: "var(--neutral-05)",
              marginRight: "8px",
            }}
          >
            Active filters:
          </span>
          {activeCountry && (
            <span className="admin-filter-chip active">
              {activeCountry}
              <button
                onClick={() => setActiveCountry(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  marginLeft: "6px",
                  fontSize: "11px",
                }}
              >
                ×
              </button>
            </span>
          )}
          {activeCity && (
            <span className="admin-filter-chip active">
              {activeCity}
              <button
                onClick={() => setActiveCity(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  marginLeft: "6px",
                  fontSize: "11px",
                }}
              >
                ×
              </button>
            </span>
          )}
          <button
            className="admin-btn-secondary"
            onClick={clearFilters}
            style={{ padding: "6px 12px", fontSize: "12px" }}
          >
            Clear All
          </button>
        </div>
      )}

      <div className="admin-expense-filters" style={{ marginBottom: "20px" }}>
        {countries.map((country) => (
          <button
            key={country}
            className={`admin-filter-chip${
              activeCountry === country ? " active" : ""
            }`}
            onClick={() =>
              setActiveCountry(
                activeCountry === country ? null : country
              )
            }
          >
            {country}
          </button>
        ))}
      </div>

      <div className="admin-expense-filters" style={{ marginBottom: "24px" }}>
        {cities.map((city) => (
          <button
            key={city}
            className={`admin-filter-chip${
              activeCity === city ? " active" : ""
            }`}
            onClick={() =>
              setActiveCity(activeCity === city ? null : city)
            }
          >
            {city}
          </button>
        ))}
      </div>

      <div className="admin-locations-table">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Projects</th>
              <th className="admin-amount-received">Received</th>
              <th className="admin-amount-expense">Expenses</th>
              <th>Balance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLocations.length === 0 ? (
              <tr>
                <td colSpan={6} className="admin-locations-empty">
                  No locations found. Click &lsquo;Add Location&rsquo; to get started.
                </td>
              </tr>
            ) : (
              filteredLocations.map((loc) => {
                const balance = loc.received - loc.expenses;
                const balanceClass =
                  balance >= 0
                    ? "admin-balance-positive"
                    : "admin-balance-negative";
                const isExpanded = expanded[loc.id];

                return (
                  <>
                    <tr key={loc.id}>
                      <td>
                        <span className="admin-location-name">
                          <span
                            className={`expand-btn${
                              isExpanded ? " open" : ""
                            }`}
                            onClick={() =>
                              loc.projects.length > 0 && toggleExpand(loc.id)
                            }
                          >
                            {loc.projects.length > 0
                              ? isExpanded
                                ? "▼"
                                : "▶"
                              : ""}
                          </span>
                          {loc.name}
                          {loc.country && (
                            <span
                              style={{
                                display: "block",
                                fontSize: "12px",
                                color: "var(--neutral-05)",
                                fontWeight: 400,
                              }}
                            >
                              {loc.country}
                            </span>
                          )}
                        </span>
                      </td>
                      <td>
                        <span className="admin-location-count">
                          {loc.projects.length} project{loc.projects.length !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="admin-amount-received">
                        {formatCurrency(loc.received, loc.currency)}
                      </td>
                      <td className="admin-amount-expense">
                        {formatCurrency(loc.expenses, loc.currency)}
                      </td>
                      <td>
                        <span className={balanceClass}>
                          {formatCurrency(balance, loc.currency)}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/admin/locations/${loc.id}`}
                          className="admin-btn-secondary"
                          style={{
                            padding: "6px 12px",
                            fontSize: "12px",
                            display: "inline-block",
                          }}
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                    {isExpanded &&
                      loc.projects.map((project) => {
                        const projBalance =
                          project.received - project.expenses;
                        const projBalanceClass =
                          projBalance >= 0
                            ? "admin-balance-positive"
                            : "admin-balance-negative";

                        return (
                          <tr key={project.id} className="admin-project-row">
                            <td>
                              <span className="admin-project-name">
                                {project.name}
                              </span>
                            </td>
                            <td>
                              <span className="admin-location-count">
                                Project
                              </span>
                            </td>
                            <td className="admin-amount-received">
                              {formatCurrency(
                                project.received,
                                project.currency
                              )}
                            </td>
                            <td className="admin-amount-expense">
                              {formatCurrency(project.expenses, project.currency)}
                            </td>
                            <td>
                              <span className={projBalanceClass}>
                                {formatCurrency(projBalance, project.currency)}
                              </span>
                            </td>
                            <td></td>
                          </tr>
                        );
                      })}
                  </>
                );
              })
            )}
            {Object.entries(currencyTotals).map(([currency, totals]) => {
              const balance = totals.received - totals.expenses;
              const balanceClass =
                balance >= 0
                  ? "admin-balance-positive"
                  : "admin-balance-negative";
              return (
                <tr key={currency} className="admin-funding-total-row">
                  <td>
                    <strong>Total ({currency})</strong>
                  </td>
                  <td></td>
                  <td className="admin-amount-received">
                    <strong>{formatCurrency(totals.received, currency)}</strong>
                  </td>
                  <td className="admin-amount-expense">
                    <strong>{formatCurrency(totals.expenses, currency)}</strong>
                  </td>
                  <td>
                    <strong className={balanceClass}>
                      {formatCurrency(balance, currency)}
                    </strong>
                  </td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
