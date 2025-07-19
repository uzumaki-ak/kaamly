// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import {
//   ChevronDown,
//   ChevronRight,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Search,
//   Star,
//   Phone,
//   MapPin,
//   Calendar,
//   Mail,
//   Download,
// } from "lucide-react"

// interface DetailedTaskStep {
//   step: string
//   status: "pending" | "completed" | "failed"
//   result?: any
//   error?: string
//   details?: any
//   timestamp?: string
// }

// interface DetailedStepViewerProps {
//   steps: DetailedTaskStep[]
//   taskId: string
// }

// export function DetailedStepViewer({ steps, taskId }: DetailedStepViewerProps) {
//   const [openSteps, setOpenSteps] = useState<number[]>([])

//   const toggleStep = (index: number) => {
//     setOpenSteps((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "completed":
//         return <CheckCircle className="h-5 w-5 text-green-500" />
//       case "failed":
//         return <XCircle className="h-5 w-5 text-red-500" />
//       case "pending":
//         return <Clock className="h-5 w-5 text-yellow-500" />
//       default:
//         return <Clock className="h-5 w-5 text-gray-400" />
//     }
//   }

//   const getStepIcon = (stepName: string) => {
//     switch (stepName.toLowerCase()) {
//       case "parse user request":
//         return <Search className="h-4 w-4" />
//       case "search providers":
//         return <MapPin className="h-4 w-4" />
//       case "select best option":
//         return <Star className="h-4 w-4" />
//       case "make appointment call":
//         return <Phone className="h-4 w-4" />
//       case "save appointment":
//         return <Calendar className="h-4 w-4" />
//       case "send confirmation email":
//         return <Mail className="h-4 w-4" />
//       default:
//         return <Clock className="h-4 w-4" />
//     }
//   }

//   const downloadCallLog = async (callLogId: string) => {
//     try {
//       const response = await fetch(`/api/call-logs/${callLogId}/download`)
//       const blob = await response.blob()
//       const url = URL.createObjectURL(blob)
//       const a = document.createElement("a")
//       a.href = url
//       a.download = `call-log-${callLogId}.pdf`
//       document.body.appendChild(a)
//       a.click()
//       document.body.removeChild(a)
//       URL.revokeObjectURL(url)
//     } catch (error) {
//       console.error("Error downloading call log:", error)
//     }
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h3 className="text-lg font-semibold">Task Execution Details</h3>
//         <Badge variant="outline">Task ID: {taskId}</Badge>
//       </div>

//       {steps.map((step, index) => (
//         <Card key={index} className="overflow-hidden">
//           <Collapsible open={openSteps.includes(index)} onOpenChange={() => toggleStep(index)}>
//             <CollapsibleTrigger asChild>
//               <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     {getStatusIcon(step.status)}
//                     {getStepIcon(step.step)}
//                     <CardTitle className="text-base">{step.step}</CardTitle>
//                     <Badge
//                       className={`${
//                         step.status === "completed"
//                           ? "bg-green-100 text-green-800"
//                           : step.status === "failed"
//                             ? "bg-red-100 text-red-800"
//                             : "bg-yellow-100 text-yellow-800"
//                       }`}
//                     >
//                       {step.status}
//                     </Badge>
//                   </div>
//                   {openSteps.includes(index) ? (
//                     <ChevronDown className="h-4 w-4" />
//                   ) : (
//                     <ChevronRight className="h-4 w-4" />
//                   )}
//                 </div>
//                 {step.timestamp && (
//                   <p className="text-xs text-gray-500 ml-11">{new Date(step.timestamp).toLocaleString()}</p>
//                 )}
//               </CardHeader>
//             </CollapsibleTrigger>

//             <CollapsibleContent>
//               <CardContent className="pt-0">
//                 {step.error && (
//                   <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
//                     <p className="text-sm text-red-700">{step.error}</p>
//                   </div>
//                 )}

//                 {step.details && (
//                   <div className="space-y-4">
//                     {/* Step 1: Parse Request Details */}
//                     {step.step === "Parse user request" && (
//                       <div className="space-y-3">
//                         <div className="bg-blue-50 p-3 rounded-md">
//                           <h4 className="font-medium text-blue-900">Original Input</h4>
//                           <p className="text-sm text-blue-800">{step.details.originalInput}</p>
//                         </div>
//                         <div className="bg-green-50 p-3 rounded-md">
//                           <h4 className="font-medium text-green-900">AI Analysis</h4>
//                           <pre className="text-sm text-green-800 whitespace-pre-wrap">{step.details.aiAnalysis}</pre>
//                         </div>
//                       </div>
//                     )}

//                     {/* Step 2: Search Providers Details */}
//                     {step.step === "Search providers" && (
//                       <div className="space-y-3">
//                         <div className="bg-purple-50 p-3 rounded-md">
//                           <h4 className="font-medium text-purple-900">Search Parameters</h4>
//                           <p className="text-sm text-purple-800">Query: {step.details.searchQuery}</p>
//                           <p className="text-sm text-purple-800">Method: {step.details.searchMethod}</p>
//                           <p className="text-sm text-purple-800">Results: {step.details.totalFound} providers found</p>
//                         </div>
//                         <div className="space-y-2">
//                           <h4 className="font-medium">Found Providers:</h4>
//                           {step.details.providers?.map((provider: any, idx: number) => (
//                             <div key={idx} className="border p-3 rounded-md bg-gray-50">
//                               <div className="flex justify-between items-start">
//                                 <div>
//                                   <p className="font-medium">{provider.name}</p>
//                                   <p className="text-sm text-gray-600">{provider.address}</p>
//                                   <p className="text-sm text-gray-600">📞 {provider.phone}</p>
//                                 </div>
//                                 <div className="text-right">
//                                   <p className="text-sm">⭐ {provider.rating}/5</p>
//                                   <p className="text-sm">{provider.priceRange}</p>
//                                   <p className="text-xs text-gray-500">{provider.distance}</p>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Step 3: Selection Details */}
//                     {step.step === "Select best option" && (
//                       <div className="space-y-3">
//                         <div className="bg-green-50 p-3 rounded-md border-l-4 border-green-400">
//                           <h4 className="font-medium text-green-900">Selected Provider</h4>
//                           <p className="text-sm text-green-800 font-medium">{step.details.selectedProvider?.name}</p>
//                           <p className="text-sm text-green-800">📍 {step.details.selectedProvider?.address}</p>
//                           <p className="text-sm text-green-800">
//                             ⭐ {step.details.selectedProvider?.rating}/5 | {step.details.selectedProvider?.priceRange}
//                           </p>
//                           <p className="text-sm text-green-700 mt-2 font-medium">
//                             Why selected: {step.details.selectedProvider?.whySelected}
//                           </p>
//                         </div>
//                         {step.details.alternativeOptions?.length > 0 && (
//                           <div>
//                             <h4 className="font-medium mb-2">Other Options Considered:</h4>
//                             {step.details.alternativeOptions.map((alt: any, idx: number) => (
//                               <div key={idx} className="text-sm text-gray-600 ml-4">
//                                 • {alt.name} (⭐ {alt.rating}/5, {alt.priceRange}) - {alt.reason}
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {/* Step 4: Call Details */}
//                     {step.step === "Make appointment call" && (
//                       <div className="space-y-3">
//                         <div className={`p-3 rounded-md ${step.details.callInitiated ? "bg-green-50" : "bg-red-50"}`}>
//                           <h4
//                             className={`font-medium ${step.details.callInitiated ? "text-green-900" : "text-red-900"}`}
//                           >
//                             Call Status: {step.details.callInitiated ? "Initiated Successfully" : "Failed"}
//                           </h4>
//                           <p className={`text-sm ${step.details.callInitiated ? "text-green-800" : "text-red-800"}`}>
//                             📞 {step.details.phoneNumber} ({step.details.providerName})
//                           </p>
//                           {step.details.vapiCallId && (
//                             <p className="text-xs text-gray-600">Call ID: {step.details.vapiCallId}</p>
//                           )}
//                         </div>

//                         {step.details.conversation && (
//                           <div className="bg-gray-50 p-3 rounded-md">
//                             <div className="flex items-center justify-between mb-2">
//                               <h4 className="font-medium">Call Transcript</h4>
//                               {step.details.callLogId && (
//                                 <Button
//                                   size="sm"
//                                   variant="outline"
//                                   onClick={() => downloadCallLog(step.details.callLogId)}
//                                   className="text-xs"
//                                 >
//                                   <Download className="h-3 w-3 mr-1" />
//                                   Download
//                                 </Button>
//                               )}
//                             </div>
//                             <div className="space-y-2 max-h-60 overflow-y-auto">
//                               {step.details.conversation.conversation?.map((msg: any, idx: number) => (
//                                 <div
//                                   key={idx}
//                                   className={`p-2 rounded text-sm ${
//                                     msg.speaker === "AI_Assistant"
//                                       ? "bg-blue-100 text-blue-900"
//                                       : msg.speaker === "Staff"
//                                         ? "bg-green-100 text-green-900"
//                                         : "bg-gray-100 text-gray-700"
//                                   }`}
//                                 >
//                                   <div className="flex justify-between items-start mb-1">
//                                     <span className="font-medium text-xs">
//                                       {msg.speaker === "AI_Assistant"
//                                         ? "🤖 AI Assistant"
//                                         : msg.speaker === "Staff"
//                                           ? "👤 Staff"
//                                           : "⚠️ System"}
//                                     </span>
//                                     <span className="text-xs opacity-70">{msg.timestamp}</span>
//                                   </div>
//                                   <p>{msg.message}</p>
//                                 </div>
//                               ))}
//                             </div>
//                             {step.details.conversation.summary && (
//                               <div className="mt-3 p-2 bg-yellow-50 rounded border">
//                                 <h5 className="font-medium text-yellow-900">Call Summary</h5>
//                                 <p className="text-sm text-yellow-800">
//                                   Status: {step.details.conversation.summary.status}
//                                 </p>
//                                 {step.details.conversation.summary.timeConfirmed && (
//                                   <p className="text-sm text-yellow-800">
//                                     Time: {step.details.conversation.summary.timeConfirmed}
//                                   </p>
//                                 )}
//                                 {step.details.conversation.summary.priceConfirmed && (
//                                   <p className="text-sm text-yellow-800">
//                                     Price: {step.details.conversation.summary.priceConfirmed}
//                                   </p>
//                                 )}
//                                 {step.details.conversation.summary.notes && (
//                                   <p className="text-sm text-yellow-800">
//                                     Notes: {step.details.conversation.summary.notes}
//                                   </p>
//                                 )}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {/* Step 5: Appointment Details */}
//                     {step.step === "Save appointment" && (
//                       <div className="bg-blue-50 p-3 rounded-md">
//                         <h4 className="font-medium text-blue-900">Appointment Created</h4>
//                         <div className="text-sm text-blue-800 space-y-1">
//                           <p>📋 ID: {step.details.appointmentDetails?.confirmationNumber}</p>
//                           <p>🏥 Service: {step.details.appointmentDetails?.service}</p>
//                           <p>📍 Provider: {step.details.appointmentDetails?.provider}</p>
//                           <p>📅 Scheduled: {step.details.scheduledFor}</p>
//                           <p>💰 Price: {step.details.appointmentDetails?.price}</p>
//                           <p>⏱️ Duration: {step.details.appointmentDetails?.duration}</p>
//                           <p>✅ Status: {step.details.appointmentDetails?.status}</p>
//                         </div>
//                       </div>
//                     )}

//                     {/* Step 6: Email Details */}
//                     {step.step === "Send confirmation email" && (
//                       <div className={`p-3 rounded-md ${step.details.emailSent ? "bg-green-50" : "bg-red-50"}`}>
//                         <h4 className={`font-medium ${step.details.emailSent ? "text-green-900" : "text-red-900"}`}>
//                           Email Status: {step.details.deliveryStatus}
//                         </h4>
//                         <div
//                           className={`text-sm ${step.details.emailSent ? "text-green-800" : "text-red-800"} space-y-1`}
//                         >
//                           <p>📧 To: {step.details.recipientEmail}</p>
//                           <p>📋 Subject: {step.details.emailContent?.subject}</p>
//                           <p>
//                             📅 Calendar file:{" "}
//                             {step.details.emailContent?.includesCalendarFile ? "Included" : "Not included"}
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </CardContent>
//             </CollapsibleContent>
//           </Collapsible>
//         </Card>
//       ))}
//     </div>
//   )
// }



//! new ui 


// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import {
//   ChevronDown,
//   ChevronRight,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Search,
//   Star,
//   Phone,
//   MapPin,
//   Calendar,
//   Mail,
//   Download,
//   Zap,
// } from "lucide-react"

// interface DetailedTaskStep {
//   step: string
//   status: "pending" | "completed" | "failed"
//   result?: any
//   error?: string
//   details?: any
//   timestamp?: string
// }

// interface DetailedStepViewerProps {
//   steps: DetailedTaskStep[]
//   taskId: string
// }

// export function DetailedStepViewer({ steps, taskId }: DetailedStepViewerProps) {
//   const [openSteps, setOpenSteps] = useState<number[]>([])

//   const toggleStep = (index: number) => {
//     setOpenSteps((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "completed":
//         return <CheckCircle className="h-5 w-5 text-emerald-400" />
//       case "failed":
//         return <XCircle className="h-5 w-5 text-red-400" />
//       case "pending":
//         return <Clock className="h-5 w-5 text-yellow-400" />
//       default:
//         return <Clock className="h-5 w-5 text-gray-400" />
//     }
//   }

//   const getStepIcon = (stepName: string) => {
//     const iconClass = "h-4 w-4 text-gray-300"
//     switch (stepName.toLowerCase()) {
//       case "parse user request":
//         return <Search className={iconClass} />
//       case "search providers":
//         return <MapPin className={iconClass} />
//       case "select best option":
//         return <Star className={iconClass} />
//       case "make appointment call":
//         return <Phone className={iconClass} />
//       case "save appointment":
//         return <Calendar className={iconClass} />
//       case "send confirmation email":
//         return <Mail className={iconClass} />
//       default:
//         return <Clock className={iconClass} />
//     }
//   }

//   const downloadCallLog = async (callLogId: string) => {
//     try {
//       const response = await fetch(`/api/call-logs/${callLogId}/download`)
//       const blob = await response.blob()
//       const url = URL.createObjectURL(blob)
//       const a = document.createElement("a")
//       a.href = url
//       a.download = `call-log-${callLogId}.pdf`
//       document.body.appendChild(a)
//       a.click()
//       document.body.removeChild(a)
//       URL.revokeObjectURL(url)
//     } catch (error) {
//       console.error("Error downloading call log:", error)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
//             <Zap className="h-4 w-4 text-white" />
//           </div>
//           <h3 className="text-xl font-semibold text-white">Task Execution Details</h3>
//         </div>
//         <Badge className="bg-white/10 text-gray-300 border-white/20">Task ID: {taskId.substring(0, 8)}...</Badge>
//       </div>

//       {steps.map((step, index) => (
//         <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-xl shadow-lg overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
//           <Collapsible open={openSteps.includes(index)} onOpenChange={() => toggleStep(index)}>
//             <CollapsibleTrigger asChild>
//               <CardHeader className="relative cursor-pointer hover:bg-white/5 transition-all duration-300">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="flex items-center gap-3">
//                       {getStatusIcon(step.status)}
//                       {getStepIcon(step.step)}
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <CardTitle className="text-base text-white">{step.step}</CardTitle>
//                       <Badge
//                         className={`${
//                           step.status === "completed"
//                             ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
//                             : step.status === "failed"
//                               ? "bg-red-500/20 text-red-300 border-red-500/30"
//                               : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
//                         }`}
//                       >
//                         {step.status}
//                       </Badge>
//                     </div>
//                   </div>
//                   <div className="text-gray-400">
//                     {openSteps.includes(index) ? (
//                       <ChevronDown className="h-5 w-5" />
//                     ) : (
//                       <ChevronRight className="h-5 w-5" />
//                     )}
//                   </div>
//                 </div>
//                 {step.timestamp && (
//                   <p className="text-xs text-gray-400 ml-14 mt-1">{new Date(step.timestamp).toLocaleString()}</p>
//                 )}
//               </CardHeader>
//             </CollapsibleTrigger>

//             <CollapsibleContent>
//               <CardContent className="relative pt-0 space-y-4">
//                 {step.error && (
//                   <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
//                     <p className="text-sm text-red-300">{step.error}</p>
//                   </div>
//                 )}

//                 {step.details && (
//                   <div className="space-y-6">
//                     {/* Step 1: Parse Request Details */}
//                     {step.step === "Parse user request" && (
//                       <div className="space-y-4">
//                         <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
//                           <h4 className="font-medium text-blue-300 mb-2 flex items-center gap-2">
//                             <Search className="h-4 w-4" />
//                             Original Input
//                           </h4>
//                           <p className="text-sm text-blue-200">{step.details.originalInput}</p>
//                         </div>
//                         <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
//                           <h4 className="font-medium text-emerald-300 mb-2 flex items-center gap-2">
//                             <Zap className="h-4 w-4" />
//                             AI Analysis
//                           </h4>
//                           <pre className="text-sm text-emerald-200 whitespace-pre-wrap font-mono">
//                             {step.details.aiAnalysis}
//                           </pre>
//                         </div>
//                       </div>
//                     )}

//                     {/* Step 2: Search Providers Details */}
//                     {step.step === "Search providers" && (
//                       <div className="space-y-4">
//                         <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
//                           <h4 className="font-medium text-purple-300 mb-3 flex items-center gap-2">
//                             <MapPin className="h-4 w-4" />
//                             Search Parameters
//                           </h4>
//                           <div className="space-y-2 text-sm text-purple-200">
//                             <p>
//                               <span className="text-purple-300 font-medium">Query:</span> {step.details.searchQuery}
//                             </p>
//                             <p>
//                               <span className="text-purple-300 font-medium">Method:</span> {step.details.searchMethod}
//                             </p>
//                             <p>
//                               <span className="text-purple-300 font-medium">Results:</span> {step.details.totalFound}{" "}
//                               providers found
//                             </p>
//                           </div>
//                         </div>
//                         <div className="space-y-3">
//                           <h4 className="font-medium text-white flex items-center gap-2">
//                             <Star className="h-4 w-4 text-cyan-400" />
//                             Found Providers
//                           </h4>
//                           {step.details.providers?.map((provider: any, idx: number) => (
//                             <div
//                               key={idx}
//                               className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm"
//                             >
//                               <div className="flex justify-between items-start">
//                                 <div className="space-y-1">
//                                   <p className="font-medium text-white">{provider.name}</p>
//                                   <p className="text-sm text-gray-300">{provider.address}</p>
//                                   <p className="text-sm text-gray-400">📞 {provider.phone}</p>
//                                 </div>
//                                 <div className="text-right space-y-1">
//                                   <p className="text-sm text-yellow-400">⭐ {provider.rating}/5</p>
//                                   <p className="text-sm text-emerald-400">{provider.priceRange}</p>
//                                   <p className="text-xs text-gray-500">{provider.distance}</p>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Step 3: Selection Details */}
//                     {step.step === "Select best option" && (
//                       <div className="space-y-4">
//                         <div className="bg-emerald-500/10 p-4 rounded-xl border-l-4 border-emerald-500">
//                           <h4 className="font-medium text-emerald-300 mb-3 flex items-center gap-2">
//                             <CheckCircle className="h-4 w-4" />
//                             Selected Provider
//                           </h4>
//                           <div className="space-y-2">
//                             <p className="text-sm text-emerald-200 font-medium">
//                               {step.details.selectedProvider?.name}
//                             </p>
//                             <p className="text-sm text-emerald-200">📍 {step.details.selectedProvider?.address}</p>
//                             <p className="text-sm text-emerald-200">
//                               ⭐ {step.details.selectedProvider?.rating}/5 | {step.details.selectedProvider?.priceRange}
//                             </p>
//                             <p className="text-sm text-emerald-300 mt-2 font-medium">
//                               Why selected: {step.details.selectedProvider?.whySelected}
//                             </p>
//                           </div>
//                         </div>
//                         {step.details.alternativeOptions?.length > 0 && (
//                           <div className="bg-white/5 p-4 rounded-xl border border-white/10">
//                             <h4 className="font-medium mb-3 text-white">Other Options Considered:</h4>
//                             <div className="space-y-2">
//                               {step.details.alternativeOptions.map((alt: any, idx: number) => (
//                                 <div key={idx} className="text-sm text-gray-300 pl-4 border-l-2 border-gray-600">
//                                   • {alt.name} (⭐ {alt.rating}/5, {alt.priceRange}) - {alt.reason}
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {/* Step 4: Call Details */}
//                     {step.step === "Make appointment call" && (
//                       <div className="space-y-4">
//                         <div
//                           className={`p-4 rounded-xl border ${
//                             step.details.callInitiated
//                               ? "bg-emerald-500/10 border-emerald-500/20"
//                               : "bg-red-500/10 border-red-500/20"
//                           }`}
//                         >
//                           <h4
//                             className={`font-medium mb-2 flex items-center gap-2 ${
//                               step.details.callInitiated ? "text-emerald-300" : "text-red-300"
//                             }`}
//                           >
//                             <Phone className="h-4 w-4" />
//                             Call Status: {step.details.callInitiated ? "Initiated Successfully" : "Failed"}
//                           </h4>
//                           <p className={`text-sm ${step.details.callInitiated ? "text-emerald-200" : "text-red-200"}`}>
//                             📞 {step.details.phoneNumber} ({step.details.providerName})
//                           </p>
//                           {step.details.vapiCallId && (
//                             <p className="text-xs text-gray-400 mt-1">Call ID: {step.details.vapiCallId}</p>
//                           )}
//                         </div>

//                         {step.details.conversation && (
//                           <div className="bg-white/5 p-4 rounded-xl border border-white/10">
//                             <div className="flex items-center justify-between mb-4">
//                               <h4 className="font-medium text-white flex items-center gap-2">
//                                 <Phone className="h-4 w-4 text-cyan-400" />
//                                 Call Transcript
//                               </h4>
//                               {step.details.callLogId && (
//                                 <Button
//                                   size="sm"
//                                   variant="outline"
//                                   onClick={() => downloadCallLog(step.details.callLogId)}
//                                   className="text-xs bg-white/5 border-white/20 text-white hover:bg-white/10"
//                                 >
//                                   <Download className="h-3 w-3 mr-1" />
//                                   Download
//                                 </Button>
//                               )}
//                             </div>
//                             <div className="space-y-3 max-h-60 overflow-y-auto">
//                               {step.details.conversation.conversation?.map((msg: any, idx: number) => (
//                                 <div
//                                   key={idx}
//                                   className={`p-3 rounded-lg text-sm border ${
//                                     msg.speaker === "Riley_AI"
//                                       ? "bg-blue-500/10 border-blue-500/20 text-blue-200"
//                                       : msg.speaker === "Staff"
//                                         ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
//                                         : "bg-gray-500/10 border-gray-500/20 text-gray-300"
//                                   }`}
//                                 >
//                                   <div className="flex justify-between items-start mb-2">
//                                     <span className="font-medium text-xs">
//                                       {msg.speaker === "Riley_AI"
//                                         ? "🤖 Riley AI"
//                                         : msg.speaker === "Staff"
//                                           ? "👤 Staff"
//                                           : "⚠️ System"}
//                                     </span>
//                                     <span className="text-xs opacity-70">{msg.timestamp}</span>
//                                   </div>
//                                   <p>{msg.message}</p>
//                                 </div>
//                               ))}
//                             </div>
//                             {step.details.conversation.summary && (
//                               <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
//                                 <h5 className="font-medium text-yellow-300 mb-2">Call Summary</h5>
//                                 <div className="space-y-1 text-sm text-yellow-200">
//                                   <p>
//                                     <span className="font-medium">Status:</span>{" "}
//                                     {step.details.conversation.summary.status}
//                                   </p>
//                                   {step.details.conversation.summary.timeConfirmed && (
//                                     <p>
//                                       <span className="font-medium">Time:</span>{" "}
//                                       {step.details.conversation.summary.timeConfirmed}
//                                     </p>
//                                   )}
//                                   {step.details.conversation.summary.priceConfirmed && (
//                                     <p>
//                                       <span className="font-medium">Price:</span>{" "}
//                                       {step.details.conversation.summary.priceConfirmed}
//                                     </p>
//                                   )}
//                                   {step.details.conversation.summary.notes && (
//                                     <p>
//                                       <span className="font-medium">Notes:</span>{" "}
//                                       {step.details.conversation.summary.notes}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {/* Step 5: Appointment Details */}
//                     {step.step === "Save appointment" && (
//                       <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
//                         <h4 className="font-medium text-blue-300 mb-3 flex items-center gap-2">
//                           <Calendar className="h-4 w-4" />
//                           Appointment Created
//                         </h4>
//                         <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-200">
//                           <p>
//                             <span className="text-blue-300 font-medium">📋 ID:</span>{" "}
//                             {step.details.appointmentDetails?.confirmationNumber}
//                           </p>
//                           <p>
//                             <span className="text-blue-300 font-medium">🏥 Service:</span>{" "}
//                             {step.details.appointmentDetails?.service}
//                           </p>
//                           <p>
//                             <span className="text-blue-300 font-medium">📍 Provider:</span>{" "}
//                             {step.details.appointmentDetails?.provider}
//                           </p>
//                           <p>
//                             <span className="text-blue-300 font-medium">📅 Scheduled:</span> {step.details.scheduledFor}
//                           </p>
//                           <p>
//                             <span className="text-blue-300 font-medium">💰 Price:</span>{" "}
//                             {step.details.appointmentDetails?.price}
//                           </p>
//                           <p>
//                             <span className="text-blue-300 font-medium">✅ Status:</span>{" "}
//                             {step.details.appointmentDetails?.status}
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     {/* Step 6: Email Details */}
//                     {step.step === "Send confirmation email" && (
//                       <div
//                         className={`p-4 rounded-xl border ${
//                           step.details.emailSent
//                             ? "bg-emerald-500/10 border-emerald-500/20"
//                             : "bg-red-500/10 border-red-500/20"
//                         }`}
//                       >
//                         <h4
//                           className={`font-medium mb-3 flex items-center gap-2 ${
//                             step.details.emailSent ? "text-emerald-300" : "text-red-300"
//                           }`}
//                         >
//                           <Mail className="h-4 w-4" />
//                           Email Status: {step.details.deliveryStatus}
//                         </h4>
//                         <div
//                           className={`space-y-2 text-sm ${
//                             step.details.emailSent ? "text-emerald-200" : "text-red-200"
//                           }`}
//                         >
//                           <p>
//                             <span className="font-medium">📧 To:</span> {step.details.recipientEmail}
//                           </p>
//                           <p>
//                             <span className="font-medium">📋 Subject:</span> {step.details.emailContent?.subject}
//                           </p>
//                           <p>
//                             <span className="font-medium">📅 Calendar file:</span>{" "}
//                             {step.details.emailContent?.includesCalendarFile ? "Included" : "Not included"}
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </CardContent>
//             </CollapsibleContent>
//           </Collapsible>
//         </Card>
//       ))}
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Star,
  Phone,
  MapPin,
  Calendar,
  Mail,
  Download,
  Zap,
} from "lucide-react"

interface DetailedTaskStep {
  step: string
  status: "pending" | "completed" | "failed"
  result?: any
  error?: string
  details?: any
  timestamp?: string
}

interface DetailedStepViewerProps {
  steps: DetailedTaskStep[]
  taskId: string
}

export function DetailedStepViewer({ steps, taskId }: DetailedStepViewerProps) {
  const [openSteps, setOpenSteps] = useState<number[]>([])

  // Safety check for taskId
  const safeTaskId = taskId || "unknown"

  const toggleStep = (index: number) => {
    setOpenSteps((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-emerald-400" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-400" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-400" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStepIcon = (stepName: string) => {
    const iconClass = "h-4 w-4 text-gray-300"
    switch (stepName.toLowerCase()) {
      case "parse user request":
        return <Search className={iconClass} />
      case "search providers":
        return <MapPin className={iconClass} />
      case "select best option":
        return <Star className={iconClass} />
      case "make appointment call":
        return <Phone className={iconClass} />
      case "save appointment":
        return <Calendar className={iconClass} />
      case "send confirmation email":
        return <Mail className={iconClass} />
      default:
        return <Clock className={iconClass} />
    }
  }

  const downloadCallLog = async (callLogId: string) => {
    if (!callLogId) {
      console.error("No call log ID provided")
      return
    }

    try {
      const response = await fetch(`/api/call-logs/${callLogId}/download`)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `call-log-${callLogId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading call log:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Task Execution Details</h3>
        </div>
        <Badge className="bg-white/10 text-gray-300 border-white/20">Task ID: {safeTaskId.substring(0, 8)}...</Badge>
      </div>

      {steps.map((step, index) => (
        <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-xl shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
          <Collapsible open={openSteps.includes(index)} onOpenChange={() => toggleStep(index)}>
            <CollapsibleTrigger asChild>
              <CardHeader className="relative cursor-pointer hover:bg-white/5 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(step.status)}
                      {getStepIcon(step.step)}
                    </div>
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base text-white">{step.step}</CardTitle>
                      <Badge
                        className={`${
                          step.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : step.status === "failed"
                              ? "bg-red-500/20 text-red-300 border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                        }`}
                      >
                        {step.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {openSteps.includes(index) ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </div>
                </div>
                {step.timestamp && (
                  <p className="text-xs text-gray-400 ml-14 mt-1">{new Date(step.timestamp).toLocaleString()}</p>
                )}
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="relative pt-0 space-y-4">
                {step.error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-sm text-red-300">{step.error}</p>
                  </div>
                )}

                {step.details && (
                  <div className="space-y-6">
                    {/* Step 1: Parse Request Details */}
                    {step.step === "Parse user request" && (
                      <div className="space-y-4">
                        <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                          <h4 className="font-medium text-blue-300 mb-2 flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            Original Input
                          </h4>
                          <p className="text-sm text-blue-200">{step.details.originalInput}</p>
                        </div>
                        <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                          <h4 className="font-medium text-emerald-300 mb-2 flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            AI Analysis
                          </h4>
                          <pre className="text-sm text-emerald-200 whitespace-pre-wrap font-mono">
                            {step.details.aiAnalysis}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Search Providers Details */}
                    {step.step === "Search providers" && (
                      <div className="space-y-4">
                        <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                          <h4 className="font-medium text-purple-300 mb-3 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Search Parameters
                          </h4>
                          <div className="space-y-2 text-sm text-purple-200">
                            <p>
                              <span className="text-purple-300 font-medium">Query:</span> {step.details.searchQuery}
                            </p>
                            <p>
                              <span className="text-purple-300 font-medium">Method:</span> {step.details.searchMethod}
                            </p>
                            <p>
                              <span className="text-purple-300 font-medium">Results:</span> {step.details.totalFound}{" "}
                              providers found
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium text-white flex items-center gap-2">
                            <Star className="h-4 w-4 text-cyan-400" />
                            Found Providers
                          </h4>
                          {step.details.providers?.map((provider: any, idx: number) => (
                            <div
                              key={idx}
                              className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm"
                            >
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <p className="font-medium text-white">{provider.name}</p>
                                  <p className="text-sm text-gray-300">{provider.address}</p>
                                  <p className="text-sm text-gray-400">📞 {provider.phone}</p>
                                </div>
                                <div className="text-right space-y-1">
                                  <p className="text-sm text-yellow-400">⭐ {provider.rating}/5</p>
                                  <p className="text-sm text-emerald-400">{provider.priceRange}</p>
                                  <p className="text-xs text-gray-500">{provider.distance}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Selection Details */}
                    {step.step === "Select best option" && (
                      <div className="space-y-4">
                        <div className="bg-emerald-500/10 p-4 rounded-xl border-l-4 border-emerald-500">
                          <h4 className="font-medium text-emerald-300 mb-3 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Selected Provider
                          </h4>
                          <div className="space-y-2">
                            <p className="text-sm text-emerald-200 font-medium">
                              {step.details.selectedProvider?.name}
                            </p>
                            <p className="text-sm text-emerald-200">📍 {step.details.selectedProvider?.address}</p>
                            <p className="text-sm text-emerald-200">
                              ⭐ {step.details.selectedProvider?.rating}/5 | {step.details.selectedProvider?.priceRange}
                            </p>
                            <p className="text-sm text-emerald-300 mt-2 font-medium">
                              Why selected: {step.details.selectedProvider?.whySelected}
                            </p>
                          </div>
                        </div>
                        {step.details.alternativeOptions?.length > 0 && (
                          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <h4 className="font-medium mb-3 text-white">Other Options Considered:</h4>
                            <div className="space-y-2">
                              {step.details.alternativeOptions.map((alt: any, idx: number) => (
                                <div key={idx} className="text-sm text-gray-300 pl-4 border-l-2 border-gray-600">
                                  • {alt.name} (⭐ {alt.rating}/5, {alt.priceRange}) - {alt.reason}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 4: Call Details */}
                    {step.step === "Make appointment call" && (
                      <div className="space-y-4">
                        <div
                          className={`p-4 rounded-xl border ${
                            step.details.callInitiated
                              ? "bg-emerald-500/10 border-emerald-500/20"
                              : "bg-red-500/10 border-red-500/20"
                          }`}
                        >
                          <h4
                            className={`font-medium mb-2 flex items-center gap-2 ${
                              step.details.callInitiated ? "text-emerald-300" : "text-red-300"
                            }`}
                          >
                            <Phone className="h-4 w-4" />
                            Call Status: {step.details.callInitiated ? "Initiated Successfully" : "Failed"}
                          </h4>
                          <p className={`text-sm ${step.details.callInitiated ? "text-emerald-200" : "text-red-200"}`}>
                            📞 {step.details.phoneNumber} ({step.details.providerName})
                          </p>
                          {step.details.vapiCallId && (
                            <p className="text-xs text-gray-400 mt-1">Call ID: {step.details.vapiCallId}</p>
                          )}
                        </div>

                        {step.details.conversation && (
                          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium text-white flex items-center gap-2">
                                <Phone className="h-4 w-4 text-cyan-400" />
                                Call Transcript
                              </h4>
                              {step.details.callLogId && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadCallLog(step.details.callLogId)}
                                  className="text-xs bg-white/5 border-white/20 text-white hover:bg-white/10"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              )}
                            </div>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                              {step.details.conversation.conversation?.map((msg: any, idx: number) => (
                                <div
                                  key={idx}
                                  className={`p-3 rounded-lg text-sm border ${
                                    msg.speaker === "Riley_AI"
                                      ? "bg-blue-500/10 border-blue-500/20 text-blue-200"
                                      : msg.speaker === "Staff"
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
                                        : "bg-gray-500/10 border-gray-500/20 text-gray-300"
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium text-xs">
                                      {msg.speaker === "Riley_AI"
                                        ? "🤖 Riley AI"
                                        : msg.speaker === "Staff"
                                          ? "👤 Staff"
                                          : "⚠️ System"}
                                    </span>
                                    <span className="text-xs opacity-70">{msg.timestamp}</span>
                                  </div>
                                  <p>{msg.message}</p>
                                </div>
                              ))}
                            </div>
                            {step.details.conversation.summary && (
                              <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                <h5 className="font-medium text-yellow-300 mb-2">Call Summary</h5>
                                <div className="space-y-1 text-sm text-yellow-200">
                                  <p>
                                    <span className="font-medium">Status:</span>{" "}
                                    {step.details.conversation.summary.status}
                                  </p>
                                  {step.details.conversation.summary.timeConfirmed && (
                                    <p>
                                      <span className="font-medium">Time:</span>{" "}
                                      {step.details.conversation.summary.timeConfirmed}
                                    </p>
                                  )}
                                  {step.details.conversation.summary.priceConfirmed && (
                                    <p>
                                      <span className="font-medium">Price:</span>{" "}
                                      {step.details.conversation.summary.priceConfirmed}
                                    </p>
                                  )}
                                  {step.details.conversation.summary.notes && (
                                    <p>
                                      <span className="font-medium">Notes:</span>{" "}
                                      {step.details.conversation.summary.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 5: Appointment Details */}
                    {step.step === "Save appointment" && (
                      <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                        <h4 className="font-medium text-blue-300 mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Appointment Created
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-200">
                          <p>
                            <span className="text-blue-300 font-medium">📋 ID:</span>{" "}
                            {step.details.appointmentDetails?.confirmationNumber}
                          </p>
                          <p>
                            <span className="text-blue-300 font-medium">🏥 Service:</span>{" "}
                            {step.details.appointmentDetails?.service}
                          </p>
                          <p>
                            <span className="text-blue-300 font-medium">📍 Provider:</span>{" "}
                            {step.details.appointmentDetails?.provider}
                          </p>
                          <p>
                            <span className="text-blue-300 font-medium">📅 Scheduled:</span> {step.details.scheduledFor}
                          </p>
                          <p>
                            <span className="text-blue-300 font-medium">💰 Price:</span>{" "}
                            {step.details.appointmentDetails?.price}
                          </p>
                          <p>
                            <span className="text-blue-300 font-medium">✅ Status:</span>{" "}
                            {step.details.appointmentDetails?.status}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Step 6: Email Details */}
                    {step.step === "Send confirmation email" && (
                      <div
                        className={`p-4 rounded-xl border ${
                          step.details.emailSent
                            ? "bg-emerald-500/10 border-emerald-500/20"
                            : "bg-red-500/10 border-red-500/20"
                        }`}
                      >
                        <h4
                          className={`font-medium mb-3 flex items-center gap-2 ${
                            step.details.emailSent ? "text-emerald-300" : "text-red-300"
                          }`}
                        >
                          <Mail className="h-4 w-4" />
                          Email Status: {step.details.deliveryStatus}
                        </h4>
                        <div
                          className={`space-y-2 text-sm ${
                            step.details.emailSent ? "text-emerald-200" : "text-red-200"
                          }`}
                        >
                          <p>
                            <span className="font-medium">📧 To:</span> {step.details.recipientEmail}
                          </p>
                          <p>
                            <span className="font-medium">📋 Subject:</span> {step.details.emailContent?.subject}
                          </p>
                          <p>
                            <span className="font-medium">📅 Calendar file:</span>{" "}
                            {step.details.emailContent?.includesCalendarFile ? "Included" : "Not included"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  )
}
