// app/es/privacidad/page.tsx
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | Fanny Samaniego",
  description:
    "Política de privacidad de Fanny Samaniego — Coach Financiera Holística y Agente Hipotecaria en Toronto. Conoce cómo recopilamos, usamos y protegemos tu información.",
};

export default function PrivacyEsPage() {
  return (
    <main id="main-content" className="flex-1 pt-20">
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
          <div className="mb-4">
            <nav aria-label="Breadcrumb" className="text-sm">
              <ol className="flex items-center gap-2 text-brand-blue/70">
                <li>
                  <Link href="/es" className="hover:text-brand-gold underline-offset-2 hover:underline">
                    Inicio
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-brand-blue">Política de Privacidad</li>
              </ol>
            </nav>
          </div>

          <h1 className="font-brand text-3xl sm:text-4xl font-bold text-brand-blue tracking-tight">
            Política de Privacidad
          </h1>
          <p className="mt-3 text-brand-blue/80">
            Última actualización: <time dateTime="2025-08-10">10 de agosto de 2025</time>
          </p>
          <p className="mt-6 text-brand-blue/90 leading-relaxed">
            Tu privacidad es importante. Esta política explica qué datos recopilamos, cómo los usamos y las opciones que
            tienes. Aplica a{" "}
            <span className="font-semibold">
              Fanny Samaniego — Coach Financiera Holística y Agente Hipotecaria en Toronto
            </span>{" "}
            (“nosotros”, “nos”, “nuestro”) y a todos los servicios y páginas bajo{" "}
            <span className="whitespace-nowrap">/es</span> en este sitio web.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-brand-beige/30">
        <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14 space-y-8">
          {/* Índice */}
          <div className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-xl text-brand-blue font-semibold mb-3">Contenido</h2>
            <ul className="list-disc ml-5 space-y-1 text-brand-blue/90">
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#datos-que-recopilamos">Datos que recopilamos</a></li>
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#como-usamos-datos">Cómo usamos tus datos</a></li>
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#base-legal">Base legal</a></li>
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#cookies">Cookies y analíticas</a></li>
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#compartir">Compartir y divulgación</a></li>
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#retencion">Retención de datos</a></li>
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#tus-derechos">Tus derechos</a></li>
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#seguridad">Seguridad</a></li>
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#menores">Privacidad de menores</a></li>
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#contacto">Contacto</a></li>
            </ul>
          </div>

          {/* Datos que recopilamos */}
          <article id="datos-que-recopilamos" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Datos que recopilamos</h2>
            <p className="text-brand-blue/90 mb-3">
              Recopilamos la información mínima necesaria para prestar nuestros servicios y mejorar tu experiencia:
            </p>
            <ul className="list-disc ml-5 space-y-2 text-brand-blue/90">
              <li>
                <span className="font-semibold">Datos de contacto</span> (p. ej., nombre, correo, teléfono) cuando reservas
                una llamada, nos contactas o te suscribes al boletín.
              </li>
              <li>
                <span className="font-semibold">Datos de reserva</span> que compartes voluntariamente para consultas o
                sesiones de coaching.
              </li>
              <li>
                <span className="font-semibold">Uso del sitio web</span> como páginas visitadas e interacciones (mediante
                cookies o analíticas; ver abajo).
              </li>
              <li>
                <span className="font-semibold">Interacción con correos</span> como aperturas o clics si te suscribes al
                boletín, para entender qué te resulta útil.
              </li>
            </ul>
            <p className="text-brand-blue/80 mt-3">
              <span className="font-semibold">No</span> vendemos datos personales.
            </p>
          </article>

          {/* Cómo usamos */}
          <article id="como-usamos-datos" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Cómo usamos tus datos</h2>
            <ul className="list-disc ml-5 space-y-2 text-brand-blue/90">
              <li>Para proporcionar los servicios que solicitas (llamadas, coaching, recursos).</li>
              <li>Para responder a consultas y soporte.</li>
              <li>Para enviar boletines o actualizaciones si das tu consentimiento (puedes darte de baja cuando quieras).</li>
              <li>Para mantener la seguridad y el rendimiento del sitio y mejorar el contenido.</li>
              <li>Para cumplir con requisitos legales, regulatorios y de auditoría.</li>
            </ul>
          </article>

          {/* Base legal */}
          <article id="base-legal" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Base legal</h2>
            <p className="text-brand-blue/90">
              Cuando aplique (p. ej., RGPD), nuestro tratamiento se basa en una o más de las siguientes bases legales:
            </p>
            <ul className="list-disc ml-5 space-y-2 text-brand-blue/90 mt-2">
              <li><span className="font-semibold">Consentimiento</span> (p. ej., suscripción al boletín).</li>
              <li><span className="font-semibold">Contrato</span> (para prestar los servicios que solicitas).</li>
              <li><span className="font-semibold">Intereses legítimos</span> (p. ej., seguridad del sitio, mejora del servicio).</li>
              <li><span className="font-semibold">Obligación legal</span> (p. ej., impuestos, cumplimiento, contabilidad).</li>
            </ul>
          </article>

          {/* Cookies */}
          <article id="cookies" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Cookies y analíticas</h2>
            <p className="text-brand-blue/90 mb-3">
              Podemos usar cookies esenciales para habilitar funciones básicas y analíticas opcionales para entender el uso
              y mejorar el contenido. Puedes controlar las cookies desde la configuración de tu navegador. Si usamos
              analíticas, procuramos hacerlo de forma respetuosa con la privacidad (p. ej., enmascaramiento de IP cuando sea posible).
            </p>
            <p className="text-brand-blue/90">
              Los correos del boletín pueden usar medición de interacción. Puedes darte de baja en cualquier momento desde
              el enlace “cancelar suscripción” en cualquier email.
            </p>
          </article>

          {/* Compartir */}
          <article id="compartir" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Compartir y divulgación</h2>
            <p className="text-brand-blue/90 mb-3">
              Compartimos datos solo con proveedores de confianza que nos ayudan a operar nuestro sitio y servicios
              (p. ej., hosting, envío de correos), y únicamente en la medida necesaria para su labor.
            </p>
            <ul className="list-disc ml-5 space-y-2 text-brand-blue/90">
              <li>Los proveedores están sujetos a obligaciones de confidencialidad y protección de datos.</li>
              <li>Podemos divulgar información si la ley lo exige o para proteger nuestros derechos y a los usuarios.</li>
              <li>No vendemos información personal.</li>
            </ul>
          </article>

          {/* Retención */}
          <article id="retencion" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Retención de datos</h2>
            <p className="text-brand-blue/90">
              Conservamos los datos solo el tiempo necesario para los fines descritos en esta política (o lo que exija la ley).
              Cuando ya no son necesarios, tomamos medidas para eliminarlos o anonimizarlos.
            </p>
          </article>

          {/* Derechos */}
          <article id="tus-derechos" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Tus derechos</h2>
            <p className="text-brand-blue/90">
              Según tu ubicación, puedes tener derechos para acceder, corregir, eliminar o restringir el tratamiento de tus
              datos personales, así como retirar tu consentimiento. Para ejercerlos, contáctanos usando los datos de abajo.
              Responderemos en un plazo razonable.
            </p>
          </article>

          {/* Seguridad */}
          <article id="seguridad" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Seguridad</h2>
            <p className="text-brand-blue/90">
              Utilizamos medidas organizativas y técnicas razonables para proteger tus datos. Sin embargo, ningún método de
              transmisión o almacenamiento es 100% seguro, por lo que no podemos garantizar seguridad absoluta.
            </p>
          </article>

          {/* Menores */}
          <article id="menores" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Privacidad de menores</h2>
            <p className="text-brand-blue/90">
              Nuestros servicios están dirigidos a adultos. Si crees que un menor nos proporcionó información personal sin
              autorización, contáctanos y tomaremos las medidas adecuadas.
            </p>
          </article>

          {/* Contacto */}
          <article id="contacto" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Contacto</h2>
            <p className="text-brand-blue/90">
              Para consultas o solicitudes relacionadas con privacidad, escríbenos a{" "}
              <a href="mailto:info@fannysamaniego.com" className="underline hover:text-brand-gold">
                info@fannysamaniego.com
              </a>{" "}
              o visita la{" "}
              <Link href="/es/contacto" className="underline hover:text-brand-gold">
                página de contacto
              </Link>
              .
            </p>
            <p className="text-brand-blue/80 mt-3">
              Licencia Hipotecaria #M22000490 · Zolo Realty
            </p>
          </article>

          {/* Enlace a EN */}
          <div className="text-center">
            <Link
              href="/en/privacy"
              className="inline-block px-4 py-2 rounded-full border-2 border-brand-gold text-brand-blue hover:bg-brand-gold hover:text-brand-green transition font-bold"
            >
              View Privacy Policy (EN)
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
