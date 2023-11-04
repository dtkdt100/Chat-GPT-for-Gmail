import { Answer } from '../messaging'

export type Event =
  | {
      type: 'answer'
      data: Answer
    }
  | {
      type: 'done'
    }| {
      type: 'fuck',
      data: any
    }

export interface GenerateAnswerParams {
  prompt: string
  onEvent: (event: Event) => void
  signal?: AbortSignal
}

export interface Provider {
  generateAnswer(params: GenerateAnswerParams): Promise<{ cleanup?: () => void }>
}
