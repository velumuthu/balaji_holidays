import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="https://i.imghippo.com/files/ZSj2010Prw.jpg"
      alt="Balaji Holidays Logo"
      fill
      className="object-contain"
    />
  );
}
