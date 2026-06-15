import { useState } from 'react'
import type { ChatStatus } from 'ai'
import { ArrowUp, Square } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from '@/components/ui/prompt-input'

type ChatInputProps = {
  status: ChatStatus
  onSend: (text: string) => void
  onStop: () => void
}

export function ChatInput({ status, onSend, onStop }: ChatInputProps) {
  const [input, setInput] = useState('')
  const isBusy = status === 'submitted' || status === 'streaming'

  function submit() {
    const text = input.trim()
    if (!text || isBusy) return
    onSend(text)
    setInput('')
  }

  return (
    <div className="chat-input-shell border-t border-gray-200 bg-white px-4 pb-4 pt-4">
      <div className="mx-auto w-full max-w-3xl">
        <PromptInput
          value={input}
          onValueChange={setInput}
          isLoading={isBusy}
          onSubmit={submit}
          className="rounded-2xl border-gray-300 bg-gray-50 shadow-sm hover:bg-white transition-smooth focus-within:bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200"
        >
          <PromptInputTextarea placeholder="Ask about SEC filings…" />
          <PromptInputActions className="justify-end pt-1">
            {isBusy ? (
              <PromptInputAction tooltip="Stop">
                <Button 
                  type="button" 
                  size="icon" 
                  className="rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-smooth"
                  onClick={onStop}
                >
                  <Square className="size-4 fill-current" />
                </Button>
              </PromptInputAction>
            ) : (
              <PromptInputAction tooltip="Send">
                <Button
                  type="button"
                  size="icon"
                  className="rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-smooth shadow-sm"
                  onClick={submit}
                  disabled={input.trim() === ''}
                  aria-label="Send message"
                >
                  <ArrowUp className="size-4" />
                </Button>
              </PromptInputAction>
            )}
          </PromptInputActions>
        </PromptInput>
        <p className="mt-2 text-center text-xs text-gray-500">
          Answers are grounded in SEC filings. Verify citations before relying on them.
        </p>
      </div>
    </div>
  )
}
