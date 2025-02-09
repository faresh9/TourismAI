declare module 'llamaai' {
    export interface LlamaAPIRequest {
      messages: {
        role: 'system' | 'user';
        content: string;
      }[];
      stream: boolean;
      temperature: number;
      max_tokens: number;
      response_format?: {
        type: string;
      };
    }
  
    export interface LlamaAPIResponse {
      choices: {
        message: {
          content: string;
        };
      }[];
    }
  
    export default class LlamaAI {
      constructor(apiKey: string);
      run(request: LlamaAPIRequest): Promise<LlamaAPIResponse>;
    }
  }