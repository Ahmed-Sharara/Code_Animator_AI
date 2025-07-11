
import React from 'react';
import { AnimationElement, AnimationElementStyle, ElementType } from '../types';

interface AnimationCanvasProps {
  elements: AnimationElement[];
  scene: { width: number; height: number };
}

const getStyle = (style: AnimationElementStyle): React.CSSProperties => {
  return {
    top: style.top,
    left: style.left,
    width: style.width,
    height: style.height,
    opacity: style.opacity,
    transform: style.transform,
    transformOrigin: style.transformOrigin,
    zIndex: style.zIndex,
    whiteSpace: style.whiteSpace
  };
};

const getClassName = (style: AnimationElementStyle): string => {
  return [
    style.backgroundColor,
    style.borderColor,
    style.color,
    style.fontSize,
    style.borderWidth,
    style.borderStyle,
  ].filter(Boolean).join(' ');
};

const RenderElement: React.FC<{ element: AnimationElement }> = ({ element }) => {
  const baseClasses = 'absolute transition-all duration-700 ease-in-out';
  const style = getStyle(element.style);
  const classNames = getClassName(element.style);

  const renderContent = (type: ElementType, el: AnimationElement) => {
    switch (type) {
      case 'code':
        return (
          <pre className="font-mono p-4 text-left w-full h-full overflow-auto">
            <code>{el.style.content}</code>
          </pre>
        );
      case 'array':
        return (
          <div className="flex flex-row w-full h-full">
            {el.children?.map(child => <RenderElement key={child.id} element={child} />)}
          </div>
        );
      case 'box':
        return (
          <div className="flex items-center justify-center w-full h-full font-mono">
            {el.style.content}
          </div>
        );
      case 'text':
      case 'pointer':
      default:
        return el.style.content;
    }
  };

  const commonClasses = 'p-2 flex items-center justify-center rounded-lg';
  const typeSpecificClasses = {
      box: 'border',
      text: 'bg-transparent',
      code: 'bg-gray-900 border border-gray-600 shadow-lg',
      pointer: 'border-2 border-sky-400',
      array: ''
  }

  return (
    <div
      style={style}
      className={`${baseClasses} ${commonClasses} ${typeSpecificClasses[element.type]} ${classNames}`}
    >
      {renderContent(element.type, element)}
    </div>
  );
};


const AnimationCanvas: React.FC<AnimationCanvasProps> = ({ elements, scene }) => {
  return (
    <div
      className="relative bg-gray-900/70 border border-gray-700 rounded-lg overflow-hidden flex-grow w-full"
      style={{ minHeight: `${scene.height}px` }}
    >
      <div className="absolute" style={{ width: `${scene.width}px`, height: `${scene.height}px` }}>
        {elements.map((element) => (
          <RenderElement key={element.id} element={element} />
        ))}
      </div>
    </div>
  );
};

export default AnimationCanvas;
