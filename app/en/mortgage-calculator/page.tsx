"use client";
import { useState } from "react";
import Link from "next/link";
import { FaHome, FaLightbulb, FaClipboardList } from "react-icons/fa";

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

  return (
    <main className="bg-brand-beige min-h-screen py-16 px-2">
      {/* Header */}
      <section className="max-w-2xl mx-auto text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-brand-blue/10 border shadow-lg w-16 h-16 flex items-center justify-center">
            <FaHome className="text-brand-blue text-3xl" />
          </div>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-brand-blue font-bold mb-3">
          Mortgage Calculator
        </h1>
        <p className="text-lg text-brand-green mb-2">
          Instantly estimate your monthly payments—even for multi-unit properties.
        </p>
        <p className="text-brand-body">
          Adjust the values below to see your payment, interest, and more for any scenario—single family or “missing middle.”
        </p>
      </section>

      {/* How it Works */}
      <section className="max-w-lg mx-auto bg-white rounded-2xl shadow border p-6 mb-8 text-brand-body">
        <h2 className="text-xl font-serif font-bold text-brand-blue mb-2">How it works:</h2>
        <ul className="list-disc ml-6 mb-2 text-base">
          <li>Enter your property price, down payment, interest rate, and amortization period.</li>
          <li>
            <span className="font-bold">Want to analyze a multi-unit property?</span> Toggle on “Multi-Unit Property” and enter the number of units and estimated monthly rent per unit.
          </li>
          <li>Click <b>Calculate</b> for your payment and detailed results.</li>
        </ul>
      </section>

      {/* Calculator Form */}
      <form
        className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border p-8 mb-10"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <label className="block text-brand-blue font-bold mb-1" htmlFor="price">
            Property Price (CAD)
          </label>
          <input
            id="price"
            type="number"
            className="w-full px-4 py-2 rounded-lg border-2 border-brand-gold focus:outline-brand-green text-lg"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            placeholder="e.g. 800000"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-brand-blue font-bold mb-1" htmlFor="down">
            Down Payment (CAD)
          </label>
          <input
            id="down"
            type="number"
            className="w-full px-4 py-2 rounded-lg border-2 border-brand-gold focus:outline-brand-green text-lg"
            value={down}
            onChange={(e) => setDown(e.target.value)}
            min="0"
            placeholder="e.g. 160000"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-brand-blue font-bold mb-1" htmlFor="rate">
            Interest Rate (Annual %)
          </label>
          <input
            id="rate"
            type="number"
            step="0.01"
            className="w-full px-4 py-2 rounded-lg border-2 border-brand-gold focus:outline-brand-green text-lg"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            min="0"
            max="20"
            placeholder="e.g. 5.2"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-brand-blue font-bold mb-1" htmlFor="years">
            Amortization Period (years)
          </label>
          <input
            id="years"
            type="number"
            className="w-full px-4 py-2 rounded-lg border-2 border-brand-gold focus:outline-brand-green text-lg"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            min="5"
            max="35"
            placeholder="e.g. 25"
            required
          />
        </div>

        {/* Multi-unit toggle */}
        <div className="mb-6 flex items-center gap-3">
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
          <h2 className="text-2xl font-serif font-bold text-brand-blue mb-2">Your Results</h2>
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
        </section>
      )}

      {/* Key Considerations Callout */}
      <section className="max-w-3xl mx-auto mb-8">
        <div className="rounded-2xl border-l-4 border-brand-blue bg-white p-6 shadow flex items-center gap-4">
          <FaClipboardList className="text-brand-blue text-3xl" />
          <div>
            <h3 className="text-lg font-bold text-brand-blue mb-1">
              Key Considerations for Multi-Unit Buyers
            </h3>
            <ul className="text-brand-body list-disc ml-6 text-base">
              <li>Most Canadian lenders require 20%+ down for 4+ units.</li>
              <li>They’ll factor in rental income (but usually not 100% of it).</li>
              <li>Have a plan for vacancies, repairs, and property taxes.</li>
              <li>Your personal income and credit still matter.</li>
              <li>Professional management can help your peace of mind!</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Investor Tips Section */}
      <section className="max-w-3xl mx-auto mb-10">
        <div className="rounded-2xl border-l-4 border-brand-gold bg-brand-beige p-8 shadow">
          <div className="flex items-center mb-3">
            <FaLightbulb className="text-brand-gold text-2xl mr-2" />
            <h3 className="text-xl font-serif font-bold text-brand-green">
              Investor Tips for Multi-Unit Success
            </h3>
          </div>
          <ul className="text-brand-body list-disc ml-6 text-base">
            <li><span className="font-bold">Always use conservative rent estimates</span>—leave margin for vacancies and maintenance.</li>
            <li><span className="font-bold">Stress-test your payment</span>: What if rates rise? Is your cash flow still positive?</li>
            <li><span className="font-bold">Track all your expenses</span>, not just mortgage—utilities, insurance, management, repairs.</li>
            <li>Speak to a mortgage professional familiar with multi-unit and “missing middle” financing before you commit.</li>
            <li><span className="font-bold">Connect with experienced landlords</span>—communities like LandlordBC or Facebook groups offer real-world advice.</li>
          </ul>
        </div>
      </section>

      {/* Next Steps / CTA */}
      <section className="max-w-3xl mx-auto mb-12 text-center">
        <div className="rounded-2xl border-l-4 border-brand-gold bg-white p-8 shadow">
          <h3 className="text-xl font-serif font-bold text-brand-blue mb-2">
            Ready for next steps?
          </h3>
          <p className="text-brand-body mb-4">
            Book a free discovery call for tailored mortgage strategies, or ask for our free Multi-Unit Mortgage Checklist!
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/en/contact">
              <button className="px-8 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition-all text-lg">
                Book Discovery Call
              </button>
            </Link>
            <a
              href="mailto:info@fannysamaniego.com?subject=Multi-Unit%20Mortgage%20Checklist%20Request"
              className="px-8 py-3 bg-brand-blue text-white font-serif font-bold rounded-full shadow hover:bg-brand-gold hover:text-brand-green transition-all text-lg"
            >
              Request Free Checklist
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
