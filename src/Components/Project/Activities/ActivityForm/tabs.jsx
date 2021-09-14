import React, { Component } from "react";
// reactstrap components
import ReactWizard from "react-bootstrap-wizard";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Api from "Helpers/Api";
import Swal from "sweetalert2";
import { withRouter } from "react-router-dom";
import { RECURRENCE_TYPES } from "Helpers/constants";
import { Spinner } from "reactstrap";

class ActivityTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recurrence: "",
      recurrenceType: "",
      startDate: "",
      endDate: "",
      // startTime: "",
      // endTime: "",
      recurrenceState: "",
      recurrenceTypeState: "",
      weekdaysState: "",
      startDateState: "",
      endDateState: "",
      startTimeState: "",
      endTimeState: "",
      allWeekDays: [
        { label: "Sunday", value: 0, isChecked: false },
        { label: "Monday", value: 1, isChecked: false },
        { label: "Tuesday", value: 2, isChecked: false },
        {
          label: "Wednesday",
          value: 3,
          isChecked: false,
        },
        {
          label: "Thursday",
          value: 4,
          isChecked: false,
        },
        { label: "Friday", value: 5, isChecked: false },
        {
          label: "Saturday",
          value: 6,
          isChecked: false,
        },
      ],
      isCreating: false,
      isWeekDayChanged: false,
    };
  }

  handleChange = (value, stateName) => {
    let stateVal = "has-danger";
    if (value) stateVal = "has-succes";

    const { recurrence } = this.state;
    if (recurrence === "One Time" && stateName === "startDate")
      this.setState({
        endDate: value,
        endDateState: stateVal,
      });

    this.setState({
      [stateName]: value,
      [stateName + "State"]: stateVal,
    });
  };

  handleCheckboxs = (event) => {
    let allWeekDays = this.state.allWeekDays,
      weekdaysState = "has-danger";
    allWeekDays.forEach((week) => {
      if (week.value === parseInt(event.target.value))
        week.isChecked = event.target.checked;
    });
    // one checkbox should be checked
    const anyChecked = allWeekDays.filter((w) => w.isChecked);
    if (anyChecked.length) weekdaysState = "has-succes";

    this.setState({ allWeekDays, weekdaysState, isWeekDayChanged: true });
  };

  toggleWeekChanged = () => {
    this.setState({
      isWeekDayChanged: false,
    });
  };

  componentDidMount() {
    let { isOnetime, recurrenceType, activityDates, recurrenceDaysList } =
      this.props.activityDetails;

    // Default week days selected
    const { allWeekDays } = this.state;
    let weekDays = recurrenceDaysList ? recurrenceDaysList.split(",") : [];
    allWeekDays.map((w) => {
      let selected = weekDays.filter((a) => parseInt(a) === w.value)[0];
      if (selected) w.isChecked = true;
      return w;
    });

    this.setState({
      recurrence: isOnetime ? "One Time" : "Recurring",
      recurrenceType: RECURRENCE_TYPES.filter(
        (r) => r.value === recurrenceType
      )[0],
      startDate:
        activityDates && activityDates.length > 0
          ? activityDates[0].startDate
          : "",
      endDate:
        activityDates && activityDates.length > 0
          ? activityDates[activityDates.length - 1].endDate
          : "",
      // startTime:
      //   activityDates && activityDates.length > 0
      //     ? activityDates[0].startDate
      //     : "",
      // endTime:
      //   activityDates && activityDates.length > 0
      //     ? activityDates[activityDates.length - 1].endDate
      //     : "",
    });
  }

  render() {
    const { title } = this.props;
    const { activityId } = this.props.match.params;
    const { isCreating } = this.state;
    var steps = [
      {
        stepName: "Activity Form",
        stepIcon: "tim-icons icon-single-02",
        component: Step1,
        stepProps: {
          ...this.props,
        },
      },
      {
        stepName: "Recurrence",
        stepIcon: "tim-icons icon-settings-gear-63",
        component: Step2,
        stepProps: {
          ...this.props,
          ...this.state,
          handleChange: this.handleChange,
          handleCheckboxs: this.handleCheckboxs,
        },
      },
      {
        stepName: "Activity Dates",
        stepIcon: "tim-icons icon-delivery-fast",
        component: Step3,
        stepProps: {
          ...this.props,
          ...this.state,
          toggleWeekChanged: this.toggleWeekChanged,
        },
      },
    ];

    return (
      <ReactWizard
        steps={steps}
        navSteps
        validate={true}
        title={title}
        headerTextCenter
        finishButtonClasses={`btn-wd btn-info ${isCreating ? "disabled" : ""}`}
        nextButtonClasses="btn-wd btn-info"
        previousButtonClasses="btn-wd"
        progressbar
        color="blue"
        finishButtonText={
          <span className="d-flex">
            {activityId ? "Update" : "Create"}
            {isCreating && <Spinner size="sm" className="ml-2 p-1" />}
          </span>
        }
        finishButtonClick={this.finishButtonClick}
      />
    );
  }

  handleCancelClick = () => this.props.history.goBack();

  handleEditProjectActivity = async (values) => {
    try {
      const { activityId } = this.props.match.params;
      // Append required id's
      values.id = window.atob(activityId);

      await Api.editActivity(values);
      Swal.fire({
        icon: "success",
        title: "Project activity edited successfully!",
      }).then(() => this.handleCancelClick());
    } catch (error) {
      console.error("ProjectForm -> error", error);
    }
  };

  handleAddProjectActivity = async (values) => {
    try {
      values.createdBy = this.props.userId;
      await Api.addActivity(values);
      Swal.fire({
        icon: "success",
        title: "Project activity added successfully!",
      }).then(() => this.handleCancelClick());
    } catch (error) {
      console.error("ProjectForm -> error", error);
    }
  };

  apiPayload = (values) => {
    // Modify fields as per endpoint
    const { id } = this.props.match.params;
    const { activityDetails } = this.props;
    const assignedStaff = values.assignedStaff.map((staff) => {
      return {
        activityId: activityDetails ? activityDetails.id : null,
        userId: staff.id,
      };
    });
    const selectedeDays = values.allWeekDays.filter((w) => w.isChecked);
    const recurrenceDays = selectedeDays.map((d) => d.value);
    const organizationIds = values.organizationIds.map((org) => org.value);
    const recurrenceType = values.recurrenceType
      ? values.recurrenceType.value
      : 0;

    return {
      projectId: window.atob(id),
      organizationIds,
      name: values.name,
      description: values.description,
      location: values.location,
      color: values.color,
      isOnetime: values.recurrence === "One Time",
      minAttendees: values.minAttendees,
      maxAttendees: values.maxAttendees,
      isRecurring: true,
      recurrenceType,
      recurrenceDaysList: recurrenceDays.toString(),
      activityDates: values.recurrenceDates,
      assignedStaff,
    };
  };

  handleSubmit = async (values) => {
    try {
      const { activityId } = this.props.match.params;
      const data = await this.apiPayload(values);

      if (activityId) await this.handleEditProjectActivity(data);
      else await this.handleAddProjectActivity(data);
      this.setState({
        isCreating: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  finishButtonClick = async (allStates) => {
    this.setState({ isCreating: true }, () => {
      this.handleSubmit({
        ...allStates["Activity Form"],
        ...this.state,
        ...allStates["Activity Dates"],
      });
    });
  };
}

export default withRouter(ActivityTabs);
