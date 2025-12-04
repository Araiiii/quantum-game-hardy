import { useState } from "react";

export default function Home() {
  const [eqNumber, setEqNumber] = useState(0);
  const [entries, setEntries] = useState({ ac: "", ad: "", bc: "", bd: "" });
  const [result, setResult] = useState("");
  const [explanation, setExplanation] = useState("");

  const equations = [
    { text: "|ψ₁⟩ = 1/√2 |01⟩ − 1/√2 |10⟩", solution: { ac: 0, ad: 1 / Math.sqrt(2), bc: -1 / Math.sqrt(2), bd: 0 }, explanation: "ψ₁ is entangled 🌟" },
    { text: "|ψ₂⟩ = 1/√3 |00⟩ + 1/√3 |10⟩ + 1/√3 |11⟩", solution: { ac: 1 / Math.sqrt(3), ad: 0, bc: 1 / Math.sqrt(3), bd: 1 / Math.sqrt(3) }, explanation: "ψ₂ is entangled 🌟" },
    { text: "|ψ₃⟩ = 1/2 |00⟩ + 1/2 |01⟩ + 1/2 |10⟩ − 1/2 |11⟩", solution: { ac: 0.5, ad: 0.5, bc: 0.5, bd: -0.5 }, explanation: "ψ₃ is entangled 🌟" },
    { text: "|ψ₄⟩ = 1/√2 |00⟩ + 1/√2 |10⟩", solution: { ac: 1 / Math.sqrt(2), ad: 0, bc: 1 / Math.sqrt(2), bd: 0 }, explanation: "ψ₄ is not entangled 🐣" },
  ];

  const parseValue = (text) => {
    if (!text) return null;
    text = text.replace(/\s+/g, "").replace(/√\((.*?)\)/g, "Math.sqrt($1)").replace(/√(\d+(\.\d+)?)/g, "Math.sqrt($1)").replace(/(\d+)\/Math.sqrt\((\d+)\)/g, "($1/Math.sqrt($2))");
    try {
      return Function('"use strict";return (' + text + ")")();
    } catch {
      return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntries({ ...entries, [name]: value });
  };

  const loadNewEquation = () => {
    setEqNumber(Math.floor(Math.random() * equations.length));
    setEntries({ ac: "", ad: "", bc: "", bd: "" });
    setResult("");
    setExplanation("");
  };

  const checkAnswers = () => {
    const ac = parseValue(entries.ac);
    const ad = parseValue(entries.ad);
    const bc = parseValue(entries.bc);
    const bd = parseValue(entries.bd);

    if ([ac, ad, bc, bd].some((v) => v === null)) {
      setResult("Invalid input. Use numbers, fractions, or √ notation.");
      return;
    }

    const tol = 1e-5;
    const sol = equations[eqNumber].solution;
    let message = "";
    message += Math.abs(ac - sol.ac) < tol ? "ac: ✔️\n" : "ac: ❌\n";
    message += Math.abs(ad - sol.ad) < tol ? "ad: ✔️\n" : "ad: ❌\n";
    message += Math.abs(bc - sol.bc) < tol ? "bc: ✔️\n" : "bc: ❌\n";
    message += Math.abs(bd - sol.bd) < tol ? "bd: ✔️\n" : "bd: ❌\n";
    setResult(message);
    setExplanation(equations[eqNumber].explanation);
  };

  const inputStyle = { width: "80px", padding: "5px", fontSize: "16px", marginRight: "10px" };
  const buttonStyle = { background: "#2b1b0e", color: "white", padding: "10px 20px", margin: "5px", cursor: "pointer" };
  const hoverStyle = { background: "#f5deb3", color: "black" };

  return (
    <div style={{ background: "#5d4d4dff", minHeight: "100vh", padding: "20px", color: "white" }}>
      <h1>Quantum Entanglement Expander Game</h1>

      <div style={{ background: "#4c3b3b", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
        <h2>{equations[eqNumber].text}</h2>
      </div>

      <div style={{ marginBottom: "20px" }}>
        {["ac", "ad", "bc", "bd"].map((coef) => (
          <span key={coef}>
            <label>{coef}: </label>
            <input type="text" name={coef} value={entries[coef]} onChange={handleInputChange} style={inputStyle} />
          </span>
        ))}
      </div>

      <div>
        <button style={buttonStyle} onClick={checkAnswers} onMouseEnter={(e) => (e.target.style = { ...buttonStyle, ...hoverStyle })} onMouseLeave={(e) => (e.target.style = buttonStyle)}>Check Answers</button>
        <button style={buttonStyle} onClick={() => setExplanation(equations[eqNumber].explanation)} onMouseEnter={(e) => (e.target.style = { ...buttonStyle, ...hoverStyle })} onMouseLeave={(e) => (e.target.style = buttonStyle)}>Explain</button>
        <button style={buttonStyle} onClick={loadNewEquation} onMouseEnter={(e) => (e.target.style = { ...buttonStyle, ...hoverStyle })} onMouseLeave={(e) => (e.target.style = buttonStyle)}>Practice More</button>
      </div>

      <pre style={{ background: "#eee", color: "black", padding: "15px", marginTop: "20px", borderRadius: "10px" }}>{result}</pre>
      {explanation && <pre style={{ background: "#f9f9f9", color: "black", padding: "15px", marginTop: "10px", borderRadius: "10px" }}>{explanation}</pre>}
    </div>
  );
}

