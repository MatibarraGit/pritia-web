import { EmailForm } from "./EmailForm";
import { FacebookButton, InstagramButton, MailButton, WhatsappButton } from "@/components"

export const NewsLetter = () => {
  return (
    <section className="w-full h-36 md:h-28 flex justify-center bg-primary text-black">
      <div className="w-full max-w-[1200px] px-2 py-3 md:py-0 flex flex-col md:flex-row justify-center gap-4 md:gap-8 items-center font-body">
        <div className="newsLetter__info">
          <h4 className="text-sm md:text-base font-subheading text-white">
            Recibí las mejores ofertas en tu E-mail
          </h4>
        </div>

        <EmailForm />

        <div className="flex justify-center items-center gap-6 md:gap-5">
          <WhatsappButton />
          <MailButton size="6"/>
          {/* <FacebookButton /> */}
          {/* <InstagramButton /> */}
        </div>
      </div>
    </section>
  );
};

