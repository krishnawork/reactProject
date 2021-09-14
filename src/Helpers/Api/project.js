import * as handler from "./handler";
import {
  PATH_PROJECTS,
  PATH_DELETE_PROJECT,
  PATH_PROJECT_ORGS,
  PATH_DELETE_PROJECT_ORG,
  PATH_INVITE_PROJECT_ORGS,
  PATH_ACCEPT_PROJECT_ORG_INVITE,
  PATH_DOCUMENT,
  PATH_DOCUMENT_DELETE,
  PATH_DOCUMENT_UPLOAD,
  PATH_DOWNLOAD_DOCUMENT,
  PATH_PARTICIPATED_PROJECTS,
  PATH_APPLY_PARTICIPATION,
} from "./path";

const getProjects = () => {
  return handler.get(PATH_PROJECTS).then((res) => {
    return res.model;
  });
};

const getProjectsByUserId = (userId) => {
  return handler.get(PATH_PROJECTS, { GetByUserId: userId }).then((res) => {
    return res.model;
  });
};

const getProjectDetails = (projectID) => {
  return handler.get(PATH_PROJECTS + projectID).then((res) => {
    return res.model;
  });
};

const addProject = (payload) => {
  return handler.post(PATH_PROJECTS, payload).then((res) => {
    return res;
  });
};

const editProject = (payload) => {
  return handler.put(PATH_PROJECTS, payload).then((res) => {
    return res;
  });
};

const deleteProject = (payload) => {
  return handler.put(PATH_DELETE_PROJECT, payload).then((res) => {
    return res;
  });
};

const getProjectOrganizations = (payload) => {
  return handler.get(PATH_PROJECT_ORGS, payload).then((res) => {
    return res.model;
  });
};

const deleteProjectOrganization = (payload) => {
  return handler.post(PATH_DELETE_PROJECT_ORG, payload).then((res) => {
    return res;
  });
};

const inviteProjectOrganization = (payload) => {
  return handler.post(PATH_INVITE_PROJECT_ORGS, payload).then((res) => {
    return res.model;
  });
};

const acceptProjectOrgInvitation = (id) => {
  return handler.get(PATH_ACCEPT_PROJECT_ORG_INVITE + id).then((res) => {
    return res.model;
  });
};

const getProjectDocument = (id) => {
  return handler.get(PATH_DOCUMENT + "?ProjectId=" + id).then((res) => {
    return res.model;
  });
};

const deleteProjectDocument = (payload) => {
  return handler.post(PATH_DOCUMENT_DELETE, payload).then((res) => {
    return res.model;
  });
};

const addProjectDocument = (payload) => {
  return handler.post(PATH_DOCUMENT_UPLOAD, payload).then((res) => {
    return res.model;
  });
};

const downloadDocument = (payload) => {
  return handler.post(PATH_DOWNLOAD_DOCUMENT, payload).then((res) => {
    return res.model;
  });
};

const getParticipatedProjects = (payload) => {
  return handler.get(PATH_PARTICIPATED_PROJECTS, payload).then((res) => {
    return res.model;
  });
};

const applyProjectParticipation = (payload) => {
  return handler.post(PATH_APPLY_PARTICIPATION, payload).then((res) => {
    return res.model;
  });
};

export default {
  getProjects,
  getProjectDetails,
  addProject,
  editProject,
  deleteProject,
  getProjectOrganizations,
  deleteProjectOrganization,
  inviteProjectOrganization,
  acceptProjectOrgInvitation,
  getProjectDocument,
  deleteProjectDocument,
  addProjectDocument,
  downloadDocument,
  getParticipatedProjects,
  applyProjectParticipation,
  getProjectsByUserId,
};
