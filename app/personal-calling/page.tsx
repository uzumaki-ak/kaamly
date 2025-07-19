"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Phone,
  Settings,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Home,
  ChevronRight,
  Copy,
  Play,
  Zap,
  Bot,
  User,
  PhoneCall,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PersonalConfig {
  id: string
  userId: string
  phoneNumber: string
  isActive: boolean
}

interface PersonalCallLog {
  id: string
  omnidimCallId: string
  phoneNumber: string
  callReason: string
  status: string
  duration: number
  transcript: string
  summary: string
  createdAt: string
  appointment?: {
    id: string
    type: string
    providerName: string
    status: string
  }
}

export default function PersonalCallingPage() {
  const [config, setConfig] = useState<PersonalConfig | null>(null)
  const [callLogs, setCallLogs] = useState<PersonalCallLog[]>([])
  const [loading, setLoading] = useState(true)
  const [calling, setCalling] = useState(false)
  const [setupForm, setSetupForm] = useState({
    userPhone: "",
    userName: "",
    userEmail: "anikeshuzumaki@gmail.com",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchConfig()
    fetchCallLogs()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch(`/api/personal-calling/setup?userEmail=${setupForm.userEmail}`)
      const data = await response.json()
      if (data.success && data.config) {
        setConfig(data.config)
        setSetupForm({
          userPhone: data.config.phoneNumber,
          userName: data.user?.name || "",
          userEmail: data.user?.email || setupForm.userEmail,
        })
      }
    } catch (error) {
      console.error("Error fetching config:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCallLogs = async () => {
    try {
      const response = await fetch(`/api/personal-calling/call-logs?userEmail=${setupForm.userEmail}`)
      const data = await response.json()
      if (data.success) {
        setCallLogs(data.callLogs)
      }
    } catch (error) {
      console.error("Error fetching call logs:", error)
    }
  }

  const saveConfig = async () => {
    try {
      const response = await fetch("/api/personal-calling/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setupForm),
      })

      const data = await response.json()
      if (data.success) {
        setConfig(data.config)
        toast({
          title: "Configuration Saved! 🎉",
          description: "Saloni AI can now call your number",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      })
    }
  }

  const callMe = async (reason = "greeting") => {
    if (!config?.phoneNumber) {
      toast({
        title: "Setup Required",
        description: "Please configure your phone number first",
        variant: "destructive",
      })
      return
    }

    try {
      setCalling(true)
      const response = await fetch("/api/personal-calling/call-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: setupForm.userEmail,
          callReason: reason,
          appointmentDetails: {
            type: "test call",
            providerName: "Personal Assistant",
            status: "active",
            scheduledTime: new Date().toISOString(),
          },
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: data.simulation ? "Call Simulated! 📞" : "Calling You Now! 📞",
          description: data.message,
          variant: data.simulation ? "default" : "default",
        })
        fetchCallLogs() // Refresh call logs
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: "Call Failed",
        description: "Unable to initiate call",
        variant: "destructive",
      })
    } finally {
      setCalling(false)
    }
  }

  const testCall = async (scenario: string) => {
    try {
      const response = await fetch("/api/personal-calling/test-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: setupForm.userEmail,
          scenario,
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: `${scenario} Test Completed! 📞`,
          description: data.message,
        })
        fetchCallLogs() // Refresh call logs
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run test",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied! 📋",
      description: "Text copied to clipboard",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-400" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "initiated":
        return <Phone className="h-4 w-4 text-blue-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
      case "failed":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "initiated":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px] opacity-20"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-white/10 rounded-xl w-1/3"></div>
            <div className="h-96 bg-white/5 rounded-xl border border-white/10"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px] opacity-20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Zap className="h-8 w-8 text-cyan-400" />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Task Executor
            </h1>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white">Personal Calling</span>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <PhoneCall className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-gray-300">Personal AI Calling</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              Saloni Calls
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Number
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Configure your phone number and let Saloni AI call you directly with appointment updates and reminders.
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-8 bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              Personal Calling Status
              <Badge
                className={
                  config
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-red-500/20 text-red-300 border-red-500/30"
                }
              >
                {config ? "Configured" : "Not Setup"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            {config ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">Your Phone Number</p>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{config.phoneNumber}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(config.phoneNumber)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">Status</p>
                  <p className="text-emerald-300 font-medium">Ready to Call You! 📞</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-4">No phone number configured yet</p>
                <p className="text-sm text-gray-400">Add your number in the Setup tab below</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Call Button */}
        {config && (
          <div className="text-center mb-8">
            <Button
              onClick={() => callMe("greeting")}
              disabled={calling}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg px-8 py-4 h-auto"
            >
              {calling ? (
                <>
                  <Phone className="h-5 w-5 mr-2 animate-pulse" />
                  Calling You...
                </>
              ) : (
                <>
                  <PhoneCall className="h-5 w-5 mr-2" />
                  Call Me Now!
                </>
              )}
            </Button>
            <p className="text-sm text-gray-400 mt-2">Saloni AI will call your number immediately</p>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="setup" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
            <TabsTrigger value="setup" className="data-[state=active]:bg-white/10 text-white">
              <Settings className="h-4 w-4 mr-2" />
              Setup
            </TabsTrigger>
            <TabsTrigger value="calls" className="data-[state=active]:bg-white/10 text-white">
              <Phone className="h-4 w-4 mr-2" />
              My Calls
            </TabsTrigger>
            <TabsTrigger value="test" className="data-[state=active]:bg-white/10 text-white">
              <Play className="h-4 w-4 mr-2" />
              Test
            </TabsTrigger>
          </TabsList>

          {/* Setup Tab */}
          <TabsContent value="setup">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Configure Your Phone Number</CardTitle>
                <p className="text-gray-300 text-sm">Enter your details so Saloni AI can call you directly</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Your Phone Number</label>
                    <Input
                      value={setupForm.userPhone}
                      onChange={(e) => setSetupForm({ ...setupForm, userPhone: e.target.value })}
                      placeholder="+91-8744XXXXXX"
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />
                    <p className="text-xs text-gray-400">Include country code (e.g., +91 for India)</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Your Name</label>
                    <Input
                      value={setupForm.userName}
                      onChange={(e) => setSetupForm({ ...setupForm, userName: e.target.value })}
                      placeholder="Your Name"
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email</label>
                    <Input
                      value={setupForm.userEmail}
                      onChange={(e) => setSetupForm({ ...setupForm, userEmail: e.target.value })}
                      placeholder="your-email@gmail.com"
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <Button
                  onClick={saveConfig}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  disabled={!setupForm.userPhone}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>

                {/* Instructions */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                  <h4 className="font-medium text-blue-300 mb-4 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    How Personal Calling Works
                  </h4>
                  <ol className="space-y-2 text-sm text-blue-200">
                    <li>1. Enter your phone number with country code</li>
                    <li>2. Saloni AI will call YOU directly when needed</li>
                    <li>3. Get appointment updates, reminders, and confirmations</li>
                    <li>4. Have natural conversations with your AI assistant</li>
                    <li>5. All calls are logged and tracked for your reference</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Call Logs Tab */}
          <TabsContent value="calls">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Phone className="h-5 w-5" />
                  Your Call History
                  <Badge className="bg-white/10 text-gray-300 border-white/20">{callLogs.length} calls</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {callLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <Phone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No calls yet</h3>
                    <p className="text-gray-300 mb-6">When Saloni calls you, the history will appear here</p>
                    <Button
                      onClick={() => callMe("greeting")}
                      disabled={!config || calling}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <PhoneCall className="h-4 w-4 mr-2" />
                      {calling ? "Calling..." : "Test Call Now"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {callLogs.map((log) => (
                      <div
                        key={log.id}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(log.status)}
                              <span className="font-medium text-white capitalize">
                                {log.callReason.replace(/_/g, " ")}
                              </span>
                              <Badge className={getStatusColor(log.status)}>{log.status}</Badge>
                            </div>

                            <p className="text-sm text-gray-300">{log.summary}</p>

                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>📞 {log.phoneNumber}</span>
                              <span>⏱️ {log.duration}s</span>
                              <span>🕒 {new Date(log.createdAt).toLocaleString()}</span>
                            </div>

                            {log.transcript && (
                              <details className="mt-2">
                                <summary className="text-xs text-blue-400 cursor-pointer hover:text-blue-300">
                                  View Transcript
                                </summary>
                                <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
                                  <pre className="text-xs text-gray-300 whitespace-pre-wrap">{log.transcript}</pre>
                                </div>
                              </details>
                            )}
                          </div>

                          {log.appointment && (
                            <div className="text-right">
                              <p className="text-sm font-medium text-white">{log.appointment.type}</p>
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                                {log.appointment.status}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test Tab */}
          <TabsContent value="test">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Test Call Scenarios</CardTitle>
                <p className="text-gray-300 text-sm">
                  Test different types of calls to see how Saloni AI will interact with you
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => testCall("greeting")}
                    className="h-24 bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 border flex flex-col items-center justify-center gap-2"
                    variant="outline"
                  >
                    <Bot className="h-6 w-6" />
                    <span>Greeting Call</span>
                  </Button>

                  <Button
                    onClick={() => testCall("appointment_reminder")}
                    className="h-24 bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 border flex flex-col items-center justify-center gap-2"
                    variant="outline"
                  >
                    <AlertCircle className="h-6 w-6" />
                    <span>Reminder Call</span>
                  </Button>

                  <Button
                    onClick={() => testCall("booking_confirmation")}
                    className="h-24 bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 border flex flex-col items-center justify-center gap-2"
                    variant="outline"
                  >
                    <CheckCircle className="h-6 w-6" />
                    <span>Confirmation Call</span>
                  </Button>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                  <h4 className="font-medium text-yellow-300 mb-2 flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Test Features
                  </h4>
                  <ul className="space-y-1 text-sm text-yellow-200">
                    <li>• Simulates different call scenarios</li>
                    <li>• Creates realistic call logs and transcripts</li>
                    <li>• Tests your phone number configuration</li>
                    <li>• No actual calls made (for testing only)</li>
                  </ul>
                </div>

                {config && (
                  <div className="text-center">
                    <Button
                      onClick={() => callMe("test_real_call")}
                      disabled={calling}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                    >
                      {calling ? (
                        <>
                          <Phone className="h-4 w-4 mr-2 animate-pulse" />
                          Making Real Call...
                        </>
                      ) : (
                        <>
                          <PhoneCall className="h-4 w-4 mr-2" />
                          Make Real Call to {config.phoneNumber}
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-400 mt-2">This will actually call your number!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
