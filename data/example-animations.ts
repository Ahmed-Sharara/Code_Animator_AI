
import { AnimationPlan } from '../types';

interface ExampleAnimation {
    title: string;
    description: string;
    plan: AnimationPlan;
}

export const exampleAnimations: ExampleAnimation[] = [
    {
        title: "Bubble Sort",
        description: "Visualize how the Bubble Sort algorithm repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        plan: {
            scene: { width: 800, height: 400 },
            elements: [
                { id: 'title', type: 'text', style: { content: 'Bubble Sort', top: '20px', left: '320px', fontSize: 'text-2xl', color: 'text-white', opacity: 0 } },
                {
                    id: 'array', type: 'array', style: { top: '100px', left: '150px', width: '500px', height: '80px', opacity: 0 },
                    children: [
                        { id: 'cell-0', type: 'box', style: { content: '5', top: '0', left: '0px', width: '70px', height: '70px', backgroundColor: 'bg-gray-700', borderColor: 'border-gray-500' } },
                        { id: 'cell-1', type: 'box', style: { content: '1', top: '0', left: '80px', width: '70px', height: '70px', backgroundColor: 'bg-gray-700', borderColor: 'border-gray-500' } },
                        { id: 'cell-2', type: 'box', style: { content: '4', top: '0', left: '160px', width: '70px', height: '70px', backgroundColor: 'bg-gray-700', borderColor: 'border-gray-500' } },
                        { id: 'cell-3', type: 'box', style: { content: '2', top: '0', left: '240px', width: '70px', height: '70px', backgroundColor: 'bg-gray-700', borderColor: 'border-gray-500' } },
                        { id: 'cell-4', type: 'box', style: { content: '8', top: '0', left: '320px', width: '70px', height: '70px', backgroundColor: 'bg-gray-700', borderColor: 'border-gray-500' } },
                    ],
                },
                { id: 'pointer-i', type: 'pointer', style: { content: 'i', top: '180px', left: '175px', width: '20px', height: '20px', opacity: 0, color: 'text-sky-300' } },
                { id: 'pointer-j', type: 'pointer', style: { content: 'j', top: '180px', left: '255px', width: '20px', height: '20px', opacity: 0, color: 'text-emerald-300' } },
            ],
            steps: [
                { description: "Initial setup of the array for Bubble Sort.", actions: [{ elementId: 'title', type: 'FADE_IN', payload: {} }, { elementId: 'array', type: 'FADE_IN', payload: {} }], duration: 1000 },
                { description: "We start by comparing the first two elements.", actions: [{ elementId: 'pointer-i', type: 'FADE_IN', payload: {} }, { elementId: 'pointer-j', type: 'FADE_IN', payload: {} }, { elementId: 'cell-0', type: 'UPDATE', payload: { borderColor: 'border-sky-400' } }, { elementId: 'cell-1', type: 'UPDATE', payload: { borderColor: 'border-emerald-400' } }], duration: 1500 },
                { description: "Since 5 > 1, we swap them.", actions: [{ elementId: 'cell-0', type: 'UPDATE', payload: { left: '80px', content: '1' } }, { elementId: 'cell-1', type: 'UPDATE', payload: { left: '0px', content: '5' } }], duration: 2000 },
                { description: "Reset borders and move to the next pair.", actions: [{ elementId: 'cell-0', type: 'UPDATE', payload: { borderColor: 'border-gray-500' } }, { elementId: 'cell-1', type: 'UPDATE', payload: { borderColor: 'border-gray-500' } }, { elementId: 'pointer-i', type: 'UPDATE', payload: { left: '255px' } }, { elementId: 'pointer-j', type: 'UPDATE', payload: { left: '335px' } }], duration: 1500 },
                { description: "Comparing 5 and 4. Since 5 > 4, we swap.", actions: [{ elementId: 'cell-0', type: 'UPDATE', payload: { borderColor: 'border-sky-400' } }, { elementId: 'cell-2', type: 'UPDATE', payload: { borderColor: 'border-emerald-400', left: '80px', content: '4' } }, { elementId: 'cell-0', type: 'UPDATE', payload: { left: '160px', content: '5' } }], duration: 2000 },
                { description: "Reset borders and move to the next pair.", actions: [{ elementId: 'cell-0', type: 'UPDATE', payload: { borderColor: 'border-gray-500' } }, { elementId: 'cell-2', type: 'UPDATE', payload: { borderColor: 'border-gray-500' } }, { elementId: 'pointer-i', type: 'UPDATE', payload: { left: '335px' } }, { elementId: 'pointer-j', type: 'UPDATE', payload: { left: '415px' } }], duration: 1500 },
                { description: "Comparing 5 and 2. Since 5 > 2, we swap.", actions: [{ elementId: 'cell-2', type: 'UPDATE', payload: { borderColor: 'border-sky-400' } }, { elementId: 'cell-3', type: 'UPDATE', payload: { borderColor: 'border-emerald-400', left: '160px', content: '2' } }, { elementId: 'cell-2', type: 'UPDATE', payload: { left: '240px', content: '5' } }], duration: 2000 },
                { description: "The largest element, 8, is already at the end. First pass is complete.", actions: [{ elementId: 'cell-4', type: 'UPDATE', payload: { backgroundColor: 'bg-emerald-800' } }], duration: 2000 },
                { description: "The process continues until the array is fully sorted.", actions: [], duration: 2000 },
            ]
        }
    },
    {
        title: "JavaScript Closures",
        description: "Understand how a function remembers and continues to access variables from its outer scope, even after that scope has finished executing.",
        plan: {
            scene: { width: 800, height: 450 },
            elements: [
                { id: 'outer-scope', type: 'box', style: { top: '50px', left: '50px', width: '300px', height: '200px', backgroundColor: 'bg-gray-800', borderColor: 'border-sky-500', opacity: 0 } },
                { id: 'outer-title', type: 'text', style: { content: 'outerFunction() scope', top: '60px', left: '90px', color: 'text-sky-300', opacity: 0 } },
                { id: 'outer-var', type: 'text', style: { content: 'let outerVar = "Hello"', top: '100px', left: '90px', color: 'text-white', opacity: 0 } },
                { id: 'inner-scope', type: 'box', style: { top: '140px', left: '75px', width: '250px', height: '80px', backgroundColor: 'bg-gray-700', borderColor: 'border-emerald-500', opacity: 0 } },
                { id: 'inner-title', type: 'text', style: { content: 'innerFunction() scope', top: '150px', left: '110px', color: 'text-emerald-300', opacity: 0 } },
                { id: 'closure-text', type: 'text', style: { top: '300px', left: '50px', width: '300px', content: '', opacity: 0, color: 'text-gray-300' } },
                { id: 'code-display', type: 'code', style: { top: '50px', left: '400px', width: '350px', height: '250px', opacity: 0, whiteSpace: 'pre-wrap', content: 'function outer() {\n  let outerVar = "Hello";\n  function inner() {\n    console.log(outerVar);\n  }\n  return inner;\n}\n\nconst myClosure = outer();\nmyClosure(); // "Hello"' } }
            ],
            steps: [
                { description: 'First, we define an outer function that contains a variable and an inner function.', actions: [{ elementId: 'code-display', type: 'FADE_IN', payload: {} }], duration: 2000 },
                { description: 'When outerFunction is called, a new execution scope is created.', actions: [{ elementId: 'outer-scope', type: 'FADE_IN', payload: {} }, { elementId: 'outer-title', type: 'FADE_IN', payload: {} }, { elementId: 'outer-var', type: 'FADE_IN', payload: {} }], duration: 1500 },
                { description: 'Inside this scope, the variable "outerVar" is declared and initialized.', actions: [{ elementId: 'outer-var', type: 'UPDATE', payload: { transform: 'scale(1.1)' } }], duration: 1000 },
                { description: 'The inner function is also defined within this scope.', actions: [{ elementId: 'outer-var', type: 'UPDATE', payload: { transform: 'scale(1)' } }, { elementId: 'inner-scope', type: 'FADE_IN', payload: {} }, { elementId: 'inner-title', type: 'FADE_IN', payload: {} }], duration: 1500 },
                { description: 'outerFunction then returns the innerFunction.', actions: [{ elementId: 'inner-scope', type: 'UPDATE', payload: { top: '270px', left: '475px', height: '60px' } }, { elementId: 'inner-title', type: 'UPDATE', payload: { top: '285px', left: '500px' } }], duration: 2000 },
                { description: 'Even after outerFunction has finished, its scope and variables are gone... or are they?', actions: [{ elementId: 'outer-scope', type: 'FADE_OUT', payload: {} }, { elementId: 'outer-title', type: 'FADE_OUT', payload: {} }], duration: 1500 },
                { description: 'The returned inner function still holds a reference to its original environment. This is the closure!', actions: [{ elementId: 'outer-var', type: 'UPDATE', payload: { borderColor: 'border-yellow-400', borderWidth: 'border-2' } }, { elementId: 'closure-text', type: 'FADE_IN', payload: { content: 'The inner function "closes over" the outerVar, keeping it alive.' } }], duration: 2500 },
                { description: 'When we call the returned function, it can still access "outerVar".', actions: [{ elementId: 'closure-text', type: 'UPDATE', payload: { content: 'Executing the closure logs "Hello" because it remembers its lexical scope.' } }], duration: 2500 },
            ]
        }
    }
];
