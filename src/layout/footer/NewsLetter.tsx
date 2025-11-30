import Image from "next/image";
import Link from "next/link";
import { EmailForm } from "./EmailForm";

export const NewsLetter = () => {
  return (
    <section className="w-full h-36 md:h-28 flex justify-center bg-primary text-black">
      <div className="w-full max-w-[1200px] px-2 py-3 md:py-0 flex flex-col md:flex-row justify-center gap-4 md:gap-8 items-center font-body">
        <div className="newsLetter__info">
          <h4 className="text-sm md:text-base font-subheading">
            Recibí las mejores ofertas en tu E-mail
          </h4>
        </div>

        <EmailForm />

        <div className="flex justify-center items-center gap-6 md:gap-5">
          <Link
            href="https://wa.me/+5491140226227"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Image
              src="/icons/whatsapp.svg"
              alt="Whatsapp"
              width={25}
              height={25}
            />
          </Link>

          <Link
            href="https://web.facebook.com/md.directo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Image
              src="/icons/facebook.svg"
              alt="Facebook"
              width={25}
              height={25}
            />
          </Link>

          <Link
            href="https://www.instagram.com/mddirectoarg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Image
              src="/icons/instagram.svg"
              alt="Instagram"
              width={25}
              height={25}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

