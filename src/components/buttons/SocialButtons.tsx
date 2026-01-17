import Image from "next/image";

export const FacebookButton = ({ size = "6" }: { size?: string }) => {
  return (
    <a
      href="https://web.facebook.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`w-${size} h-${size}`}
    >
      <Image
        src="/icons/facebook.webp"
        alt="Facebook"
        width={100}
        height={100}
        className=""
      />
    </a>
  );
};

export const InstagramButton = ({ size = "6" }: { size?: string }) => {
  return (
    <a
      href="https://www.instagram.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`w-${size} h-${size}`}
    >
      <Image
        src="/icons/instagram.webp"
        alt="Instagram"
        width={100}
        height={100}
        className="rounded-full"
      />
    </a>
  );
};

export const MailButton = ({ size = "6" }: { size?: string }) => {
  return (
    <a
      href="mailto:matileonardo.2013@gmail.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`w-${size} h-${size} p-1 center-flex text-white bg-[#F7F7F7] rounded-full`}
    >
      <Image
        src="/icons/gmail.svg"
        alt="Gmail"
        width={100}
        height={100}
      />
    </a>
  );
};

export const WhatsappButton = ({ size = "6" }: { size?: string }) => {
  return (
    <a
      href="https://wa.me/+5491131738925"
      target="_blank"
      rel="noopener noreferrer"
      className={`w-${size} h-${size} center-flex text-white bg-[#25D366] rounded-full`}
    >
      <Image
        src="/icons/whatsapp-white.svg"
        alt="Whatsapp"
        width={100}
        height={100}
      />
    </a>
  );
};