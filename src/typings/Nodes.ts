import { Selection } from 'd3';
import { SimulationNodeDatum } from 'd3-force';

export type InitialNode = {
  index: number;
};

export type ModifiedNode = SimulationNodeDatum & InitialNode;

export type NodeCircles = Selection<
  SVGLineElement,
  ModifiedNode,
  SVGElement,
  unknown
>;
