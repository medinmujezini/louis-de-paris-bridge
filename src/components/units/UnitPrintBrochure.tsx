import React, { forwardRef } from "react";
import { Unit } from "@/types/units";
import dinoLogo from "@/assets/dino-residence-logo.png";
import {
  Bed,
  Bath,
  Maximize,
  Compass,
  Building2,
  MapPin,
  Layers,
} from "lucide-react";

interface UnitPrintBrochureProps {
  unit: Unit;
}

export const UnitPrintBrochure = forwardRef<HTMLDivElement, UnitPrintBrochureProps>(
  ({ unit }, ref) => {
    const formatPrice = (price: number) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(price);

    const pricePerSqm = Math.round(unit.price / unit.surface);

    return (
      <div ref={ref} className="print-brochure">
        {/* Header */}
        <div className="print-brochure__header">
          <img src={dinoLogo} alt="Dino Residence" className="print-brochure__logo" />
          <div className="print-brochure__header-text">
            <h1 className="print-brochure__title">DINO RESIDENCE</h1>
            <p className="print-brochure__subtitle">Luxury Living, Redefined</p>
          </div>
        </div>

        {/* Accent line */}
        <div className="print-brochure__accent-line" />

        {/* Unit Title Section */}
        <div className="print-brochure__unit-header">
          <div>
            <h2 className="print-brochure__unit-name">{unit.name}</h2>
            <div className="print-brochure__unit-meta">
              <span className="print-brochure__meta-item">
                <Building2 size={14} /> Floor {unit.floor}
              </span>
              {unit.building && (
                <span className="print-brochure__meta-item">
                  <Layers size={14} /> Building {unit.building}
                </span>
              )}
              {unit.orientation && (
                <span className="print-brochure__meta-item">
                  <Compass size={14} /> {unit.orientation.charAt(0).toUpperCase() + unit.orientation.slice(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="print-brochure__section">
          <h3 className="print-brochure__section-title">Specifications</h3>
          <div className="print-brochure__specs-grid">
            <div className="print-brochure__spec-card">
              <Bed size={20} className="print-brochure__spec-icon" />
              <span className="print-brochure__spec-value">{unit.bedrooms}</span>
              <span className="print-brochure__spec-label">Bedrooms</span>
            </div>
            <div className="print-brochure__spec-card">
              <Bath size={20} className="print-brochure__spec-icon" />
              <span className="print-brochure__spec-value">{unit.bathrooms}</span>
              <span className="print-brochure__spec-label">Bathrooms</span>
            </div>
            <div className="print-brochure__spec-card">
              <Maximize size={20} className="print-brochure__spec-icon" />
              <span className="print-brochure__spec-value">{unit.surface}m²</span>
              <span className="print-brochure__spec-label">Total Surface</span>
            </div>
            {unit.terrace && (
              <div className="print-brochure__spec-card">
                <MapPin size={20} className="print-brochure__spec-icon" />
                <span className="print-brochure__spec-value">{unit.terrace}m²</span>
                <span className="print-brochure__spec-label">Terrace</span>
              </div>
            )}
            {unit.duplexTotal && (
              <div className="print-brochure__spec-card">
                <Layers size={20} className="print-brochure__spec-icon" />
                <span className="print-brochure__spec-value">{unit.duplexTotal}m²</span>
                <span className="print-brochure__spec-label">Duplex Total</span>
              </div>
            )}
            <div className="print-brochure__spec-card">
              <Building2 size={20} className="print-brochure__spec-icon" />
              <span className="print-brochure__spec-value">Floor {unit.floor}</span>
              <span className="print-brochure__spec-label">Level</span>
            </div>
          </div>
        </div>

        {/* Features */}
        {unit.features && unit.features.length > 0 && (
          <div className="print-brochure__section">
            <h3 className="print-brochure__section-title">Features & Amenities</h3>
            <div className="print-brochure__features">
              {unit.features.map((feature) => (
                <span key={feature} className="print-brochure__feature-tag">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Floor Plan Placeholder */}
        <div className="print-brochure__section">
          <h3 className="print-brochure__section-title">Floor Plan</h3>
          <div className="print-brochure__floorplan">
            <div className="print-brochure__floorplan-placeholder">
              <p>Floor Plan — {unit.name}</p>
              <p className="print-brochure__floorplan-sub">{unit.surface}m² · Floor {unit.floor}</p>
            </div>
          </div>
        </div>


        {/* Footer */}
        <div className="print-brochure__footer">
          <div className="print-brochure__accent-line" />
          <div className="print-brochure__footer-content">
            <p className="print-brochure__footer-brand">DINO RESIDENCE</p>
            <p className="print-brochure__footer-contact">
              info@dinoresidence.com · +355 69 XXX XXXX · www.dinoresidence.com
            </p>
            <p className="print-brochure__footer-disclaimer">
              All specifications are subject to change. Images are for illustration purposes only.
            </p>
          </div>
        </div>
      </div>
    );
  }
);

UnitPrintBrochure.displayName = "UnitPrintBrochure";
