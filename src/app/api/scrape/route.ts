import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid URL" }, { status: 400 });
    }

    // Fetch HTML with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ValueCalculator/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch: ${response.status}` },
        { status: 502 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script, style, nav, footer, header noise
    $("script, style, noscript, nav, footer, iframe, svg").remove();

    // Extract metadata
    const title = $("title").text().trim() || $("h1").first().text().trim() || "";
    const metaDescription = $('meta[name="description"]').attr("content") || "";
    const ogTitle = $('meta[property="og:title"]').attr("content") || "";
    const ogDescription = $('meta[property="og:description"]').attr("content") || "";

    // Extract main content — prioritize article/main, fallback to body
    let mainContent = "";
    const mainEl = $("main, article, [role='main'], .content, #content").first();
    if (mainEl.length) {
      mainContent = mainEl.text();
    } else {
      mainContent = $("body").text();
    }

    // Clean whitespace
    const cleanText = mainContent
      .replace(/\s+/g, " ")
      .replace(/\n\s*\n/g, "\n")
      .trim()
      .slice(0, 8000); // Cap at 8k chars for API context

    // Extract headings for structure
    const headings: string[] = [];
    $("h1, h2, h3").each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length < 200) headings.push(text);
    });

    // Extract feature lists
    const features: string[] = [];
    $("ul li, ol li").each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 10 && text.length < 200) {
        features.push(text);
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        url: parsedUrl.toString(),
        title: ogTitle || title,
        description: ogDescription || metaDescription,
        content: cleanText,
        headings: headings.slice(0, 20),
        features: features.slice(0, 30),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scrape failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
