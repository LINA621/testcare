"use client"

import React from "react"
import Link from "next/link"
import { useState } from "react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AssistantConsultationsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <DashboardLayout userRole="assistant" pageTitle="Consultations">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#0A1F44]">Consultations</h1>
        </div>

        {/* Search Bar */}
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
              {/* API_ENDPOINT: GET /secretaire/consultations */}
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
