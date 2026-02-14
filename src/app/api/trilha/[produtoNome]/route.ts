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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ produtoNome: string }> }
) {
  try {
    const { produtoNome } = await params;
    const nomeProduto = decodeURIComponent(produtoNome);

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

    return NextResponse.json({
      info: resposta,
      disponivel: true,
    });
  } catch (error: any) {
    console.error("Erro na consulta à IA:", error?.message || error);
    return NextResponse.json({
      info: `Não foi possível obter as informações neste momento. Erro: ${error?.message || "Desconhecido"}`,
      disponivel: false,
    });
  }
}
