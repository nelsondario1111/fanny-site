"use client";
import { useState, useRef } from "react";
import { FaCalculator, FaPrint, FaQuestionCircle } from "react-icons/fa";
import Image from "next/image";

export default function BudgetCalculator() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState([
    { name: "Housing", value: "" },
    { name: "Utilities", value: "" },
    { name: "Groceries", value: "" },
    { name: "Transportation", value: "" },
    { name: "Insurance", value: "" },
    { name: "Healthcare", value: "" },
    { name: "Other", value: "" },
  ]);
  const [showResults, setShowResults] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + (parseFloat(exp.value) || 0),
    0
  );
  const net = (parseFloat(income) || 0) - totalExpenses;

  function handleExpenseChange(i: number, val: string) {
    setExpenses((prev) =>
      prev.map((exp, idx) => (idx === i ? { ...exp, value: val } : exp))
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowResults(true);
  }

  function handleReset() {
    setIncome("");
    setExpenses(expenses.map((exp) => ({ ...exp, value: "" })));
    setShowResults(false);
  }

  function handlePrint() {
    window.print();
  }

  const today = new Date();
  const printDate = today.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="bg-brand-beige min-h-screen py-16 px-2">
      {/* --- BUDGET FORM --- */}
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white/90 rounded-2xl p-8 shadow border border-brand-gold mb-8 print:hidden"
      >
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-brand-green flex items-center gap-2">
          <FaCalculator className="text-brand-gold" /> Holistic Budget Calculator
        </h1>
         <div className="flex justify-center mb-8">
            <div className="w-20 border-t-4 border-brand-gold rounded-full"></div>
          </div>
        <div className="mb-4">
          <label className="block font-bold text-brand-blue mb-1">
            Monthly Income (CAD)
          </label>
          <input
            type="number"
            value={income}
            min={0}
            onChange={(e) => setIncome(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border-2 border-brand-green focus:border-brand-blue font-sans text-lg"
            required
          />
        </div>
        <div>
          <label className="block font-bold text-brand-blue mb-2">
            Monthly Expenses
          </label>
          {expenses.map((exp, i) => (
            <div key={exp.name} className="flex items-center mb-2">
              <span className="w-36 font-medium text-brand-green">{exp.name}</span>
              <input
                type="number"
                value={exp.value}
                min={0}
                onChange={(e) => handleExpenseChange(i, e.target.value)}
                className="w-full px-3 py-1 rounded-lg border border-brand-green focus:border-brand-blue font-sans text-base"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-brand-gold text-brand-green font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition"
          >
            Calculate
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 px-6 py-3 bg-brand-blue text-white font-bold rounded-full shadow hover:bg-brand-gold hover:text-brand-green transition"
          >
            Reset
          </button>
        </div>
      </form>

      {/* --- RESULTS --- */}
      {showResults && (
        <section
          ref={resultsRef}
          className="max-w-xl mx-auto bg-brand-blue/5 rounded-2xl border-2 border-brand-blue p-8 shadow mb-10 text-center print:bg-white print:border-none print:shadow-none"
        >
          {/* --- PRINT-ONLY HEADER --- */}
          <div className="hidden print:block mb-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/fanny-logo.png"
                alt="Fanny Samaniego Logo"
                width={120}
                height={120}
                style={{ margin: "0 auto" }}
                className="mb-2"
              />
              <div className="font-serif font-bold text-brand-green text-2xl mb-1">
                Fanny Samaniego
              </div>
              <div className="text-brand-blue text-lg font-serif">
                Holistic Financial Coach &amp; Advisor
              </div>
              <div className="text-sm mt-2 text-brand-blue">
                Prepared by Fanny Samaniego <br />
                Date: {printDate}
              </div>
            </div>
            <hr className="my-3 border-brand-gold" />
          </div>

          <h2 className="text-2xl font-serif font-bold text-brand-green mb-2 print:mt-0">
            Your Results
          </h2>
          <p className="text-lg mb-2">
            <span className="font-bold text-brand-blue">Total Income:</span>{" "}
            <span className="font-semibold">
              {parseFloat(income).toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </span>
          </p>
          <p className="text-lg mb-2">
            <span className="font-bold text-brand-blue">Total Expenses:</span>{" "}
            <span className="font-semibold">
              {totalExpenses.toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </span>
          </p>
          <p
            className={`text-xl font-bold mt-3 ${
              net >= 0 ? "text-brand-green" : "text-red-600"
            }`}
          >
            {net >= 0
              ? "You have money left over each month:"
              : "Your expenses exceed your income by:"}{" "}
            <br />
            {net.toLocaleString("en-CA", {
              style: "currency",
              currency: "CAD",
            })}
          </p>

          {/* Print Button - only on screen */}
          <button
            onClick={handlePrint}
            className="mt-6 px-6 py-2 bg-brand-gold text-brand-green font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition flex items-center gap-2 print:hidden"
            type="button"
          >
            <FaPrint className="inline" /> Print Results (PDF)
          </button>
        </section>
      )}

      {/* --- FAQ & GUIDANCE --- */}
      <section className="max-w-xl mx-auto bg-white/90 rounded-2xl p-8 shadow border border-brand-gold mb-12 print:hidden">
        <div className="flex items-center mb-4 gap-2">
          <FaQuestionCircle className="text-brand-blue text-2xl" />
          <h3 className="font-serif font-bold text-brand-green text-2xl">
            Budgeting FAQs & Guidance
          </h3>
        </div>
        <ul className="list-disc pl-6 text-brand-body space-y-3 text-base">
          <li>
            <b>What counts as “Income”?</b> <br />
            Include your take-home pay after taxes, plus any regular rental, freelance, government, or side hustle income.
          </li>
          <li>
            <b>How should I categorize my expenses?</b> <br />
            Use the categories provided, but add more in “Other” if you need (e.g., childcare, pets, savings, giving).
          </li>
          <li>
            <b>How often should I do a budget?</b> <br />
            At least once per month—or any time your situation changes. Checking in regularly keeps you clear and confident!
          </li>
          <li>
            <b>Is my information saved?</b> <br />
            No—everything stays on your device, and nothing is stored or shared. This calculator is 100% private and secure.
          </li>
          <li>
            <b>What if my expenses are higher than my income?</b> <br />
            Don’t stress. This is a starting point for gentle awareness and empowered change. Consider adjusting non-essentials, or reach out for guidance.
          </li>
        </ul>
        <div className="mt-6 text-center">
          <span className="font-sans text-brand-green text-base">
            Want personalized support?{" "}
            <a
              href="/en/contact"
              className="text-brand-blue font-bold underline hover:text-brand-gold"
            >
              Contact Fanny
            </a>
          </span>
        </div>
      </section>
    </main>
  );
}
