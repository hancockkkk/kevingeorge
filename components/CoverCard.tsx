import Link from "next/link";

interface CoverCardProps {
  title: string;
  subtitle?: string;
  color: string;
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CoverCard({
  title,
  subtitle,
  color,
  href,
  size = "md",
  className = "",
}: CoverCardProps) {
  const sizeClasses = {
    sm: "w-40 h-40 md:w-48 md:h-48",
    md: "w-64 h-64 md:w-80 md:h-80",
    lg: "w-72 h-72 md:w-96 md:h-96",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const content = (
    <div
      className={`${sizeClasses[size]} rounded-2xl flex flex-col items-center justify-end p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${className}`}
      style={{ backgroundColor: color }}
    >
      {subtitle && (
        <p className={`${textSizeClasses[size]} text-white/80 mb-1 text-center`}>
          {subtitle}
        </p>
      )}
      <h3
        className={`font-bold text-white text-center ${
          size === "lg" ? "text-2xl md:text-3xl" : size === "md" ? "text-xl md:text-2xl" : "text-lg"
        }`}
      >
        {title}
      </h3>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
