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
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface OmnidimConfig {
  id: string
  agentId: string
  phoneNumber: string
  agentName: string
  isActive: boolean
}

interface CallLog {
  id: string
  callId: string
  callerName: string
  salonName: string
  clientName: string
  appointmentStatus: string
  duration: number
  processed: boolean
  createdAt: string
  matchedAppointment?: {
    id: string
    type: string
    providerName: string
    status: string
  }
}

export default function OmnidimPage() {
  const [config, setConfig] = useState<OmnidimConfig | null>(null)
  const [callLogs, setCallLogs] = useState<CallLog[]>([])
  const [loading, setLoading] = useState(true)
  const [setupForm, setSetupForm] = useState({
    agentId: "",
    phoneNumber: "",
    agentName: "Saloni AI",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchConfig()
    fetchCallLogs()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/omnidim-integration/setup")
      const data = await response.json()
      if (data.success && data.config) {
        setConfig(data.config)
        setSetupForm({
          agentId: data.config.agentId,
          phoneNumber: data.config.phoneNumber,
          agentName: data.config.agentName,
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
      const response = await fetch("/api/omnidim-integration/call-logs")
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
      const response = await fetch("/api/omnidim-integration/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setupForm),
      })

      const data = await response.json()
      if (data.success) {
        setConfig(data.config)
        toast({
          title: "Configuration Saved! 🎉",
          description: "Your Omnidim agent is now connected",
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

  const simulateCall = async (scenario: string) => {
    try {
      const response = await fetch("/api/omnidim-integration/simulate-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }),
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: `${scenario} Call Simulated! 📞`,
          description: data.message,
        })
        fetchCallLogs() // Refresh call logs
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to simulate call",
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
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-emerald-400" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "rescheduled":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "rescheduled":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
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
          <span className="text-white">Omnidim Integration</span>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Phone className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-300">Omnidim Voice AI Integration</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              AI Receptionist
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Management
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Configure and manage your Omnidim AI agent that handles appointment confirmations from service providers.
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-8 bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              Integration Status
              <Badge
                className={
                  config
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-red-500/20 text-red-300 border-red-500/30"
                }
              >
                {config ? "Connected" : "Not Configured"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            {config ? (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">Agent Name</p>
                  <p className="text-white font-medium">{config.agentName}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">Phone Number</p>
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
                  <p className="text-sm text-gray-400 mb-1">Agent ID</p>
                  <p className="text-white font-medium text-xs">{config.agentId}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-4">No Omnidim agent configured yet</p>
                <p className="text-sm text-gray-400">Configure your agent in the Setup tab below</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="setup" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
            <TabsTrigger value="setup" className="data-[state=active]:bg-white/10 text-white">
              <Settings className="h-4 w-4 mr-2" />
              Setup
            </TabsTrigger>
            <TabsTrigger value="calls" className="data-[state=active]:bg-white/10 text-white">
              <Phone className="h-4 w-4 mr-2" />
              Call Logs
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
                <CardTitle className="text-white">Configure Omnidim Agent</CardTitle>
                <p className="text-gray-300 text-sm">Enter your Omnidim agent details to connect the AI receptionist</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Agent ID</label>
                    <Input
                      value={setupForm.agentId}
                      onChange={(e) => setSetupForm({ ...setupForm, agentId: e.target.value })}
                      placeholder="Your Omnidim agent ID"
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />
                    <p className="text-xs text-gray-400">Get this from your Omnidim dashboard</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Phone Number</label>
                    <Input
                      value={setupForm.phoneNumber}
                      onChange={(e) => setSetupForm({ ...setupForm, phoneNumber: e.target.value })}
                      placeholder="+1-XXX-XXX-XXXX"
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />
                    <p className="text-xs text-gray-400">The number providers will call</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Agent Name</label>
                    <Input
                      value={setupForm.agentName}
                      onChange={(e) => setSetupForm({ ...setupForm, agentName: e.target.value })}
                      placeholder="Saloni AI"
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Webhook URL</label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={`${window.location.origin}/api/omnidim-integration/webhook`}
                        readOnly
                        className="bg-white/5 border-white/20 text-white"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(`${window.location.origin}/api/omnidim-integration/webhook`)}
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400">Add this webhook URL to your Omnidim agent</p>
                  </div>
                </div>

                <Button
                  onClick={saveConfig}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                  disabled={!setupForm.agentId || !setupForm.phoneNumber}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>

                {/* Instructions */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                  <h4 className="font-medium text-blue-300 mb-4 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Setup Instructions
                  </h4>
                  <ol className="space-y-2 text-sm text-blue-200">
                    <li>1. Create your Omnidim agent at omnidim.io</li>
                    <li>2. Copy the Agent ID from your Omnidim dashboard</li>
                    <li>3. Get the phone number assigned to your agent</li>
                    <li>4. Add the webhook URL above to your agent configuration</li>
                    <li>5. Save the configuration here</li>
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
                  Recent Confirmation Calls
                  <Badge className="bg-white/10 text-gray-300 border-white/20">{callLogs.length} calls</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {callLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <Phone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No calls yet</h3>
                    <p className="text-gray-300 mb-6">When providers call your Omnidim number, they'll appear here</p>
                    <Button
                      onClick={() => simulateCall("confirmed")}
                      variant="outline"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Simulate Test Call
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
                              {getStatusIcon(log.appointmentStatus)}
                              <span className="font-medium text-white">{log.salonName || "Unknown Salon"}</span>
                              <Badge className={getStatusColor(log.appointmentStatus)}>
                                {log.appointmentStatus || "unknown"}
                              </Badge>
                              {log.processed && (
                                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                                  Processed
                                </Badge>
                              )}
                            </div>

                            <p className="text-sm text-gray-300">
                              Caller: {log.callerName} • Client: {log.clientName}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>📞 {log.callId}</span>
                              <span>⏱️ {log.duration}s</span>
                              <span>🕒 {new Date(log.createdAt).toLocaleString()}</span>
                            </div>
                          </div>

                          {log.matchedAppointment && (
                            <div className="text-right">
                              <p className="text-sm font-medium text-white">{log.matchedAppointment.type}</p>
                              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                                {log.matchedAppointment.status}
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
                  Simulate different types of confirmation calls to test your integration
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => simulateCall("confirmed")}
                    className="h-24 bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 border flex flex-col items-center justify-center gap-2"
                    variant="outline"
                  >
                    <CheckCircle className="h-6 w-6" />
                    <span>Confirmed Call</span>
                  </Button>

                  <Button
                    onClick={() => simulateCall("rescheduled")}
                    className="h-24 bg-yellow-500/10 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/20 border flex flex-col items-center justify-center gap-2"
                    variant="outline"
                  >
                    <AlertCircle className="h-6 w-6" />
                    <span>Rescheduled Call</span>
                  </Button>

                  <Button
                    onClick={() => simulateCall("cancelled")}
                    className="h-24 bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20 border flex flex-col items-center justify-center gap-2"
                    variant="outline"
                  >
                    <XCircle className="h-6 w-6" />
                    <span>Cancelled Call</span>
                  </Button>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                  <h4 className="font-medium text-yellow-300 mb-2 flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    How Testing Works
                  </h4>
                  <ul className="space-y-1 text-sm text-yellow-200">
                    <li>• Simulates calls from different salon providers</li>
                    <li>• Creates realistic call logs with extracted data</li>
                    <li>• Tests appointment matching and status updates</li>
                    <li>• No actual phone calls are made</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
