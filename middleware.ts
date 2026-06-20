import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/settings",
  "/admin",
  "/system",
  "/payment",
  "/matches",
  "/register/personal",
  "/register/religion",
  "/register/residence",
  "/register/requirements",
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const needsAuth = PROTECTED_PREFIXES.some(
    (p) => path === p || path.startsWith(p + "/")
  );

  // Public pages skip the Supabase auth round trip entirely; it would add
  // hundreds of ms of latency to every request for no benefit.
  if (!needsAuth) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return response;
}

// Only invoke the middleware function at all on protected routes; public
// pages and static assets are served without it.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/system/:path*",
    "/payment/:path*",
    "/matches/:path*",
    "/register/personal/:path*",
    "/register/religion/:path*",
    "/register/residence/:path*",
    "/register/requirements/:path*",
  ],
};
