import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  alt?: string;
};

export function BrandLogo({ className, alt = "UploadAura" }: BrandLogoProps) {
  return (
    <Image
      src="/logomain.svg"
      alt={alt}
      width={190}
      height={90}
      className={className}
      unoptimized
    />
  );
}
