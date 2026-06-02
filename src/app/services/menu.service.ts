// TYPES //
import { MenuItem } from "@/types/menu";

export async function getMenu(): Promise<MenuItem[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/menu`, {
        next: { revalidate: 3600 } // Cache data for an hour
    });

    if (!res.ok) {
        throw new Error('Failed to fetch menu items');
    }

    return res.json();
}