'use client'

import { useState, useRef } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { AlertCircle, Upload } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSession } from 'next-auth/react'
import { useLanguage } from '@/context/LanguageContext'
import { useRouter } from 'next/navigation'

export default function UserProfile() {
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()
  const { language: contextLanguage, setLanguage } = useLanguage()
  const router = useRouter()

  const [name, setName] = useState(session?.user?.name || '')
  const [email, setEmail] = useState(session?.user?.email || '')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        if (selectedFile.size <= 5 * 1024 * 1024) { // 5MB limit
          setFile(selectedFile)
          setFileError(null)
        } else {
          setFileError('File size exceeds 5MB limit')
        }
      } else {
        setFileError('Please upload a PDF file')
      }
    }
  }

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('User data to be saved:', { name, email, language: contextLanguage, resume: file ? file.name : null });

      // Update the session data
      if (session?.user) {
        session.user.name = name;
        session.user.email = email;
      }

      // Show a success message
      alert(contextLanguage === 'en' ? 'Profile updated successfully' : '個人資料更新成功');
    } catch (error) {
      console.error('Error saving user data:', error);
      setSaveError(contextLanguage === 'en' ? 'Failed to save changes' : '保存更改失敗');
    } finally {
      setIsSaving(false);
    }
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{contextLanguage === 'en' ? 'User Profile' : '用戶資料'}</CardTitle>
          <CardDescription>{contextLanguage === 'en' ? 'Manage your account settings and preferences.' : '管理您的帳戶設置和偏好。'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">{contextLanguage === 'en' ? 'General' : '一般'}</TabsTrigger>
              <TabsTrigger value="resumes">{contextLanguage === 'en' ? 'Resumes' : '履歷'}</TabsTrigger>
              <TabsTrigger value="billing">{contextLanguage === 'en' ? 'Billing' : '帳單'}</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{contextLanguage === 'en' ? 'Name' : '名字'}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{contextLanguage === 'en' ? 'Email' : '電子郵件'}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">{contextLanguage === 'en' ? 'Language' : '語言'}</Label>
                  <Select value={contextLanguage} onValueChange={(value) => setLanguage(value as 'en' | 'zh')}>
                    <SelectTrigger>
                      <SelectValue placeholder={contextLanguage === 'en' ? 'Select language' : '選擇語言'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="zh">繁體中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="resumes">
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="resume">{contextLanguage === 'en' ? 'Upload Resume (PDF, max 5MB)' : '上傳履歷（PDF，最大 5MB）'}</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                    >
                      <Upload className="mr-2 h-4 w-4" /> {contextLanguage === 'en' ? 'Select File' : '選擇檔案'}
                    </Button>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    {file && <span className="text-sm text-muted-foreground">{file.name}</span>}
                  </div>
                  {fileError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{contextLanguage === 'en' ? 'Error' : '錯誤'}</AlertTitle>
                      <AlertDescription>{fileError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="billing">
              <div className="space-y-4 mt-4">
                <p>{contextLanguage === 'en' ? 'Billing information and settings will be displayed here.' : '帳單資訊和設置將顯示在這裡。'}</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSave}>
            {isSaving
              ? (contextLanguage === 'en' ? 'Saving...' : '保存中...')
              : (contextLanguage === 'en' ? 'Save Changes' : '保存更改')}
          </Button>
        </CardFooter>
        {saveError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{contextLanguage === 'en' ? 'Error' : '錯誤'}</AlertTitle>
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  )
}