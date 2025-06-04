"use client";
import { useState } from "react";
import { FaCalculator } from "react-icons/fa";

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

  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + (parseFloat(exp.value) || 0),
    0
  );
  const net = (parseFloat(income) || 0) - totalExpenses;

  // --- FIXED TYPES BELOW ---
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

  return (
    <main className="bg-brand-beige min-h-screen py-16 px-2">
      {/* Header */}
      <section className="max-w-2xl mx-auto text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-brand-green/10 border shadow-lg w-16 h-16 flex items-center justify-center">
            <FaCalculator className="text-brand-gold text-3xl" />
          </div>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-brand-green font-bold mb-3">
          Monthly Budget Calculator
        </h1>
        <p className="text-lg text-brand-blue mb-2">
          A simple way to track your income, expenses, and goals—holistically.
        </p>
        <p className="text-brand-body">
          Enter your monthly numbers, see your net amount, and get clarity on your spending.
        </p>
      </section>

      {/* How it Works */}
      <section className="max-w-lg mx-auto bg-white rounded-2xl shadow border p-6 mb-8 text-brand-body">
        <h2 className="text-xl font-serif font-bold text-brand-blue mb-2">How it works:</h2>
        <ul className="list-disc ml-6 mb-2 text-base">
          <li>Enter your monthly income and each main expense.</li>
          <li>Click <b>Calculate</b> to see your net and breakdown.</li>
          <li>Use your results to adjust your habits and plan ahead!</li>
        </ul>
      </section>

      {/* Calculator Form */}
      <form
        className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border p-8 mb-10"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <label className="block text-brand-green font-bold mb-1" htmlFor="income">
            Monthly Income (CAD)
          </label>
          <input
            id="income"
            type="number"
            className="w-full px-4 py-2 rounded-lg border-2 border-brand-gold focus:outline-brand-green text-lg"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            min="0"
            placeholder="e.g. 4000"
            required
          />
        </div>
        <h3 className="font-bold text-brand-blue mb-3 text-lg">Expenses</h3>
        {expenses.map((exp, i) => (
          <div className="mb-3" key={exp.name}>
            <label className="block text-brand-body mb-1">{exp.name}</label>
            <input
              type="number"
              className="w-full px-4 py-2 rounded-lg border border-brand-green focus:outline-brand-gold text-lg"
              value={exp.value}
              onChange={(e) => handleExpenseChange(i, e.target.value)}
              min="0"
              placeholder="0"
              required
            />
          </div>
        ))}
        <div className="flex gap-4 justify-center mt-6">
          <button
            type="submit"
            className="px-7 py-2 bg-brand-gold text-brand-green font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition"
          >
            Calculate
          </button>
          <button
            type="button"
            className="px-7 py-2 bg-brand-blue text-white font-bold rounded-full shadow hover:bg-brand-gold hover:text-brand-green transition"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>

      {/* Results */}
      {showResults && (
        <section className="max-w-xl mx-auto bg-brand-blue/5 rounded-2xl border-2 border-brand-blue p-8 shadow mb-10 text-center">
          <h2 className="text-2xl font-serif font-bold text-brand-green mb-2">Your Results</h2>
          <p className="text-lg mb-2">
            <span className="font-bold text-brand-blue">Total Income:</span>{" "}
            <span className="font-semibold">{parseFloat(income).toLocaleString("en-CA", {style: "currency", currency: "CAD"})}</span>
          </p>
          <p className="text-lg mb-2">
            <span className="font-bold text-brand-blue">Total Expenses:</span>{" "}
            <span className="font-semibold">{totalExpenses.toLocaleString("en-CA", {style: "currency", currency: "CAD"})}</span>
          </p>
          <p className={`text-xl font-bold mt-3 ${net >= 0 ? "text-brand-green" : "text-red-600"}`}>
            {net >= 0 ? "You have money left over each month:" : "Your expenses exceed your income by:"} <br />
            {net.toLocaleString("en-CA", {style: "currency", currency: "CAD"})}
          </p>
        </section>
      )}

      {/* FAQ / Education Section */}
      <section className="max-w-3xl mx-auto mb-12">
        <div className="rounded-2xl border-l-4 border-brand-gold bg-brand-beige p-8 shadow text-center">
          <h3 className="text-xl font-serif font-bold text-brand-green mb-2">
            Why budget holistically?
          </h3>
          <p className="text-brand-body mb-4">
            When your budget reflects your values and real life—not just numbers—it’s easier to make confident, conscious financial choices. Use this calculator to check in, reset, and celebrate your progress.
          </p>
        </div>
      </section>
    </main>
  );
}
