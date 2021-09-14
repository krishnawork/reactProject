import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Button,
} from "reactstrap";
import Table from "../../Common/Table";
import Api from "Helpers/Api";
import { connect } from "react-redux";
import moment from "moment";
import { USER_ROLES } from "Helpers/constants";
import { hasRoles } from "Helpers/utils";
import { searchParticipants } from "Redux/Actions/search.action";

let tableColumns = []

const ParticipantListByOrganization = (props) => {
  const { id } = props.match.params;
  const [participants, setParticipants] = useState([]);
  const [orgDetails, setOrgDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, userId } = props;

  const getOrganizationParticipants = async () => {
    try {
      const result = await Api.getOrganizationParticipants(window.atob(id));
      let orgParticipants = [];
      result
          .filter(
              (orgPart) =>
                  hasRoles(user, [
                    USER_ROLES.ADMIN,
                    USER_ROLES.DIRECTOR,
                    USER_ROLES.MANAGER,
                  ]) || orgPart.organizationUser.userId === userId
          )
          .forEach((orgPart) => {
            orgParticipants.push({
              ...orgPart.participant,
              ...orgPart,
              dateOfBirth: moment(
                  orgPart.participant.userProfile.dateOfBirth
              ).format("MMMM DD, YYYY"),
            });
          });
      setParticipants(orgParticipants);
    } catch (error) {
      console.error("getOrganizationParticipants -> error", error);
    }
  };

  const getOrganizationDetails = async () => {
    try {
      const result = await Api.getOrganizationById(window.atob(id));
      setOrgDetails(result);
    } catch (error) {
      console.error("getOrganizationDetails -> error", error);
    }
  };

  const getInitValues = async () => {
    setLoading(true);
    setTableColumns();
    if (hasRoles(user, [
      USER_ROLES.ADMIN,
      USER_ROLES.MANAGER,
      USER_ROLES.DIRECTOR
    ])) {
      tableColumns.push({
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        filterable: false
      },)
    }

    await Promise.all([
      getOrganizationParticipants(),
      getOrganizationDetails(),
    ]);
    setLoading(false);
  };

  const setTableColumns = () => {
    tableColumns = [
      {
        Header: "Name",
        accessor: "name",
        Filter: ({ onChange }) => (
            <input
                style={{ width: "100%" }}
                placeholder="Search name"
                onChange={event => onChange(event.target.value)}
            />
        )
      },
      {
        Header: "Email Id",
        accessor: "email",
        filterable: false
      },
      {
        Header: "Date of Birth",
        accessor: "dateOfBirth",
        filterable: false
      },
      {
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        filterable: false
      }
    ]
  }

  useEffect(() => {
    getInitValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditClick = async (participantId) => {
    await props.searchParticipants({
      ...props.participants,
      participantId,
    });
    const partDetails = participants.filter(
        (part) => part.id === participantId
    )[0];
    if (partDetails) props.history.push("/p/" + partDetails.username);
  };

  const handleOrgParticipantDeleteClick = async (organizationUserId,participantId) => {
    await Api.removeParticipant(organizationUserId, participantId);
    getInitValues();
  }

  return (
      <div className="content">
        <Row>
          <Col xs={12} md={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4" className="float-left">
                  Manage Participants for {orgDetails.name || ""}
                </CardTitle>
                <Link to={`/organization/${window.btoa(orgDetails.id)}/participants-search`}>
                  <Button color="info" className="btn-round float-right mr-3">
                    New Participant
                    <i className="tim-icons icon-minimal-right ml-1" />
                  </Button>
                </Link>
                <Link to={`/organization`}>
                  <Button className="btn-link float-right mr-3" color="info">
                    <i className="tim-icons icon-minimal-left" /> Go back
                  </Button>
                </Link>
              </CardHeader>
              <CardBody>
                <Table
                    filterable
                    columns={tableColumns}
                    dataTable={participants}
                    loading={loading}
                    actionsVisibility={{
                      isViewHidden: true,
                      isEditHidden: !hasRoles(user, [
                        USER_ROLES.ADMIN,
                        USER_ROLES.MANAGER,
                        USER_ROLES.DIRECTOR
                      ]),
                      isDeleteHidden: !hasRoles(user, [
                        USER_ROLES.ADMIN,
                        USER_ROLES.MANAGER,
                        USER_ROLES.DIRECTOR
                      ]),
                      isDeleteOrgParticipantHidden:false
                    }}
                    handleEditClick={handleEditClick} 
                    handleOrgParticipantDeleteClick = {handleOrgParticipantDeleteClick}
                    shouldReturnProps={true}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
  );
};

const mapReduxStateToProps = (state) => ({
  user: state.auth.user,
  userId: state.auth.userId,
  participants: state.search.participants,
});

export default connect(mapReduxStateToProps, { searchParticipants })(
    withRouter(ParticipantListByOrganization)
);

