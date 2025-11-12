// src/components/BudgetChart.jsx
import { useEffect, useRef } from "react";
import * as d3 from "d3";

function BudgetChart({ budget, actual }) {
  const chartRef = useRef();

  useEffect(() => {
    if (budget === null || actual === null) return;

    d3.select(chartRef.current).selectAll("*").remove();

    const data = [
      { label: "Budget", value: budget },
      { label: "Expenses", value: actual },
    ];

    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.label))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.value))
      .attr("fill", (d) => (d.label === "Budget" ? "#3b82f6" : "#ef4444"));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text("Budget vs Actual Expenses");
  }, [budget, actual]);

  return <div ref={chartRef} className="mt-10" />;
}

export default BudgetChart;
