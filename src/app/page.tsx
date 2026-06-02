// TYPES //
import { MenuItem } from "@/types/menu";

// COMPONENTS //
import MenuClient from "./components/MenuClient";

// SERVICES //
import { getMenu } from "./services/menu.service";

export default async function Home() {
  // Fetch menu items from the API using the service function
  const menuItems = await getMenu();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8 border-b border-gray-200 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Zwiggy</h1>
          <p className="text-gray-500 mt-1">Select your favorite meals and track them instantly.</p>
        </div>
      </header>

      {/* Render the Menu Client Component with the fetched menu items */}
      <MenuClient initialItems={menuItems} />
    </main>
  );
}
