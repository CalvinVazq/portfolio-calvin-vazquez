import { catalogResponse } from "./catalog.mjs";

export const runtime = "nodejs";

export function GET(request) {
  return catalogResponse(request.nextUrl.searchParams.get("path"));
}
