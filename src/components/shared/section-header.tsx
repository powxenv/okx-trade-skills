interface SectionHeaderProps {
  badgeIcon: React.ReactNode;
  badgeText: string;
  title: string;
  description: string;
  descriptionMaxWidth?: string;
}

export default function SectionHeader({
  badgeIcon,
  badgeText,
  title,
  description,
  descriptionMaxWidth = "max-w-md",
}: SectionHeaderProps) {
  return (
    <>
      <div className="border pl-2 pr-4 py-1 flex gap-1 items-center rounded-lg text-sm w-fit mb-4">
        {badgeIcon}
        {badgeText}
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4">
        {title}
      </h2>
      <p className={`text-base sm:text-lg text-zinc-600 ${descriptionMaxWidth} mb-6`}>
        {description}
      </p>
    </>
  );
}
