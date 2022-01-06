import * as d3 from 'd3';
import sample from 'lodash/sample';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants/canvas';
import { MERGED_INITIAL_SETTINGS_VALUES } from '../constants/mergedInitialSettingsValues';
import { InitialLink, LinkLines, ModifiedLink } from '../typings/Links';
import { InitialNode, ModifiedNode, NodeCircles } from '../typings/Nodes';
import { CircleDragEventHandler, DragEvent } from '../typings/Events';

const svg = d3.select('.canvas__element');

//intialize data
const nodes: InitialNode[] = new Array(
  +MERGED_INITIAL_SETTINGS_VALUES.nodesNumber
)
  .fill(0)
  .map((_, index) => ({ index }));

const links: InitialLink[] = nodes.map(({ index }) => ({
  index,
  source: index,
  target: sample(nodes.filter((n) => n.index !== index))!.index,
}));

const simulation = d3
  .forceSimulation(nodes)
  .velocityDecay(0.3)
  .force(
    'link',
    d3
      .forceLink<InitialNode, InitialLink>(links)
      .id((d) => d.index)
      .strength(1)
      .distance(30)
      .iterations(2)
  )
  .force('charge', d3.forceManyBody().strength(-150))
  .force(
    'center',
    d3.forceCenter(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2).strength(1)
  )
  .force('x', d3.forceX())
  .force('y', d3.forceY())
  .force('tick', ticked);

svg
  .append('defs')
  .append('marker')
  .attr('id', 'link-arrow')
  .attr('viewBox', '-5 -5 10 10')
  .attr('markerWidth', 4)
  .attr('markerHeight', 4)
  .attr('refX', 12)
  .attr('refY', 0)
  .attr('orient', 'auto')
  .append('path')
  .attr('d', 'M 0,0 m -5,-5 L 5,0 L -5,5 Z');

const linkLines = svg
  .append('g')
  .attr('class', 'links')
  .selectAll('line')
  .data(links)
  .enter()
  .append('line')
  .attr('data-from', (d) => String(d.index))
  .attr('stroke-width', 3) as unknown as LinkLines;

const getTargetIndex = (sourceIndex: number) =>
  (links as unknown as ModifiedLink[]).find(
    (link) => link.source.index == sourceIndex
  )?.target.index;

const getTargetElem = (sourceIndex: number) => {
  const targetId = getTargetIndex(sourceIndex);

  return svg
    .select<SVGCircleElement>(`circle[data-index="${targetId}"]`)
    .node()!;
};

const getAssociatedLink = (sourceIndex: number) => {
  return svg.select<SVGLineElement>(`line[data-from="${sourceIndex}"]`).node()!;
};

const dragstarted: CircleDragEventHandler = (event, elem) => {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  elem.fx = elem.x;
  elem.fy = elem.y;
};

const dragged: CircleDragEventHandler = (event, elem) => {
  elem.fx = event.x;
  elem.fy = event.y;
};

const dragended: CircleDragEventHandler = (event, elem) => {
  if (!event.active) simulation.alphaTarget(0);
  elem.fx = null;
  elem.fy = null;
};

const nodeCircles = (
  svg
    .append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(nodes) as unknown as NodeCircles
)
  .enter()
  .append('circle')
  .attr('data-index', (d) => d.index)
  .on('mouseover', function (event) {
    const sourceElem = event.target;
    const circleId = Number(sourceElem.dataset.index);
    const targetElem = getTargetElem(circleId);
    const associatedLink = getAssociatedLink(circleId);

    sourceElem.style.fill = 'blue';
    targetElem.style.fill = 'green';
    associatedLink?.setAttribute('marker-end', 'url(#link-arrow)');
  })
  .on('mouseout', function (event) {
    const sourceElem = event.target;
    const circleId = Number(sourceElem.dataset.index);
    const targetElem = getTargetElem(circleId);
    const associatedLink = getAssociatedLink(circleId);

    sourceElem.style.fill = 'red';
    targetElem.style.fill = 'red';
    associatedLink?.removeAttribute('marker-end');
  })
  .attr('r', 5)
  .attr('fill', function (d) {
    return 'red';
  })
  .call(
    d3
      .drag<SVGCircleElement, ModifiedNode>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
  );

function ticked() {
  linkLines
    .attr('x1', (d) => d.source.x!)
    .attr('y1', (d) => d.source.y!)
    .attr('x2', (d) => d.target.x!)
    .attr('y2', (d) => d.target.y!);
  nodeCircles.attr('cx', (d) => d.x!).attr('cy', (d) => d.y!);
}
