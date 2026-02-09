"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const API_URL = "http://localhost:8080/api/v1"

interface ActivityStats {
  newPatients: number
  appointmentsToday: number
  diagnosticsMade: number
}

interface Assistant {
  id: string
  name: string
  telephone: string
  email: string
  photo_profil: string
}

interface Appointment {
  date: string
  utilisateur?: { prenom: string; nom: string }
  raison: string
  statut: string
}

export default function DoctorDashboard() {
  const [activityStats, setActivityStats] = useState<ActivityStats>({
    newPatients: 0,
    appointmentsToday: 0,
    diagnosticsMade: 0,
  })

  const [assignedAssistant, setAssignedAssistant] = useState<Assistant | null>(null)
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [doctorId, setDoctorId] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const storedDoctorId = localStorage.getItem("userId")
        if (storedDoctorId) {
          setDoctorId(storedDoctorId)

          // Fetch doctor's appointments: GET /medecin/{id}/rendezvous
          const appointmentsRes = await fetch(`${API_URL}/medecin/${storedDoctorId}/rendezvous`)
          const appointmentsData = appointmentsRes.ok ? await appointmentsRes.json() : []

          // Fetch doctor's consultations for diagnostics: GET /medecin/{id}/consultations
          const consultationsRes = await fetch(`${API_URL}/medecin/${storedDoctorId}/consultations`)
          const consultationsData = consultationsRes.ok ? await consultationsRes.json() : []

          // Get today's appointments
          const today = new Date().toISOString().split("T")[0]
          const todayAppts = appointmentsData.filter(
            (appt: any) => appt.date && appt.date.split("T")[0] === today
          )

          setActivityStats({
            newPatients: appointmentsData.length > 0 ? Math.floor(appointmentsData.length * 0.3) : 0,
            appointmentsToday: todayAppts.length,
            diagnosticsMade: consultationsData.length,
          })

          setTodayAppointments(
            todayAppts.slice(0, 10).map((appt: any) => ({
              date: appt.date,
              utilisateur: appt.patient?.utilisateur,
              raison: appt.raison,
              statut: appt.statut,
            }))
          )

          // Fetch assigned assistant (from secretaire table if assigned)
          const secretariesRes = await fetch(`${API_URL}/secretaire`)
          if (secretariesRes.ok) {
            const secretariesData = await secretariesRes.json()
            if (secretariesData.length > 0) {
              setAssignedAssistant({
                id: secretariesData[0].id,
                name: `${secretariesData[0].utilisateur?.prenom} ${secretariesData[0].utilisateur?.nom}`,
                telephone: secretariesData[0].utilisateur?.telephone,
                email: secretariesData[0].compte?.email,
                photo_profil: secretariesData[0].utilisateur?.photo_profil || "/placeholder-user.jpg",
              })
            }
          }
        }
      } catch (error) {
        console.log("[v0] Error fetching doctor dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <DashboardLayout userRole="doctor" pageTitle="Dashboard">
        <div className="space-y-6">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="doctor" pageTitle="Dashboard">
      <div className="space-y-6">
        {/* Activity Overview Section */}
        <div>
          <h2 className="text-xl font-bold text-[#0A1F44] mb-4">Activity Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* New Patients */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">New Patients</p>
                    <p className="text-4xl font-bold text-[#0A1F44]">{activityStats.newPatients}</p>
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointments Today */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Appointments Today</p>
                    <p className="text-4xl font-bold text-[#0A1F44]">{activityStats.appointmentsToday}</p>
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Diagnostics */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Consultations</p>
                    <p className="text-4xl font-bold text-[#0A1F44]">{activityStats.diagnosticsMade}</p>
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Grid: Assigned Assistant + Today's Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assigned Assistant Card */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm h-full">
              <CardHeader>
                <CardTitle className="text-lg">Assigned Assistant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignedAssistant ? (
                  <>
                    <div className="flex items-center gap-4">
                      <img
                        src={assignedAssistant.photo_profil}
                        alt={assignedAssistant.name}
                        className="w-14 h-14 rounded-full object-cover border border-gray-300"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#0A1F44]">{assignedAssistant.name}</h3>
                        <p className="text-sm text-gray-600">{assignedAssistant.telephone}</p>
                        <p className="text-sm text-gray-600">{assignedAssistant.email}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4">No assistant assigned</p>
                )}

                <Link href="/dashboard/doctor/consultations/new">
                  <Button className="w-full bg-[#0066FF] text-white hover:bg-[#0052CC] font-semibold">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    New Consultation Report
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Today's Appointments Card */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">TODAY APPOINTMENTS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Patient Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayAppointments.length > 0 ? (
                        todayAppointments.slice(0, 6).map((appointment, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(appointment.date).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </td>
                            <td className="py-3 px-4 font-medium text-[#0A1F44]">
                              {appointment.utilisateur?.prenom} {appointment.utilisateur?.nom}
                            </td>
                            <td className="py-3 px-4 text-gray-600">{appointment.raison || appointment.statut}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-6 text-center text-gray-500">No appointments today</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" disabled className="text-gray-600">
            Previous
          </Button>
          <Button className="bg-[#0066FF] text-white hover:bg-[#0052CC] w-10 h-10">
            1
          </Button>
          <Button variant="outline" className="w-10 h-10">
            2
          </Button>
          <Button variant="outline" className="w-10 h-10">
            3
          </Button>
          <Button variant="outline" className="w-10 h-10">
            4
          </Button>
          <Button variant="outline" className="text-blue-600 hover:text-blue-700">
            Next
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
