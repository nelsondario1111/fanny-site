"use client";
import { useState } from "react";
import { FaHome, FaPrint, FaQuestionCircle } from "react-icons/fa";
import Image from "next/image";

// Mortgage calculation helper
function calcMortgage(principal: number, rate: number, years: number): number {
  const monthlyRate = rate / 100 / 12;
  const n = years * 12;
  if (monthlyRate === 0) return principal / n || 0;
  const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
  return payment || 0;
}

export default function MortgageCalculator() {
  const [price, setPrice] = useState("");
  const [down, setDown] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState(25);
  const [multi, setMulti] = useState(false);
  const [units, setUnits] = useState(4);
  const [rent, setRent] = useState("");
  const [showResults, setShowResults] = useState(false);

  const loan = Math.max(0, (parseFloat(price) || 0) - (parseFloat(down) || 0));
  const monthly = calcMortgage(loan, parseFloat(rate) || 0, years);
  const totalPaid = monthly * years * 12;
  const totalInterest = totalPaid - loan;
  const perUnit = multi && units > 0 ? monthly / units : monthly;
  const monthlyRental = parseFloat(rent) || 0;
  const totalRental = multi && units > 0 ? monthlyRental * units : 0;
  const cashFlow = multi ? totalRental - monthly : null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowResults(true);
  }

  function handleReset() {
    setPrice("");
    setDown("");
    setRate("");
    setYears(25);
    setMulti(false);
    setUnits(4);
    setRent("");
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
    <main className="bg-brand-beige min-h-screen py-12 px-2">
      {/* HEADER */}
      <section className="max-w-xl mx-auto text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-brand-blue/10 border shadow-lg w-16 h-16 flex items-center justify-center">
            <FaHome className="text-brand-blue text-3xl" />
          </div>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-brand-blue font-bold mb-3">
          Mortgage Calculator
        </h1>
         <div className="flex justify-center mb-8">
            <div className="w-20 border-t-4 border-brand-gold rounded-full"></div>
          </div>
        <p className="text-lg text-brand-green mb-2">
          Instantly estimate your monthly payments—even for multi-unit properties.
        </p>
        <p className="text-brand-body mb-3">
          Adjust the values below to see your payment, interest, and more for any scenario—single family or “missing middle.”
        </p>
      </section>

      {/* CALCULATOR CARD */}
      <form
        className="max-w-xl mx-auto bg-white/90 rounded-2xl p-8 shadow border border-brand-gold mb-8 print:hidden"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-serif font-bold text-brand-blue mb-6">
          Mortgage Details
        </h2>
        <div className="mb-4">
          <label className="block text-brand-blue font-bold mb-1" htmlFor="price">
            Property Price (CAD)
          </label>
          <input
            id="price"
            type="number"
            className="w-full px-4 py-2 rounded-xl border-2 border-brand-green focus:border-brand-blue text-lg"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            placeholder="e.g. 800000"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-brand-blue font-bold mb-1" htmlFor="down">
            Down Payment (CAD)
          </label>
          <input
            id="down"
            type="number"
            className="w-full px-4 py-2 rounded-xl border-2 border-brand-green focus:border-brand-blue text-lg"
            value={down}
            onChange={(e) => setDown(e.target.value)}
            min="0"
            placeholder="e.g. 160000"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-brand-blue font-bold mb-1" htmlFor="rate">
            Interest Rate (Annual %)
          </label>
          <input
            id="rate"
            type="number"
            step="0.01"
            className="w-full px-4 py-2 rounded-xl border-2 border-brand-green focus:border-brand-blue text-lg"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            min="0"
            max="20"
            placeholder="e.g. 5.2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-brand-blue font-bold mb-1" htmlFor="years">
            Amortization Period (years)
          </label>
          <input
            id="years"
            type="number"
            className="w-full px-4 py-2 rounded-xl border-2 border-brand-green focus:border-brand-blue text-lg"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            min="5"
            max="35"
            placeholder="e.g. 25"
            required
          />
        </div>
        <div className="mb-4 flex items-center gap-3">
          <input
            type="checkbox"
            id="multi"
            checked={multi}
            onChange={() => setMulti((v) => !v)}
            className="accent-brand-blue w-5 h-5"
          />
          <label htmlFor="multi" className="font-bold text-brand-blue">
            Multi-Unit Property
          </label>
        </div>
        {multi && (
          <div className="bg-brand-blue/5 border-l-4 border-brand-blue p-4 rounded-xl mb-6">
            <div className="mb-4">
              <label className="block text-brand-blue font-bold mb-1" htmlFor="units">
                Number of Units
              </label>
              <input
                id="units"
                type="number"
                min="2"
                max="12"
                className="w-full px-4 py-2 rounded-lg border border-brand-blue text-lg"
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                placeholder="e.g. 4"
                required
              />
            </div>
            <div>
              <label className="block text-brand-blue font-bold mb-1" htmlFor="rent">
                Expected Rent Per Unit (Monthly, CAD)
              </label>
              <input
                id="rent"
                type="number"
                min="0"
                className="w-full px-4 py-2 rounded-lg border border-brand-blue text-lg"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                placeholder="e.g. 2200"
              />
            </div>
          </div>
        )}
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

      {/* RESULTS */}
      {showResults && (
        <section className="max-w-xl mx-auto bg-brand-blue/5 rounded-2xl border-2 border-brand-blue p-8 shadow mb-10 text-center print:bg-white print:border-none print:shadow-none">
          {/* Print-Only Logo, Name, Date */}
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
          <h2 className="text-2xl font-serif font-bold text-brand-blue mb-2 print:mt-0">
            Your Results
          </h2>
          <p className="text-lg mb-2">
            <span className="font-bold text-brand-blue">Loan Amount:</span>{" "}
            <span className="font-semibold">
              {loan.toLocaleString("en-CA", { style: "currency", currency: "CAD" })}
            </span>
          </p>
          <p className="text-lg mb-2">
            <span className="font-bold text-brand-blue">Estimated Monthly Payment:</span>{" "}
            <span className="font-semibold">
              {monthly.toLocaleString("en-CA", { style: "currency", currency: "CAD" })}
            </span>
          </p>
          {multi && (
            <>
              <p className="text-lg mb-2">
                <span className="font-bold text-brand-blue">Payment Per Unit:</span>{" "}
                <span className="font-semibold">
                  {perUnit.toLocaleString("en-CA", { style: "currency", currency: "CAD" })}
                </span>
              </p>
              <p className="text-lg mb-2">
                <span className="font-bold text-brand-blue">Total Rental Income (All Units):</span>{" "}
                <span className="font-semibold">
                  {totalRental.toLocaleString("en-CA", { style: "currency", currency: "CAD" })}
                </span>
              </p>
              {typeof cashFlow === "number" && (
                <p className={`text-lg font-bold mt-3 ${cashFlow >= 0 ? "text-brand-green" : "text-red-600"}`}>
                  {cashFlow >= 0
                    ? "Estimated Positive Cash Flow: "
                    : "Estimated Shortfall: "}
                  {cashFlow.toLocaleString("en-CA", { style: "currency", currency: "CAD" })}
                </p>
              )}
            </>
          )}
          {!multi && (
            <p className="text-lg mt-3 font-bold text-brand-green">
              Not a multi-unit scenario. Use “Multi-Unit Property” toggle to see advanced results.
            </p>
          )}
          <p className="text-lg mb-2 mt-4">
            <span className="font-bold text-brand-blue">Total Paid Over {years} Years:</span>{" "}
            <span className="font-semibold">
              {totalPaid.toLocaleString("en-CA", { style: "currency", currency: "CAD" })}
            </span>
          </p>
          <p className="text-lg">
            <span className="font-bold text-brand-blue">Total Interest:</span>{" "}
            <span className="font-semibold">
              {totalInterest.toLocaleString("en-CA", { style: "currency", currency: "CAD" })}
            </span>
          </p>
          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="mt-6 px-6 py-2 bg-brand-gold text-brand-green font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition flex items-center gap-2 print:hidden"
            type="button"
          >
            <FaPrint className="inline" /> Print Results (PDF)
          </button>
        </section>
      )}

      {/* FAQ & Guidance - same look as budget calculator */}
      <section className="max-w-xl mx-auto bg-white/90 rounded-2xl p-8 shadow border border-brand-gold mb-12 print:hidden">
        <div className="flex items-center mb-4 gap-2">
          <FaQuestionCircle className="text-brand-blue text-2xl" />
          <h3 className="font-serif font-bold text-brand-green text-2xl">
            Mortgage FAQs & Guidance
          </h3>
        </div>
        <ul className="list-disc pl-6 text-brand-body space-y-3 text-base">
          <li>
            <b>How is my mortgage payment calculated?</b><br />
            It’s based on your loan amount, interest rate, and amortization period. We use a standard Canadian mortgage formula.
          </li>
          <li>
            <b>What is a “multi-unit” property?</b><br />
            Typically a building with 2+ rental units (like duplex, fourplex, or apartment). Financing rules differ for 4+ units!
          </li>
          <li>
            <b>Does rent cover all my mortgage?</b><br />
            Most lenders only count 50–80% of rental income toward your application. Plan for vacancies and repairs.
          </li>
          <li>
            <b>What about property taxes, insurance, and fees?</b><br />
            This tool is for mortgage payment only—remember to budget for ALL housing costs.
          </li>
          <li>
            <b>Want custom advice?</b><br />
            <a
              href="/en/contact"
              className="text-brand-blue font-bold underline hover:text-brand-gold"
            >
              Contact Fanny
            </a> for a tailored assessment!
          </li>
        </ul>
      </section>
    </main>
  );
}
