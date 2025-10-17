// src/utils.ts

/**
 * Cleans the raw string response from an AI model.
 * It intelligently extracts the JSON object, removing markdown code blocks
 * (like ```json ... ```) and any surrounding text or whitespace.
 * @param rawResponse The raw string returned by the AI.
 * @returns A clean string that is ready for JSON.parse().
 */
export function cleanAiResponse(rawResponse: string): string {
  // Find the first opening curly brace '{'
  const firstBracket = rawResponse.indexOf('{');

  // Find the last closing curly brace '}'
  const lastBracket = rawResponse.lastIndexOf('}');

  // If either is not found, the string is likely not valid JSON, return as is.
  if (firstBracket === -1 || lastBracket === -1) {
    return rawResponse;
  }

  // Extract the substring between the first '{' and the last '}'
  return rawResponse.substring(firstBracket, lastBracket + 1);
}
