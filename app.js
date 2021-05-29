// Dummy data
const DUMMY_DATA = [
  { id: "d1", region: "USA", value: 10 },
  { id: "d2", region: "India", value: 12 },
  { id: "d3", region: "China", value: 11 },
  { id: "d4", region: "Germany", value: 6 },
];

// Chart dimensions and constants
const MARGINS = { top: 20, bottom: 10 };
const CHART_WIDTH = 600;
const CHART_HEIGHT = 400 - MARGINS.top - MARGINS.bottom;

let selectedData = DUMMY_DATA;

// Scale for plotting the charts
const xScale = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
const yScale = d3.scaleLinear().range([CHART_HEIGHT, 0]);

// Chart container element
const chartContainer = d3
  .select("svg")
  .attr("width", CHART_WIDTH)
  .attr("height", CHART_HEIGHT + MARGINS.top + MARGINS.bottom);

// Add domain to X and Y axis
xScale.domain(DUMMY_DATA.map((d) => d.region));
yScale.domain([0, d3.max(DUMMY_DATA, (d) => d.value) + 3]);

// "group" html element
const chart = chartContainer.append("g");

// Create axis
chart
  .append("g")
  .call(d3.axisBottom(xScale).tickSizeOuter(0))
  .attr("transform", `translate(0, ${CHART_HEIGHT})`)
  .attr("color", "#4f009e");

// Render the entire chat
function renderChart() {
  // Fill up the list items
  chart
    .selectAll(".bar")
    .data(selectedData, (data) => data.id)
    .enter() // Will have access to all elements since none exist now
    .append("rect")
    .classed("bar", true)
    .attr("width", xScale.bandwidth())
    .attr("height", (data) => CHART_HEIGHT - yScale(data.value))
    .attr("x", (data) => xScale(data.region))
    .attr("y", (data) => yScale(data.value));

  chart
    .selectAll(".bar")
    .data(selectedData, (data) => data.id)
    .exit()
    .remove();

  chart
    .selectAll(".label")
    .data(selectedData, (data) => data.id)
    .enter()
    .append("text")
    .text((data) => data.value)
    .attr("x", (data) => xScale(data.region) + xScale.bandwidth() / 2)
    .attr("y", (data) => yScale(data.value) - 20)
    .attr("text-anchor", "middle")
    .classed("label", true);

  chart
    .selectAll(".label")
    .data(selectedData, (data) => data.id)
    .exit()
    .remove();
}

renderChart();

// Used for toggling the checkboxes
let unselectedIds = [];

// List of items in the dummy data (displayed on right)
const listItems = d3
  .select("#data")
  .select("ul")
  .selectAll("li")
  .data(DUMMY_DATA)
  .enter()
  .append("li");

// Region name
listItems.append("span").text((data) => data.region);

// Checkbox toggle input
listItems
  .append("input")
  .attr("type", "checkbox")
  .attr("checked", true)
  // event listener
  .on("change", (data) => {
    if (unselectedIds.indexOf(data.id) === -1) {
      unselectedIds.push(data.id);
    } else {
      unselectedIds = unselectedIds.filter((id) => id !== data.id);
    }
    selectedData = DUMMY_DATA.filter((d) => unselectedIds.indexOf(d.id) === -1);
    // re render the chart after change
    renderChart();
  });
