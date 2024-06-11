import React from "react";

const tiers = [
  {
    name: "Silver",
    benefits: ["기본 혜택 제공", "월간 뉴스레터"],
    price: "무료",
    color: "#C0C0C0",
  },
  {
    name: "Gold",
    benefits: ["실버 혜택 포함", "추가 할인 혜택", "우선 지원"],
    price: "월 $9.99",
    color: "#FFD700",
  },
  {
    name: "Platinum",
    benefits: ["골드 혜택 포함", "개인 맞춤 컨설팅", "VIP 이벤트 초대"],
    price: "월 $29.99",
    color: "#E5E4E2",
  },
];

const TierPlan = () => {
  return (
    <div className="TierPlan">
      <div className="tier-plan">
        {tiers.map((tier, index) => (
          <div key={index} className="tier" style={{ borderColor: tier.color }}>
            <h2 style={{ color: tier.color }}>{tier.name}</h2>
            <ul>
              {tier.benefits.map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>
            <p>{tier.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TierPlan;
