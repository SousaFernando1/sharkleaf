export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function TicketRedirectPage({
  params,
}: {
  params: Promise<{ ticket: string }>;
}) {
  const { ticket } = await params;
  
  const pedido = await prisma.pedido.findUnique({
    where: { ticket },
    select: { id: true },
  });

  if (!pedido) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">
            Ticket não encontrado
          </h1>
          <p className="mt-2 text-muted-foreground">
            O ticket informado não corresponde a nenhum pedido.
          </p>
        </div>
      </div>
    );
  }

  redirect(`/rastreio/${pedido.id}`);
}

