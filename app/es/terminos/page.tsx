// app/es/terminos/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/* ---------------------- Ayudas de animación ---------------------- */
const easing: number[] = [0.22, 1, 0.36, 1];

function useAnims() {
  const prefersReduced = useReducedMotion();
  const fade = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: prefersReduced ? { duration: 0 } : { duration: 0.5, ease: easing },
    },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReduced ? { duration: 0 } : { duration: 0.55, ease: easing },
    },
  };
  const stagger = {
    hidden: {},
    visible: {
      transition: prefersReduced ? {} : { staggerChildren: 0.12, delayChildren: 0.06 },
    },
  };
  return { fade, fadeUp, stagger };
}

/* ---------------------- UI ---------------------- */
function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={[
        "max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-10",
        "bg-white/95 rounded-[28px] border border-brand-gold shadow-xl",
        "backdrop-blur-[1px]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

function MotionPanel({
  children,
  viewportAmount = 0.2,
}: {
  children: React.ReactNode;
  viewportAmount?: number;
}) {
  const { fadeUp } = useAnims();
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount }}
    >
      <Panel>{children}</Panel>
    </motion.section>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: React.ReactNode;
}) {
  const { fade, fadeUp } = useAnims();
  return (
    <motion.div
      variants={fade}
      initial="hidden"
      animate="visible"
      className="text-center mb-6"
    >
      <motion.h1
        variants={fadeUp}
        className="font-serif font-extrabold text-4xl md:text-5xl text-brand-green tracking-tight"
      >
        {title}
      </motion.h1>
      <motion.div variants={fade} className="flex justify-center my-4" aria-hidden="true">
        <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
      </motion.div>
      {subtitle && (
        <motion.p variants={fadeUp} className="text-brand-blue/90 text-lg max-w-3xl mx-auto">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

function TermSection({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  const { fadeUp } = useAnims();
  return (
    <motion.div variants={fadeUp} className="space-y-3" id={id}>
      <h2 className="font-serif text-2xl font-semibold text-brand-green">{heading}</h2>
      <div className="prose prose-brand max-w-none">
        {children}
      </div>
    </motion.div>
  );
}

/* ---------------------- Página ---------------------- */
export default function TerminosPage() {
  const { fadeUp, stagger } = useAnims(); // removed unused 'fade'

  return (
    <main id="main" className="bg-brand-beige min-h-screen px-4 py-10">
      <SectionTitle
        title="Términos del Servicio"
        subtitle={
          <>
            Lee estos Términos con atención. Al usar este sitio y nuestros servicios, aceptas lo
            siguiente. Última actualización: <strong>13 de agosto de 2025</strong>.
          </>
        }
      />

      {/* Intro + índice */}
      <MotionPanel>
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-sm text-brand-blue/80">
          Esta versión en español se ofrece para tu comodidad. La versión en{" "}
          <Link className="text-brand-green font-semibold hover:underline" href="/en/terms">
            Inglés
          </Link>{" "}
          también es aplicable; en caso de discrepancia, prevalece la versión en inglés.
        </motion.div>

        <motion.nav
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mt-6 grid sm:grid-cols-2 gap-2 text-sm"
          aria-label="Índice de secciones"
        >
          {[
            ["alcance", "1. Alcance de los Servicios"],
            ["elegibilidad", "2. Elegibilidad del Cliente"],
            ["pagos", "3. Honorarios y Pagos"],
            ["cancelaciones", "4. Agenda, Cancelaciones y Reembolsos"],
            ["comunicacion", "5. Comunicación y Expectativas"],
            ["privacidad", "6. Privacidad y Datos"],
            ["ia", "7. Uso de Asistencia con IA"],
            ["noasesoria", "8. Sin Asesoría Legal, Fiscal o de Inversión"],
            ["cumplimiento", "9. Licencias y Cumplimiento"],
            ["responsabilidades", "10. Responsabilidades del Cliente"],
            ["propiedad", "11. Propiedad Intelectual"],
            ["responsabilidad", "12. Exenciones y Limitación de Responsabilidad"],
            ["testimonios", "13. Testimonios y Resultados"],
            ["cambios", "14. Cambios a los Términos"],
            ["ley", "15. Ley Aplicable"],
            ["contacto", "16. Contacto"],
          ].map(([id, label]) => (
            <Link
              key={id}
              href={`#${id}`}
              className="rounded-lg px-3 py-2 border border-brand-gold/60 bg-white/70 hover:bg-brand-green/10 hover:text-brand-green transition"
            >
              {label}
            </Link>
          ))}
        </motion.nav>
      </MotionPanel>

      {/* Secciones */}
      <div className="mt-8 space-y-6">
        <MotionPanel>
          <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8">
            <TermSection id="alcance" heading="1. Alcance de los Servicios">
              <p>
                Ofrecemos coaching financiero holístico, guía hipotecaria y apoyo en planificación
                fiscal para ayudarte a tomar decisiones informadas. El coaching se centra en
                educación, organización y acompañamiento. La guía hipotecaria incluye evaluar
                elegibilidad general y orientarte sobre opciones con prestamistas licenciados. La
                planificación fiscal se enfoca en educación y preparación; la presentación de
                impuestos puede realizarla un contador asociado si contratas ese servicio.
              </p>
            </TermSection>

            <TermSection id="elegibilidad" heading="2. Elegibilidad del Cliente">
              <ul>
                <li>Debes ser mayor de 18 años y con capacidad para contratar.</li>
                <li>Los servicios están dirigidos principalmente a residentes de Ontario, Canadá.</li>
                <li>Podemos rechazar casos fuera de nuestro alcance o capacidad.</li>
              </ul>
            </TermSection>

            <TermSection id="pagos" heading="3. Honorarios y Pagos">
              <ul>
                <li>Los precios vigentes se muestran en el sitio o por escrito.</li>
                <li>En hipotecas residenciales estándar, normalmente el prestamista paga la compensación; si aplica honorario al cliente (p. ej., financiamiento privado/complejo), se divulgará por escrito y se requerirá tu autorización antes de proceder.</li>
                <li>Los pagos de coaching/planificación fiscal se realizan según checkout o factura.</li>
              </ul>
            </TermSection>

            <TermSection id="cancelaciones" heading="4. Agenda, Cancelaciones y Reembolsos">
              <ul>
                <li>Reprogramaciones requieren al menos 24 horas de aviso.</li>
                <li>Ausencias o cancelaciones tardías pueden cobrarse o descontarse de paquetes.</li>
                <li>Los reembolsos, si aplican, quedan a nuestra discreción considerando el trabajo ya realizado.</li>
              </ul>
            </TermSection>

            <TermSection id="comunicacion" heading="5. Comunicación y Expectativas">
              <ul>
                <li>El tiempo de respuesta habitual es de 2–3 días hábiles (sin contar feriados).</li>
                <li>Preferimos email para mantener registro. WhatsApp o teléfono según acuerdo.</li>
                <li>La información que nos proporciones debe ser veraz y completa.</li>
              </ul>
            </TermSection>

            <TermSection id="privacidad" heading="6. Privacidad y Datos">
              <p>
                Respetamos tu privacidad y tratamos la información conforme a nuestra{" "}
                <Link href="/es/privacidad" className="text-brand-green font-semibold hover:underline">
                  Política de Privacidad
                </Link>
                . Eres responsable de custodiar tus documentos y avisarnos de cambios relevantes.
              </p>
            </TermSection>

            <TermSection id="ia" heading="7. Uso de Asistencia con IA">
              <p>
                Podemos usar herramientas de IA (p. ej., borradores de listas, resúmenes de notas)
                para mejorar eficiencia y calidad. Una persona revisa los resultados antes de usarlos.
                Evita compartir datos sensibles que no quieras transmitir electrónicamente.
              </p>
            </TermSection>

            <TermSection id="noasesoria" heading="8. Sin Asesoría Legal, Fiscal o de Inversión">
              <p>
                El coaching y los materiales son informativos; no constituyen asesoría legal, fiscal,
                contable ni de inversión. Consulta profesionales calificados antes de decidir. Tasas y
                aprobaciones hipotecarias siempre dependen de la evaluación del prestamista.
              </p>
            </TermSection>

            <TermSection id="cumplimiento" heading="9. Licencias y Cumplimiento">
              <ul>
                <li>Los servicios hipotecarios son ofrecidos por una Agente Hipotecaria (Nivel 2) licenciada en Ontario, sujetos a FSRA y a las políticas del bróker.</li>
                <li>Cuando corresponda, la presentación de impuestos la realiza un contador asociado, bajo su propio contrato y términos.</li>
              </ul>
            </TermSection>

            <TermSection id="responsabilidades" heading="10. Responsabilidades del Cliente">
              <ul>
                <li>Entregar información y documentos veraces y a tiempo.</li>
                <li>Las decisiones finales son tuyas; tus acciones son tu responsabilidad.</li>
                <li>Cumplir requisitos del prestamista y del regulador al gestionar hipotecas.</li>
              </ul>
            </TermSection>

            <TermSection id="propiedad" heading="11. Propiedad Intelectual">
              <p>
                El contenido, plantillas y materiales entregados son para tu uso personal y no pueden
                reproducirse ni distribuirse sin permiso por escrito.
              </p>
            </TermSection>

            <TermSection id="responsabilidad" heading="12. Exenciones y Limitación de Responsabilidad">
              <ul>
                <li>No garantizamos resultados específicos (p. ej., aprobaciones, tasas, resultados fiscales).</li>
                <li>
                  En la medida máxima que permita la ley, nuestra responsabilidad total por reclamos
                  relacionados con los servicios se limita a los honorarios que hayas pagado por el
                  servicio afectado.
                </li>
              </ul>
            </TermSection>

            <TermSection id="testimonios" heading="13. Testimonios y Resultados">
              <p>
                Las historias de clientes reflejan experiencias individuales y no constituyen promesa
                de resultados. Tus resultados dependen de tus circunstancias y acciones.
              </p>
            </TermSection>

            <TermSection id="cambios" heading="14. Cambios a los Términos">
              <p>
                Podemos actualizar estos Términos periódicamente. Los cambios rigen al publicarse en
                esta página, con la fecha de “Última actualización” ajustada arriba.
              </p>
            </TermSection>

            <TermSection id="ley" heading="15. Ley Aplicable">
              <p>
                Estos Términos se rigen por las leyes de la Provincia de Ontario y las leyes
                federales de Canadá aplicables.
              </p>
            </TermSection>

            <TermSection id="contacto" heading="16. Contacto">
              <p>
                ¿Preguntas? Escríbenos a{" "}
                <a className="text-brand-green font-semibold hover:underline" href="mailto:info@fannysamaniego.com">
                  info@fannysamaniego.com
                </a>{" "}
                o usa el{" "}
                <Link className="text-brand-green font-semibold hover:underline" href="/es/contacto">
                  formulario de contacto
                </Link>
                .
              </p>
            </TermSection>
          </motion.div>
        </MotionPanel>
      </div>
    </main>
  );
}
