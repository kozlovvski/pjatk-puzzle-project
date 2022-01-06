import { D3DragEvent } from 'd3-drag';
import { ModifiedNode } from './Nodes';

export type DragEvent = D3DragEvent<SVGCircleElement, ModifiedNode, unknown>;

export type CircleDragEventHandler = (
  event: DragEvent,
  element: ModifiedNode
) => void;
