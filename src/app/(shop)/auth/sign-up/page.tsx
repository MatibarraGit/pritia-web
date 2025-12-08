import { AuthForm } from "@/components/forms/AuthForm";

export const metadata = {
  title: "Registrarse",
  description: "Registrarse en nuestro sitio web",
}

export default async function SignUp({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const callbackUrl = (await searchParams).callbackUrl;

  return (
		<div className="w-11/12 max-w-2xl min-h-content relative top-20 mx-auto">
			<AuthForm mode="sign-up" showSocialButtons={false} callbackUrl={callbackUrl} />
		</div>
	)
}