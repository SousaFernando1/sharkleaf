import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

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

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sua-chave-openai-aqui") {
      return NextResponse.json({
        info: `Informações da IA não disponíveis no momento para "${nomeProduto}". Configure a chave da API OpenAI para habilitar este recurso.`,
        disponivel: false,
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = PROMPT_PADRAO.replace("{NOME_PRODUTO}", nomeProduto);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    });

    const resposta = completion.choices[0]?.message?.content || "Não foi possível obter informações.";

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

