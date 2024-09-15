'use client'

import { useSession } from 'next-auth/react'
import { AuthSigninPage } from '@/components/app-auth-signin-page'
import { InterviewWarmupComponent } from '@/components/interview-warmup'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    console.log('Session status:', status)
    console.log('Session data:', session)
    if (status === 'unauthenticated') {
      console.log('User is unauthenticated, redirecting to signin page')
      router.push('/auth/signin')
    }
  }, [status, router, session])

  if (status === 'loading') {
    console.log('Session is loading')
    return <div>Loading...</div>
  }

  if (status === 'authenticated' && session) {
    console.log('User is authenticated, rendering InterviewWarmupComponent')
    return <InterviewWarmupComponent />
  }

  console.log('Rendering AuthSigninPage')
  return <AuthSigninPage />
}