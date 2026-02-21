"use client";

type ProfileAvatarProps = {
  imageUrl: string | null | undefined;
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-xl",
};

export function ProfileAvatar({
  imageUrl,
  name,
  className = "",
  size = "md",
}: ProfileAvatarProps) {
  const initial = name.trim() ? name.trim().charAt(0).toUpperCase() : "?";

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`rounded-full object-cover bg-muted ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-800 ${sizeClasses[size]} ${className}`}
      aria-hidden
    >
      {initial}
    </div>
  );
}
