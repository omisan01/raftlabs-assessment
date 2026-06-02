// TYPES //
import { MenuItem } from "@/types/menu";

// OTHERS //
import QuantitySelector from "./QuantitySelector";

/** Menu Item Card Component - Displays individual menu item details and quantity selector */
export const MenuItemCard = ({ item }: { item: MenuItem }) => {
  return (
    <div
      key={item.id}
      className="group bg-white rounded-3xl border border-gray-100/80 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-orange-100 transition-all duration-300 overflow-hidden flex flex-col h-[420px]"
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-50">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 to-transparent z-10 opacity-60 transition-opacity group-hover:opacity-40" />
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Content Panel */}
      <div className="p-6 flex flex-col flex-grow justify-between bg-gradient-to-b from-white to-gray-50/30">
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200 line-clamp-1">
              {item.name}
            </h3>
            <span className="text-orange-600 font-medium text-lg bg-orange-50 px-2.5 py-0.5 rounded-lg whitespace-nowrap">
              ₹{item.price_in_rupees}
            </span>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
            {item.description}
          </p>
        </div>

        {/* Add to cart Button */}
        <div className="mt-4 pt-2 border-t border-gray-100/60">
          <QuantitySelector
            itemId={item.id}
            name={item.name}
            priceInRupees={item.price_in_rupees}
          />
        </div>
      </div>
    </div>

  );
}