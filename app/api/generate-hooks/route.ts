import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { productDescription, targetAudience } = await req.json();

  if (!productDescription || !targetAudience) {
    return new Response('Missing product description or target audience', { status: 400 });
  }

 
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const megaPrompt = `
Act as an expert direct response copywriter and social media advertising strategist with a decade of experience crafting high-converting, attention-grabbing hooks and headlines for diverse industries and platforms. Your copy is known for its creativity, psychological acuity, and ability to drive engagement and action.

I will provide you with:
1. PRODUCT_DESCRIPTION: "${productDescription}"
2. TARGET_AUDIENCE_DESCRIPTION: "${targetAudience}"

Your primary task is to generate TEN (10) distinct and compelling marketing hooks and headlines. These should be specifically tailored for use in social media advertisements (assume platforms like Facebook, Instagram, TikTok, and LinkedIn, aiming for broad appeal unless the target audience strongly suggests a specific platform's tone).

CRITICAL INSTRUCTIONS FOR VARIETY AND ANGLES:
Ensure the generated hooks are highly varied and explore different psychological angles to maximize appeal and provide options for A/B testing. For each hook, aim to leverage one or more of the following approaches. Strive for a mix across the set of 10 hooks:

* **Emotional Appeal:**
    * **Curiosity/Intrigue:** Make them *need* to know more (e.g., "The one thing about [Product Category] they don't want you to know...").
    * **FOMO (Fear Of Missing Out):** Hint at a limited opportunity or something popular they're missing.
    * **Hope/Aspiration:** Connect with their desires for a better future/self (e.g., "Imagine finally achieving with...").
    * **Pain Point Agitation/Solution:** Deepen the understanding of their problem, then pivot to the solution (e.g., "Tired of [Problem]? Discover the [Adjective] way to...").
* **Logical/Benefit-Driven Appeal:**
    * **Clear Benefit Statement:** Directly state a primary advantage (e.g., "Save with [Product Name].").
    * **Quantifiable Results:** Use numbers or specific outcomes where possible (e.g., "Boost [Metric] by X% in Y days.").
* **Question-Based Engagement:**
    * Ask provocative, rhetorical, or benefit-oriented questions that make the audience reflect or agree (e.g., "What if you could without [Pain Point]?").

OUTPUT FORMATTING AND CONSTRAINTS:
* Present each of the 10 hooks on a new line.
* Prefix each hook with its primary angle in parentheses, e.g., "(Curiosity):..." or "(Benefit-Driven):...".
* Keep hooks concise, punchy, and impactful, ideally under 15-20 words.
* DO NOT: Generate generic, bland, overly clichéd, or uninspired hooks. Do not use placeholder text like "[Your Product]" in the final hooks.
`;

  try {
    const result = await model.generateContent(megaPrompt);
    const response = result.response;
    const text = response.text();

   
    const hooks = text.split('\n').filter((hook: string) => hook.trim() !== '');

    return new Response(JSON.stringify({ hooks }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to generate hooks from AI', { status: 500 });
  }
}
