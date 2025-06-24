// "use client";

// import type React from "react";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Loader2,
//   Send,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Mail,
//   MapPin,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { DetailedStepViewer } from "@/components/detailed-step-viewer";

// interface TaskStep {
//   step: string;
//   status: "pending" | "completed" | "failed";
//   result?: any;
//   error?: string;
//   details?: any;
//   timestamp?: string;
// }

// interface TaskResult {
//   success: boolean;
//   taskId: string;
//   steps: TaskStep[];
//   finalResult?: any;
//   error?: string;
// }

// export default function HomePage() {
//   const [input, setInput] = useState("");
//   const [email, setEmail] = useState("anikeshuzumaki@gmail.com");
//   const [location, setLocation] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isGettingLocation, setIsGettingLocation] = useState(false);
//   const [taskResult, setTaskResult] = useState<TaskResult | null>(null);
//   const { toast } = useToast();

//   const getCurrentLocation = async () => {
//     if (!navigator.geolocation) {
//       toast({
//         title: "Location not supported",
//         description: "Your browser doesn't support geolocation",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsGettingLocation(true);

//     const options = {
//       enableHighAccuracy: true,
//       timeout: 15000, // 15 seconds
//       maximumAge: 300000, // 5 minutes
//     };

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         try {
//           const { latitude, longitude } = position.coords;
//           console.log(`Got coordinates: ${latitude}, ${longitude}`);

//           toast({
//             title: "Location found!",
//             description: "Getting address...",
//           });

//           // Reverse geocoding to get address
//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
//             {
//               headers: {
//                 "User-Agent": "TaskExecutionApp/1.0",
//               },
//             }
//           );

//           if (response.ok) {
//             const data = await response.json();
//             console.log("Geocoding response:", data);

//             // Extract relevant address parts
//             const address = data.address;
//             let locationString = "";

//             if (address) {
//               const parts = [];
//               if (address.suburb || address.neighbourhood)
//                 parts.push(address.suburb || address.neighbourhood);
//               if (address.city || address.town)
//                 parts.push(address.city || address.town);
//               if (address.state) parts.push(address.state);

//               locationString =
//                 parts.length > 0 ? parts.join(", ") : data.display_name;
//             } else {
//               locationString = data.display_name || `${latitude}, ${longitude}`;
//             }

//             setLocation(locationString);

//             toast({
//               title: "Location set successfully!",
//               description: `Using: ${locationString}`,
//             });
//           } else {
//             const fallbackLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
//             setLocation(fallbackLocation);
//             toast({
//               title: "Location set",
//               description: "Using coordinates as location",
//             });
//           }
//         } catch (error) {
//           console.error("Error getting address:", error);

//           // Fallback to coordinates
//           const { latitude, longitude } = position.coords;
//           const fallbackLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
//           setLocation(fallbackLocation);

//           toast({
//             title: "Location set",
//             description: "Using GPS coordinates",
//           });
//         } finally {
//           setIsGettingLocation(false);
//         }
//       },
//       (error) => {
//         console.error("Geolocation error:", error);
//         setIsGettingLocation(false);

//         let message = "Could not get your location";
//         let title = "Location error";

//         switch (error.code) {
//           case error.PERMISSION_DENIED:
//             title = "Permission denied";
//             message =
//               "Please allow location access in your browser settings. Click the location icon in your browser's address bar and select 'Allow'.";
//             break;
//           case error.POSITION_UNAVAILABLE:
//             title = "Location unavailable";
//             message =
//               "Location information is not available. Please enter your location manually.";
//             break;
//           case error.TIMEOUT:
//             title = "Request timeout";
//             message =
//               "Location request timed out. Please try again or enter manually.";
//             break;
//           default:
//             title = "Location error";
//             message = "An unknown error occurred while getting your location.";
//             break;
//         }

//         toast({
//           title,
//           description: message,
//           variant: "destructive",
//         });
//       },
//       options
//     );
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim() || isProcessing) return;

//     setIsProcessing(true);
//     setTaskResult(null);

//     // Add location to input if provided
//     let finalInput = input;
//     if (location.trim()) {
//       finalInput = input.replace(/near me|nearby/gi, `near ${location}`);
//       if (!finalInput.includes("near") && !finalInput.includes("in ")) {
//         finalInput += ` near ${location}`;
//       }
//     }

//     try {
//       const response = await fetch("/api/execute-task", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userInput: finalInput,
//           userEmail: email.trim() || undefined,
//         }),
//       });

//       const result = await response.json();
//       setTaskResult(result);
//     } catch (error) {
//       console.error("Error executing task:", error);
//       setTaskResult({
//         success: false,
//         taskId: "",
//         steps: [],
//         error: "Failed to execute task",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "completed":
//         return <CheckCircle className="h-4 w-4 text-green-500" />;
//       case "failed":
//         return <XCircle className="h-4 w-4 text-red-500" />;
//       case "pending":
//         return <Clock className="h-4 w-4 text-yellow-500" />;
//       default:
//         return <Clock className="h-4 w-4 text-gray-400" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-100 text-green-800";
//       case "failed":
//         return "bg-red-100 text-red-800";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">
//             🤖 AI Task Executor
//           </h1>
//           <p className="text-lg text-gray-600">
//             Tell me what you need, and I'll handle everything automatically
//           </p>
//         </div>

//         <Card className="mb-8">
//           <CardHeader>
//             <CardTitle>What can I help you with?</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="flex gap-2">
//                 <Input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   placeholder="e.g., Find a salon near me, book the cheapest slot for Friday, and email me the details"
//                   className="flex-1"
//                   disabled={isProcessing}
//                 />
//                 <Button type="submit" disabled={isProcessing || !input.trim()}>
//                   {isProcessing ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     <Send className="h-4 w-4" />
//                   )}
//                   {isProcessing && <span className="ml-2">Processing...</span>}
//                 </Button>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Mail className="h-4 w-4 text-gray-500" />
//                 <Input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="your-email@gmail.com"
//                   className="flex-1"
//                   disabled={isProcessing}
//                 />
//               </div>

//               <div className="flex items-center gap-2">
//                 <MapPin className="h-4 w-4 text-gray-500" />
//                 <Input
//                   value={location}
//                   onChange={(e) => setLocation(e.target.value)}
//                   placeholder="Enter location or click to get current location"
//                   className="flex-1"
//                   disabled={isProcessing}
//                 />
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={getCurrentLocation}
//                   disabled={isGettingLocation || isProcessing}
//                   className="flex items-center gap-2 whitespace-nowrap"
//                 >
//                   {isGettingLocation ? (
//                     <>
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                       Getting...
//                     </>
//                   ) : (
//                     <>
//                       <MapPin className="h-4 w-4" />
//                       Current Location
//                     </>
//                   )}
//                 </Button>
//               </div>

//               <div className="text-xs text-gray-500">
//                 💡 <strong>Tips:</strong> Add your location for better results.
//                 Use "near me" in your request and click "Current Location" to
//                 auto-fill your GPS location. Make sure to allow location access
//                 when prompted.
//               </div>
//             </form>

//             <div className="mt-4 text-sm text-gray-500">
//               <p className="font-medium mb-2">Try these examples:</p>
//               <div className="space-y-1">
//                 <p>• "Find a hospital near Delhi Dwarka for tomorrow"</p>
//                 <p>
//                   • "Book a barber appointment near Delhi for tomorrow under
//                   ₹500"
//                 </p>
//                 <p>• "Find a spa near me, book a massage for this weekend"</p>
//                 <p>
//                   • "Schedule a haircut at the nearest salon for Friday evening"
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {taskResult && (
//           <div className="space-y-6">
//             {/* Summary Card */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   Task Execution Summary
//                   <Badge
//                     className={
//                       taskResult.success
//                         ? "bg-green-100 text-green-800"
//                         : "bg-red-100 text-red-800"
//                     }
//                   >
//                     {taskResult.success ? "Success" : "Failed"}
//                   </Badge>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {taskResult.success && taskResult.finalResult && (
//                   <div className="p-4 bg-green-50 rounded-lg border border-green-200">
//                     <h3 className="font-semibold text-green-800 mb-2">
//                       🎉 Task Completed Successfully!
//                     </h3>
//                     <div className="text-sm text-green-700 space-y-1">
//                       <p>✅ Appointment booked and saved to database</p>
//                       <p>✅ Confirmation email sent with calendar attachment</p>
//                       <p>
//                         {taskResult.finalResult.callMade
//                           ? "✅ Provider was contacted successfully"
//                           : "⚠️ Provider call failed - manual confirmation needed"}
//                       </p>
//                       <p>✅ You can view your appointment in the dashboard</p>
//                       {taskResult.finalResult.callLogId && (
//                         <p>📞 Call logs available for download</p>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {!taskResult.success && taskResult.error && (
//                   <div className="p-4 bg-red-50 rounded-lg border border-red-200">
//                     <h3 className="font-semibold text-red-800 mb-2">
//                       ❌ Task Failed
//                     </h3>
//                     <p className="text-sm text-red-700">{taskResult.error}</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Detailed Steps */}
//             <DetailedStepViewer
//               steps={taskResult.steps}
//               taskId={taskResult.taskId}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// new voice

// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Loader2, Send, CheckCircle, XCircle, Clock, Mail, MapPin } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { DetailedStepViewer } from "@/components/detailed-step-viewer"
// import { VoiceAssistant } from "@/components/voice-assistant"

// interface TaskStep {
//   step: string
//   status: "pending" | "completed" | "failed"
//   result?: any
//   error?: string
//   details?: any
//   timestamp?: string
// }

// interface TaskResult {
//   success: boolean
//   taskId: string
//   steps: TaskStep[]
//   finalResult?: any
//   error?: string
// }

// export default function HomePage() {
//   const [input, setInput] = useState("")
//   const [email, setEmail] = useState("anikeshuzumaki@gmail.com")
//   const [location, setLocation] = useState("")
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [isGettingLocation, setIsGettingLocation] = useState(false)
//   const [taskResult, setTaskResult] = useState<TaskResult | null>(null)
//   const { toast } = useToast()

//   const getCurrentLocation = async () => {
//     if (!navigator.geolocation) {
//       toast({
//         title: "Location not supported",
//         description: "Your browser doesn't support geolocation",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsGettingLocation(true)

//     const options = {
//       enableHighAccuracy: true,
//       timeout: 15000, // 15 seconds
//       maximumAge: 300000, // 5 minutes
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         try {
//           const { latitude, longitude } = position.coords
//           console.log(`Got coordinates: ${latitude}, ${longitude}`)

//           toast({
//             title: "Location found!",
//             description: "Getting address...",
//           })

//           // Reverse geocoding to get address
//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
//             {
//               headers: {
//                 "User-Agent": "TaskExecutionApp/1.0",
//               },
//             },
//           )

//           if (response.ok) {
//             const data = await response.json()
//             console.log("Geocoding response:", data)

//             // Extract relevant address parts
//             const address = data.address
//             let locationString = ""

//             if (address) {
//               const parts = []
//               if (address.suburb || address.neighbourhood) parts.push(address.suburb || address.neighbourhood)
//               if (address.city || address.town) parts.push(address.city || address.town)
//               if (address.state) parts.push(address.state)

//               locationString = parts.length > 0 ? parts.join(", ") : data.display_name
//             } else {
//               locationString = data.display_name || `${latitude}, ${longitude}`
//             }

//             setLocation(locationString)

//             toast({
//               title: "Location set successfully!",
//               description: `Using: ${locationString}`,
//             })
//           } else {
//             const fallbackLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
//             setLocation(fallbackLocation)
//             toast({
//               title: "Location set",
//               description: "Using coordinates as location",
//             })
//           }
//         } catch (error) {
//           console.error("Error getting address:", error)

//           // Fallback to coordinates
//           const { latitude, longitude } = position.coords
//           const fallbackLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
//           setLocation(fallbackLocation)

//           toast({
//             title: "Location set",
//             description: "Using GPS coordinates",
//           })
//         } finally {
//           setIsGettingLocation(false)
//         }
//       },
//       (error) => {
//         console.error("Geolocation error:", error)
//         setIsGettingLocation(false)

//         let message = "Could not get your location"
//         let title = "Location error"

//         switch (error.code) {
//           case error.PERMISSION_DENIED:
//             title = "Permission denied"
//             message =
//               "Please allow location access in your browser settings. Click the location icon in your browser's address bar and select 'Allow'."
//             break
//           case error.POSITION_UNAVAILABLE:
//             title = "Location unavailable"
//             message = "Location information is not available. Please enter your location manually."
//             break
//           case error.TIMEOUT:
//             title = "Request timeout"
//             message = "Location request timed out. Please try again or enter manually."
//             break
//           default:
//             title = "Location error"
//             message = "An unknown error occurred while getting your location."
//             break
//         }

//         toast({
//           title,
//           description: message,
//           variant: "destructive",
//         })
//       },
//       options,
//     )
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!input.trim() || isProcessing) return

//     setIsProcessing(true)
//     setTaskResult(null)

//     // Add location to input if provided
//     let finalInput = input
//     if (location.trim()) {
//       finalInput = input.replace(/near me|nearby/gi, `near ${location}`)
//       if (!finalInput.includes("near") && !finalInput.includes("in ")) {
//         finalInput += ` near ${location}`
//       }
//     }

//     try {
//       const response = await fetch("/api/execute-task", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userInput: finalInput,
//           userEmail: email.trim() || undefined,
//         }),
//       })

//       const result = await response.json()
//       setTaskResult(result)
//     } catch (error) {
//       console.error("Error executing task:", error)
//       setTaskResult({
//         success: false,
//         taskId: "",
//         steps: [],
//         error: "Failed to execute task",
//       })
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const handleVoiceDataCollected = (data: any) => {
//     // Auto-fill form inputs from voice assistant
//     if (data.serviceType) {
//       setInput(data.serviceType)
//     }
//     if (data.userEmail) {
//       setEmail(data.userEmail)
//     }
//     if (data.location) {
//       setLocation(data.location)
//     }

//     toast({
//       title: "Voice data collected!",
//       description: "Form has been auto-filled from your voice input.",
//     })
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "completed":
//         return <CheckCircle className="h-4 w-4 text-green-500" />
//       case "failed":
//         return <XCircle className="h-4 w-4 text-red-500" />
//       case "pending":
//         return <Clock className="h-4 w-4 text-yellow-500" />
//       default:
//         return <Clock className="h-4 w-4 text-gray-400" />
//     }
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-100 text-green-800"
//       case "failed":
//         return "bg-red-100 text-red-800"
//       case "pending":
//         return "bg-yellow-100 text-yellow-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">🤖 AI Task Executor</h1> 
//           <p className="text-lg text-gray-600">Tell me what you need, and I'll handle everything automatically</p>
//           <p className="text-sm text-blue-600 mt-2">
//             💬 Try the voice assistant! Click the blue button in the bottom right.
//           </p>
          
//         </div>

//         <Card className="mb-8">
//           <CardHeader>
//             <CardTitle>What can I help you with?</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="flex gap-2">
//                 <Input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   placeholder="e.g., Find a salon near me, book the cheapest slot for Friday, and email me the details"
//                   className="flex-1"
//                   disabled={isProcessing}
//                 />
//                 <Button type="submit" disabled={isProcessing || !input.trim()}>
//                   {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//                   {isProcessing && <span className="ml-2">Processing...</span>}
//                 </Button>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Mail className="h-4 w-4 text-gray-500" />
//                 <Input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="your-email@gmail.com"
//                   className="flex-1"
//                   disabled={isProcessing}
//                 />
//               </div>

//               <div className="flex items-center gap-2">
//                 <MapPin className="h-4 w-4 text-gray-500" />
//                 <Input
//                   value={location}
//                   onChange={(e) => setLocation(e.target.value)}
//                   placeholder="Enter location or click to get current location"
//                   className="flex-1"
//                   disabled={isProcessing}
//                 />
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={getCurrentLocation}
//                   disabled={isGettingLocation || isProcessing}
//                   className="flex items-center gap-2 whitespace-nowrap"
//                 >
//                   {isGettingLocation ? (
//                     <>
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                       Getting...
//                     </>
//                   ) : (
//                     <>
//                       <MapPin className="h-4 w-4" />
//                       Current Location
//                     </>
//                   )}
//                 </Button>
//               </div>

//               <div className="text-xs text-gray-500">
//                 💡 <strong>Tips:</strong> Add your location for better results. Use "near me" in your request and click
//                 "Current Location" to auto-fill your GPS location. Make sure to allow location access when prompted.
//               </div>
//             </form>

//             <div className="mt-4 text-sm text-gray-500">
//               <p className="font-medium mb-2">Try these examples:</p>
//               <div className="space-y-1">
//                 <p>• "Find a hospital near Delhi Dwarka for tomorrow"</p>
//                 <p>• "Book a barber appointment near Delhi for tomorrow under ₹500"</p>
//                 <p>• "Find a spa near me, book a massage for this weekend"</p>
//                 <p>• "Schedule a haircut at the nearest salon for Friday evening"</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {taskResult && (
//           <div className="space-y-6">
//             {/* Summary Card */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   Task Execution Summary
//                   <Badge className={taskResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
//                     {taskResult.success ? "Success" : "Failed"}
//                   </Badge>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {taskResult.success && taskResult.finalResult && (
//                   <div className="p-4 bg-green-50 rounded-lg border border-green-200">
//                     <h3 className="font-semibold text-green-800 mb-2">🎉 Task Completed Successfully!</h3>
//                     <div className="text-sm text-green-700 space-y-1">
//                       <p>✅ Appointment booked and saved to database</p>
//                       <p>✅ Confirmation email sent with calendar attachment</p>
//                       <p>
//                         {taskResult.finalResult.callMade
//                           ? "✅ Provider was contacted successfully"
//                           : "⚠️ Provider call failed - manual confirmation needed"}
//                       </p>
//                       <p>✅ You can view your appointment in the dashboard</p>
//                       {taskResult.finalResult.callLogId && <p>📞 Call logs available for download</p>}
//                     </div>
//                   </div>
//                 )}

//                 {!taskResult.success && taskResult.error && (
//                   <div className="p-4 bg-red-50 rounded-lg border border-red-200">
//                     <h3 className="font-semibold text-red-800 mb-2">❌ Task Failed</h3>
//                     <p className="text-sm text-red-700">{taskResult.error}</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Detailed Steps */}
//             <DetailedStepViewer steps={taskResult.steps} taskId={taskResult.taskId} />
//           </div>
//         )}
//       </div>

//       {/* Voice Assistant */}
//       <VoiceAssistant onDataCollected={handleVoiceDataCollected} />
//     </div>
//   )
// }



// !ui chnage 


"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, CheckCircle, XCircle, Clock, Mail, MapPin, LayoutDashboard, Sparkles, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DetailedStepViewer } from "@/components/detailed-step-viewer"
import { VoiceAssistant } from "@/components/voice-assistant"

interface TaskStep {
  step: string
  status: "pending" | "completed" | "failed"
  result?: any
  error?: string
  details?: any
  timestamp?: string
}

interface TaskResult {
  success: boolean
  taskId: string
  steps: TaskStep[]
  finalResult?: any
  error?: string
}

export default function HomePage() {
  const [input, setInput] = useState("")
  const [email, setEmail] = useState("anikeshuzumaki@gmail.com")
  const [location, setLocation] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [taskResult, setTaskResult] = useState<TaskResult | null>(null)
  const { toast } = useToast()

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      })
      return
    }

    setIsGettingLocation(true)

    const options = {
      enableHighAccuracy: true,
      timeout: 15000, // 15 seconds
      maximumAge: 300000, // 5 minutes
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          console.log(`Got coordinates: ${latitude}, ${longitude}`)

          toast({
            title: "Location found!",
            description: "Getting address...",
          })

          // Reverse geocoding to get address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            {
              headers: {
                "User-Agent": "TaskExecutionApp/1.0",
              },
            },
          )

          if (response.ok) {
            const data = await response.json()
            console.log("Geocoding response:", data)

            // Extract relevant address parts
            const address = data.address
            let locationString = ""

            if (address) {
              const parts = []
              if (address.suburb || address.neighbourhood) parts.push(address.suburb || address.neighbourhood)
              if (address.city || address.town) parts.push(address.city || address.town)
              if (address.state) parts.push(address.state)

              locationString = parts.length > 0 ? parts.join(", ") : data.display_name
            } else {
              locationString = data.display_name || `${latitude}, ${longitude}`
            }

            setLocation(locationString)

            toast({
              title: "Location set successfully!",
              description: `Using: ${locationString}`,
            })
          } else {
            const fallbackLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            setLocation(fallbackLocation)
            toast({
              title: "Location set",
              description: "Using coordinates as location",
            })
          }
        } catch (error) {
          console.error("Error getting address:", error)

          // Fallback to coordinates
          const { latitude, longitude } = position.coords
          const fallbackLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          setLocation(fallbackLocation)

          toast({
            title: "Location set",
            description: "Using GPS coordinates",
          })
        } finally {
          setIsGettingLocation(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        setIsGettingLocation(false)

        let message = "Could not get your location"
        let title = "Location error"

        switch (error.code) {
          case error.PERMISSION_DENIED:
            title = "Permission denied"
            message =
              "Please allow location access in your browser settings. Click the location icon in your browser's address bar and select 'Allow'."
            break
          case error.POSITION_UNAVAILABLE:
            title = "Location unavailable"
            message = "Location information is not available. Please enter your location manually."
            break
          case error.TIMEOUT:
            title = "Request timeout"
            message = "Location request timed out. Please try again or enter manually."
            break
          default:
            title = "Location error"
            message = "An unknown error occurred while getting your location."
            break
        }

        toast({
          title,
          description: message,
          variant: "destructive",
        })
      },
      options,
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    setIsProcessing(true)
    setTaskResult(null)

    // Add location to input if provided
    let finalInput = input
    if (location.trim()) {
      finalInput = input.replace(/near me|nearby/gi, `near ${location}`)
      if (!finalInput.includes("near") && !finalInput.includes("in ")) {
        finalInput += ` near ${location}`
      }
    }

    try {
      const response = await fetch("/api/execute-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: finalInput,
          userEmail: email.trim() || undefined,
        }),
      })

      const result = await response.json()
      setTaskResult(result)
    } catch (error) {
      console.error("Error executing task:", error)
      setTaskResult({
        success: false,
        taskId: "",
        steps: [],
        error: "Failed to execute task",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVoiceDataCollected = (data: any) => {
    // Auto-fill form inputs from voice assistant
    if (data.serviceType) {
      setInput(data.serviceType)
    }
    if (data.userEmail) {
      setEmail(data.userEmail)
    }
    if (data.location) {
      setLocation(data.location)
    }

    toast({
      title: "Voice data collected!",
      description: "Form has been auto-filled from your voice input.",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-400" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-900/20 text-emerald-300 border-emerald-500/20"
      case "failed":
        return "bg-red-900/20 text-red-300 border-red-500/20"
      case "pending":
        return "bg-yellow-900/20 text-yellow-300 border-yellow-500/20"
      default:
        return "bg-gray-800/50 text-gray-300 border-gray-600/20"
    }
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
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-300"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </Link>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-gray-300">Powered by Advanced AI</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              Your Personal
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Assistant
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Tell me what you need, and I'll handle everything automatically. From booking appointments to finding the
            best services near you.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-blue-400">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Try the voice assistant! Click the floating button below.</span>
          </div>
        </div>

        {/* Main Input Card */}
        <Card className="mb-12 bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
          <CardHeader className="relative">
            <CardTitle className="text-2xl text-white flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              What can I help you with today?
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Main Input */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex gap-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Find a salon near me, book the cheapest slot for Friday, and email me the details..."
                    className="flex-1 h-14 bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/20 rounded-xl text-lg"
                    disabled={isProcessing}
                  />
                  <Button
                    type="submit"
                    disabled={isProcessing || !input.trim()}
                    className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                  >
                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    {isProcessing && <span className="ml-3">Processing...</span>}
                  </Button>
                </div>
              </div>

              {/* Email Input */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-email@gmail.com"
                    className="pl-12 h-12 bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20 rounded-lg"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Location Input */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter your location..."
                      className="pl-12 h-12 bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400/50 focus:ring-purple-400/20 rounded-lg"
                      disabled={isProcessing}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation || isProcessing}
                    className="h-12 px-6 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 rounded-lg transition-all duration-300"
                  >
                    {isGettingLocation ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Locating...
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 mr-2" />
                        Use Current
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {/* Tips Section */}
            <div className="bg-black/20 rounded-xl p-6 border border-white/10">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">💡 Pro Tips</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Get better results by adding your location and being specific about your needs.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-sm text-gray-300">"Find a hospital near Delhi Dwarka for tomorrow"</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-sm text-gray-300">"Book a barber appointment under ₹500"</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-sm text-gray-300">"Find a spa near me for this weekend"</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-sm text-gray-300">"Schedule a haircut for Friday evening"</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {taskResult && (
          <div className="space-y-8">
            {/* Summary Card */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5"></div>
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                    {taskResult.success ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <XCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                  Task Execution Summary
                  <Badge
                    className={`${
                      taskResult.success
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-red-500/20 text-red-300 border-red-500/30"
                    } ml-auto`}
                  >
                    {taskResult.success ? "Success" : "Failed"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                {taskResult.success && taskResult.finalResult && (
                  <div className="bg-emerald-500/10 rounded-xl p-6 border border-emerald-500/20">
                    <h3 className="font-semibold text-emerald-300 mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">🎉</div>
                      Task Completed Successfully!
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-emerald-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span>Appointment booked and saved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span>Confirmation email sent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {taskResult.finalResult.callMade ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-400" />
                        )}
                        <span>
                          {taskResult.finalResult.callMade
                            ? "Provider contacted successfully"
                            : "Manual confirmation needed"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span>Available in dashboard</span>
                      </div>
                    </div>
                  </div>
                )}

                {!taskResult.success && taskResult.error && (
                  <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
                    <h3 className="font-semibold text-red-300 mb-2 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      Task Failed
                    </h3>
                    <p className="text-sm text-red-200">{taskResult.error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detailed Steps */}
            <DetailedStepViewer steps={taskResult.steps} taskId={taskResult.taskId} />
          </div>
        )}
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant onDataCollected={handleVoiceDataCollected} />
    </div>
  )
}
