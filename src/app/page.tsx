import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/infrastructure/auth/auth-options";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  redirect(session?.user ? "/dashboard" : "/login");
}
