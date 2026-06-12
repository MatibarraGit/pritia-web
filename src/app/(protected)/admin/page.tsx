import { getServerSession } from "@/libs/get-session";
import { LogOutButton } from "@/components";

export default async function MainAdminPage() {
  const session = await getServerSession();
  const user = session?.user;
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2>Bienvenido {user?.name}! Estás en el panel de administración.</h2>
      </div>
      <LogOutButton />
    </div>
  );
}