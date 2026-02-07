'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiService } from '@/lib/api'

interface Doctor {
  id: number
  name: string
  specialty: string
  image_url: string
  experience_years?: number
  bio?: string
  rating?: number
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('all')

  // Default doctors if API is not connected
  const defaultDoctors: Doctor[] = [
    { 
      id: 1, 
      name: 'Dr. John Smith', 
      specialty: 'Cardiologist', 
      image_url: '',
      experience_years: 15,
      rating: 4.8
    },
    { 
      id: 2, 
      name: 'Dr. Sarah Johnson', 
      specialty: 'Orthopedic Surgeon', 
      image_url: '',
      experience_years: 12,
      rating: 4.7
    },
    { 
      id: 3, 
      name: 'Dr. Michael Lee', 
      specialty: 'Pediatrician', 
      image_url: '',
      experience_years: 10,
      rating: 4.9
    },
    { 
      id: 4, 
      name: 'Dr. Emily Davis', 
      specialty: 'Gynecologist', 
      image_url: '',
      experience_years: 14,
      rating: 4.8
    },
    { 
      id: 5, 
      name: 'Dr. Fatima Marouon', 
      specialty: 'General Practitioner', 
      image_url: '',
      experience_years: 18,
      rating: 4.9
    },
    { 
      id: 6, 
      name: 'Dr. Ahmed Hassan', 
      specialty: 'Dermatologist', 
      image_url: '',
      experience_years: 11,
      rating: 4.6
    },
  ]

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await apiService.getDoctors()
      if (response.success && response.data) {
        setDoctors(response.data as Doctor[])
      } else {
        setDoctors(defaultDoctors)
      }
      setIsLoading(false)
    }

    fetchDoctors()
  }, [])

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = specialtyFilter === 'all' || doctor.specialty === specialtyFilter
    return matchesSearch && matchesSpecialty
  })

  const specialties = ['all', ...new Set(doctors.map((d) => d.specialty))]

  return (
    <DashboardLayout userRole="patient" pageTitle="Book Appointment">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#0A1F44] mb-2">Find a Doctor</h1>
          <p className="text-gray-600">Browse our specialist doctors and book your appointment</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="text"
            placeholder="Search doctor by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <select
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] text-sm"
          >
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty === 'all' ? 'All Specialties' : specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Doctors Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading doctors...</p>
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Doctor Image */}
                <div className="aspect-square bg-gray-200 relative overflow-hidden">
                  <img
                    src={doctor.image_url || `/placeholder.svg?height=300&width=300&query=professional doctor portrait`}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Doctor Info */}
                  <div>
                    <h3 className="font-semibold text-[#0A1F44] text-lg">{doctor.name}</h3>
                    <p className="text-sm text-[#0066FF] font-medium">{doctor.specialty}</p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Link href={`/dashboard/patient/doctors/${doctor.id}`} className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        View Profile
                      </Button>
                    </Link>
                    <Link href={`/dashboard/patient/appointments/book?doctorId=${doctor.id}`} className="flex-1">
                      <Button className="w-full bg-[#0066FF] text-white hover:bg-[#0052CC]">
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No doctors found matching your search.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
