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
  Label,
} from "reactstrap";
import { Formik, Form as FormikForm, Field } from "formik";
import { errorMessage } from "Helpers/Validation";
import { initialValues, validationSchema } from "./validation";
import { URL_PROJECT } from "Helpers/urls";
import { Input, Select, DatePicker } from "Components/Common/Form/elements";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import Api from "Helpers/Api";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { isEmpty } from "Helpers/utils";

const ProjectForm = (props) => {
  const { id } = props.match.params;
  const [projectDetails, setProjectDetails] = useState({});
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCancelClick = () => props.history.push(URL_PROJECT);

  const handleEditProject = async (values) => {
    try {
      // Append required id's
      values.id = projectDetails.id;
      values.createdDate = projectDetails.createdDate;
      values.createdBy = projectDetails.createdBy;

      await Api.editProject(values);
      Swal.fire({
        icon: "success",
        title: "Project edited successfully!",
      }).then(() => handleCancelClick());
    } catch (error) {
      console.error("ProjectForm -> error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (values) => {
    try {
      await Api.addProject(values);
      Swal.fire({
        icon: "success",
        title: "Project added successfully!",
      }).then(() => handleCancelClick());
    } catch (error) {
      console.error("ProjectForm -> error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    // Modify Select values
    values.primaryOrganizationGuid = values.primaryOrganizationGuid.id;
    if (id) return handleEditProject(values);
    return handleAddProject(values);
  };

  const getProjectDetails = async () => {
    try {
      if (id) {
        const result = await Api.getProjectDetails(window.atob(id));
        result.projectOrganizations.map((org) => {
          org.id = org.organizationId;
          org.name = org.organization.name;
          if (org.organizationId === result.primaryOrganizationGuid)
            result.primaryOrganizationGuid = org;
          return org;
        });
        setProjectDetails(result);
      }
    } catch (error) {
      console.error("getProjectDetails -> error", error);
    }
  };

  const getOrganizations = async () => {
    try {
      const result = await Api.getOrganizations({
        userId: props.userId,
      });

      setOrganizations(result);
    } catch (error) {
      console.error("ProjectForm -> error", error);
    }
  };

  const getProjectData = async () => {
    await Promise.all([getProjectDetails(), getOrganizations()]);
  };

  useEffect(() => {
    getProjectData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Formik
            enableReinitialize={true}
            initialValues={initialValues(projectDetails)}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, errors, touched, setFieldValue, values }) => {
              const labelClasses = (name) =>
                classnames("has-label", {
                  "has-danger": errors[name] && touched[name],
                });
              return (
                <FormikForm onSubmit={handleSubmit} id="RegisterValidation">
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">Project Form</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <FormGroup className={labelClasses("name")}>
                        <label>Name</label>
                        <Field component={Input} name="name" maxLength={80} />
                        {errorMessage("name")}
                      </FormGroup>
                      <FormGroup className={labelClasses("description")}>
                        <label>Description</label>
                        <Field
                          type="textarea"
                          component={Input}
                          name="description"
                          maxLength={5000}
                        />
                        {errorMessage("description")}
                      </FormGroup>
                      <FormGroup
                        className={labelClasses("primaryOrganizationGuid")}
                      >
                        <label>Primary Organization</label>
                        <Field
                          component={Select}
                          className="react-select info form-control"
                          classNamePrefix="react-select"
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          name="primaryOrganizationGuid"
                          options={
                            isEmpty(projectDetails)
                              ? organizations
                              : projectDetails.projectOrganizations
                          }
                        />
                        {errorMessage("primaryOrganizationGuid")}
                      </FormGroup>
                      <Row>
                        <Col md={6}>
                          <FormGroup className={labelClasses("startDate")}>
                            <label>Start Date</label>
                            <Field component={DatePicker} name="startDate" />
                            {errorMessage("startDate")}
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup className={labelClasses("endDate")}>
                            <label>End Date</label>
                            <Field component={DatePicker} name="endDate" />
                            {errorMessage("endDate")}
                          </FormGroup>
                        </Col>
                      </Row>
                      <FormGroup
                        check
                        className={"mt-3 " + labelClasses("isPublic")}
                      >
                        <Label check>
                          <Field
                            type="checkbox"
                            component={Input}
                            name="isPublic"
                          />
                          <span className="form-check-sign" />
                          Is this a public project?
                        </Label>
                        {errorMessage("isPublic")}
                      </FormGroup>
                    </CardBody>
                    <CardFooter className="text-right">
                      <Button color="default mr-3" onClick={handleCancelClick}>
                        Cancel
                      </Button>
                      <Button color="primary" type="submit" disabled={loading}>
                        {id ? "Update" : "Create"}
                        {loading && <Spinner size="sm" className="ml-2" />}
                      </Button>
                    </CardFooter>
                  </Card>
                </FormikForm>
              );
            }}
          </Formik>
        </Col>
      </Row>
    </div>
  );
};

const mapReduxStateToProps = (state) => ({
  userId: state.auth.userId,
});

export default connect(mapReduxStateToProps)(withRouter(ProjectForm));
