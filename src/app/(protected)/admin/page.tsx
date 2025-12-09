import { unauthorized } from "next/navigation";
import { getServerSession } from "@/libs";
import { LogOutButton } from "@/components";

export default async function MainAdminPage() {
  const session = await getServerSession();
  const user = session?.user;

  if(!user) unauthorized()

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2>Bienvenido a la página de administración {user.role}</h2>
          <div>{JSON.stringify(user, null, 2)}</div>
        </div>
        <LogOutButton />
      </div>

      
    </>
  );
}