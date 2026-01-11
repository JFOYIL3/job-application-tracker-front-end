import request from '../http-common';

class JobApplicationsService {
    getAllJobApplications() {
        return request.get('/job-applications');
    }

    getJobApplicationById(id: string) {
        return request.get(`/job-applications/${id}`);
    }

    createJobApplication(data: object) {
        return request.post('/create-job-application', data);
    }

    updateJobApplication(id: string, data: object) {
        return request.put(`/update-job-application/${id}`, data);
    }

    deleteJobApplication(id: string) {
        return request.delete(`/delete-job-application/${id}`);
    }
}

export default new JobApplicationsService;