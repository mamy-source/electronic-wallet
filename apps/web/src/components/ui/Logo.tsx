import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="/images/monexa_light.png"
      alt="Electronic Wallet"
      width={160}
      height={48}
      priority
    />
  );
}