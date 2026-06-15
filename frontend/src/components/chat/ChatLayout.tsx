import { Outlet, useParams } from 'react-router-dom'

import { ThreadSidebar } from '@/components/chat/ThreadSidebar'
import { ThreadsProvider } from '@/components/chat/ThreadsProvider'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { useThreads } from '@/hooks/useThreads'

function ChatHeader() {
  const { threadId } = useParams()
  const { threads } = useThreads()
  const activeThread = threads.find((thread) => thread.id === threadId)

  return (
    <header className="flex h-16 shrink-0 items-center justify-center border-b border-gray-200 bg-white px-3 transition-smooth relative">
      <div className="absolute left-3">
        <SidebarTrigger className="text-gray-500 hover:text-gray-700 transition-smooth" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 text-center truncate max-w-md">
        {activeThread?.title ?? 'Document Copilot'}
      </h2>
    </header>
  )
}

export function ChatLayout() {
  return (
    <ThreadsProvider>
      <SidebarProvider>
        <div className="chat-app-shell w-full">
          <ThreadSidebar />
          <SidebarInset className="flex h-svh min-h-0 flex-col bg-white">
            <ChatHeader />
            <div className="flex min-h-0 flex-1 flex-col">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ThreadsProvider>
  )
}
