import { useEffect, useState, useMemo } from 'react'
import './App.css'
import JobApplicationsService from './services/jobApplicationsService'
import type { JobApplication as JobApplicationType } from './types/JobApplicationType'
import NavBar from './components/NavBar'
import NewJobApplicationModal from './components/NewJobApplicationModal'
import JobApplicationCard from './components/Dashboard/jobApplicationCard'
import DeleteJobApplicationModal from './components/DeleteJobApplicationModal'
import EditJobApplicationModal from './components/EditJobApplicationModal'

function App() {
  const [jobApplications, setJobApplications] = useState<JobApplicationType[]>([])
  const [activeView, setActiveView] = useState<string>('applied')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [jobApplicationToDelete, setJobApplicationToDelete] = useState<JobApplicationType | null>(null)
  const [jobApplicationToEdit, setJobApplicationToEdit] = useState<JobApplicationType | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const fetchJobApplications = () => {
    setIsLoading(true)
    JobApplicationsService.getAllJobApplications()
      .then((response) => {
        setJobApplications(response.data.job_applications)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchJobApplications()
  }, [])

  const handleCreateJobApplication = async (data: {
    title: string;
    company: string;
    salaryRange?: { high_end: number; low_end: number };
    location?: string;
    links?: string[];
    priority?: number;
    expiration?: number;
    status?: string;
  }) => {
    await JobApplicationsService.createJobApplication({
      ...data,
      status: data.status || 'applied' // Default status for new applications
    })
    fetchJobApplications() // Refresh the list after creation
  }

  const handleDeleteJobApplication = async () => {
    if (jobApplicationToDelete) {
      await JobApplicationsService.deleteJobApplication(jobApplicationToDelete.id)
      fetchJobApplications()
      setJobApplicationToDelete(null)
      setIsDeleteModalOpen(false)
    }
  }

  const handleUpdateJobApplication = async (updated: {
    id: string;
    title: string;
    company: string;
    salaryRange?: { high_end: number; low_end: number };
    location?: string;
    links?: string[];
    priority?: number;
    status?: string;
    expiration?: number;
  }) => {
    await JobApplicationsService.updateJobApplication(updated.id, {
      ...updated,
      updatedAt: new Date()
    })
    fetchJobApplications()
    setJobApplicationToEdit(null)
    setIsEditModalOpen(false)
  }

  // Filter job applications based on active view (status) and search query
  const filteredApplications = useMemo(() => {
    let filtered = jobApplications
    
    // If not 'all' view, filter by status
    if (activeView !== 'all') {
      filtered = jobApplications.filter(app => app.status === activeView || (!app.status && activeView === 'applied'))
    }
    
    // Apply search filter if search query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(app => {
        const titleMatch = app.title?.toLowerCase().includes(query) || false
        const companyMatch = app.company?.toLowerCase().includes(query) || false
        const locationMatch = app.location?.toLowerCase().includes(query) || false
        return titleMatch || companyMatch || locationMatch
      })
    }
    
    return filtered
  }, [jobApplications, activeView, searchQuery])

  return (
    <div className="flex h-screen bg-gray-100">
      <NavBar 
        activeView={activeView} 
        onNavigate={setActiveView}
        onNewApplicationClick={() => setIsModalOpen(true)}
      />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {activeView === 'all' ? 'All Applications' : activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </h1>
            {!isLoading && (
              <p className="text-gray-600">
                {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'}
              </p>
            )}
          </div>
          
          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by title, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            </div>
          ) : filteredApplications.length > 0 ? (
            <div className="grid gap-4">
              {filteredApplications.map((application) => (
                <JobApplicationCard 
                  key={application.id} 
                  jobApplication={application} 
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                  setJobApplicationToDelete={setJobApplicationToDelete}
                  setJobApplicationToEdit={setJobApplicationToEdit}
                  setIsEditModalOpen={setIsEditModalOpen}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500 text-lg">No applications found in this category.</p>
            </div>
          )}
        </div>
      </main>
      <NewJobApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateJobApplication}
      />
      <DeleteJobApplicationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteJobApplication}
        jobApplicationTitle={jobApplicationToDelete?.title}
      />
      <EditJobApplicationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        jobApplication={jobApplicationToEdit}
        onSubmit={handleUpdateJobApplication}
      />
    </div>
  )
}

export default App