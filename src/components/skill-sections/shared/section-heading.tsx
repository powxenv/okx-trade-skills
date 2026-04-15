interface SectionHeadingProps {
  badgeIcon: React.ReactNode;
  badgeText: string;
  title: string;
  description: string;
  align?: "center" | "left";
}

export default function SectionHeading({
  badgeIcon,
  badgeText,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`max-w-2xl ${isCenter ? "mx-auto text-center flex flex-col items-center" : "text-left"}`}
    >
      <div className="border pl-2 pr-4 py-1 flex gap-1 items-center rounded-lg text-sm">
        {badgeIcon}
        {badgeText}
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 mt-4">
        {title}
      </h1>
      <p className="max-w-xl text-base sm:text-lg md:text-xl text-zinc-600">
        {description}
      </p>
    </div>
  );
}
