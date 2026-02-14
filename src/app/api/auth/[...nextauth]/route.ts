import { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// In Next.js 15+, dynamic route params are a Promise.
// NextAuth v4 expects synchronous params, so we create a wrapper.
const nextAuthHandler = NextAuth(authOptions);

async function handler(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  // Resolve the params Promise for Next.js 16 compatibility
  const resolvedParams = await context.params;

  // Pass the resolved params to NextAuth
  return nextAuthHandler(req, { params: resolvedParams } as any);
}

export { handler as GET, handler as POST };
