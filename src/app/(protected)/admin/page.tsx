// import { auth } from "@/auth";
// import { LogoutButton } from "@/components";

// interface Session {
//   user: {
//     email: string;
//   };
// }

export default async function MainAdminPage() {
  // const session = (await auth()) as Session;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2>Bienvenido a la página de administración</h2>
          {/* <h4>{session.user.email}</h4> */}
        </div>
        {/* <LogoutButton /> */}
      </div>

      {/* <article className="mainAdminPage-information">
        <Accordion title="Información útil" accordionItems={usefulInformation} />

        <Accordion title="Contacto" accordionItems={contactInformation} />
      </article> */}
    </>
  );
}

// const usefulInformation = [
//   {
//     value: "Panel de administración",
//     description: `Este es el panel de administración, acá podés gestionar tus productos, categorías y los administradores de la página. Por motivos de seguridad, solo se puede acceder a este panel a través de la url, escribiendo mercadodirecto.com/admin`,
//   },
//   {
//     value: "Página de productos",
//     description: `Información sobre el tamaño de las imágenes`,
//   },
//   {
//     value: "Página de administradores",
//     description:
//       "En la página de administradores podés gestionar a los administradores de la tienda, agregar nuevos administradores, eliminar administradores, etc.",
//   },
//   {
//     value: "Página de inicio",
//     description: `Información sobre el tamaño de los sliders y de los banners`,
//   },
//   {
//     value: "Contenido estático",
//     description: `Información sobre el contenido estático`,
//   },
// ];