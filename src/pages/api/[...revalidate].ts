export const prerender = false;

import type { APIContext } from "astro";
import { getMultiCache } from "fetch-cache/cache/multicache";

const handlers = {
  "revalidate-all": async () => {
    try {
      const cache = await getMultiCache().connect();
      await cache.revalidateAll();
    } catch (err) {
      console.log("HERE", err);
      return Response.json(err, { status: 500 });
    }
    return Response.json({ message: "Revalidation complete" });
  },
  "revalidate-tags": async ({ request }) => {
    try {
      const cache = await getMultiCache().connect();
      const formData = await request.formData();
      const tags = JSON.parse(formData.get("tags") || "[]");
      await cache.revalidateTags(tags);
      await cache.disconnect();
    } catch (err) {
      return Response.json(err, { status: 500 });
    }
    return Response.json({ message: "Revalidation complete" });
  },
};

export const POST = async (ctx: APIContext) => {
  const handler = ctx.params.revalidate;
  if (handler in handlers) {
    return handlers[handler](ctx);
  }
  return new Response(
    JSON.stringify({
      message: `There is no handler for ${handler} revalidation.`,
    })
  );
};
