export const prerender = false;
import articles from "../../resources/articles.json";

export const GET = async ({}) => {
  console.log("[API] > GET /api/articles");
  return Response.json(articles);
};
