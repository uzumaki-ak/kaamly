// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Calendar, MapPin, Phone, Clock, Trash2 } from "lucide-react"
// import { CalendarDownload } from "@/components/calendar-download"

// interface Appointment {
//   id: string
//   type: string
//   providerName: string
//   providerPhone?: string
//   location: string
//   price?: string
//   scheduledTime: string
//   status: string
//   createdAt: string
// }

// export default function Dashboard() {
//   const [appointments, setAppointments] = useState<Appointment[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchAppointments()
//   }, [])

//   const fetchAppointments = async () => {
//     try {
//       const response = await fetch("/api/appointments")
//       const data = await response.json()
//       setAppointments(data.appointments || [])
//     } catch (error) {
//       console.error("Error fetching appointments:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const cancelAppointment = async (appointmentId: string) => {
//     try {
//       const response = await fetch(`/api/appointments/${appointmentId}`, {
//         method: "DELETE",
//       })

//       if (response.ok) {
//         setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId))
//       }
//     } catch (error) {
//       console.error("Error canceling appointment:", error)
//     }
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "confirmed":
//         return "bg-green-100 text-green-800"
//       case "pending":
//         return "bg-yellow-100 text-yellow-800"
//       case "cancelled":
//         return "bg-red-100 text-red-800"
//       case "completed":
//         return "bg-blue-100 text-blue-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="animate-pulse">
//             <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
//             <div className="space-y-4">
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="h-32 bg-gray-200 rounded"></div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
//           <Button onClick={() => (window.location.href = "/")}>Book New Appointment</Button>
//         </div>

//         {appointments.length === 0 ? (
//           <Card>
//             <CardContent className="text-center py-12">
//               <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
//               <p className="text-gray-500 mb-4">Start by booking your first appointment using our AI assistant</p>
//               <Button onClick={() => (window.location.href = "/")}>Book Appointment</Button>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {appointments.map((appointment) => (
//               <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
//                 <CardHeader>
//                   <div className="flex justify-between items-start">
//                     <CardTitle className="text-lg capitalize">{appointment.type} Appointment</CardTitle>
//                     <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <div className="flex items-center gap-2 text-sm">
//                     <Calendar className="h-4 w-4 text-gray-500" />
//                     <span>{new Date(appointment.scheduledTime).toLocaleString()}</span>
//                   </div>

//                   <div className="flex items-start gap-2 text-sm">
//                     <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
//                     <div>
//                       <p className="font-medium">{appointment.providerName}</p>
//                       <p className="text-gray-600">{appointment.location}</p>
//                     </div>
//                   </div>

//                   {appointment.providerPhone && (
//                     <div className="flex items-center gap-2 text-sm">
//                       <Phone className="h-4 w-4 text-gray-500" />
//                       <span>{appointment.providerPhone}</span>
//                     </div>
//                   )}

//                   {appointment.price && (
//                     <div className="flex items-center gap-2 text-sm">
//                       <span className="font-medium">Price: {appointment.price}</span>
//                     </div>
//                   )}

//                   <div className="flex items-center gap-2 text-xs text-gray-500">
//                     <Clock className="h-3 w-3" />
//                     <span>Booked {new Date(appointment.createdAt).toLocaleDateString()}</span>
//                   </div>

//                   <div className="pt-3 border-t flex flex-col gap-2">
//                     <CalendarDownload appointmentDetails={appointment} />

//                     {appointment.status !== "cancelled" && appointment.status !== "completed" && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => cancelAppointment(appointment.id)}
//                         className="w-full text-red-600 hover:text-red-700"
//                       >
//                         <Trash2 className="h-4 w-4 mr-2" />
//                         Cancel Appointment
//                       </Button>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }



// !new ui designn 

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  MapPin,
  Phone,
  Clock,
  Trash2,
  Home,
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle,
  Zap,
  TrendingUp,
  Activity,
  Users,
  ChevronRight,
} from "lucide-react"
import { CalendarDownload } from "@/components/calendar-download"

interface Appointment {
  id: string
  type: string
  providerName: string
  providerPhone?: string
  location: string
  price?: string
  scheduledTime: string
  status: string
  createdAt: string
}

export default function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments")
      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId))
      }
    } catch (error) {
      console.error("Error canceling appointment:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "completed":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-emerald-400" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  // Calculate stats
  const stats = {
    total: appointments.length,
    confirmed: appointments.filter((apt) => apt.status === "confirmed").length,
    pending: appointments.filter((apt) => apt.status === "pending").length,
    completed: appointments.filter((apt) => apt.status === "completed").length,
  }

  // Group appointments by status for better organization
  const upcomingAppointments = appointments
    .filter((apt) => apt.status === "confirmed" || apt.status === "pending")
    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())

  const pastAppointments = appointments
    .filter((apt) => apt.status === "completed" || apt.status === "cancelled")
    .sort((a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime())

  if (loading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px] opacity-20"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-white/10 rounded-xl w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-white/5 rounded-xl border border-white/10"></div>
              ))}
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-white/5 rounded-xl border border-white/10"></div>
              ))}
            </div>
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
          <span className="text-white">Dashboard</span>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Activity className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-gray-300">Your Appointment Dashboard</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              Manage Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Appointments
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Track, manage, and organize all your AI-booked appointments in one beautiful dashboard.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Appointments</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Confirmed</p>
                  <p className="text-3xl font-bold text-white">{stats.confirmed}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending</p>
                  <p className="text-3xl font-bold text-white">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Completed</p>
                  <p className="text-3xl font-bold text-white">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-12">
          <Link href="/">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Book New Appointment
            </Button>
          </Link>
          <Button
            variant="outline"
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-md"
            onClick={() => window.location.reload()}
          >
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {appointments.length === 0 ? (
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
            <CardContent className="relative text-center py-16">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-12 w-12 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No appointments yet</h3>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                Start your journey by booking your first appointment using our intelligent AI assistant. It's quick,
                easy, and completely automated.
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Book Your First Appointment
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Upcoming Appointments</h3>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    {upcomingAppointments.length}
                  </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {upcomingAppointments.map((appointment) => (
                    <Card
                      key={appointment.id}
                      className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardHeader className="relative">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg text-white capitalize flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                              <Users className="h-4 w-4 text-white" />
                            </div>
                            {appointment.type} Appointment
                          </CardTitle>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1">{appointment.status}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="relative space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="h-4 w-4 text-cyan-400" />
                          <span className="text-gray-300">{new Date(appointment.scheduledTime).toLocaleString()}</span>
                        </div>

                        <div className="flex items-start gap-3 text-sm">
                          <MapPin className="h-4 w-4 text-cyan-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-white">{appointment.providerName}</p>
                            <p className="text-gray-300">{appointment.location}</p>
                          </div>
                        </div>

                        {appointment.providerPhone && (
                          <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-cyan-400" />
                            <span className="text-gray-300">{appointment.providerPhone}</span>
                          </div>
                        )}

                        {appointment.price && (
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-500"></div>
                            <span className="font-medium text-emerald-300">Price: {appointment.price}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>Booked {new Date(appointment.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                          <CalendarDownload appointmentDetails={appointment} />

                          {appointment.status !== "cancelled" && appointment.status !== "completed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelAppointment(appointment.id)}
                              className="w-full bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-500/50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Cancel Appointment
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Past Appointments</h3>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {pastAppointments.length}
                  </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {pastAppointments.map((appointment) => (
                    <Card
                      key={appointment.id}
                      className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 relative overflow-hidden group opacity-75"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardHeader className="relative">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg text-white capitalize flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                              <Users className="h-4 w-4 text-white" />
                            </div>
                            {appointment.type} Appointment
                          </CardTitle>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1">{appointment.status}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="relative space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="h-4 w-4 text-purple-400" />
                          <span className="text-gray-300">{new Date(appointment.scheduledTime).toLocaleString()}</span>
                        </div>

                        <div className="flex items-start gap-3 text-sm">
                          <MapPin className="h-4 w-4 text-purple-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-white">{appointment.providerName}</p>
                            <p className="text-gray-300">{appointment.location}</p>
                          </div>
                        </div>

                        {appointment.providerPhone && (
                          <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-purple-400" />
                            <span className="text-gray-300">{appointment.providerPhone}</span>
                          </div>
                        )}

                        {appointment.price && (
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                            <span className="font-medium text-purple-300">Price: {appointment.price}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>Booked {new Date(appointment.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                          <CalendarDownload appointmentDetails={appointment} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
