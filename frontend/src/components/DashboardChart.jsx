import { useEffect, useRef } from "react";
import * as d3 from "d3";

function DashboardChart({ summary }) {
  const chartRef = useRef();

  useEffect(() => {
    if (!summary) return;

    // Clear previous chart (for hot reloads)
    d3.select(chartRef.current).selectAll("*").remove();

    const data = [
      { label: "Income", value: summary.total_income },
      { label: "Expenses", value: summary.total_expenses },
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

    // Bars
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.label))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.value))
      .attr("fill", (d) =>
        d.label === "Income" ? "#22c55e" : "#ef4444"
      );

    // X-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    // Y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Chart title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text("Income vs Expenses");
  }, [summary]);

  return <div ref={chartRef} className="mt-10" />;
}

export default DashboardChart;
