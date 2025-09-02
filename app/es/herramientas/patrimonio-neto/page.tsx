// app/es/herramientas/preparacion-impuestos/page.tsx
"use client";

import ChecklistEs, { ChecklistSection } from "@/components/ChecklistEs";

export default function PreparacionImpuestosPage() {
  const sections: ChecklistSection[] = [
    {
      title: "Información Personal",
      items: [
        "Nombre legal completo, domicilio actual, cambios de estado civil",
        "Información de dependientes (SIN, recibos de matrícula si aplica)",
      ],
    },
    {
      title: "Comprobantes de Ingreso",
      items: [
        "T4 ingreso por empleo",
        "T5 ingreso de inversiones; T3 ingreso de fideicomisos",
        "T4A pensión/otros; T4E EI; T5007 beneficios",
        "Trabajo autónomo: resumen de ingresos y gastos",
      ],
    },
    {
      title: "Deducciones y Créditos",
      items: [
        "Aportes RRSP (año + primeros 60 días)",
        "Recibos de guardería (datos del proveedor + montos)",
        "Gastos médicos y primas de seguro (elegibles)",
        "Recibos de donaciones",
        "Cuotas sindicales/profesionales; herramientas elegibles",
      ],
    },
    {
      title: "Vivienda / Mudanza",
      items: [
        "Recibos de renta o impuesto predial (si crédito aplica)",
        "Gastos de mudanza (si elegible)",
      ],
    },
    {
      title: "Otros",
      items: [
        "Pagos por cuotas a CRA (comprobante)",
        "Datos para depósito directo (cheque anulado/PAD)",
      ],
    },
  ];

  return (
    <main className="bg-brand-beige min-h-screen pt-10 pb-16 px-4">
      <section className="max-w-6xl mx-auto">
        <div className="bg-white/95 rounded-[28px] border border-brand-gold shadow-xl p-6 sm:p-10">
          <ChecklistEs
            title="Lista de Preparación — Temporada de Impuestos"
            subtitle="Una lista clara y completa para que la temporada de impuestos sea tranquila, no caótica."
            sections={sections}
            storageKey="prep-impuestos-es-v1"
          />
        </div>
      </section>
    </main>
  );
}
