'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/context/LanguageContext'

export default function SignUpPage() {
  const { language } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send a request to your API to create a new user
    // For this example, we'll just log the email and password
    console.log('Sign up attempt with:', email, password)
    // After successful signup, you might want to sign the user in
    // await signIn('credentials', { email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {language === 'en' ? 'Create an account' : '創建帳戶'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {language === 'en' ? 'Sign up for Interview Warmup' : '註冊面試熱身'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">
                {language === 'en' ? 'Email address' : '電子郵件地址'}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder={language === 'en' ? 'Enter your email' : '輸入您的電子郵件'}
              />
            </div>
            <div>
              <Label htmlFor="password">
                {language === 'en' ? 'Password' : '密碼'}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder={language === 'en' ? 'Create a password' : '創建密碼'}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            {language === 'en' ? 'Sign up' : '註冊'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          {language === 'en' ? 'Already have an account?' : '已經有帳戶了？'}{' '}
          <Link href="/auth/signin" className="font-medium text-primary hover:text-primary-dark">
            {language === 'en' ? 'Sign in' : '登入'}
          </Link>
        </p>
      </div>
    </div>
  )
}