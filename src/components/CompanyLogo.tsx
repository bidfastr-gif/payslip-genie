import { useMemo, useState } from "react";

interface CompanyLogoProps {
  company: string | null;
}

const CompanyLogo = ({ company }: CompanyLogoProps) => {
  const sources = useMemo(() => {
    const map: Record<string, string[]> = {
      GAP: ["/gap-logo.png", "/gap-logo.jpg", "/gap-logo.jpeg", "/gap-logo.svg"],
      Srivaru: ["/srivaru-logo.png", "/srivaru-logo.jpg", "/srivaru-logo.jpeg", "/srivaru-logo.svg"],
    };
    return company ? map[company] || [] : [];
  }, [company]);

  const [index, setIndex] = useState(0);
  const current = sources[index];

  if (!current) return null;

  return (
    <img
      src={current}
      alt={company ?? "Company"}
      onError={() => setIndex((i) => i + 1)}
      style={{
        display: "block",
        width: company === "GAP" ? "220px" : company === "Srivaru" ? "220px" : undefined,
        height: "auto",
        mixBlendMode: "multiply",
        backgroundColor: "transparent",
      }}
    />
  );
};

export default CompanyLogo;
