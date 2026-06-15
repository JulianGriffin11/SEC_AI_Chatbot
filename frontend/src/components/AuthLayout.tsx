import type { ReactNode } from 'react'

import { Logo } from '@/components/Logo'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type AuthLayoutProps = {
  title: string
  description?: string
  children: ReactNode
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-white p-4 animate-fade-in">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full opacity-40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-100 rounded-full opacity-30 blur-3xl" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full">
        <Logo />
        
        <Card className="w-full max-w-sm shadow-lg border border-gray-200">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
            {description ? (
              <CardDescription className="text-base text-gray-600">{description}</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className="animate-slide-up">{children}</CardContent>
        </Card>

        {/* Footer link area will be handled by child pages */}
      </div>
    </div>
  )
}
