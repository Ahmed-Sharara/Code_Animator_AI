
import { GoogleGenAI, Type } from "@google/genai";
import { AnimationPlan } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the detailed schema for the style properties, which is used in multiple places.
const styleSchemaProperties = {
    type: Type.OBJECT,
    properties: {
        top: { type: Type.STRING, description: "CSS top position (e.g., '10px', '20%')" },
        left: { type: Type.STRING, description: "CSS left position (e.g., '10px', '20%')" },
        width: { type: Type.STRING, description: "CSS width (e.g., '100px', '50%')" },
        height: { type: Type.STRING, description: "CSS height (e.g., '100px', '50%')" },
        backgroundColor: { type: Type.STRING, description: "TailwindCSS background color class (e.g., 'bg-sky-500')" },
        borderColor: { type: Type.STRING, description: "TailwindCSS border color class (e.g., 'border-red-500')" },
        color: { type: Type.STRING, description: "TailwindCSS text color class (e.g., 'text-white')" },
        opacity: { type: Type.NUMBER, description: "Opacity from 0 to 1" },
        content: { type: Type.STRING, description: "Text or code content of the element" },
        fontSize: { type: Type.STRING, description: "TailwindCSS font size class (e.g., 'text-lg')" },
        zIndex: { type: Type.NUMBER, description: "CSS z-index" },
        transform: { type: Type.STRING, description: "CSS transform property (e.g., 'rotate(45deg)')" },
        transformOrigin: { type: Type.STRING, description: "CSS transform-origin property (e.g., '0 0')" },
        borderWidth: { type: Type.STRING, description: "TailwindCSS border width class (e.g., 'border-2')" },
        borderStyle: { type: Type.STRING, description: "TailwindCSS border style class (e.g., 'border-dashed')" },
        whiteSpace: { type: Type.STRING, enum: ['pre-wrap', 'normal'], description: "CSS white-space property" },
    }
};

// Define a schema for a *base* element that CANNOT have children.
// This is used for items inside a container (like an array).
const baseElementSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "Unique identifier for the element." },
        type: {
            type: Type.STRING,
            // An element inside a container cannot itself be a container.
            enum: ['box', 'text', 'code', 'pointer'],
            description: "The type of non-container element to render."
        },
        style: styleSchemaProperties,
    },
    required: ['id', 'type', 'style'],
};

// Define the schema for a top-level element, which CAN have children.
// This prevents infinite recursion in the schema definition.
const topLevelElementSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "Unique identifier for the element." },
        type: {
            type: Type.STRING,
            enum: ['box', 'text', 'code', 'pointer', 'array'],
            description: "The type of element to render."
        },
        style: styleSchemaProperties,
        children: {
            type: Type.ARRAY,
            description: "Child elements for composite elements like 'array'. Child elements cannot have their own children.",
            items: baseElementSchema // Reference the non-recursive schema here.
        }
    },
    required: ['id', 'type', 'style'],
};


// Define the final schema for the entire animation plan.
const animationPlanSchema = {
    type: Type.OBJECT,
    properties: {
        scene: {
            type: Type.OBJECT,
            properties: {
                width: { type: Type.NUMBER, description: "The width of the animation canvas in pixels." },
                height: { type: Type.NUMBER, description: "The height of the animation canvas in pixels." },
            },
            required: ['width', 'height'],
        },
        elements: {
            type: Type.ARRAY,
            description: "The initial set of elements on the canvas.",
            items: topLevelElementSchema, // Use the schema that allows one level of nesting.
        },
        steps: {
            type: Type.ARRAY,
            description: "The sequence of animation steps.",
            items: {
                type: Type.OBJECT,
                properties: {
                    description: { type: Type.STRING, description: "Text description of what is happening in this step." },
                    actions: {
                        type: Type.ARRAY,
                        description: "The actions to perform in this step.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                elementId: { type: Type.STRING, description: "The ID of the element to animate." },
                                type: {
                                    type: Type.STRING,
                                    enum: ['UPDATE', 'FADE_IN', 'FADE_OUT'],
                                    description: "The type of action to perform."
                                },
                                payload: {
                                    ...styleSchemaProperties,
                                    description: "The style properties to apply for an 'UPDATE' action."
                                },
                            },
                            required: ['elementId', 'type'],
                        },
                    },
                    duration: { type: Type.NUMBER, description: "Optional duration for this step in milliseconds." },
                },
                required: ['description', 'actions'],
            },
        },
    },
    required: ['scene', 'elements', 'steps'],
};


const systemInstruction = `
You are an expert programming instructor and a masterful visual storyteller. Your mission is to transform abstract programming concepts into clear, engaging, and **technically accurate** animations.
You will receive a user's query and must generate a single, valid JSON object that represents a complete animation plan, adhering strictly to the provided JSON schema.

**Core Principles for Animation Design:**
1.  **Technical Accuracy:** The animation MUST be a faithful and correct representation of the computer science concept.
2.  **Pedagogical Clarity:** The goal is to teach. Start simple. Each step's description must clearly explain BOTH the concept and the visual action. Write descriptions in a clear, narrative style suitable for text-to-speech.
3.  **Simplicity and Focus:** Avoid visual clutter. Use a minimal set of elements. Good color examples: \`bg-sky-500\`, \`bg-emerald-500\` for highlights; \`bg-gray-700\` for neutral elements.
4.  **Logical Pacing:** Use the \`duration\` property to control pacing. Shorter durations (e.g., 800ms) for simple highlights, longer durations (e.g., 2000ms) for complex movements.
5.  **Step Count Adherence:** Aim for a step count close to the user's target, but prioritize clarity. A range of +/- 3 steps is acceptable.

**Layout and Positioning Best Practices:**
- **Coordinate System:** All \`top\` and \`left\` positions are in pixels, relative to a scene of the specified \`scene.width\` and \`scene.height\`.
- **Centering:** To horizontally center an element, calculate its position. For a title, if the scene width is 800 and the title text box is 300px wide, its \`left\` should be \`'${(800-300)/2}px'\`.
- **Spacing:** Arrange elements with deliberate and consistent spacing. For example, when creating an array of boxes, leave a consistent gap (e.g., '10px') between each box.
- **Avoid Overlap:** Ensure that text elements, boxes, and other visual components do not overlap unless it's a specific part of the animation (e.g., a pointer moving over an element).
- **Readability:** Ensure text has enough padding within its container and is positioned with enough surrounding space to be easily readable.
- **Connectors:** To draw a line between elements, create a \`box\` element with a small height (e.g., \`height: '2px'\`). You must calculate the required length (\`width\`) and angle (\`transform: 'rotate(Ndeg)'\`) to connect two points. For this to work correctly, you MUST also set \`transformOrigin: '0 0'\` in the style and position the line from its starting point.

**Crucial JSON Formatting Rules:**
- Respond with ONLY the valid JSON object for the \`AnimationPlan\`. Do not wrap it in markdown.
- **All string values, including types like "FADE_IN", "UPDATE", "box", "text", etc., must be enclosed in double quotes.**
- Ensure all element \`id\` strings are unique.
- For actions of type 'FADE_IN' or 'FADE_OUT', the 'payload' should be an empty object: {}.
`;


export const generateAnimationPlan = async (prompt: string, numSteps: number): Promise<AnimationPlan> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate an animation plan for the following user query: "${prompt}". The animation should have approximately ${numSteps} steps.`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: animationPlanSchema,
      }
    });

    let jsonStr = response.text.trim();
    
    // In case Gemini still wraps the output in markdown fences
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);
    
    // Basic validation is still good practice
    if (!parsedData.scene || !parsedData.elements || !parsedData.steps) {
        throw new Error("Invalid animation plan structure received from API.");
    }

    return parsedData as AnimationPlan;
  } catch (error) {
    console.error("Error generating animation plan:", error);
    if (error instanceof Error) {
        // Check for specific Gemini API errors if possible
        const geminiError = (error as any).cause?.error;
        if(geminiError) {
          throw new Error(`The AI API returned an error: ${geminiError.message} (Code: ${geminiError.code})`);
        }
        if (error.message.toLowerCase().includes('json')) {
            throw new Error(`The AI returned a malformed response. This can be a temporary issue. Please try again. Error: ${error.message}`);
        }
        throw new Error(`Failed to generate or parse animation plan: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
};
