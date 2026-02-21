import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;

  const publicPaths = ["/", "/login", "/register", "/terms", "/privacy"];
  const isPublic =
    path.startsWith("/api/auth") ||
    publicPaths.some((p) => path === p || path.startsWith(p + "/"));

  if (!isPublic && !isLoggedIn) {
    const login = new URL("/login", req.nextUrl.origin);
    login.searchParams.set("callbackUrl", path);
    return Response.redirect(login);
  }

  if (path === "/login" || path === "/register") {
    if (isLoggedIn) {
      return Response.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
  }

  return undefined;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
