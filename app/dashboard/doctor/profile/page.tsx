'use client'

import React from "react"

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function DoctorProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: 'Dr. Abderrahim Harouchi',
    email: 'abderrahim.harouchi@medcare.com',
    phone: '+212 612345678',
    specialization: 'General Medicine',
    licenseNumber: 'LIC-2024-001',
  })

  // API_ENDPOINT: GET /api/doctor/profile
  // Response: { id, fullName, email, phone, specialization, licenseNumber, yearsOfExperience, clinic, about, avatar }
  
  // API_ENDPOINT: PUT /api/doctor/profile
  // Request: Updated profile data
  // Response: Updated profile information

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // API call to update profile
    console.log('[v0] Save profile:', formData)
    setIsEditing(false)
  }

  return (
    <DashboardLayout userRole="doctor" pageTitle="Profile">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0A1F44]">Profile</h1>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="bg-[#0066FF] text-white hover:bg-[#0052CC]">
              Edit Profile
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSaveProfile} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-semibold text-[#0A1F44] mb-6">Basic Information</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Full Name</label>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email"
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Phone Number</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">License Number</label>
                    <Input
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      placeholder="Enter license number"
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h2 className="text-lg font-semibold text-[#0A1F44] mb-6">Professional Information</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Specialization</label>
                    <Input
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      placeholder="e.g., Cardiology"
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-[#0066FF] text-white hover:bg-[#0052CC]">
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>


      </div>
    </DashboardLayout>
  )
}
