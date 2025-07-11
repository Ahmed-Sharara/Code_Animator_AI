
export type ElementType = 'box' | 'text' | 'code' | 'pointer' | 'array';
export type ActionType = 'UPDATE' | 'FADE_IN' | 'FADE_OUT';

export interface AnimationElementStyle {
  top?: string;
  left?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  borderColor?: string;
  color?: string;
  opacity?: number;
  content?: string;
  fontSize?: string;
  zIndex?: number;
  transform?: string;
  transformOrigin?: string;
  borderWidth?: string;
  borderStyle?: string;
  whiteSpace?: 'pre-wrap' | 'normal';
}

export interface AnimationElement {
  id: string;
  type: ElementType;
  style: AnimationElementStyle;
  children?: AnimationElement[];
}

export interface AnimationAction {
  elementId: string;
  type: ActionType;
  payload: Partial<AnimationElementStyle>;
}

export interface AnimationStep {
  description: string;
  actions: AnimationAction[];
  duration?: number; // Optional: duration of this step in milliseconds
}

export interface AnimationPlan {
  scene: {
    width: number;
    height: number;
  };
  elements: AnimationElement[];
  steps: AnimationStep[];
}
