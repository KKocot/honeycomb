import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VALID_FRAMEWORKS = new Set(["react", "solid", "vue"]);
const FRAMEWORK_PAGES = new Set(["hive-provider", "installation"]);

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Handle old query param URLs: /hive-provider?framework=solid -> /solid/hive-provider
  const framework_param = searchParams.get("framework");
  if (framework_param) {
    const framework = VALID_FRAMEWORKS.has(framework_param)
      ? framework_param
      : "react";

    // Extract page name from pathname
    const page = pathname.split("/").filter(Boolean).pop() || "hive-provider";

    const new_url = request.nextUrl.clone();
    new_url.pathname = `/${framework}/${page}`;
    new_url.search = ""; // Clear search params

    return NextResponse.redirect(new_url);
  }

  // Handle direct access to framework-specific pages without framework segment
  // /hive-provider -> /react/hive-provider
  // /installation -> /react/installation
  if (pathname === "/hive-provider" || pathname === "/installation") {
    const page = pathname.substring(1); // Remove leading slash
    const new_url = request.nextUrl.clone();
    new_url.pathname = `/react/${page}`;

    return NextResponse.redirect(new_url);
  }

  // Handle invalid framework in URL: /invalidfw/hive-provider -> /react/hive-provider
  // Pattern: /[framework]/[page]
  const path_segments = pathname.split("/").filter(Boolean);
  if (path_segments.length === 2) {
    const [framework, page] = path_segments;

    // Check if page is a framework page and framework is invalid
    if (FRAMEWORK_PAGES.has(page) && !VALID_FRAMEWORKS.has(framework)) {
      const new_url = request.nextUrl.clone();
      new_url.pathname = `/react/${page}`;

      return NextResponse.redirect(new_url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/hive-provider",
    "/installation",
    "/:framework/hive-provider",
    "/:framework/installation",
  ],
};
