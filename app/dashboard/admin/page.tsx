"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Card, CardContent } from "@/components/ui/card"

const API_URL = "http://localhost:8080/api/v1"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalSpecialties: 0,
    totalAssistants: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        // Fetch total doctors
        const doctorsRes = await fetch(`${API_URL}/medecin`)
        const doctorsData = doctorsRes.ok ? await doctorsRes.json() : []
        
        // Fetch total specialties
        const specialtiesRes = await fetch(`${API_URL}/specialite`)
        const specialtiesData = specialtiesRes.ok ? await specialtiesRes.json() : []
        
        // Fetch total secretaries/assistants
        const secretariesRes = await fetch(`${API_URL}/secretaire`)
        const secretariesData = secretariesRes.ok ? await secretariesRes.json() : []
        
        // Fetch total patients
        const patientsRes = await fetch(`${API_URL}/patient`)
        const patientsData = patientsRes.ok ? await patientsRes.json() : []

        setStats({
          totalUsers: patientsData.length + doctorsData.length + secretariesData.length,
          totalDoctors: doctorsData.length,
          totalSpecialties: specialtiesData.length,
          totalAssistants: secretariesData.length,
        })
      } catch (error) {
        console.log("[v0] Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: "👥" },
    { label: "Active Doctors", value: stats.totalDoctors, icon: "👨‍⚕️" },
    { label: "Specialties", value: stats.totalSpecialties, icon: "🏥" },
    { label: "Total Assistants", value: stats.totalAssistants, icon: "👤" },
  ]

  return (
    <DashboardLayout userRole="admin" pageTitle="">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#0A1F44] mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-[#0A1F44] mt-2">
                      {loading ? "-" : stat.value}
                    </p>
                  </div>
                  <div className="text-5xl opacity-60">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
