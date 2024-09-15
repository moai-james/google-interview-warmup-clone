'use client'

import { signIn } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Github } from "lucide-react"
import { useLanguage } from '@/context/LanguageContext'

export function AuthSigninPage() {
  const { language } = useLanguage();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = (event.currentTarget.elements.namedItem('email') as HTMLInputElement).value
    const password = (event.currentTarget.elements.namedItem('password') as HTMLInputElement).value
    const result = await signIn("credentials", { 
      redirect: false, 
      email, 
      password 
    })
    if (result?.error) {
      // Handle error
      console.error(result.error)
    } else {
      // Redirect to the home page on successful sign-in
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {language === 'en' ? 'Welcome back' : '歡迎回來'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {language === 'en' ? 'Sign in to your Interview Warmup account' : '登入您的面試熱身帳戶'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="sr-only">
                {language === 'en' ? 'Email address' : '電子郵件地址'}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder={language === 'en' ? 'Email address' : '電子郵件地址'}
              />
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">
                {language === 'en' ? 'Password' : '密碼'}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder={language === 'en' ? 'Password' : '密碼'}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                {language === 'en' ? 'Remember me' : '記住我'}
              </Label>
            </div>

            <div className="text-sm">
              <Link href="/auth/forgot-password" className="font-medium text-primary hover:text-primary-dark">
                {language === 'en' ? 'Forgot your password?' : '忘記密碼？'}
              </Link>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              {language === 'en' ? 'Sign in' : '登入'}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {language === 'en' ? 'Or continue with' : '或繼續使用'}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full" onClick={() => signIn('google')}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full" onClick={() => signIn('github')}>
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          {language === 'en' ? "Don't have an account?" : '還沒有帳戶？'}{" "}
          <Link href="/auth/signup" className="font-medium text-primary hover:text-primary-dark">
            {language === 'en' ? 'Sign up' : '註冊'}
          </Link>
        </p>
      </div>
    </div>
  )
}