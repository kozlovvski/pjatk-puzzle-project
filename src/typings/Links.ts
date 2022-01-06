import { Selection } from 'd3';
import { ModifiedNode } from './Nodes';

export type InitialLink = {
  index: number;
  source: number;
  target: number;
};

export type ModifiedLink = {
  index: number;
  source: ModifiedNode;
  target: ModifiedNode;
};

export type LinkLines = Selection<
  SVGLineElement,
  ModifiedLink,
  SVGElement,
  unknown
>;
