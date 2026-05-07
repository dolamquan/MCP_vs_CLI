import {encodingForModel, getEncoding} from "js-tiktoken";


export type SupportedTokenizerModel =
  | "gpt-4"
  | "gpt-4o"
  | "gpt-4o-mini"
  | "gpt-3.5-turbo";


export const countTokens = (
    text: string,
    model: SupportedTokenizerModel = "gpt-4o-mini"
): number =>{
    if(!text || text.length === 0) return 0;

    const cleanedText = text.trim();

    if (cleanedText.length === 0) return 0;


    const encoding = encodingForModel(model);
    const tokens = encoding.encode(cleanedText);


    /*
     * Fallback encoder: getEncoding("cl100k_base") is a more general encoder that can be used if the specific model encoding is not available. It may not be as optimized 
     * for the specific model, but it will still provide a token count. 
     */

    return tokens.length;
}


