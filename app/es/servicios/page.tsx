import Link from "next/link";
import {
  FaLeaf,
  FaUsers,
  FaDollarSign,
  FaComments,
  FaHandshake,
  FaRegLightbulb,
  FaPhoneAlt,
} from "react-icons/fa";

const servicios = [
  {
    name: "Llamada de Descubrimiento",
    icon: <FaPhoneAlt className="text-brand-green text-2xl" />,
    description:
      "Conversación gratuita y amable para conocerte, entender tus necesidades y tus objetivos—sin presión ni compromiso. Descubramos si somos compatibles.",
    color: "bg-brand-green/10 border-brand-green",
    cta: "Reservar llamada",
    link: "/es/contacto",
  },
  {
    name: "Sesión de Claridad Financiera",
    icon: <FaDollarSign className="text-brand-gold text-2xl" />,
    description:
      "Sesión enfocada para aclarar tu mayor duda financiera—presupuesto, impuestos, compra de vivienda, o cualquier reto con tu dinero. Recibe pasos personalizados y tranquilidad.",
    color: "bg-brand-gold/10 border-brand-gold",
    cta: "Reservar sesión",
    link: "/es/contacto",
  },
  {
    name: "Paquete Bienestar 3 Meses",
    icon: <FaLeaf className="text-brand-green text-2xl" />,
    description:
      "Acompañamiento para crear hábitos financieros sólidos, un plan claro y avanzar realmente en tu camino financiero—juntas, paso a paso.",
    color: "bg-brand-green/10 border-brand-green",
    cta: "Más información",
    link: "/es/inversion",
  },
  {
    name: "Paquete Holístico 6 Meses",
    icon: <FaUsers className="text-brand-blue text-2xl" />,
    description:
      "Transformación profunda y apoyo continuo para cambios importantes, grandes metas financieras o planificación integral para ti y tu familia o pareja.",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Más información",
    link: "/es/inversion",
  },
  {
    name: "Retención Continua (Solo ex-clientes)",
    icon: <FaRegLightbulb className="text-brand-blue text-2xl" />,
    description:
      "Mantén el acompañamiento y el apoyo con sesiones mensuales y guía continua. Solo para quienes ya han sido clientes.",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Reconectar",
    link: "/es/contacto",
  },
  {
    name: "Círculo de Dinero (Grupo, 4 Semanas)",
    icon: <FaComments className="text-brand-blue text-2xl" />,
    description:
      "Grupo pequeño y seguro para aprender, compartir y crecer juntas en temas de dinero y abundancia. Empoderamiento y comunidad en confianza.",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Unirme al círculo",
    link: "/es/contacto",
  },
  {
    name: "Círculo Mensual de Dinero",
    icon: <FaComments className="text-brand-gold text-2xl" />,
    description:
      "Sesiones grupales mensuales para acompañamiento continuo, inspiración y aprendizaje práctico.",
    color: "bg-brand-gold/10 border-brand-gold",
    cta: "Unirme al mensual",
    link: "/es/contacto",
  },
  {
    name: "Talleres (Comunidad/Público)",
    icon: <FaHandshake className="text-brand-gold text-2xl" />,
    description:
      "Talleres interactivos sobre presupuesto, impuestos, compra de vivienda y más—para comunidades, organizaciones y público general.",
    color: "bg-brand-gold/10 border-brand-gold",
    cta: "Solicitar información",
    link: "/es/contacto",
  },
  {
    name: "Talleres (Corporativo/Organización)",
    icon: <FaHandshake className="text-brand-blue text-2xl" />,
    description:
      "Talleres personalizados para empresas y organizaciones. Da a tu equipo herramientas de bienestar financiero, en inglés o español.",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Reservar taller",
    link: "/es/contacto",
  },
];

export default function Servicios() {
  return (
    <main className="bg-brand-beige min-h-screen py-12 px-2">
      {/* Banner */}
      <section className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="font-serif text-4xl md:text-5xl text-brand-green font-bold mb-3">
          Cómo te puedo acompañar
        </h1>
        <p className="text-lg text-brand-blue mb-3">
          Apoyo cálido, holístico y práctico para tu bienestar financiero.
        </p>
        <p className="text-brand-body mb-2">
          Ya sea que busques asesoría puntual, un proceso transformador o una comunidad de apoyo, te ofrezco guía con compasión, claridad y cuidado—en español o inglés.
        </p>
        <Link href="/es/inversion" className="inline-block mt-4">
          <button className="bg-brand-gold text-brand-green px-6 py-2 rounded-full shadow hover:bg-brand-blue hover:text-white font-semibold text-base transition">
            Ver paquetes e inversión
          </button>
        </Link>
      </section>

      {/* Grid de Tarjetas */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {servicios.map((servicio) => (
          <div
            key={servicio.name}
            className={`rounded-2xl border-2 ${servicio.color} shadow-xl p-8 flex flex-col items-center text-center transition hover:-translate-y-1 hover:shadow-2xl`}
          >
            <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-lg border">
              {servicio.icon}
            </div>
            <h3 className="font-serif text-xl font-bold mb-2">{servicio.name}</h3>
            <p className="text-brand-body mb-4">{servicio.description}</p>
            <Link href={servicio.link}>
              <button className="bg-brand-gold text-brand-green px-5 py-2 rounded-full shadow hover:bg-brand-blue hover:text-white font-semibold transition">
                {servicio.cta}
              </button>
            </Link>
          </div>
        ))}
      </section>

      {/* Nota de invitación */}
      <section className="max-w-xl mx-auto bg-brand-beige border-l-4 border-brand-gold rounded-2xl p-6 shadow text-center mb-12">
        <p className="text-brand-body font-semibold">
          Todo empieza con una invitación abierta.  
          <br />
          Reserva tu llamada gratuita—sin presión, solo una conversación cálida.
        </p>
      </section>
    </main>
  );
}
