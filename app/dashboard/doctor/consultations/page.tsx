"use client"

import React from "react"
import Link from "next/link"
import { useState } from "react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function DoctorConsultationsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <DashboardLayout userRole="doctor" pageTitle="Consultations">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#0A1F44]">Consultations</h1>
          <Link href="/dashboard/doctor/consultations/new">
            <Button className="bg-[#0066FF] text-white hover:bg-[#0052CC] flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Consultation Report
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="flex gap-4 items-center">
          <Input
            type="text"
            placeholder="Search consultations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Consultations Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Patient Name</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* API_ENDPOINT: GET /medecin/{id}/consultations */}
              {/* Response: Array of consultation objects with patient_name, type, date */}
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td colSpan={4} className="py-12 px-6 text-center text-gray-500">
                  No consultations yet. Create one to get started.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
