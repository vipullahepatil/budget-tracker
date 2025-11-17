import { useEffect, useRef } from "react";
import * as d3 from "d3";

function BudgetChart({ budget }) {
  const chartRef = useRef();

  useEffect(() => {
    if (!budget) return;

    const data = [
      { label: "Expenses", value: budget.total_expenses },
      { label: "Remaining", value: budget.amount - budget.total_expenses },
    ];

    const w = 260, h = 260, r = 120;
    const svg = d3
      .select(chartRef.current)
      .html("")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    const colors = d3.scaleOrdinal(["#EF4444", "#22C55E"]);

    const g = svg.append("g").attr("transform", `translate(${w / 2},${h / 2})`);

    const pie = d3.pie().value((d) => d.value);

    g.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", d3.arc().innerRadius(0).outerRadius(r))
      .attr("fill", (d, i) => colors(i));
  }, [budget]);

  return (
    <div className="flex justify-center mt-6">
      <div ref={chartRef}></div>
    </div>
  );
}

export default BudgetChart;
