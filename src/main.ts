import * as d3 from "d3";
import sample from "lodash/sample";

import "./helpers/handleModals"
import "./helpers/handleSettingsFormSubmit"
import "./helpers/applySettingsFormInitialValues"

import "./styles/index.scss";
import { MERGED_INITIAL_SETTINGS_VALUES } from "./constants/mergedInitialSettingsValues";


var svg = d3.select(".canvas__element");
var width = 960;
var height = 600;

//intialize data
const nodes: d3.SimulationNodeDatum[] = new Array(+MERGED_INITIAL_SETTINGS_VALUES.nodesNumber)
  .fill(0)
  .map((_, index) => ({ index }));

const links = nodes.map(({ index }) => ({
  index,
  source: index,
  target: sample(nodes.filter((n) => n.index !== index))?.index,
}));

var simulation = d3
  .forceSimulation(nodes)
  .velocityDecay(0.3)
  .force(
    "link",
    d3
      .forceLink(links)
      .id((d) => d.index)
      .strength(1)
      .distance(30)
      .iterations(2)
  )
  .force("charge", d3.forceManyBody().strength(-150))
  // .force("collide", d3.forceCollide())
  .force("center", d3.forceCenter(width / 2, height / 2).strength(1))
  .force("x", d3.forceX())
  .force("y", d3.forceY());
// .force("tick", ticked)

const marker = svg
  .append("defs")
  .append("marker")
  .attr("id", "link-arrow")
  .attr("viewBox", "-5 -5 10 10")
  .attr("markerWidth", 4)
  .attr("markerHeight", 4)
  .attr("refX", 12)
  .attr("refY", 0)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M 0,0 m -5,-5 L 5,0 L -5,5 Z");

var link = svg
  .append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(links)
  .enter()
  .append("line")
  .attr("data-from", d => String(d.index))
  .attr("stroke-width", 3)

const getTargetIndex = (sourceIndex: number) => links.find(link => link.source.index == sourceIndex)?.target.index

const getTargetElem = (sourceIndex: number) => {
  const targetId = getTargetIndex(sourceIndex)

  return svg.select<SVGCircleElement>(`circle[data-index="${targetId}"]`).node()
}

const getAssociatedLink = (sourceIndex: number) => {
  return svg.select<SVGLineElement>(`line[data-from="${sourceIndex}"]`).node()
}

var node = svg
  .append("g")
  .attr("class", "nodes")
  .selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("data-index", d => d.index)
  .on("mouseover", function (event) {
    const sourceElem = event.target;
    const circleId = Number(sourceElem.dataset.index)
    const targetElem = getTargetElem(circleId)
    const associatedLink = getAssociatedLink(circleId)

    sourceElem.style.fill = "blue"
    targetElem.style.fill = "green"
    associatedLink?.setAttribute("marker-end", "url(#link-arrow)")

  })
  // .on("mousemove", function (event) {
  //   console.log(event);
  //   return tooltip
  //     .style("top", event.pageY + "px")
  //     .style("left", event.pageX + "px");
  // })
  .on("mouseout", function (event) {
    const sourceElem = event.target;
    const circleId = Number(sourceElem.dataset.index)
    const targetElem = getTargetElem(circleId)
    const associatedLink = getAssociatedLink(circleId)

    sourceElem.style.fill = "red"
    targetElem.style.fill = "red"
    associatedLink?.removeAttribute("marker-end")

  })
  .attr("r", 5)
  .attr("fill", function (d) {
    return "red";
  })
  .call(
    d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  );

function ticked() {
  link
    .attr("x1", function (d) {
      return d.source.x;
    })
    .attr("y1", function (d) {
      return d.source.y;
    })
    .attr("x2", function (d) {
      return d.target.x;
    })
    .attr("y2", function (d) {
      return d.target.y;
    });

  node
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    });
}

simulation.on("tick", ticked);

function dragstarted(event, elem) {
  console.log(arguments);
  if (!event.active) simulation.alphaTarget(0.3).restart();
  elem.fx = elem.x;
  elem.fy = elem.y;
}

function dragged(event, elem) {
  elem.fx = event.x;
  elem.fy = event.y;
}

function dragended(event, elem) {
  if (!event.active) simulation.alphaTarget(0);
  elem.fx = null;
  elem.fy = null;
}
