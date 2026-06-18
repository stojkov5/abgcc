"use client";

import { Check, Minus } from "lucide-react";

import {
  BENEFITS,
  BENEFIT_ORDER,
  COMPARISON,
  TIER_COLUMNS,
  TIERS,
} from "@/lib/membership/tiers";
import BenefitInfo from "@/components/BenefitInfo";

const COLUMN_LABEL = Object.fromEntries(TIERS.map((t) => [t.key, t.title]));

function Cell({ value }) {
  if (value === "limited") {
    return <span className="mcompare-limited">Limited</span>;
  }
  if (value) {
    return <Check size={17} className="mcompare-check" />;
  }
  return <Minus size={15} className="mcompare-dash" />;
}

export default function MembershipComparison() {
  return (
    <div className="mcompare-wrap">
      <table className="mcompare-table">
        <thead>
          <tr>
            <th className="mcompare-benefit-col">Benefit</th>
            {TIER_COLUMNS.map((key) => (
              <th key={key} className={key === "presidential" ? "is-premier" : ""}>
                {COLUMN_LABEL[key]}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {BENEFIT_ORDER.map((b) => (
            <tr key={b}>
              <td className="mcompare-benefit-col">
                <span className="mcompare-benefit-label">
                  {BENEFITS[b].label}
                  <BenefitInfo
                    label={BENEFITS[b].label}
                    description={BENEFITS[b].description}
                  />
                </span>
              </td>

              {TIER_COLUMNS.map((key) => (
                <td key={key} className={key === "presidential" ? "is-premier" : ""}>
                  <Cell value={COMPARISON[b][key]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
