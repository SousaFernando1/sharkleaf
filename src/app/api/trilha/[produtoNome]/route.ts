import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PROMPT_PADRAO = `Você é um assistente especialista em botânica e silvicultura. 
Forneça informações breves e educativas sobre a seguinte espécie de planta/muda: "{NOME_PRODUTO}".

Inclua:
1. Nome científico
2. Família botânica
3. Características principais (altura, folhas, etc)
4. Usos comuns (madeira, celulose, reflorestamento, etc)
5. Tempo médio de crescimento
6. Curiosidade interessante

Responda de forma objetiva e didática, em no máximo 200 palavras. Em português do Brasil.`;

// Cache em memória para evitar chamadas repetidas ao Gemini
const cache = new Map<string, { info: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hora

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ produtoNome: string }> }
) {
  try {
    const { produtoNome } = await params;
    const nomeProduto = decodeURIComponent(produtoNome);
    const cacheKey = nomeProduto.toLowerCase().trim();

    // Verificar cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        info: cached.info,
        disponivel: true,
        fromCache: true,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        info: `Informações da IA não disponíveis no momento para "${nomeProduto}". Configure a chave da API Gemini (GEMINI_API_KEY) para habilitar este recurso.`,
        disponivel: false,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = PROMPT_PADRAO.replace("{NOME_PRODUTO}", nomeProduto);

    const result = await model.generateContent(prompt);
    const resposta =
      result.response.text() || "Não foi possível obter informações.";

    // Salvar no cache
    cache.set(cacheKey, { info: resposta, timestamp: Date.now() });

    return NextResponse.json({
      info: resposta,
      disponivel: true,
    });
  } catch (error: any) {
    console.error("Erro na consulta à IA:", error?.message || error);

    // Tratamento específico para rate limit
    if (error?.message?.includes("429") || error?.message?.includes("quota") || error?.message?.includes("RESOURCE_EXHAUSTED")) {
      return NextResponse.json({
        info: "A IA está temporariamente indisponível devido ao limite de requisições. Tente novamente em alguns instantes.",
        disponivel: false,
      });
    }

    return NextResponse.json({
      info: `Não foi possível obter as informações neste momento.`,
      disponivel: false,
    });
  }
}
