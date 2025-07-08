
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Horse, Owner, ParsedMessageAction } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    horseName: {
      type: Type.STRING,
      description: "The name of the horse mentioned in the message. Must match a name from the provided list. Leave empty if no specific horse is mentioned.",
      nullable: true,
    },
    ownerName: {
      type: Type.STRING,
      description: "The name of the owner associated with the horse. Must match a name from the provided list. Leave empty if no owner can be identified.",
      nullable: true,
    },
    actionType: {
      type: Type.STRING,
      enum: ['APPOINTMENT', 'TASK', 'QUERY'],
      description: "The type of action requested. 'APPOINTMENT' for scheduling, 'TASK' for a to-do item, or 'QUERY' for a general question.",
    },
    details: {
      type: Type.STRING,
      description: "A concise summary of the requested action or query. e.g., 'Book a vet appointment' or 'Schedule grooming'.",
    },
    date: {
      type: Type.STRING,
      description: "The specific date and time for the appointment or task, if mentioned. Format as ISO 8601 string (YYYY-MM-DDTHH:mm:ss). Today's date is " + new Date().toISOString().split('T')[0] + ". Leave empty if not specified.",
      nullable: true,
    },
  },
  required: ['actionType', 'details'],
};

export const parseWhatsAppMessage = async (
  message: string,
  horses: Horse[],
  owners: Owner[]
): Promise<ParsedMessageAction> => {
  try {
    const horseContext = horses.map(h => `- ${h.name} (Owners: ${h.owners.map(o => o.name).join(', ')})`).join('\n');
    const ownerContext = owners.map(o => `- ${o.name} (${o.phone})`).join('\n');

    const prompt = `
      Analyze the following message sent to a horse stable. Your task is to extract key information based on the provided context of horses and owners.

      **Message to Analyze:**
      "${message}"

      **Contextual Information:**
      - Today's date is: ${new Date().toISOString()}
      - List of Horses at the stable:
      ${horseContext}
      - List of Owners:
      ${ownerContext}

      **Instructions:**
      1.  Identify the horse the message is about. The name must match one from the list.
      2.  Identify the owner associated with that horse.
      3.  Determine the requested action: creating an APPOINTMENT, a TASK, or a general QUERY.
      4.  Summarize the action in the 'details' field.
      5.  If a date or time is mentioned, convert it to an ISO 8601 format string. If it's relative like "next Tuesday", calculate the actual date.
      6.  Return the data in the specified JSON format. If a horse cannot be confidently identified, return null for horseName.

    `;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    return parsedData as ParsedMessageAction;

  } catch (error) {
    console.error("Error parsing message with Gemini:", error);
    throw new Error("Failed to analyze message. Please try again.");
  }
};
