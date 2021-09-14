import React, { useEffect, useState } from "react";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import { Formik, Form as FormikForm, Field } from "formik";
import { errorMessage } from "Helpers/Validation";
import { initialValues, validationSchema } from "./validation";
import {
  Input,
  Select,
  DatePicker,
  TimePicker,
  RadioGroup,
} from "Components/Common/Form/elements";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import Api from "Helpers/Api";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { isEmpty } from "Helpers/utils";
import { RECURRENCE, RECURRENCE_TYPES } from "Helpers/constants";
import moment from "moment";

const ActivityForm = (props) => {
  const { id, activityId } = props.match.params;
  const [projectDetails, setProjectDetails] = useState({});
  const [activityDetails, setActivityDetails] = useState({});
  const [activityUsers, setActivityUsers] = useState([]);
  const [projectOrgs, setProjectOrgs] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const handleCancelClick = () => props.history.goBack();

  const handleEditProjectActivity = async (values, { setSubmitting }) => {
    try {
      // Append required id's
      values.id = window.atob(activityId);

      await Api.editActivity(values);
      Swal.fire({
        icon: "success",
        title: "Project activity edited successfully!",
      }).then(() => handleCancelClick());
    } catch (error) {
      console.error("ProjectForm -> error", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddProjectActivity = async (values, { setSubmitting }) => {
    try {
      values.createdBy = props.userId;
      await Api.addActivity(values);
      Swal.fire({
        icon: "success",
        title: "Project activity added successfully!",
      }).then(() => handleCancelClick());
    } catch (error) {
      console.error("ProjectForm -> error", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (values, actions) => {
    try {
      let startDate = moment(values.startDate).format("YYYY-MM-DD");
      // Modify fields as per endpoint
      values.projectId = window.atob(id);
      values.assignedStaff = values.assignedStaff.id;
      values.isOnetime = values.recurrence === "One Time";
      // Combined start date + start time
      values.startTime = moment(values.startTime).format("HH:mm");
      values.startDate = startDate + " " + values.startTime;
      // Combined end date + end time
      values.endTime = moment(values.endTime).format("HH:mm");
      values.endDate = values.endDate
        ? moment(values.endDate).format("YYYY-MM-DD") + " " + values.endTime
        : startDate + " " + values.endTime;
      values.organizationIds = values.organizationIds.map((org) => org.value);

      if (activityId) return handleEditProjectActivity(values, actions);
      return handleAddProjectActivity(values, actions);
    } catch (error) {
      console.error(error);
    }
  };

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
    setIsLoadingData(true);
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
        actDetails.assignedStaff = orgUsers.filter(
          (o) => o.id === actDetails.assignedStaff
        )[0];
      }
      setActivityDetails(actDetails);
    }
    setIsLoadingData(false);
  };

  useEffect(() => {
    getProjectData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="content">
      <Row>
        <Col md="12">
          {isLoadingData ? (
            <div className="text-center">
              <Spinner />
            </div>
          ) : (
            <Formik
              enableReinitialize={true}
              initialValues={initialValues(activityDetails)}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, errors, touched, values, isSubmitting }) => {
                const labelClasses = (name) =>
                  classnames("has-label", {
                    "has-danger": errors[name] && touched[name],
                  });
                const showEndDate = values.recurrence === "Recurring";
                return (
                  <FormikForm onSubmit={handleSubmit} id="RegisterValidation">
                    <Card>
                      <CardHeader>
                        <CardTitle tag="h4">
                          Project Activity Form for {projectDetails.name || ""}
                        </CardTitle>
                      </CardHeader>
                      <CardBody>
                        <FormGroup className={labelClasses("name")}>
                          <label>Name</label>
                          <Field component={Input} name="name" type="text" />
                          {errorMessage("name")}
                        </FormGroup>
                        <FormGroup className={labelClasses("description")}>
                          <label>Description</label>
                          <Field
                            type="textarea"
                            component={Input}
                            name="description"
                          />
                          {errorMessage("description")}
                        </FormGroup>
                        <FormGroup className={labelClasses("location")}>
                          <label>Site Name</label>
                          <Field
                            component={Input}
                            name="location"
                            type="text"
                          />
                          {errorMessage("location")}
                        </FormGroup>
                        <FormGroup className={labelClasses("organizationIds")}>
                          <label>Organizations</label>
                          <Field
                            component={Select}
                            className="react-select info form-control"
                            classNamePrefix="react-select"
                            name="organizationIds"
                            options={projectOrgs}
                            defaultValues={[projectOrgs[0]]}
                            isMulti
                          />
                          {errorMessage("organizationIds")}
                        </FormGroup>
                        <FormGroup className={labelClasses("assignedStaff")}>
                          <label>Assigned Users/Staff</label>
                          <Field
                            component={Select}
                            className="react-select info form-control"
                            classNamePrefix="react-select"
                            getOptionLabel={(option) => option.email}
                            getOptionValue={(option) => option.id}
                            name="assignedStaff"
                            options={activityUsers}
                          />
                          {errorMessage("assignedStaff")}
                        </FormGroup>
                        <Row>
                          <Col md={6}>
                            <FormGroup className={labelClasses("minAttendees")}>
                              <label>Minimum number of Participants</label>
                              <Field
                                component={Input}
                                name="minAttendees"
                                type="text"
                              />
                              {errorMessage("minAttendees")}
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                            <FormGroup className={labelClasses("maxAttendees")}>
                              <label>Maximum number of Participants</label>
                              <Field
                                component={Input}
                                name="maxAttendees"
                                type="text"
                              />
                              {errorMessage("maxAttendees")}
                            </FormGroup>
                          </Col>
                        </Row>
                        <FormGroup className={labelClasses("recurrence")}>
                          <label>Recurrence</label>
                          <Field
                            component={Select}
                            className="react-select info form-control"
                            classNamePrefix="react-select"
                            name="recurrence"
                            value={RECURRENCE.filter(function (option) {
                              return option === values.recurrence;
                            })}
                            getOptionValue={(option) => option}
                            getOptionLabel={(option) => option}
                            options={RECURRENCE}
                          />
                          {errorMessage("recurrence")}
                        </FormGroup>
                        {showEndDate && (
                          <FormGroup className={labelClasses("recurrenceType")}>
                            <label>Recurrence Type</label>
                            <Field
                              component={Select}
                              className="react-select info form-control"
                              classNamePrefix="react-select"
                              name="recurrenceType"
                              value={RECURRENCE_TYPES.filter(function (option) {
                                return option === values.recurrenceType;
                              })}
                              getOptionValue={(option) => option}
                              getOptionLabel={(option) => option}
                              options={RECURRENCE_TYPES}
                            />
                            {errorMessage("recurrenceType")}
                          </FormGroup>
                        )}
                        {values.recurrenceType &&
                          values.recurrenceType === "Daily" && (
                            <>
                              <Row>
                                <Col md="7" className="mb-3">
                                  <FormGroup>
                                    <label>Week days</label>
                                    <Field
                                      component={RadioGroup}
                                      options={[
                                        { label: "Sunday", value: "sunday" },
                                        { label: "Monday", value: "monday" },
                                        { label: "Tuesday", value: "tuesday" },
                                        {
                                          label: "Wednesday",
                                          value: "wednesday",
                                        },
                                        {
                                          label: "Thursday",
                                          value: "thursday",
                                        },
                                        { label: "Friday", value: "friday" },
                                        {
                                          label: "Saturday",
                                          value: "saturday",
                                        },
                                      ]}
                                      name="weekdays"
                                      checkbox="true"
                                    />
                                    {errorMessage("weekdays")}
                                  </FormGroup>
                                </Col>
                                <Col md={5}>
                                  <FormGroup className={labelClasses("ends")}>
                                    <label>Ends</label>
                                    <Field
                                      component={Input}
                                      name="ends"
                                      type="number"
                                    />
                                    {errorMessage("ends")}
                                  </FormGroup>
                                </Col>
                              </Row>
                            </>
                          )}
                        <Row>
                          <Col md={showEndDate ? 3 : 6}>
                            <FormGroup className={labelClasses("startDate")}>
                              <label>Start Date</label>
                              <Field component={DatePicker} name="startDate" />
                              {errorMessage("startDate")}
                            </FormGroup>
                          </Col>
                          {showEndDate && (
                            <Col md={3}>
                              <FormGroup className={labelClasses("endDate")}>
                                <label>End Date</label>
                                <Field component={DatePicker} name="endDate" />
                                {errorMessage("endDate")}
                              </FormGroup>
                            </Col>
                          )}
                          <Col md={3}>
                            <FormGroup className={labelClasses("startTime")}>
                              <label>Start Time</label>
                              <Field component={TimePicker} name="startTime" />
                              {errorMessage("startTime")}
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className={labelClasses("endTime")}>
                              <label>End Time</label>
                              <Field component={TimePicker} name="endTime" />
                              {errorMessage("endTime")}
                            </FormGroup>
                          </Col>
                        </Row>
                      </CardBody>
                      <CardFooter className="text-right">
                        <Button
                          color="default mr-3"
                          onClick={handleCancelClick}
                        >
                          Cancel
                        </Button>
                        <Button
                          color="primary"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {activityId ? "Update" : "Create"}
                          {isSubmitting && (
                            <Spinner size="sm" className="ml-2" />
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </FormikForm>
                );
              }}
            </Formik>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapReduxStateToProps = (state) => ({
  userId: state.auth.userId,
});

export default connect(mapReduxStateToProps)(withRouter(ActivityForm));
