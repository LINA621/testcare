"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const deleteUser = (id: number) => {
  // Placeholder function for deleteUser
  console.log(`Deleting user with id: ${id}`);
}

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [showDoctorModal, setShowDoctorModal] = useState(false)
  const [showSecretaryModal, setShowSecretaryModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Doctor form state (Utilisateur + Medecin + Compte)
  const [doctorNom, setDoctorNom] = useState("")
  const [doctorPrenom, setDoctorPrenom] = useState("")
  const [doctorDateNaissance, setDoctorDateNaissance] = useState("")
  const [doctorSexe, setDoctorSexe] = useState("")
  const [doctorTelephone, setDoctorTelephone] = useState("")
  const [doctorAdresse, setDoctorAdresse] = useState("")
  const [doctorCin, setDoctorCin] = useState("")
  const [doctorEmail, setDoctorEmail] = useState("")
  const [doctorPassword, setDoctorPassword] = useState("")
  const [doctorStatut, setDoctorStatut] = useState("Active")
  const [numeroLicence, setNumeroLicence] = useState("")
  const [specialiteId, setSpecialiteId] = useState("")
  
  // Secretary form state (Utilisateur + Secretaire + Compte)
  const [secretaryNom, setSecretaryNom] = useState("")
  const [secretaryPrenom, setSecretaryPrenom] = useState("")
  const [secretaryDateNaissance, setSecretaryDateNaissance] = useState("")
  const [secretarySexe, setSecretarySexe] = useState("")
  const [secretaryTelephone, setSecretaryTelephone] = useState("")
  const [secretaryAdresse, setSecretaryAdresse] = useState("")
  const [secretaryCin, setSecretaryCin] = useState("")
  const [secretaryEmail, setSecretaryEmail] = useState("")
  const [secretaryPassword, setSecretaryPassword] = useState("")
  const [secretaryStatut, setSecretaryStatut] = useState("Active")
  
  // Mock specialties and doctors list (would be fetched from API)
  const [specialties, setSpecialties] = useState([
    { id: 1, name: "Cardiology" },
    { id: 2, name: "Neurology" },
    { id: 3, name: "General Practice" },
    { id: 4, name: "Pediatrics" },
  ])
  const [doctors, setDoctors] = useState([
    { id: 1, name: "Dr. John Smith" },
    { id: 2, name: "Dr. Michael Lee" },
  ])
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Dr. John Smith",
      email: "john@medcare.com",
      role: "Doctor",
      status: "Active",
      joinDate: "2023-03-15",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@medcare.com",
      role: "Patient",
      status: "Active",
      joinDate: "2023-06-20",
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily@medcare.com",
      role: "Assistant",
      status: "Active",
      joinDate: "2023-08-10",
    },
    {
      id: 4,
      name: "Michael Lee",
      email: "michael@medcare.com",
      role: "Doctor",
      status: "Inactive",
      joinDate: "2023-01-05",
    },
  ])

  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!filterRole || user.role === filterRole),
  )

  const toggleUserStatus = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" } : user
      )
    )
  }

  const handleDoctorModalClose = () => {
    setShowDoctorModal(false)
    // Reset doctor form
    setDoctorNom("")
    setDoctorPrenom("")
    setDoctorDateNaissance("")
    setDoctorSexe("")
    setDoctorTelephone("")
    setDoctorAdresse("")
    setDoctorCin("")
    setDoctorEmail("")
    setDoctorPassword("")
    setDoctorStatut("Active")
    setNumeroLicence("")
    setSpecialiteId("")
  }

  const handleSecretaryModalClose = () => {
    setShowSecretaryModal(false)
    // Reset secretary form
    setSecretaryNom("")
    setSecretaryPrenom("")
    setSecretaryDateNaissance("")
    setSecretarySexe("")
    setSecretaryTelephone("")
    setSecretaryAdresse("")
    setSecretaryCin("")
    setSecretaryEmail("")
    setSecretaryPassword("")
    setSecretaryStatut("Active")
  }

  const handleCreateDoctor = () => {
    // Validation
    if (!doctorNom || !doctorPrenom || !doctorEmail || !doctorPassword || !numeroLicence || !specialiteId) {
      alert("Please fill in all required fields")
      return
    }

    // API Integration: POST /medecin/create
    console.log("[v0] Creating doctor with data:", {
      utilisateur: {
        nom: doctorNom,
        prenom: doctorPrenom,
        date_naissance: doctorDateNaissance,
        sexe: doctorSexe,
        telephone: doctorTelephone,
        adresse: doctorAdresse,
        cin: doctorCin,
      },
      compte: {
        email: doctorEmail,
        mot_de_passe: doctorPassword,
        role: "medecin",
        statut: doctorStatut,
      },
      medecin: {
        numero_licence: numeroLicence,
        specialite_id: specialiteId,
      },
    })

    // Add doctor to list (temporary)
    const today = new Date().toISOString().split("T")[0]
    const newDoctor = {
      id: users.length + 1,
      name: `Dr. ${doctorPrenom} ${doctorNom}`,
      email: doctorEmail,
      role: "Doctor",
      status: doctorStatut,
      joinDate: today,
    }
    setUsers([...users, newDoctor])

    handleDoctorModalClose()
  }

  const handleCreateSecretary = () => {
    // Validation
    if (!secretaryNom || !secretaryPrenom || !secretaryEmail || !secretaryPassword) {
      alert("Please fill in all required fields")
      return
    }

    // API Integration: POST /secretaire/create
    console.log("[v0] Creating secretary with data:", {
      utilisateur: {
        nom: secretaryNom,
        prenom: secretaryPrenom,
        date_naissance: secretaryDateNaissance,
        sexe: secretarySexe,
        telephone: secretaryTelephone,
        adresse: secretaryAdresse,
        cin: secretaryCin,
      },
      compte: {
        email: secretaryEmail,
        mot_de_passe: secretaryPassword,
        role: "secretaire",
        statut: secretaryStatut,
      },
    })

    // Add secretary to list (temporary)
    const today = new Date().toISOString().split("T")[0]
    const newSecretary = {
      id: users.length + 1,
      name: `${secretaryPrenom} ${secretaryNom}`,
      email: secretaryEmail,
      role: "Assistant",
      status: secretaryStatut,
      joinDate: today,
    }
    setUsers([...users, newSecretary])

    handleSecretaryModalClose()
  }

  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  return (
    <DashboardLayout userRole="admin" pageTitle="Users">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#0A1F44]">Users Management</h1>
          <div className="flex gap-3">
            <Button onClick={() => setShowDoctorModal(true)} className="bg-[#0066FF] text-white hover:bg-[#0052CC]">
              + Add Doctor
            </Button>
            <Button onClick={() => setShowSecretaryModal(true)} className="bg-[#0066FF] text-white hover:bg-[#0052CC]">
              + Add Secretary
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value="Doctor">Doctor</option>
                <option value="Patient">Patient</option>
                <option value="Assistant">Assistant</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Name</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Email</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Role</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Join Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-4 px-6 text-gray-700 font-medium">{user.name}</td>
                      <td className="py-4 px-6 text-gray-600">{user.email}</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-[#0066FF]">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm">{user.joinDate}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            user.status === "Active"
                              ? "bg-red-50 hover:bg-red-100 text-red-600"
                              : "bg-green-50 hover:bg-green-100 text-green-600"
                          }`}
                        >
                          {user.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-medium text-sm transition ${
                  page === currentPage
                    ? "bg-[#0066FF] text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-[#0066FF]"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="text-[#0066FF] hover:text-[#0052CC] text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        {/* Add Doctor Modal */}
        {showDoctorModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md m-0 max-h-[90vh] overflow-y-auto">
              <div className="bg-[#1e3a8a] p-6 flex items-center justify-between sticky top-0 z-10">
                <span className="text-xl font-bold text-white">
                  <span className="text-[#0066FF]">Med</span>
                  <span className="text-white">Care</span>
                </span>
                <button onClick={handleDoctorModalClose} className="text-white hover:bg-[#0052CC] p-1 rounded">
                  ✕
                </button>
              </div>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#0A1F44] mb-4">Add New Doctor</h2>
                <form className="space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Personal Information</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">First Name *</label>
                          <Input 
                            placeholder="Prenom"
                            value={doctorPrenom}
                            onChange={(e) => setDoctorPrenom(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Last Name *</label>
                          <Input 
                            placeholder="Nom"
                            value={doctorNom}
                            onChange={(e) => setDoctorNom(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
                          <Input 
                            type="date"
                            value={doctorDateNaissance}
                            onChange={(e) => setDoctorDateNaissance(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                          <select 
                            value={doctorSexe}
                            onChange={(e) => setDoctorSexe(e.target.value)}
                            className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                        <Input 
                          placeholder="Telephone"
                          value={doctorTelephone}
                          onChange={(e) => setDoctorTelephone(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                        <Input 
                          placeholder="Adresse"
                          value={doctorAdresse}
                          onChange={(e) => setDoctorAdresse(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">ID/CIN</label>
                        <Input 
                          placeholder="CIN"
                          value={doctorCin}
                          onChange={(e) => setDoctorCin(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Professional Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">License Number *</label>
                        <Input 
                          placeholder="Numero Licence"
                          value={numeroLicence}
                          onChange={(e) => setNumeroLicence(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Specialty *</label>
                        <select 
                          value={specialiteId}
                          onChange={(e) => setSpecialiteId(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066FF]"
                        >
                          <option value="">Select a specialty</option>
                          {specialties.map((spec) => (
                            <option key={spec.id} value={spec.id}>{spec.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Account Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                        <Input 
                          type="email" 
                          placeholder="Email address"
                          value={doctorEmail}
                          onChange={(e) => setDoctorEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Password *</label>
                        <Input 
                          type="password" 
                          placeholder="Password"
                          value={doctorPassword}
                          onChange={(e) => setDoctorPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                        <select 
                          value={doctorStatut}
                          onChange={(e) => setDoctorStatut(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <Button onClick={handleDoctorModalClose} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateDoctor}
                      className="flex-1 bg-[#0066FF] text-white hover:bg-[#0052CC]"
                    >
                      Create Doctor
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Secretary Modal */}
        {showSecretaryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md m-0 max-h-[90vh] overflow-y-auto">
              <div className="bg-[#1e3a8a] p-6 flex items-center justify-between sticky top-0 z-10">
                <span className="text-xl font-bold text-white">
                  <span className="text-[#0066FF]">Med</span>
                  <span className="text-white">Care</span>
                </span>
                <button onClick={handleSecretaryModalClose} className="text-white hover:bg-[#0052CC] p-1 rounded">
                  ✕
                </button>
              </div>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#0A1F44] mb-4">Add New Secretary</h2>
                <form className="space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Personal Information</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">First Name *</label>
                          <Input 
                            placeholder="Prenom"
                            value={secretaryPrenom}
                            onChange={(e) => setSecretaryPrenom(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Last Name *</label>
                          <Input 
                            placeholder="Nom"
                            value={secretaryNom}
                            onChange={(e) => setSecretaryNom(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
                          <Input 
                            type="date"
                            value={secretaryDateNaissance}
                            onChange={(e) => setSecretaryDateNaissance(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                          <select 
                            value={secretarySexe}
                            onChange={(e) => setSecretarySexe(e.target.value)}
                            className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                        <Input 
                          placeholder="Telephone"
                          value={secretaryTelephone}
                          onChange={(e) => setSecretaryTelephone(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                        <Input 
                          placeholder="Adresse"
                          value={secretaryAdresse}
                          onChange={(e) => setSecretaryAdresse(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">ID/CIN</label>
                        <Input 
                          placeholder="CIN"
                          value={secretaryCin}
                          onChange={(e) => setSecretaryCin(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Account Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                        <Input 
                          type="email" 
                          placeholder="Email address"
                          value={secretaryEmail}
                          onChange={(e) => setSecretaryEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Password *</label>
                        <Input 
                          type="password" 
                          placeholder="Password"
                          value={secretaryPassword}
                          onChange={(e) => setSecretaryPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                        <select 
                          value={secretaryStatut}
                          onChange={(e) => setSecretaryStatut(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <Button onClick={handleSecretaryModalClose} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateSecretary}
                      className="flex-1 bg-[#0066FF] text-white hover:bg-[#0052CC]"
                    >
                      Create Secretary
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
