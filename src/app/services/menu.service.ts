// TYPES //
import { MenuItem } from "@/types/menu";

// COMPONENTS //
import { cookies } from "next/headers";

// UTILS //
import { createClient } from "@/utils/supabase/server";

export async function getMenu(): Promise<MenuItem[]> {
    // 1. Initialize the server-side Supabase client directly
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
        .from("menu")
        .select("*");

    if (error) {
        throw new Error(`Failed to fetch menu items: ${error.message}`);
    }

    return data as MenuItem[];
}