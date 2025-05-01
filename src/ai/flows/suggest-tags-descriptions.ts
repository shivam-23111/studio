// 'use server';

/**
 * @fileOverview An AI agent that suggests relevant tags and descriptions for uploaded files.
 *
 * - suggestTagsDescriptions - A function that handles the tag and description suggestion process.
 * - SuggestTagsDescriptionsInput - The input type for the suggestTagsDescriptions function.
 * - SuggestTagsDescriptionsOutput - The return type for the suggestTagsDescriptions function.
 */

'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestTagsDescriptionsInputSchema = z.object({
  fileContent: z.string().describe('The content of the file as a string.'),
  fileName: z.string().describe('The name of the file.'),
});
export type SuggestTagsDescriptionsInput = z.infer<
  typeof SuggestTagsDescriptionsInputSchema
>;

const SuggestTagsDescriptionsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of suggested tags for the file.'),
  description:
    z.string().describe('A suggested description for the file.'),
});
export type SuggestTagsDescriptionsOutput = z.infer<
  typeof SuggestTagsDescriptionsOutputSchema
>;

export async function suggestTagsDescriptions(
  input: SuggestTagsDescriptionsInput
): Promise<SuggestTagsDescriptionsOutput> {
  return suggestTagsDescriptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTagsDescriptionsPrompt',
  input: {
    schema: z.object({
      fileContent: z
        .string()
        .describe('The content of the file as a string.'),
      fileName: z.string().describe('The name of the file.'),
    }),
  },
  output: {
    schema: z.object({
      tags: z
        .array(z.string())
        .describe('An array of suggested tags for the file.'),
      description:
        z.string().describe('A suggested description for the file.'),
    }),
  },
  prompt: `You are an AI assistant that suggests relevant tags and descriptions for uploaded files.

  Based on the content of the file, suggest a few relevant tags and a concise description.

  File Name: {{{fileName}}}
  File Content: {{{fileContent}}}

  Tags: 
  Description:
  `,
});

const suggestTagsDescriptionsFlow = ai.defineFlow<
  typeof SuggestTagsDescriptionsInputSchema,
  typeof SuggestTagsDescriptionsOutputSchema
>(
  {
    name: 'suggestTagsDescriptionsFlow',
    inputSchema: SuggestTagsDescriptionsInputSchema,
    outputSchema: SuggestTagsDescriptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
