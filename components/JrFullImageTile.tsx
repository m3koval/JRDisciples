import Link from "next/link";
import type { ReactNode } from "react";

type JrFullImageTileProps = {
  href: string;
  image: string;
  title: ReactNode;
  label: ReactNode;
  description?: ReactNode;
  cta: ReactNode;
  color: string;
  minHeight?: number;
  children?: ReactNode;
};

export function JrFullImageTile({
  href,
  image,
  title,
  label,
  description,
  cta,
  color,
  minHeight = 285,
  children,
}: JrFullImageTileProps) {
  return (
    <Link
      href={href}
      className="block no-underline hover:no-underline"
      style={{
        position: "relative",
        minHeight,
        height: "100%",
        borderRadius: 28,
        overflow: "hidden",
        border: `4px solid ${color}`,
        boxShadow: "0 22px 56px rgba(13,31,60,.2)",
        background: "#0d1f3c",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <img
        src={image}
        alt={typeof title === "string" ? title : "Junior Disciples activity"}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scale(1.035)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg,rgba(7,18,36,.08),rgba(7,18,36,.28) 35%,rgba(7,18,36,.9))",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <p className="puzzle-label" style={{ color: "#ffd866", marginBottom: 8, textShadow: "0 4px 18px rgba(0,0,0,.45)" }}>
          {label}
        </p>
        <h3
          style={{
            fontFamily: "var(--font-nunito)",
            fontWeight: 1000,
            fontSize: "clamp(1.35rem,4vw,1.9rem)",
            color: "#fff",
            lineHeight: 1.05,
            marginBottom: 10,
            textShadow: "0 8px 26px rgba(0,0,0,.45)",
          }}
        >
          {title}
        </h3>
        {description && (
          <p
            style={{
              fontFamily: "var(--font-lora)",
              fontSize: "0.96rem",
              fontWeight: 800,
              color: "rgba(255,255,255,.95)",
              lineHeight: 1.5,
              marginBottom: 14,
              textShadow: "0 5px 18px rgba(0,0,0,.45)",
            }}
          >
            {description}
          </p>
        )}
        {children}
        <span
          style={{
            alignSelf: "flex-start",
            borderRadius: 999,
            padding: "10px 18px",
            background: color,
            color: "#fff",
            fontFamily: "var(--font-nunito)",
            fontWeight: 1000,
            boxShadow: "0 12px 28px rgba(0,0,0,.24)",
          }}
        >
          {cta} →
        </span>
      </div>
    </Link>
  );
}
