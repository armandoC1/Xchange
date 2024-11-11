import Link from "next/link";

export const NavBar = ()=>{
    return(
        
<nav className="border-b bg-white">
<div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-4">
  <div className="flex justify-between h-16">
    <div className="flex items-center">
      <Link href="/" className="text-xl font-bold text-gray-900">
        XChange
      </Link>
    </div>
    <div className="hidden sm:flex sm:items-center sm:space-x-8">
      <Link
        href="/"
        className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
      >
        Inicio
      </Link>
      <Link
        href="/ofertas"
        className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
      >
        Ofertas
      </Link>
      <Link
        href="/categorias"
        className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
      >
        Categorías
      </Link>
      <Link
        href="/usuarios"
        className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
      >
        Usuarios
      </Link>
      <Link
        href="/resenas"
        className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
      >
        Reseñas
      </Link>
      <Link
        href="/chat"
        className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
      >
        Mensajes
      </Link>
      
    </div>
  </div>
</div>
</nav>
    );
}