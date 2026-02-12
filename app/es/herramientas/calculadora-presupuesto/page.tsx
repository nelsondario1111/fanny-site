"use client";

import { useMemo, useRef, useState } from "react";
import type {
  ElementType,
  ComponentPropsWithoutRef,
  ReactNode,
  FormEvent,
} from "react";
import { FaHome, FaPrint, FaQuestionCircle } from "react-icons/fa";
import Image from "next/image";

/* ---------- Componentes de estilo compartido (panel/tabla) ---------- */
type PanelProps<T extends ElementType> = {
  children: ReactNode;
  className?: string;
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

function Panel<T extends ElementType = "section">({
  children,
  className = "",
  as,
  ...rest
}: PanelProps<T>) {
  const Tag = (as || "section") as ElementType;
  return (
    <Tag
      className={[
        "max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-12",
        "bg-white/95 rounded-[28px] border border-brand-gold shadow-xl",
        "backdrop-blur-[1px]",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function SectionTitle({
  title,
  subtitle,
  center = true,
}: {
  title: string;
  subtitle?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center mb-6" : "mb-6"}>
      <h1 className="font-brand font-bold text-4xl md:text-5xl text-brand-green tracking-tight">
        {title}
      </h1>
      <div className="flex justify-center my-4">
        <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
      </div>
      {subtitle && (
        <p className="text-brand-blue/90 text-lg md:text-xl max-w-3xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
/* ------------------------------------------------------------------- */

/** Pago mensual estimado para hipoteca fija (estándar Canadá) */
function calcMortgage(principal: number, ratePct: number, years: number): number {
  const r = ratePct / 100 / 12;
  const n = Math.max(1, years * 12);
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

const fmt = (n: number) =>
  (Number.isFinite(n) ? n : 0).toLocaleString("es-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  });

export default function CalculadoraHipotecaria() {
  // Entradas
  const [precio, setPrecio] = useState<string>("");
  const [enganche, setEnganche] = useState<string>("");
  const [tasa, setTasa] = useState<string>("");
  const [anios, setAnios] = useState<number>(25);

  const [multi, setMulti] = useState<boolean>(false);
  const [unidades, setUnidades] = useState<number>(4);
  const [rentaUnidad, setRentaUnidad] = useState<string>("");

  const [mostrarResultados, setMostrarResultados] = useState(false);
  const resultadosRef = useRef<HTMLDivElement>(null);

  // Derivados
  const precioNum = parseFloat(precio) || 0;
  const engancheNum = parseFloat(enganche) || 0;
  const prestamo = Math.max(0, precioNum - engancheNum);
  const tasaNum = parseFloat(tasa) || 0;

  const mensual = useMemo(
    () => calcMortgage(prestamo, tasaNum, anios),
    [prestamo, tasaNum, anios]
  );
  const totalPagado = mensual * anios * 12;
  const interesTotal = totalPagado - prestamo;

  const rentaPorUnidad = parseFloat(rentaUnidad) || 0;
  const rentaTotal = multi && unidades > 0 ? rentaPorUnidad * unidades : 0;
  const pagoPorUnidad = multi && unidades > 0 ? mensual / unidades : mensual;
  const flujoCaja = multi ? rentaTotal - mensual : null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMostrarResultados(true);
    setTimeout(() => resultadosRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function handleReset() {
    setPrecio("");
    setEnganche("");
    setTasa("");
    setAnios(25);
    setMulti(false);
    setUnidades(4);
    setRentaUnidad("");
    setMostrarResultados(false);
  }

  function handlePrint() {
    window.print();
  }

  const fechaImpresion = new Date().toLocaleDateString("es-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="bg-brand-beige min-h-screen pb-16 print:bg-white">
      {/* HERO */}
      <header className="pt-10 px-4 print:hidden">
        <Panel as="div">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-brand-blue/10 border w-16 h-16 flex items-center justify-center shadow">
              <FaHome className="text-brand-blue text-2xl" aria-hidden />
            </div>
          </div>
          <SectionTitle
            title="Calculadora de Hipoteca"
            subtitle={
              <>
                Estima tu pago mensual en segundos—para vivienda unifamiliar o multi-unidad.
                Privada, bilingüe y lista para imprimir, para compartir con tu familia o agente.
              </>
            }
          />
        </Panel>
      </header>

      {/* FORMULARIO */}
      <section className="px-4 mt-8 print:hidden">
        <Panel as="form" onSubmit={handleSubmit}>
          <h2 className="font-brand text-2xl md:text-3xl text-brand-green font-semibold mb-6">
            Ingresa los detalles de tu hipoteca
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-brand-blue font-semibold mb-1" htmlFor="precio">
                Precio de la propiedad (CAD)
              </label>
              <input
                id="precio"
                type="number"
                min={0}
                inputMode="decimal"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="Ej: 800000"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-brand-green/30 bg-white text-brand-body placeholder:text-brand-body/60 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 outline-none"
              />
            </div>

            <div>
              <label className="block text-brand-blue font-semibold mb-1" htmlFor="enganche">
                Enganche (CAD)
              </label>
              <input
                id="enganche"
                type="number"
                min={0}
                inputMode="decimal"
                value={enganche}
                onChange={(e) => setEnganche(e.target.value)}
                placeholder="Ej: 160000"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-brand-green/30 bg-white text-brand-body placeholder:text-brand-body/60 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 outline-none"
              />
            </div>

            <div>
              <label className="block text-brand-blue font-semibold mb-1" htmlFor="tasa">
                Tasa de interés (anual %)
              </label>
              <input
                id="tasa"
                type="number"
                step="0.01"
                min={0}
                max={25}
                inputMode="decimal"
                value={tasa}
                onChange={(e) => setTasa(e.target.value)}
                placeholder="Ej: 5.20"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-brand-green/30 bg-white text-brand-body placeholder:text-brand-body/60 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 outline-none"
              />
            </div>

            <div>
              <label className="block text-brand-blue font-semibold mb-1" htmlFor="anios">
                Amortización (años)
              </label>
              <input
                id="anios"
                type="number"
                min={5}
                max={35}
                value={anios}
                onChange={(e) => setAnios(Number(e.target.value))}
                placeholder="Ej: 25"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-brand-green/30 bg-white text-brand-body placeholder:text-brand-body/60 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 outline-none"
              />
            </div>
          </div>

          {/* Multi-unidad */}
          <div className="mt-6">
            <label className="inline-flex items-center gap-3">
              <input
                type="checkbox"
                className="w-5 h-5 accent-brand-blue"
                checked={multi}
                onChange={() => setMulti((v) => !v)}
              />
              <span className="text-brand-blue font-semibold">Esta propiedad es multi-unidad</span>
            </label>
          </div>

          {multi && (
            <div className="mt-4 rounded-2xl border border-brand-blue/40 bg-brand-blue/5 p-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-brand-blue font-semibold mb-1" htmlFor="unidades">
                    Número de unidades
                  </label>
                  <input
                    id="unidades"
                    type="number"
                    min={2}
                    max={12}
                    value={unidades}
                    onChange={(e) => setUnidades(Number(e.target.value))}
                    placeholder="Ej: 4"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-brand-blue/40 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-brand-blue font-semibold mb-1" htmlFor="renta">
                    Renta estimada por unidad (mensual, CAD)
                  </label>
                  <input
                    id="renta"
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={rentaUnidad}
                    onChange={(e) => setRentaUnidad(e.target.value)}
                    placeholder="Ej: 2200"
                    className="w-full px-4 py-3 rounded-xl border border-brand-blue/40 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            <button
              type="submit"
              className="px-6 py-3 bg-brand-gold text-brand-green font-sans font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition"
            >
              Calcular
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 border-2 border-brand-gold text-brand-green font-sans font-bold rounded-full hover:bg-brand-gold hover:text-brand-green transition"
            >
              Reiniciar
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-3 bg-brand-blue text-white font-sans font-bold rounded-full shadow hover:bg-brand-gold hover:text-brand-green transition"
            >
              Imprimir (PDF)
            </button>
          </div>
        </Panel>
      </section>

      {/* RESULTADOS */}
      {mostrarResultados && (
        <section ref={resultadosRef} className="px-4 mt-8">
          <Panel>
            {/* Encabezado impresión */}
            <div className="hidden print:block mb-2 text-center">
              <Image
                src="/fanny-logo.png"
                alt="Logo Fanny Samaniego"
                width={96}
                height={96}
                className="mx-auto"
              />
              <div className="font-sans font-bold text-brand-green">
                Fanny Samaniego — Coach & Asesora Financiera Holística
              </div>
              <div className="text-xs text-brand-blue">Preparado el {fechaImpresion}</div>
              <div className="w-16 h-[2px] bg-brand-gold rounded-full mx-auto mt-2" />
            </div>

            <h2 className="font-brand text-2xl md:text-3xl text-brand-green font-semibold mb-4 text-center">
              Resumen de Hipoteca
            </h2>

            {/* Tabla resumen */}
            <div className="rounded-2xl border border-brand-gold/60 p-5 bg-white/70 max-w-3xl mx-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <tbody>
                  <tr>
                    <td className="text-brand-blue font-semibold pr-3">Precio de la propiedad</td>
                    <td>{fmt(precioNum)}</td>
                  </tr>
                  <tr>
                    <td className="text-brand-blue font-semibold pr-3">Enganche</td>
                    <td>{fmt(engancheNum)}</td>
                  </tr>
                  <tr>
                    <td className="text-brand-blue font-semibold pr-3">Monto del préstamo</td>
                    <td>{fmt(prestamo)}</td>
                  </tr>
                  <tr>
                    <td className="text-brand-blue font-semibold pr-3">Tasa de interés</td>
                    <td>{(tasaNum || 0).toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td className="text-brand-blue font-semibold pr-3">Amortización</td>
                    <td>{anios} años</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-3 text-lg">
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-brand-green">Pago mensual estimado</span>
                  <span className="font-semibold">{fmt(mensual)}</span>
                </div>
                <div className="flex justify-between text-brand-body/80">
                  <span>Total pagado en {anios} años</span>
                  <span>{fmt(totalPagado)}</span>
                </div>
                <div className="flex justify-between text-brand-body/80">
                  <span>Interés total</span>
                  <span>{fmt(interesTotal)}</span>
                </div>
              </div>
            </div>

            {/* Detalle multi-unidad */}
            {multi && (
              <div className="mt-6 rounded-2xl border border-brand-blue/40 p-5 bg-brand-blue/5 max-w-3xl mx-auto">
                <h3 className="font-sans text-xl text-brand-blue font-semibold mb-2">
                  Vista rápida multi-unidad
                </h3>
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <tbody>
                    <tr>
                      <td className="text-brand-blue font-semibold pr-3">Unidades</td>
                      <td>{unidades}</td>
                    </tr>
                    <tr>
                      <td className="text-brand-blue font-semibold pr-3">Renta por unidad</td>
                      <td>{fmt(rentaPorUnidad)}</td>
                    </tr>
                    <tr>
                      <td className="text-brand-blue font-semibold pr-3">Renta total mensual</td>
                      <td>{fmt(rentaTotal)}</td>
                    </tr>
                    <tr>
                      <td className="text-brand-blue font-semibold pr-3">Pago por unidad</td>
                      <td>{fmt(pagoPorUnidad)}</td>
                    </tr>
                    <tr>
                      <td className="text-brand-blue font-semibold pr-3">Flujo de caja</td>
                      <td
                        className={
                          (Number(flujoCaja) ?? 0) >= 0
                            ? "text-brand-green font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {fmt(Math.abs(flujoCaja ?? 0))}{" "}
                        {(Number(flujoCaja) ?? 0) >= 0 ? "(positivo)" : "(déficit)"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-2 text-sm text-brand-body/80">
                  Nota: Para calificación, muchos prestamistas consideran entre 50% y 80% del ingreso por renta.
                  Planea contingencias por vacancia y mantenimiento.
                </p>
              </div>
            )}

            {/* Botón imprimir */}
            <div className="mt-6 text-center print:hidden">
              <button
                onClick={handlePrint}
                type="button"
                className="px-6 py-3 bg-brand-gold text-brand-green font-sans font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition inline-flex items-center gap-2"
              >
                <FaPrint aria-hidden /> Imprimir resultados (PDF)
              </button>
            </div>
          </Panel>
        </section>
      )}

      {/* FAQ / Guía */}
      <section className="px-4 mt-8 print:hidden">
        <Panel>
          <div className="flex items-center gap-2 mb-4">
            <FaQuestionCircle className="text-brand-blue text-2xl" aria-hidden />
            <h3 className="font-sans text-2xl text-brand-green font-semibold m-0">
              Preguntas frecuentes y guía
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6 text-brand-body">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <b>¿Cómo se calcula el pago?</b> Usamos la fórmula estándar canadiense según monto del
                préstamo, tasa de interés y amortización.
              </li>
              <li>
                <b>¿Y el plazo (term)?</b> El plazo es distinto de la amortización. Muchos compradores
                eligen 3–5 años fijo, pero depende de tu tolerancia al riesgo y tus planes.
              </li>
              <li>
                <b>¿Incluye impuestos o seguro?</b> No. Esta herramienta estima solo la hipoteca. Agrega
                impuesto predial, seguro, cuotas de condominio, servicios y mantenimiento.
              </li>
            </ul>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <b>¿Financiamiento multi-unidad?</b> A partir de 4+ unidades aplican reglas distintas
                (DSCR, rentas, NOI). Agenda una llamada para un plan a tu medida.
              </li>
              <li>
                <b>¿Escenarios personalizados?</b> Modelamos cambios de tasa, pagos anticipados y
                opciones de refinanciación.
              </li>
              <li>
                <a href="/es/contacto" className="text-brand-blue font-bold underline hover:text-brand-gold">
                  Contacta a Fanny y Equipo
                </a>{" "}
                para una evaluación personalizada.
              </li>
            </ul>
          </div>
        </Panel>
      </section>
    </main>
  );
}
