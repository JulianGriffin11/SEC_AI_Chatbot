import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Logo } from '@/components/Logo'
import { UserMenu } from '@/components/chat/UserMenu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from '@/components/ui/sidebar'
import { useThreads } from '@/hooks/useThreads'
import type { ThreadSummary } from '@/lib/chat'
import { groupByRecency } from '@/lib/format'

export function ThreadSidebar() {
  const navigate = useNavigate()
  const { threadId } = useParams()
  const { setOpenMobile, isMobile } = useSidebar()
  const { threads, isLoading, error, createNewThread, deleteThread } = useThreads()
  const [isCreating, setIsCreating] = useState(false)
  const [threadToDelete, setThreadToDelete] = useState<ThreadSummary | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const groups = groupByRecency(threads, (thread) => thread.updatedAt)

  async function handleNewChat() {
    setIsCreating(true)
    try {
      const id = await createNewThread()
      navigate(`/chats/${id}`)
      if (isMobile) setOpenMobile(false)
    } finally {
      setIsCreating(false)
    }
  }

  async function handleDeleteThread() {
    if (!threadToDelete) return

    setIsDeleting(true)
    try {
      await deleteThread(threadToDelete.id)
      toast.success('Conversation deleted')

      if (threadToDelete.id === threadId) {
        navigate('/chats', { replace: true })
      }

      if (isMobile) setOpenMobile(false)
      setThreadToDelete(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not delete conversation.'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Sidebar className="border-r border-gray-200 bg-gray-50">
        <SidebarHeader className="gap-3 p-3 border-b border-gray-200">
          <Logo className="px-1 py-1" />
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 hover:border-gray-400 transition-smooth"
            onClick={() => void handleNewChat()}
            disabled={isCreating}
          >
            <Plus className="size-4" />
            {isCreating ? 'Creating…' : 'New chat'}
          </Button>
        </SidebarHeader>

        <SidebarContent className="px-1">
          {isLoading ? (
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuSkeleton />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : null}

          {!isLoading && error ? (
            <p className="px-3 py-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          {!isLoading && !error && threads.length === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-500">No conversations yet.</p>
          ) : null}

          {!isLoading && !error
            ? groups.map((group) => (
                <SidebarGroup key={group.label}>
                  <SidebarGroupLabel className="text-gray-600">{group.label}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((thread) => (
                        <SidebarMenuItem key={thread.id}>
                          <SidebarMenuButton
                            asChild
                            isActive={thread.id === threadId}
                            tooltip={thread.title}
                            className="hover:bg-white hover:border-gray-300 transition-smooth"
                          >
                            <Link
                              to={`/chats/${thread.id}`}
                              onClick={() => {
                                if (isMobile) setOpenMobile(false)
                              }}
                            >
                              <span className="truncate text-gray-900">{thread.title}</span>
                            </Link>
                          </SidebarMenuButton>
                          <SidebarMenuAction
                            showOnHover
                            aria-label={`Delete conversation: ${thread.title}`}
                            title="Delete conversation"
                            className="text-gray-400 hover:bg-red-50 hover:text-red-600 transition-smooth"
                            disabled={isDeleting}
                            onClick={(event) => {
                              event.preventDefault()
                              event.stopPropagation()
                              setThreadToDelete(thread)
                            }}
                          >
                            {isDeleting && threadToDelete?.id === thread.id ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Trash2 />
                            )}
                          </SidebarMenuAction>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))
            : null}
        </SidebarContent>

        <SidebarFooter className="border-t border-gray-200">
          <UserMenu />
        </SidebarFooter>
      </Sidebar>

      <AlertDialog
        open={threadToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setThreadToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete this conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete “{threadToDelete?.title}” and its message history.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault()
                void handleDeleteThread()
              }}
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
