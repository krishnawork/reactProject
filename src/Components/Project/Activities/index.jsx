import React, { useEffect, useState } from "react";
import Api from "Helpers/Api";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import Table from "Components/Common/Table";
import { Card, CardBody, CardHeader, CardTitle, Button } from "reactstrap";
import Swal from "sweetalert2";

const ProjectActivity = (props) => {
  const { user } = props;
  const { id } = props.match.params;
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectDetails, setProjectDetails] = useState({});

  const getActivities = async () => {
    setLoading(true);
    try {
      const result = await Api.getActivities({
        projectId: window.atob(id),
      });
      setActivities(result);
    } catch (error) {
      console.error("getProjects -> error", error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectDetails = async () => {
    try {
      const result = await Api.getProjectDetails(window.atob(id));
      setProjectDetails(result);
    } catch (error) {
      console.error("getProjectDetails -> error", error);
    }
  };

  const getInitValues = async () => {
    getActivities();
    getProjectDetails();
  };

  useEffect(() => {
    getInitValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDateTimeClick = (activityId) =>
    props.history.push(
      `/project/${id}/activity/${window.btoa(activityId)}/dates`
    );

  const handleEditClick = (projectId) =>
    props.history.push(
      `/project/${id}/activity/${window.btoa(projectId)}/edit`
    );

  const handleDeleteClick = async (activityId) => {
    try {
      await Api.deleteActivity(activityId);
      let data = [...activities];
      data.find((o, i) => {
        if (o.id === activityId) {
          data.splice(i, 1);
          return true;
        }
        return false;
      });
      setActivities(data);
    } catch (error) {
      console.error("handleDeleteClick -> error", error);
    }
  };

  const deleteConfirmMessage = (activityId) => {
    const data = activities.filter((o, i) => o.id === activityId)[0];
    Swal.fire({
      title: "Are you sure?",
      text: `Once deleted, you will not able to recover ${data.name || ""}`,
      icon: "warning",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: `Yes, delete it!`,
      denyButtonText: `Cancel`,
      confirmButtonColor: "#ec250d",
      cancelButtonColor: "#1d8cf8",
    }).then((willDelete) => {
      if (willDelete.isConfirmed) handleDeleteClick(activityId);
    });
  };

  return (
    <div className="content">
      <Card>
        <CardHeader className="d-flex">
          <div className="d-flex flex-row flex-fill">
            <CardTitle tag="h4">
              Project Activities for {projectDetails.name || ""}
              <div className="d-flex align-items-center">
                <Link to={`/project/${id}/calendar/`}>
                  <Button className="btn-link p-0 d-flex align-items-center" color="info">
                    <i className="tim-icons icon-calendar-60 mr-1" /> View Calendar
                  </Button>
                </Link>
              </div>
            </CardTitle>
          </div>
          <div className="d-flex align-items-center">
            <Link to={`/project`}>
              <Button className="btn-link float-right mr-3" color="info">
                <i className="tim-icons icon-minimal-left" /> Go back
              </Button>
            </Link>
            <Link to={`/project/${id}/activity/new`}>
              <Button color="info" className="btn-round float-right mr-3">
                New Project Activity
                <i className="tim-icons icon-minimal-right ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody>
          <Table
            columns={[
              {
                Header: "Name",
                accessor: "name",
              },
              {
                Header: "Description",
                accessor: "description",
              },
              {
                Header: "Site Name",
                accessor: "location",
              },
              {
                Header: "Actions",
                accessor: "actions",
                sortable: false,
              },
            ]}
            dataTable={activities}
            loading={loading}
            viewIcon={<i className="tim-icons icon-watch-time" />}
            handleViewClick={handleDateTimeClick}
            handleDeleteClick={deleteConfirmMessage}
            handleEditClick={handleEditClick}
            actionsVisibility={{
              isViewHidden: false,
              isEditHidden: false,
              isDeleteHidden: false,
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
};

const mapReduxStateToProps = (state) => ({
  user: state.auth.user,
  userId: state.auth.userId,
});

export default connect(mapReduxStateToProps)(withRouter(ProjectActivity));
