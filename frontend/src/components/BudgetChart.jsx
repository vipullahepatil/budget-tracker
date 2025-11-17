import { useEffect, useRef } from "react";
import * as d3 from "d3";

function BudgetChart({ budget }) {
  const chartRef = useRef();

  useEffect(() => {
    if (!budget) return;

    const expenses = Number(budget.total_expenses);
    const remaining = Math.max(budget.amount - expenses, 0);

    const data = [
      { label: "Expenses", value: expenses },
      { label: "Remaining", value: remaining },
    ];

    const w = 250, h = 250, r = 100;

    const svg = d3
      .select(chartRef.current)
      .html("")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    const g = svg.append("g").attr("transform", `translate(${w / 2}, ${h / 2})`);

    const color = d3.scaleOrdinal(["#EF4444", "#22C55E"]);

    const pie = d3.pie().value((d) => d.value);

    const arc = d3.arc().innerRadius(50).outerRadius(r);

    g.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i))
      .style("stroke", "#fff")
      .style("stroke-width", "2px");
  }, [budget]);

  return (
    <div className="flex justify-center mt-4">
      <div ref={chartRef}></div>
    </div>
  );
}

export default BudgetChart;
