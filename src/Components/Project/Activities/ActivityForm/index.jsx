import React, { useState, useEffect } from "react";
// reactstrap components
import { Spinner, Col } from "reactstrap";
import { isEmpty } from "Helpers/utils";
import ActivityTabs from "./tabs";
import Api from "Helpers/Api";
import { withRouter } from "react-router-dom";

const ActivityForm = (props) => {
  const { id, activityId } = props.match.params;
  const [projectDetails, setProjectDetails] = useState({});
  const [activityDetails, setActivityDetails] = useState({});
  const [activityUsers, setActivityUsers] = useState([]);
  const [projectOrgs, setProjectOrgs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getProjectDetails = async () => {
    try {
      if (id) {
        const result = await Api.getProjectDetails(window.atob(id));
        setProjectDetails(result);
        if (!isEmpty(result)) {
          result.projectOrganizations.map((org) => {
            org.value = org.organizationId;
            org.label = org.organization.name;
            return org;
          });
          setProjectOrgs(result.projectOrganizations);
          return result.projectOrganizations;
        }
      }
    } catch (error) {
      console.error("getProjectDetails -> error", error);
    }
  };

  const getOrganizationUsers = async () => {
    try {
      if (id) {
        const result = await Api.getActivitytUsers(window.atob(id));
        setActivityUsers(result);
        return result;
      }
    } catch (error) {
      console.error("ProjectForm -> error", error);
    }
  };

  const getActivityDetails = async () => {
    try {
      if (activityId) {
        const result = await Api.getActivityDetails(window.atob(activityId));
        setActivityDetails(result);
        return result;
      }
    } catch (error) {
      console.error("ProjectForm -> error", error);
    }
  };

  const getProjectData = async () => {
    setIsLoading(true);
    const allData = await Promise.all([
      getProjectDetails(),
      getOrganizationUsers(),
      getActivityDetails(),
    ]);

    const actDetails = allData[2],
      orgUsers = allData[1],
      orgProjects = allData[0];

    if (!isEmpty(actDetails)) {
      // Adding label and value for default selection of organizations
      if (actDetails.organizationIds !== null)
        actDetails.organizationIds = actDetails.organizationIds.map((org) => {
          const orgDetails = orgProjects.filter(
            (o) => o.organizationId === org
          )[0];
          if (!isEmpty(orgDetails))
            return {
              label: orgDetails.organization
                ? orgDetails.organization.name
                : "",
              value: orgDetails.organizationId,
            };
          return org;
        });

      // Adding label and value for default selection of staff
      if (!isEmpty(actDetails) && actDetails.assignedStaff !== null) {
        actDetails.assignedStaff =
          orgUsers &&
          orgUsers.filter(
            (o) => actDetails.assignedStaff.filter((a) => o.id === a.userId)[0]
          );
      }
      setActivityDetails(actDetails);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getProjectData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="content">
      {isLoading ? (
        <div className="text-center">
          <Spinner />
        </div>
      ) : (
        <Col className="mr-auto ml-auto" md="12">
          <ActivityTabs
            title={`Project Activity Form for ${projectDetails.name || ""}`}
            activityDetails={activityDetails}
            activityUsers={activityUsers}
            projectOrgs={projectOrgs}
          />
        </Col>
      )}
    </div>
  );
};

export default withRouter(ActivityForm);
