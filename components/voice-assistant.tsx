// "use client"

// import type React from "react"

// import { useState, useEffect, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Mic, MicOff, Volume2, VolumeX, MessageCircle, X, Send, AlertCircle } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// interface VoiceMessage {
//   id: string
//   speaker: "user" | "assistant"
//   message: string
//   timestamp: string
// }

// interface VoiceAssistantProps {
//   onDataCollected?: (data: any) => void
// }

// export function VoiceAssistant({ onDataCollected }: VoiceAssistantProps) {
//   const [isOpen, setIsOpen] = useState(false)
//   const [isListening, setIsListening] = useState(false)
//   const [isSpeaking, setIsSpeaking] = useState(false)
//   const [sessionId, setSessionId] = useState<string | null>(null)
//   const [messages, setMessages] = useState<VoiceMessage[]>([])
//   const [currentStep, setCurrentStep] = useState("greeting")
//   const [isLoading, setIsLoading] = useState(false)
//   const [textInput, setTextInput] = useState("")
//   const [speechSupported, setSpeechSupported] = useState(false)
//   const [voiceError, setVoiceError] = useState<string | null>(null)
//   const [retryCount, setRetryCount] = useState(0)

//   const recognitionRef = useRef<any>(null)
//   const synthesisRef = useRef<SpeechSynthesis | null>(null)
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const isRecognitionActiveRef = useRef(false)
//   const { toast } = useToast()

//   // Check browser support
//   useEffect(() => {
//     const checkSpeechSupport = () => {
//       const hasRecognition = "webkitSpeechRecognition" in window || "SpeechRecognition" in window
//       const hasSynthesis = "speechSynthesis" in window

//       setSpeechSupported(hasRecognition && hasSynthesis)

//       if (!hasRecognition || !hasSynthesis) {
//         setVoiceError("Voice features not supported in this browser")
//         toast({
//           title: "Limited Browser Support",
//           description: "Voice features work best in Chrome, Edge, or Brave browsers. Using text-only mode.",
//           variant: "destructive",
//         })
//       }
//     }

//     checkSpeechSupport()
//   }, [toast])

//   // Initialize speech recognition
//   useEffect(() => {
//     if (!speechSupported) return

//     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
//     if (!SpeechRecognition) return

//     const recognition = new SpeechRecognition()

//     recognition.continuous = false
//     recognition.interimResults = false
//     recognition.lang = "en-US"

//     recognition.onstart = () => {
//       console.log("🎤 Speech recognition started")
//       setIsListening(true)
//       isRecognitionActiveRef.current = true
//       setVoiceError(null)
//     }

//     recognition.onresult = (event: any) => {
//       const transcript = event.results[0][0].transcript
//       const confidence = event.results[0][0].confidence

//       console.log("🗣️ Speech recognized:", transcript, "Confidence:", confidence)
//       handleUserMessage(transcript, transcript, confidence)
//       setRetryCount(0) // Reset retry count on success
//     }

//     recognition.onerror = (event: any) => {
//       console.error("❌ Speech recognition error:", event.error)
//       setIsListening(false)
//       isRecognitionActiveRef.current = false

//       // Handle different error types with specific solutions
//       switch (event.error) {
//         case "not-allowed":
//           setVoiceError("Microphone access denied")
//           toast({
//             title: "Microphone Access Required",
//             description: "Please click the microphone icon in your browser's address bar and allow access.",
//             variant: "destructive",
//           })
//           break
//         case "no-speech":
//           setVoiceError("No speech detected")
//           // Don't show toast for no-speech, just try again
//           break
//         case "network":
//           setVoiceError("Network connection issue")
//           if (retryCount < 2) {
//             // Auto-retry up to 2 times
//             setTimeout(() => {
//               setRetryCount((prev) => prev + 1)
//               startListening()
//             }, 1000)
//           } else {
//             toast({
//               title: "Voice Recognition Unavailable",
//               description: "Network issues with speech service. Please use text input instead.",
//               variant: "destructive",
//             })
//           }
//           break
//         case "audio-capture":
//           setVoiceError("Microphone not available")
//           toast({
//             title: "Microphone Error",
//             description: "Could not access your microphone. Please check your device settings.",
//             variant: "destructive",
//           })
//           break
//         case "service-not-allowed":
//           setVoiceError("Speech service blocked")
//           toast({
//             title: "Service Blocked",
//             description: "Speech recognition is blocked. Please use text input.",
//             variant: "destructive",
//           })
//           break
//         default:
//           setVoiceError(`Speech error: ${event.error}`)
//           toast({
//             title: "Speech Recognition Error",
//             description: `Error: ${event.error}. Please try text input instead.`,
//             variant: "destructive",
//           })
//       }
//     }

//     recognition.onend = () => {
//       console.log("🎤 Speech recognition ended")
//       setIsListening(false)
//       isRecognitionActiveRef.current = false
//     }

//     recognitionRef.current = recognition
//     synthesisRef.current = window.speechSynthesis

//     return () => {
//       if (recognitionRef.current && isRecognitionActiveRef.current) {
//         recognitionRef.current.abort()
//         isRecognitionActiveRef.current = false
//       }
//     }
//   }, [speechSupported, toast, retryCount])

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   const startVoiceSession = async () => {
//     try {
//       setIsLoading(true)
//       const response = await fetch("/api/voice/session/start", {
//         method: "POST",
//       })

//       const data = await response.json()

//       if (data.success) {
//         setSessionId(data.session.id)
//         setCurrentStep(data.session.currentStep)

//         // Get initial greeting
//         const sessionResponse = await fetch(`/api/voice/session/${data.session.id}`)
//         const sessionData = await sessionResponse.json()

//         if (sessionData.success && sessionData.session.messages.length > 0) {
//           const formattedMessages = sessionData.session.messages.map((msg: any) => ({
//             id: msg.id,
//             speaker: msg.speaker,
//             message: msg.message,
//             timestamp: msg.timestamp,
//           }))
//           setMessages(formattedMessages)

//           // Speak the greeting after a short delay
//           setTimeout(() => {
//             const greeting = sessionData.session.messages[0].message
//             speakMessage(greeting)
//           }, 500)
//         }
//       }
//     } catch (error) {
//       console.error("Error starting voice session:", error)
//       toast({
//         title: "Error",
//         description: "Failed to start voice session",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleUserMessage = async (message: string, audioTranscript?: string, confidence?: number) => {
//     if (!sessionId) return

//     try {
//       setIsLoading(true)

//       // Add user message to UI immediately
//       const userMessage: VoiceMessage = {
//         id: Date.now().toString(),
//         speaker: "user",
//         message,
//         timestamp: new Date().toISOString(),
//       }
//       setMessages((prev) => [...prev, userMessage])

//       // Send to backend
//       const response = await fetch("/api/voice/session/message", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           sessionId,
//           message,
//           audioTranscript,
//           confidence,
//         }),
//       })

//       const data = await response.json()

//       if (data.success) {
//         // Add assistant response
//         const assistantMessage: VoiceMessage = {
//           id: (Date.now() + 1).toString(),
//           speaker: "assistant",
//           message: data.response.message,
//           timestamp: new Date().toISOString(),
//         }
//         setMessages((prev) => [...prev, assistantMessage])
//         setCurrentStep(data.response.nextStep)

//         // Speak the response after a short delay
//         setTimeout(() => {
//           speakMessage(data.response.message)
//         }, 300)

//         // If should execute, do it
//         if (data.response.shouldExecute) {
//           executeTask()
//         }

//         // If data collected, notify parent
//         if (data.response.collectedData && onDataCollected) {
//           onDataCollected(data.response.collectedData)
//         }
//       }
//     } catch (error) {
//       console.error("Error sending message:", error)
//       toast({
//         title: "Error",
//         description: "Failed to process message",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const executeTask = async () => {
//     if (!sessionId) return

//     try {
//       setIsLoading(true)
//       const response = await fetch("/api/voice/session/execute", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ sessionId }),
//       })

//       const data = await response.json()

//       if (data.success) {
//         // Add completion message
//         const completionMessage: VoiceMessage = {
//           id: Date.now().toString(),
//           speaker: "assistant",
//           message: data.message,
//           timestamp: new Date().toISOString(),
//         }
//         setMessages((prev) => [...prev, completionMessage])

//         // Speak completion message
//         setTimeout(() => {
//           speakMessage(data.message)
//         }, 300)

//         setCurrentStep("completed")
//       }
//     } catch (error) {
//       console.error("Error executing task:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const speakMessage = (message: string) => {
//     if (!synthesisRef.current || !speechSupported) return

//     // Cancel any ongoing speech
//     synthesisRef.current.cancel()

//     const utterance = new SpeechSynthesisUtterance(message)
//     utterance.rate = 0.9
//     utterance.pitch = 1.0
//     utterance.volume = 0.8

//     utterance.onstart = () => {
//       console.log("🔊 Started speaking:", message.substring(0, 50) + "...")
//       setIsSpeaking(true)
//     }

//     utterance.onend = () => {
//       console.log("🔇 Finished speaking")
//       setIsSpeaking(false)
//     }

//     utterance.onerror = (event) => {
//       console.error("🔇 Speech synthesis error:", event.error)
//       setIsSpeaking(false)
//     }

//     synthesisRef.current.speak(utterance)
//   }

//   const startListening = () => {
//     // Reset error state
//     setVoiceError(null)

//     if (!recognitionRef.current || !speechSupported) {
//       setVoiceError("Speech recognition not available")
//       return
//     }

//     // Check if already listening
//     if (isRecognitionActiveRef.current || isListening) {
//       console.log("🎤 Already listening, ignoring request")
//       return
//     }

//     // Stop any ongoing speech before listening
//     if (synthesisRef.current && isSpeaking) {
//       synthesisRef.current.cancel()
//       setIsSpeaking(false)
//     }

//     // Wait a moment for speech to stop, then start listening
//     setTimeout(() => {
//       try {
//         console.log("🎤 Attempting to start speech recognition...")
//         recognitionRef.current.start()
//       } catch (error) {
//         console.error("❌ Error starting recognition:", error)
//         setVoiceError("Failed to start microphone")
//         isRecognitionActiveRef.current = false
//       }
//     }, 500)
//   }

//   const stopListening = () => {
//     if (recognitionRef.current && isRecognitionActiveRef.current) {
//       console.log("🛑 Stopping speech recognition...")
//       recognitionRef.current.stop()
//     }
//   }

//   const stopSpeaking = () => {
//     if (synthesisRef.current) {
//       console.log("🔇 Stopping speech synthesis...")
//       synthesisRef.current.cancel()
//       setIsSpeaking(false)
//     }
//   }

//   const handleTextSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (textInput.trim()) {
//       handleUserMessage(textInput.trim())
//       setTextInput("")
//     }
//   }

//   const openAssistant = () => {
//     setIsOpen(true)
//     if (!sessionId) {
//       startVoiceSession()
//     }
//   }

//   const clearVoiceError = () => {
//     setVoiceError(null)
//     setRetryCount(0)
//   }

//   return (
//     <>
//       {/* Floating Voice Button */}
//       {!isOpen && (
//         <Button
//           onClick={openAssistant}
//           className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
//           size="icon"
//         >
//           <MessageCircle className="h-6 w-6 text-white" />
//         </Button>
//       )}

//       {/* Voice Assistant Chat Window */}
//       {isOpen && (
//         <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-lg">🎤 Voice Assistant</CardTitle>
//             <div className="flex items-center gap-2">
//               <Badge variant="outline" className="text-xs">
//                 {currentStep.replace("_", " ")}
//               </Badge>
//               {voiceError ? (
//                 <Badge className="bg-red-100 text-red-800 text-xs">Voice Error</Badge>
//               ) : speechSupported ? (
//                 <Badge className="bg-green-100 text-green-800 text-xs">Voice Ready</Badge>
//               ) : (
//                 <Badge className="bg-yellow-100 text-yellow-800 text-xs">Text Only</Badge>
//               )}
//               <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6">
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           </CardHeader>

//           <CardContent className="flex-1 flex flex-col p-4">
//             {/* Voice Error Banner */}
//             {voiceError && (
//               <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
//                 <AlertCircle className="h-4 w-4 text-red-600" />
//                 <span className="text-xs text-red-700 flex-1">{voiceError}</span>
//                 <Button onClick={clearVoiceError} size="sm" variant="ghost" className="h-6 w-6 p-0">
//                   <X className="h-3 w-3" />
//                 </Button>
//               </div>
//             )}

//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto space-y-3 mb-4">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex ${message.speaker === "user" ? "justify-end" : "justify-start"}`}
//                 >
//                   <div
//                     className={`max-w-[80%] p-3 rounded-lg ${
//                       message.speaker === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
//                     }`}
//                   >
//                     <p className="text-sm">{message.message}</p>
//                   </div>
//                 </div>
//               ))}
//               {isLoading && (
//                 <div className="flex justify-start">
//                   <div className="bg-gray-100 p-3 rounded-lg">
//                     <div className="flex space-x-1">
//                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                       <div
//                         className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                         style={{ animationDelay: "0.1s" }}
//                       ></div>
//                       <div
//                         className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                         style={{ animationDelay: "0.2s" }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input Controls */}
//             <div className="space-y-2">
//               {/* Voice Controls */}
//               {speechSupported && !voiceError && (
//                 <div className="flex items-center justify-center gap-2">
//                   <Button
//                     onClick={isListening ? stopListening : startListening}
//                     disabled={isLoading}
//                     className={`${
//                       isListening ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-green-600 hover:bg-green-700"
//                     }`}
//                     size="sm"
//                   >
//                     {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
//                     {isListening ? "Listening..." : "Speak"}
//                   </Button>

//                   <Button
//                     onClick={isSpeaking ? stopSpeaking : undefined}
//                     disabled={!isSpeaking}
//                     variant="outline"
//                     size="sm"
//                     className={isSpeaking ? "animate-pulse" : ""}
//                   >
//                     {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
//                     {isSpeaking ? "Speaking..." : "Audio"}
//                   </Button>
//                 </div>
//               )}

//               {/* Text Input */}
//               <form onSubmit={handleTextSubmit} className="flex gap-2">
//                 <input
//                   type="text"
//                   value={textInput}
//                   onChange={(e) => setTextInput(e.target.value)}
//                   placeholder={
//                     voiceError
//                       ? "Voice unavailable - type your message..."
//                       : speechSupported
//                         ? "Type or speak your message..."
//                         : "Type your message..."
//                   }
//                   disabled={isLoading}
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <Button type="submit" disabled={isLoading || !textInput.trim()} size="sm">
//                   <Send className="h-4 w-4" />
//                 </Button>
//               </form>

//               {/* Help text */}
//               <div className="text-xs text-gray-500 text-center">
//                 {voiceError ? (
//                   <>⚠️ Voice unavailable. Use text input to continue.</>
//                 ) : speechSupported ? (
//                   <>💡 Wait for me to finish speaking, then click "Speak" to respond</>
//                 ) : (
//                   <>💡 Voice not supported in this browser. Use text input.</>
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </>
//   )
// }




// "use client"

// import type React from "react"

// import { useState, useEffect, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { X, Send, Bot, User, Sparkles } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// interface VoiceMessage {
//   id: string
//   speaker: "user" | "assistant"
//   message: string
//   timestamp: string
// }

// interface VoiceAssistantProps {
//   onDataCollected?: (data: any) => void
// }

// export function VoiceAssistant({ onDataCollected }: VoiceAssistantProps) {
//   const [isOpen, setIsOpen] = useState(false)
//   const [sessionId, setSessionId] = useState<string | null>(null)
//   const [messages, setMessages] = useState<VoiceMessage[]>([])
//   const [currentStep, setCurrentStep] = useState("greeting")
//   const [isLoading, setIsLoading] = useState(false)
//   const [textInput, setTextInput] = useState("")
//   const [isTyping, setIsTyping] = useState(false)

//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const { toast } = useToast()

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   const startVoiceSession = async () => {
//     try {
//       setIsLoading(true)
//       const response = await fetch("/api/voice/session/start", {
//         method: "POST",
//       })

//       const data = await response.json()

//       if (data.success) {
//         setSessionId(data.session.id)
//         setCurrentStep(data.session.currentStep)

//         // Get initial greeting
//         const sessionResponse = await fetch(`/api/voice/session/${data.session.id}`)
//         const sessionData = await sessionResponse.json()

//         if (sessionData.success && sessionData.session.messages.length > 0) {
//           const formattedMessages = sessionData.session.messages.map((msg: any) => ({
//             id: msg.id,
//             speaker: msg.speaker,
//             message: msg.message,
//             timestamp: msg.timestamp,
//           }))

//           // Animate the greeting message
//           setMessages([])
//           setTimeout(() => {
//             typeMessage(formattedMessages[0])
//           }, 500)
//         }
//       }
//     } catch (error) {
//       console.error("Error starting voice session:", error)
//       toast({
//         title: "Error",
//         description: "Failed to start assistant session",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const typeMessage = (message: VoiceMessage) => {
//     setIsTyping(true)
//     setMessages((prev) => [...prev, { ...message, message: "" }])

//     const fullMessage = message.message
//     let currentText = ""
//     let index = 0

//     const typeInterval = setInterval(() => {
//       if (index < fullMessage.length) {
//         currentText += fullMessage[index]
//         setMessages((prev) => prev.map((msg, i) => (i === prev.length - 1 ? { ...msg, message: currentText } : msg)))
//         index++
//       } else {
//         clearInterval(typeInterval)
//         setIsTyping(false)
//       }
//     }, 30) // Typing speed
//   }

//   const handleUserMessage = async (message: string) => {
//     if (!sessionId) return

//     try {
//       setIsLoading(true)

//       // Add user message to UI immediately
//       const userMessage: VoiceMessage = {
//         id: Date.now().toString(),
//         speaker: "user",
//         message,
//         timestamp: new Date().toISOString(),
//       }
//       setMessages((prev) => [...prev, userMessage])

//       // Send to backend
//       const response = await fetch("/api/voice/session/message", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           sessionId,
//           message,
//           audioTranscript: message,
//           confidence: 1.0,
//         }),
//       })

//       const data = await response.json()

//       if (data.success) {
//         // Add assistant response with typing animation
//         const assistantMessage: VoiceMessage = {
//           id: (Date.now() + 1).toString(),
//           speaker: "assistant",
//           message: data.response.message,
//           timestamp: new Date().toISOString(),
//         }

//         setCurrentStep(data.response.nextStep)

//         // Animate the response
//         setTimeout(() => {
//           typeMessage(assistantMessage)
//         }, 500)

//         // If should execute, do it
//         if (data.response.shouldExecute) {
//           setTimeout(() => {
//             executeTask()
//           }, 2000)
//         }

//         // If data collected, notify parent
//         if (data.response.collectedData && onDataCollected) {
//           onDataCollected(data.response.collectedData)
//         }
//       }
//     } catch (error) {
//       console.error("Error sending message:", error)
//       toast({
//         title: "Error",
//         description: "Failed to process message",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const executeTask = async () => {
//     if (!sessionId) return

//     try {
//       setIsLoading(true)

//       // Add a "working" message
//       const workingMessage: VoiceMessage = {
//         id: Date.now().toString(),
//         speaker: "assistant",
//         message: "🔄 Perfect! Let me start working on that for you. I'm searching for providers and making calls...",
//         timestamp: new Date().toISOString(),
//       }

//       setTimeout(() => {
//         typeMessage(workingMessage)
//       }, 500)

//       const response = await fetch("/api/voice/session/execute", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ sessionId }),
//       })

//       const data = await response.json()

//       if (data.success) {
//         // Add completion message
//         const completionMessage: VoiceMessage = {
//           id: (Date.now() + 1).toString(),
//           speaker: "assistant",
//           message: data.message,
//           timestamp: new Date().toISOString(),
//         }

//         setTimeout(() => {
//           typeMessage(completionMessage)
//         }, 3000) // Wait a bit to simulate work

//         setCurrentStep("completed")

//         toast({
//           title: "Task Completed! 🎉",
//           description: "Your appointment has been booked successfully!",
//         })
//       }
//     } catch (error) {
//       console.error("Error executing task:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleTextSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (textInput.trim() && !isTyping) {
//       handleUserMessage(textInput.trim())
//       setTextInput("")
//     }
//   }

//   const openAssistant = () => {
//     setIsOpen(true)
//     if (!sessionId) {
//       startVoiceSession()
//     }
//   }

//   const getStepEmoji = (step: string) => {
//     switch (step) {
//       case "greeting":
//         return "👋"
//       case "collecting_service":
//         return "🔍"
//       case "collecting_email":
//         return "📧"
//       case "collecting_location":
//         return "📍"
//       case "collecting_preferences":
//         return "⚙️"
//       case "confirming":
//         return "✅"
//       case "executing":
//         return "🔄"
//       case "completed":
//         return "🎉"
//       default:
//         return "💬"
//     }
//   }

//   const quickReplies = {
//     greeting: ["I need a salon", "Find a restaurant", "Book a doctor", "Help me find a spa"],
//     collecting_email: ["anikeshuzumaki@gmail.com", "Use my email", "Skip email"],
//     collecting_location: ["Delhi", "Mumbai", "Near me", "Bangalore"],
//     collecting_preferences: ["Today", "Tomorrow", "This weekend", "Cheapest option"],
//     confirming: ["Yes, proceed", "Looks good", "Make the booking", "Go ahead"],
//   }

//   return (
//     <>
//       {/* Floating Assistant Button */}
//       {!isOpen && (
//         <Button
//           onClick={openAssistant}
//           className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg z-50 animate-pulse"
//           size="icon"
//         >
//           <Sparkles className="h-6 w-6 text-white" />
//         </Button>
//       )}

//       {/* AI Assistant Chat Window */}
//       {isOpen && (
//         <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col border-2 border-blue-200">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-purple-50">
//             <CardTitle className="text-lg flex items-center gap-2">
//               <Bot className="h-5 w-5 text-blue-600" />
//               AI Assistant
//             </CardTitle>
//             <div className="flex items-center gap-2">
//               <Badge variant="outline" className="text-xs">
//                 {getStepEmoji(currentStep)} {currentStep.replace("_", " ")}
//               </Badge>
//               <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6">
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           </CardHeader>

//           <CardContent className="flex-1 flex flex-col p-4">
//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto space-y-3 mb-4">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex ${message.speaker === "user" ? "justify-end" : "justify-start"}`}
//                 >
//                   <div
//                     className={`max-w-[85%] p-3 rounded-lg flex items-start gap-2 ${
//                       message.speaker === "user"
//                         ? "bg-blue-600 text-white flex-row-reverse"
//                         : "bg-gray-100 text-gray-900"
//                     }`}
//                   >
//                     {message.speaker === "user" ? (
//                       <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
//                     ) : (
//                       <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />
//                     )}
//                     <p className="text-sm">{message.message}</p>
//                   </div>
//                 </div>
//               ))}

//               {isTyping && (
//                 <div className="flex justify-start">
//                   <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2">
//                     <Bot className="h-4 w-4 text-blue-600" />
//                     <div className="flex space-x-1">
//                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
//                       <div
//                         className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
//                         style={{ animationDelay: "0.1s" }}
//                       ></div>
//                       <div
//                         className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
//                         style={{ animationDelay: "0.2s" }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div ref={messagesEndRef} />
//             </div>

//             {/* Quick Replies */}
//             {quickReplies[currentStep as keyof typeof quickReplies] && !isTyping && (
//               <div className="mb-3">
//                 <div className="text-xs text-gray-500 mb-2">Quick replies:</div>
//                 <div className="flex flex-wrap gap-1">
//                   {quickReplies[currentStep as keyof typeof quickReplies].map((reply, index) => (
//                     <Button
//                       key={index}
//                       variant="outline"
//                       size="sm"
//                       className="text-xs h-7"
//                       onClick={() => handleUserMessage(reply)}
//                       disabled={isLoading || isTyping}
//                     >
//                       {reply}
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Text Input */}
//             <form onSubmit={handleTextSubmit} className="flex gap-2">
//               <input
//                 type="text"
//                 value={textInput}
//                 onChange={(e) => setTextInput(e.target.value)}
//                 placeholder="Type your message..."
//                 disabled={isLoading || isTyping}
//                 className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <Button
//                 type="submit"
//                 disabled={isLoading || !textInput.trim() || isTyping}
//                 size="sm"
//                 className="bg-blue-600 hover:bg-blue-700"
//               >
//                 <Send className="h-4 w-4" />
//               </Button>
//             </form>

//             {/* Help text */}
//             <div className="text-xs text-gray-500 text-center mt-2">
//               💡 I'll help you find and book services automatically!
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </>
//   )
// }


// new gemini 

// "use client"

// import type React from "react"

// import { useState, useEffect, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Mic, MicOff, Volume2, VolumeX, X, Send, Bot, User, Sparkles, AlertCircle } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// interface VoiceMessage {
//   id: string
//   speaker: "user" | "assistant"
//   message: string
//   timestamp: string
// }

// interface VoiceAssistantProps {
//   onDataCollected?: (data: any) => void
// }

// export function VoiceAssistant({ onDataCollected }: VoiceAssistantProps) {
//   const [isOpen, setIsOpen] = useState(false)
//   const [isListening, setIsListening] = useState(false)
//   const [isSpeaking, setIsSpeaking] = useState(false)
//   const [sessionId, setSessionId] = useState<string | null>(null)
//   const [messages, setMessages] = useState<VoiceMessage[]>([])
//   const [currentStep, setCurrentStep] = useState("greeting")
//   const [isLoading, setIsLoading] = useState(false)
//   const [textInput, setTextInput] = useState("")
//   const [isTyping, setIsTyping] = useState(false)
//   const [speechSupported, setSpeechSupported] = useState(false)
//   const [voiceError, setVoiceError] = useState<string | null>(null)
//   const [useGeminiSpeech, setUseGeminiSpeech] = useState(false)

//   const mediaRecorderRef = useRef<MediaRecorder | null>(null)
//   const audioChunksRef = useRef<Blob[]>([])
//   const synthesisRef = useRef<SpeechSynthesis | null>(null)
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const { toast } = useToast()

//   // Check browser support and initialize
//   useEffect(() => {
//     const checkSpeechSupport = () => {
//       const hasRecognition = "webkitSpeechRecognition" in window || "SpeechRecognition" in window
//       const hasSynthesis = "speechSynthesis" in window
//       const hasMediaRecorder = "MediaRecorder" in window

//       setSpeechSupported(hasRecognition && hasSynthesis)

//       if (!hasRecognition && hasMediaRecorder) {
//         // Fallback to Gemini Speech API
//         setUseGeminiSpeech(true)
//         setSpeechSupported(true)
//         console.log("🎤 Using Gemini Speech API as fallback")
//       }

//       if (hasSynthesis) {
//         synthesisRef.current = window.speechSynthesis
//       }
//     }

//     checkSpeechSupport()
//   }, [])

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   const startVoiceSession = async () => {
//     try {
//       setIsLoading(true)
//       const response = await fetch("/api/voice/session/start", {
//         method: "POST",
//       })

//       const data = await response.json()

//       if (data.success) {
//         setSessionId(data.session.id)
//         setCurrentStep(data.session.currentStep)

//         // Get initial greeting
//         const sessionResponse = await fetch(`/api/voice/session/${data.session.id}`)
//         const sessionData = await sessionResponse.json()

//         if (sessionData.success && sessionData.session.messages.length > 0) {
//           const formattedMessages = sessionData.session.messages.map((msg: any) => ({
//             id: msg.id,
//             speaker: msg.speaker,
//             message: msg.message,
//             timestamp: msg.timestamp,
//           }))

//           // Animate the greeting message
//           setMessages([])
//           setTimeout(() => {
//             typeMessage(formattedMessages[0])
//             // Speak the greeting
//             setTimeout(() => {
//               speakMessage(formattedMessages[0].message)
//             }, 1000)
//           }, 500)
//         }
//       }
//     } catch (error) {
//       console.error("Error starting voice session:", error)
//       toast({
//         title: "Error",
//         description: "Failed to start assistant session",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const typeMessage = (message: VoiceMessage) => {
//     setIsTyping(true)
//     setMessages((prev) => [...prev, { ...message, message: "" }])

//     const fullMessage = message.message
//     let currentText = ""
//     let index = 0

//     const typeInterval = setInterval(() => {
//       if (index < fullMessage.length) {
//         currentText += fullMessage[index]
//         setMessages((prev) => prev.map((msg, i) => (i === prev.length - 1 ? { ...msg, message: currentText } : msg)))
//         index++
//       } else {
//         clearInterval(typeInterval)
//         setIsTyping(false)
//       }
//     }, 30)
//   }

//   // Gemini Speech-to-Text API
//   const transcribeWithGemini = async (audioBlob: Blob): Promise<string> => {
//     try {
//       const formData = new FormData()
//       formData.append("audio", audioBlob, "audio.webm")

//       const response = await fetch("/api/voice/transcribe", {
//         method: "POST",
//         body: formData,
//       })

//       const data = await response.json()

//       if (data.success) {
//         return data.transcript
//       } else {
//         throw new Error(data.error || "Transcription failed")
//       }
//     } catch (error) {
//       console.error("Gemini transcription error:", error)
//       throw error
//     }
//   }

//   // Start recording with MediaRecorder (for Gemini API)
//   const startGeminiRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
//       const mediaRecorder = new MediaRecorder(stream)

//       audioChunksRef.current = []

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data)
//         }
//       }

//       mediaRecorder.onstop = async () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })

//         try {
//           setIsLoading(true)
//           const transcript = await transcribeWithGemini(audioBlob)

//           if (transcript.trim()) {
//             handleUserMessage(transcript, transcript, 1.0)
//           } else {
//             toast({
//               title: "No speech detected",
//               description: "Please try speaking again",
//               variant: "destructive",
//             })
//           }
//         } catch (error) {
//           console.error("Transcription failed:", error)
//           toast({
//             title: "Speech recognition failed",
//             description: "Please try typing instead",
//             variant: "destructive",
//           })
//         } finally {
//           setIsLoading(false)
//         }

//         // Stop all tracks
//         stream.getTracks().forEach((track) => track.stop())
//       }

//       mediaRecorderRef.current = mediaRecorder
//       mediaRecorder.start()
//       setIsListening(true)
//       setVoiceError(null)

//       console.log("🎤 Started Gemini recording")
//     } catch (error) {
//       console.error("Error starting Gemini recording:", error)
//       setVoiceError("Microphone access denied")
//       toast({
//         title: "Microphone Error",
//         description: "Please allow microphone access and try again",
//         variant: "destructive",
//       })
//     }
//   }

//   const stopGeminiRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
//       mediaRecorderRef.current.stop()
//       setIsListening(false)
//       console.log("🛑 Stopped Gemini recording")
//     }
//   }

//   // Web Speech API (fallback)
//   const startWebSpeechRecognition = () => {
//     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
//     if (!SpeechRecognition) return

//     const recognition = new SpeechRecognition()
//     recognition.continuous = false
//     recognition.interimResults = false
//     recognition.lang = "en-US"

//     recognition.onstart = () => {
//       setIsListening(true)
//       setVoiceError(null)
//       console.log("🎤 Web Speech started")
//     }

//     recognition.onresult = (event: any) => {
//       const transcript = event.results[0][0].transcript
//       const confidence = event.results[0][0].confidence
//       handleUserMessage(transcript, transcript, confidence)
//     }

//     recognition.onerror = (event: any) => {
//       console.error("Web Speech error:", event.error)
//       setIsListening(false)

//       if (event.error === "network") {
//         // Switch to Gemini API
//         setUseGeminiSpeech(true)
//         toast({
//           title: "Switching to better speech service",
//           description: "Using Gemini AI for speech recognition",
//         })
//       } else {
//         setVoiceError(`Speech error: ${event.error}`)
//       }
//     }

//     recognition.onend = () => {
//       setIsListening(false)
//     }

//     try {
//       recognition.start()
//     } catch (error) {
//       console.error("Error starting Web Speech:", error)
//       setUseGeminiSpeech(true)
//     }
//   }

//   const startListening = () => {
//     if (!speechSupported) {
//       toast({
//         title: "Speech not supported",
//         description: "Please use text input",
//         variant: "destructive",
//       })
//       return
//     }

//     // Stop any ongoing speech
//     if (synthesisRef.current && isSpeaking) {
//       synthesisRef.current.cancel()
//       setIsSpeaking(false)
//     }

//     setTimeout(() => {
//       if (useGeminiSpeech) {
//         startGeminiRecording()
//       } else {
//         startWebSpeechRecognition()
//       }
//     }, 500)
//   }

//   const stopListening = () => {
//     if (useGeminiSpeech) {
//       stopGeminiRecording()
//     } else {
//       setIsListening(false)
//     }
//   }

//   const speakMessage = (message: string) => {
//     if (!synthesisRef.current) return

//     synthesisRef.current.cancel()

//     const utterance = new SpeechSynthesisUtterance(message)
//     utterance.rate = 0.9
//     utterance.pitch = 1.0
//     utterance.volume = 0.8

//     utterance.onstart = () => {
//       setIsSpeaking(true)
//       console.log("🔊 Started speaking")
//     }

//     utterance.onend = () => {
//       setIsSpeaking(false)
//       console.log("🔇 Finished speaking")
//     }

//     utterance.onerror = () => {
//       setIsSpeaking(false)
//     }

//     synthesisRef.current.speak(utterance)
//   }

//   const stopSpeaking = () => {
//     if (synthesisRef.current) {
//       synthesisRef.current.cancel()
//       setIsSpeaking(false)
//     }
//   }

//   const handleUserMessage = async (message: string, audioTranscript?: string, confidence?: number) => {
//     if (!sessionId) return

//     try {
//       setIsLoading(true)

//       const userMessage: VoiceMessage = {
//         id: Date.now().toString(),
//         speaker: "user",
//         message,
//         timestamp: new Date().toISOString(),
//       }
//       setMessages((prev) => [...prev, userMessage])

//       const response = await fetch("/api/voice/session/message", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           sessionId,
//           message,
//           audioTranscript,
//           confidence,
//         }),
//       })

//       const data = await response.json()

//       if (data.success) {
//         const assistantMessage: VoiceMessage = {
//           id: (Date.now() + 1).toString(),
//           speaker: "assistant",
//           message: data.response.message,
//           timestamp: new Date().toISOString(),
//         }

//         setCurrentStep(data.response.nextStep)

//         setTimeout(() => {
//           typeMessage(assistantMessage)
//           // Speak after typing
//           setTimeout(() => {
//             speakMessage(data.response.message)
//           }, 1500)
//         }, 500)

//         if (data.response.shouldExecute) {
//           setTimeout(() => {
//             executeTask()
//           }, 3000)
//         }

//         if (data.response.collectedData && onDataCollected) {
//           onDataCollected(data.response.collectedData)
//         }
//       }
//     } catch (error) {
//       console.error("Error sending message:", error)
//       toast({
//         title: "Error",
//         description: "Failed to process message",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const executeTask = async () => {
//     if (!sessionId) return

//     try {
//       setIsLoading(true)

//       const workingMessage: VoiceMessage = {
//         id: Date.now().toString(),
//         speaker: "assistant",
//         message: "🔄 Perfect! Let me start working on that for you. I'm searching for providers and making calls...",
//         timestamp: new Date().toISOString(),
//       }

//       setTimeout(() => {
//         typeMessage(workingMessage)
//         setTimeout(() => {
//           speakMessage(workingMessage.message)
//         }, 1000)
//       }, 500)

//       const response = await fetch("/api/voice/session/execute", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ sessionId }),
//       })

//       const data = await response.json()

//       if (data.success) {
//         const completionMessage: VoiceMessage = {
//           id: (Date.now() + 1).toString(),
//           speaker: "assistant",
//           message: data.message,
//           timestamp: new Date().toISOString(),
//         }

//         setTimeout(() => {
//           typeMessage(completionMessage)
//           setTimeout(() => {
//             speakMessage(data.message)
//           }, 1500)
//         }, 3000)

//         setCurrentStep("completed")

//         toast({
//           title: "Task Completed! 🎉",
//           description: "Your appointment has been booked successfully!",
//         })
//       }
//     } catch (error) {
//       console.error("Error executing task:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleTextSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (textInput.trim() && !isTyping) {
//       handleUserMessage(textInput.trim())
//       setTextInput("")
//     }
//   }

//   const openAssistant = () => {
//     setIsOpen(true)
//     if (!sessionId) {
//       startVoiceSession()
//     }
//   }

//   const getStepEmoji = (step: string) => {
//     switch (step) {
//       case "greeting":
//         return "👋"
//       case "collecting_service":
//         return "🔍"
//       case "collecting_email":
//         return "📧"
//       case "collecting_location":
//         return "📍"
//       case "collecting_preferences":
//         return "⚙️"
//       case "confirming":
//         return "✅"
//       case "executing":
//         return "🔄"
//       case "completed":
//         return "🎉"
//       default:
//         return "💬"
//     }
//   }

//   const quickReplies = {
//     greeting: ["I need a salon", "Find a restaurant", "Book a doctor", "Help me find a spa"],
//     collecting_email: ["anikeshuzumaki@gmail.com", "Use my email", "Skip email"],
//     collecting_location: ["Delhi", "Mumbai", "Near me", "Bangalore"],
//     collecting_preferences: ["Today", "Tomorrow", "This weekend", "Cheapest option"],
//     confirming: ["Yes, proceed", "Looks good", "Make the booking", "Go ahead"],
//   }

//   return (
//     <>
//       {/* Floating Assistant Button */}
//       {!isOpen && (
//         <Button
//           onClick={openAssistant}
//           className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg z-50 animate-pulse"
//           size="icon"
//         >
//           <Sparkles className="h-6 w-6 text-white" />
//         </Button>
//       )}

//       {/* AI Assistant Chat Window - PROPERLY SIZED */}
//       {isOpen && (
//         <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col border-2 border-blue-200 overflow-hidden">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0">
//             <CardTitle className="text-lg flex items-center gap-2 min-w-0">
//               <Bot className="h-5 w-5 text-blue-600 flex-shrink-0" />
//               <span className="truncate">AI Assistant</span>
//             </CardTitle>
//             <div className="flex items-center gap-1 flex-shrink-0">
//               <Badge variant="outline" className="text-xs max-w-[80px] truncate">
//                 {getStepEmoji(currentStep)} {currentStep.replace("_", " ")}
//               </Badge>
//               {voiceError ? (
//                 <Badge className="bg-red-100 text-red-800 text-xs">Error</Badge>
//               ) : speechSupported ? (
//                 <Badge className="bg-green-100 text-green-800 text-xs">{useGeminiSpeech ? "Gemini" : "Voice"}</Badge>
//               ) : (
//                 <Badge className="bg-yellow-100 text-yellow-800 text-xs">Text</Badge>
//               )}
//               <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6 flex-shrink-0">
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           </CardHeader>

//           <CardContent className="flex-1 flex flex-col p-4 min-h-0 overflow-hidden">
//             {/* Voice Error Banner */}
//             {voiceError && (
//               <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 flex-shrink-0">
//                 <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
//                 <span className="text-xs text-red-700 flex-1 truncate">{voiceError}</span>
//                 <Button
//                   onClick={() => setVoiceError(null)}
//                   size="sm"
//                   variant="ghost"
//                   className="h-6 w-6 p-0 flex-shrink-0"
//                 >
//                   <X className="h-3 w-3" />
//                 </Button>
//               </div>
//             )}

//             {/* Messages - PROPERLY CONSTRAINED */}
//             <div className="flex-1 overflow-y-auto space-y-3 mb-4 px-1">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex ${message.speaker === "user" ? "justify-end" : "justify-start"}`}
//                 >
//                   <div
//                     className={`max-w-[75%] p-3 rounded-lg flex items-start gap-2 word-wrap break-words ${
//                       message.speaker === "user"
//                         ? "bg-blue-600 text-white flex-row-reverse"
//                         : "bg-gray-100 text-gray-900"
//                     }`}
//                     style={{
//                       wordWrap: "break-word",
//                       overflowWrap: "break-word",
//                       wordBreak: "break-word",
//                       maxWidth: "75%",
//                     }}
//                   >
//                     {message.speaker === "user" ? (
//                       <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
//                     ) : (
//                       <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />
//                     )}
//                     <p className="text-sm leading-relaxed break-words" style={{ wordBreak: "break-word" }}>
//                       {message.message}
//                     </p>
//                   </div>
//                 </div>
//               ))}

//               {isTyping && (
//                 <div className="flex justify-start">
//                   <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2 max-w-[75%]">
//                     <Bot className="h-4 w-4 text-blue-600 flex-shrink-0" />
//                     <div className="flex space-x-1">
//                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
//                       <div
//                         className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
//                         style={{ animationDelay: "0.1s" }}
//                       ></div>
//                       <div
//                         className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
//                         style={{ animationDelay: "0.2s" }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div ref={messagesEndRef} />
//             </div>

//             {/* Voice Controls - CONSTRAINED */}
//             {speechSupported && !voiceError && (
//               <div className="flex items-center justify-center gap-2 mb-3 px-2">
//                 <Button
//                   onClick={isListening ? stopListening : startListening}
//                   disabled={isLoading || isTyping}
//                   className={`flex-1 max-w-[120px] ${
//                     isListening ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-green-600 hover:bg-green-700"
//                   }`}
//                   size="sm"
//                 >
//                   {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
//                   <span className="ml-1 text-xs">{isListening ? "Stop" : "Speak"}</span>
//                 </Button>

//                 <Button
//                   onClick={isSpeaking ? stopSpeaking : undefined}
//                   disabled={!isSpeaking}
//                   variant="outline"
//                   size="sm"
//                   className={`flex-1 max-w-[120px] ${isSpeaking ? "animate-pulse" : ""}`}
//                 >
//                   {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
//                   <span className="ml-1 text-xs">{isSpeaking ? "Stop" : "Audio"}</span>
//                 </Button>
//               </div>
//             )}

//             {/* Quick Replies - PROPERLY CONSTRAINED */}
//             {quickReplies[currentStep as keyof typeof quickReplies] && !isTyping && (
//               <div className="mb-3 px-2">
//                 <div className="text-xs text-gray-500 mb-2">Quick replies:</div>
//                 <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
//                   {quickReplies[currentStep as keyof typeof quickReplies].map((reply, index) => (
//                     <Button
//                       key={index}
//                       variant="outline"
//                       size="sm"
//                       className="text-xs h-7 flex-shrink-0 max-w-[140px] truncate"
//                       onClick={() => handleUserMessage(reply)}
//                       disabled={isLoading || isTyping}
//                       title={reply} // Show full text on hover
//                     >
//                       {reply.length > 15 ? `${reply.substring(0, 15)}...` : reply}
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Text Input - CONSTRAINED */}
//             <div className="px-2">
//               <form onSubmit={handleTextSubmit} className="flex gap-2">
//                 <input
//                   type="text"
//                   value={textInput}
//                   onChange={(e) => setTextInput(e.target.value)}
//                   placeholder={speechSupported ? "Type or speak..." : "Type message..."}
//                   disabled={isLoading || isTyping}
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
//                   style={{ maxWidth: "calc(100% - 50px)" }}
//                 />
//                 <Button
//                   type="submit"
//                   disabled={isLoading || !textInput.trim() || isTyping}
//                   size="sm"
//                   className="bg-blue-600 hover:bg-blue-700 flex-shrink-0 w-10 h-10"
//                 >
//                   <Send className="h-4 w-4" />
//                 </Button>
//               </form>

//               {/* Help text */}
//               <div className="text-xs text-gray-500 text-center mt-2 px-1">
//                 {useGeminiSpeech ? (
//                   <>🤖 Using Gemini AI for speech</>
//                 ) : speechSupported ? (
//                   <>💡 Wait for me to finish, then click "Speak"</>
//                 ) : (
//                   <>💡 I'll help you find and book services!</>
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </>
//   )
// }



//! new ui chnage+ some fixes


"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX, X, Send, Bot, User, Sparkles, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VoiceMessage {
  id: string
  speaker: "user" | "assistant"
  message: string
  timestamp: string
}

interface VoiceAssistantProps {
  onDataCollected?: (data: any) => void
}

export function VoiceAssistant({ onDataCollected }: VoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<VoiceMessage[]>([])
  const [currentStep, setCurrentStep] = useState("greeting")
  const [isLoading, setIsLoading] = useState(false)
  const [textInput, setTextInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [useGeminiSpeech, setUseGeminiSpeech] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const synthesisRef = useRef<SpeechSynthesis | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Check browser support and initialize
  useEffect(() => {
    const checkSpeechSupport = () => {
      const hasRecognition = "webkitSpeechRecognition" in window || "SpeechRecognition" in window
      const hasSynthesis = "speechSynthesis" in window
      const hasMediaRecorder = "MediaRecorder" in window

      setSpeechSupported(hasRecognition && hasSynthesis)

      if (!hasRecognition && hasMediaRecorder) {
        // Fallback to Gemini Speech API
        setUseGeminiSpeech(true)
        setSpeechSupported(true)
        console.log("🎤 Using Gemini Speech API as fallback")
      }

      if (hasSynthesis) {
        synthesisRef.current = window.speechSynthesis
      }
    }

    checkSpeechSupport()

    // Cleanup on unmount or page refresh
    return () => {
      cleanupAllAudio()
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Cleanup function for all audio-related activities
  const cleanupAllAudio = () => {
    // Stop speech synthesis
    if (synthesisRef.current) {
      synthesisRef.current.cancel()
      setIsSpeaking(false)
    }

    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }

    // Clear typing interval
    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current)
      typeIntervalRef.current = null
    }

    // Reset listening state
    setIsListening(false)
  }

  // Close assistant with proper cleanup
  const closeAssistant = () => {
    console.log("🔇 Closing assistant and stopping all audio")

    // Stop all audio activities
    cleanupAllAudio()

    // Reset states
    setIsOpen(false)
    setIsTyping(false)
    setIsLoading(false)
    setVoiceError(null)
  }

  const startVoiceSession = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/voice/session/start", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setSessionId(data.session.id)
        setCurrentStep(data.session.currentStep)

        // Get initial greeting
        const sessionResponse = await fetch(`/api/voice/session/${data.session.id}`)
        const sessionData = await sessionResponse.json()

        if (sessionData.success && sessionData.session.messages.length > 0) {
          const formattedMessages = sessionData.session.messages.map((msg: any) => ({
            id: msg.id,
            speaker: msg.speaker,
            message: msg.message,
            timestamp: msg.timestamp,
          }))

          // Animate the greeting message
          setMessages([])
          setTimeout(() => {
            typeMessage(formattedMessages[0])
            // Speak the greeting only if assistant is still open
            setTimeout(() => {
              if (isOpen) {
                speakMessage(formattedMessages[0].message)
              }
            }, 1000)
          }, 500)
        }
      }
    } catch (error) {
      console.error("Error starting voice session:", error)
      toast({
        title: "Error",
        description: "Failed to start assistant session",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const typeMessage = (message: VoiceMessage) => {
    setIsTyping(true)
    setMessages((prev) => [...prev, { ...message, message: "" }])

    const fullMessage = message.message
    let currentText = ""
    let index = 0

    typeIntervalRef.current = setInterval(() => {
      if (index < fullMessage.length && isOpen) {
        currentText += fullMessage[index]
        setMessages((prev) => prev.map((msg, i) => (i === prev.length - 1 ? { ...msg, message: currentText } : msg)))
        index++
      } else {
        if (typeIntervalRef.current) {
          clearInterval(typeIntervalRef.current)
          typeIntervalRef.current = null
        }
        setIsTyping(false)
      }
    }, 30)
  }

  // Gemini Speech-to-Text API
  const transcribeWithGemini = async (audioBlob: Blob): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "audio.webm")

      const response = await fetch("/api/voice/transcribe", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        return data.transcript
      } else {
        throw new Error(data.error || "Transcription failed")
      }
    } catch (error) {
      console.error("Gemini transcription error:", error)
      throw error
    }
  }

  // Start recording with MediaRecorder (for Gemini API)
  const startGeminiRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)

      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })

        try {
          setIsLoading(true)
          const transcript = await transcribeWithGemini(audioBlob)

          if (transcript.trim()) {
            handleUserMessage(transcript, transcript, 1.0)
          } else {
            toast({
              title: "No speech detected",
              description: "Please try speaking again",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Transcription failed:", error)
          toast({
            title: "Speech recognition failed",
            description: "Please try typing instead",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsListening(true)
      setVoiceError(null)

      console.log("🎤 Started Gemini recording")
    } catch (error) {
      console.error("Error starting Gemini recording:", error)
      setVoiceError("Microphone access denied")
      toast({
        title: "Microphone Error",
        description: "Please allow microphone access and try again",
        variant: "destructive",
      })
    }
  }

  const stopGeminiRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
      setIsListening(false)
      console.log("🛑 Stopped Gemini recording")
    }
  }

  // Web Speech API (fallback)
  const startWebSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setIsListening(true)
      setVoiceError(null)
      console.log("🎤 Web Speech started")
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      const confidence = event.results[0][0].confidence
      handleUserMessage(transcript, transcript, confidence)
    }

    recognition.onerror = (event: any) => {
      console.error("Web Speech error:", event.error)
      setIsListening(false)

      if (event.error === "network") {
        // Switch to Gemini API
        setUseGeminiSpeech(true)
        toast({
          title: "Switching to better speech service",
          description: "Using Gemini AI for speech recognition",
        })
      } else {
        setVoiceError(`Speech error: ${event.error}`)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    try {
      recognition.start()
    } catch (error) {
      console.error("Error starting Web Speech:", error)
      setUseGeminiSpeech(true)
    }
  }

  const startListening = () => {
    if (!speechSupported) {
      toast({
        title: "Speech not supported",
        description: "Please use text input",
        variant: "destructive",
      })
      return
    }

    // Stop any ongoing speech
    if (synthesisRef.current && isSpeaking) {
      synthesisRef.current.cancel()
      setIsSpeaking(false)
    }

    setTimeout(() => {
      if (useGeminiSpeech) {
        startGeminiRecording()
      } else {
        startWebSpeechRecognition()
      }
    }, 500)
  }

  const stopListening = () => {
    if (useGeminiSpeech) {
      stopGeminiRecording()
    } else {
      setIsListening(false)
    }
  }

  const speakMessage = (message: string) => {
    if (!synthesisRef.current || !isOpen) return

    synthesisRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(message)
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 0.8

    utterance.onstart = () => {
      setIsSpeaking(true)
      console.log("🔊 Started speaking")
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      console.log("🔇 Finished speaking")
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    // Only speak if assistant is still open
    if (isOpen) {
      synthesisRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const handleUserMessage = async (message: string, audioTranscript?: string, confidence?: number) => {
    if (!sessionId) return

    try {
      setIsLoading(true)

      const userMessage: VoiceMessage = {
        id: Date.now().toString(),
        speaker: "user",
        message,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMessage])

      const response = await fetch("/api/voice/session/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          message,
          audioTranscript,
          confidence,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: VoiceMessage = {
          id: (Date.now() + 1).toString(),
          speaker: "assistant",
          message: data.response.message,
          timestamp: new Date().toISOString(),
        }

        setCurrentStep(data.response.nextStep)

        setTimeout(() => {
          if (isOpen) {
            typeMessage(assistantMessage)
            // Speak after typing only if assistant is still open
            setTimeout(() => {
              if (isOpen) {
                speakMessage(data.response.message)
              }
            }, 1500)
          }
        }, 500)

        if (data.response.shouldExecute) {
          setTimeout(() => {
            if (isOpen) {
              executeTask()
            }
          }, 3000)
        }

        if (data.response.collectedData && onDataCollected) {
          onDataCollected(data.response.collectedData)
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to process message",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const executeTask = async () => {
    if (!sessionId || !isOpen) return

    try {
      setIsLoading(true)

      const workingMessage: VoiceMessage = {
        id: Date.now().toString(),
        speaker: "assistant",
        message: "🔄 Perfect! Let me start working on that for you. I'm searching for providers and making calls...",
        timestamp: new Date().toISOString(),
      }

      setTimeout(() => {
        if (isOpen) {
          typeMessage(workingMessage)
          setTimeout(() => {
            if (isOpen) {
              speakMessage(workingMessage.message)
            }
          }, 1000)
        }
      }, 500)

      const response = await fetch("/api/voice/session/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      })

      const data = await response.json()

      if (data.success) {
        const completionMessage: VoiceMessage = {
          id: (Date.now() + 1).toString(),
          speaker: "assistant",
          message: data.message,
          timestamp: new Date().toISOString(),
        }

        setTimeout(() => {
          if (isOpen) {
            typeMessage(completionMessage)
            setTimeout(() => {
              if (isOpen) {
                speakMessage(data.message)
              }
            }, 1500)
          }
        }, 3000)

        setCurrentStep("completed")

        toast({
          title: "Task Completed! 🎉",
          description: "Your appointment has been booked successfully!",
        })
      }
    } catch (error) {
      console.error("Error executing task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (textInput.trim() && !isTyping) {
      handleUserMessage(textInput.trim())
      setTextInput("")
    }
  }

  const openAssistant = () => {
    setIsOpen(true)
    if (!sessionId) {
      startVoiceSession()
    }
  }

  const getStepEmoji = (step: string) => {
    switch (step) {
      case "greeting":
        return "👋"
      case "collecting_service":
        return "🔍"
      case "collecting_email":
        return "📧"
      case "collecting_location":
        return "📍"
      case "collecting_preferences":
        return "⚙️"
      case "confirming":
        return "✅"
      case "executing":
        return "🔄"
      case "completed":
        return "🎉"
      default:
        return "💬"
    }
  }

  const quickReplies = {
    greeting: ["I need a salon", "Find a restaurant", "Book a doctor", "Help me find a spa"],
    collecting_email: ["anikeshuzumaki@gmail.com", "Use my email", "Skip email"],
    collecting_location: ["Delhi", "Mumbai", "Near me", "Bangalore"],
    collecting_preferences: ["Today", "Tomorrow", "This weekend", "Cheapest option"],
    confirming: ["Yes, proceed", "Looks good", "Make the booking", "Go ahead"],
  }

  return (
    <>
      {/* Floating Assistant Button */}
      {!isOpen && (
        <Button
          onClick={openAssistant}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg z-50 animate-pulse"
          size="icon"
        >
          <Sparkles className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* AI Assistant Chat Window - DARK THEME */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 flex-shrink-0 border-b border-white/10">
            <CardTitle className="text-lg flex items-center gap-2 min-w-0 text-white">
              <Bot className="h-5 w-5 text-cyan-400 flex-shrink-0" />
              <span className="truncate">AI Assistant</span>
            </CardTitle>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Badge className="bg-white/10 text-gray-300 border-white/20 text-xs max-w-[80px] truncate">
                {getStepEmoji(currentStep)} {currentStep.replace("_", " ")}
              </Badge>
              {voiceError ? (
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">Error</Badge>
              ) : speechSupported ? (
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                  {useGeminiSpeech ? "Gemini" : "Voice"}
                </Badge>
              ) : (
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">Text</Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={closeAssistant}
                className="h-6 w-6 flex-shrink-0 text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="relative flex-1 flex flex-col p-4 min-h-0 overflow-hidden">
            {/* Voice Error Banner */}
            {voiceError && (
              <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2 flex-shrink-0">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span className="text-xs text-red-300 flex-1 truncate">{voiceError}</span>
                <Button
                  onClick={() => setVoiceError(null)}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 flex-shrink-0 text-red-400 hover:text-red-300"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Messages - DARK THEME */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 px-1">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.speaker === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-lg flex items-start gap-2 word-wrap break-words ${
                      message.speaker === "user"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white flex-row-reverse"
                        : "bg-white/10 text-gray-200 border border-white/10"
                    }`}
                    style={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                      maxWidth: "75%",
                    }}
                  >
                    {message.speaker === "user" ? (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-cyan-400" />
                    )}
                    <p className="text-sm leading-relaxed break-words" style={{ wordBreak: "break-word" }}>
                      {message.message}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 border border-white/10 p-3 rounded-lg flex items-center gap-2 max-w-[75%]">
                    <Bot className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Voice Controls - DARK THEME */}
            {speechSupported && !voiceError && (
              <div className="flex items-center justify-center gap-2 mb-3 px-2">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isLoading || isTyping}
                  className={`flex-1 max-w-[120px] ${
                    isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-emerald-500 hover:bg-emerald-600"
                  }`}
                  size="sm"
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  <span className="ml-1 text-xs">{isListening ? "Stop" : "Speak"}</span>
                </Button>

                <Button
                  onClick={isSpeaking ? stopSpeaking : undefined}
                  disabled={!isSpeaking}
                  variant="outline"
                  size="sm"
                  className={`flex-1 max-w-[120px] bg-white/5 border-white/20 text-white hover:bg-white/10 ${
                    isSpeaking ? "animate-pulse" : ""
                  }`}
                >
                  {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  <span className="ml-1 text-xs">{isSpeaking ? "Stop" : "Audio"}</span>
                </Button>
              </div>
            )}

            {/* Quick Replies - DARK THEME */}
            {quickReplies[currentStep as keyof typeof quickReplies] && !isTyping && (
              <div className="mb-3 px-2">
                <div className="text-xs text-gray-400 mb-2">Quick replies:</div>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                  {quickReplies[currentStep as keyof typeof quickReplies].map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 flex-shrink-0 max-w-[140px] truncate bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
                      onClick={() => handleUserMessage(reply)}
                      disabled={isLoading || isTyping}
                      title={reply}
                    >
                      {reply.length > 15 ? `${reply.substring(0, 15)}...` : reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Text Input - DARK THEME */}
            <div className="px-2">
              <form onSubmit={handleTextSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={speechSupported ? "Type or speak..." : "Type message..."}
                  disabled={isLoading || isTyping}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/20 text-white placeholder:text-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 min-w-0"
                  style={{ maxWidth: "calc(100% - 50px)" }}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !textInput.trim() || isTyping}
                  size="sm"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 flex-shrink-0 w-10 h-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>

              {/* Help text */}
              <div className="text-xs text-gray-400 text-center mt-2 px-1">
                {useGeminiSpeech ? (
                  <>🤖 Using Gemini AI for speech</>
                ) : speechSupported ? (
                  <>💡 Wait for me to finish, then click "Speak"</>
                ) : (
                  <>💡 I'll help you find and book services!</>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
