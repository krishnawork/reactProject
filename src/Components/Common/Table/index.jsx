import React from "react";
import ReactTable from "react-table";
import { Button } from "reactstrap";
import Switch from "react-bootstrap-switch";
import moment from "moment";
import { PER_PAGE } from "Helpers/constants";
import PropTypes from 'prop-types';
import TooltipElement from 'Components/Common/Tooltip';

const eyeIcon = (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 16 16"
    width="16"
    height="16"
  >
    <g className="nc-icon-wrapper" fill="#fd5d93">
      <path
        fill="#fd5d93"
        d="M8,14c4.707,0,7.744-5.284,7.871-5.508c0.171-0.304,0.172-0.676,0.001-0.98C15.746,7.287,12.731,2,8,2 C3.245,2,0.251,7.289,0.126,7.514c-0.169,0.303-0.168,0.672,0.002,0.975C0.254,8.713,3.269,14,8,14z M8,4 c2.839,0,5.036,2.835,5.818,4C13.034,9.166,10.837,12,8,12c-2.841,0-5.038-2.838-5.819-4.001C2.958,6.835,5.146,4,8,4z"
      ></path>{" "}
      <circle data-color="color-2" fill="#fd5d93" cx="8" cy="8" r="2"></circle>
    </g>
  </svg>
);

const Table = ({
  columns,
  dataTable,
  handleDeleteClick,
  handleOrgParticipantDeleteClick,
  actionsVisibility: { isEditHidden, isDeleteHidden, isViewHidden,isDeleteOrgParticipantHidden },
  handleEditClick,
  handleViewClick,
  handleOtherClick,
  otherTooltip,
  viewTooltip,
  activityDetail,
  viewIcon,
  otherIcon,
  loading,
  filterable = false,
  activityIcon = "",
  handleActivityClick,
  isPrimaryUserHidden = false,
  orgCreatedId = "",
  isPastDateHidden = false,
  isPastDateEditHidden = false,
  isToggleBtn = false,
  handleSwitchChange,
  applyIcon,
  handleApplyClick,
  isPrimaryOrgHidden = false,
  primaryOrganization = "",
  handleActivityDetailClick,
  isManual = false,
  fetchData,
  totalCount,
  isYesNoFlag = false,
  shouldReturnProps = false,
  tooltipMsg = "",
}) => {
  const data = dataTable.map((prop) => {
    const activityTooltip = (
      <TooltipElement
        id={`tooltip-activity-${prop.id}`}
        position="top"
      >
        View Activities
      </TooltipElement>
    );

    return {
      ...prop,
      actions: (
        <div className="actions-right">
          {/* use this button for activity detail */}
          {activityDetail && (
            <>
              <Button
                id={`tooltip-activity-${prop.id}`}
                onClick={() => handleActivityDetailClick(prop.id)}
                color="info"
                size="sm"
                className="btn-link like"
              >
              {activityDetail}
              </Button>
              {activityTooltip}
            </>
          )}
          {/* use this button for project activity */}
          {activityIcon && (
            <>
              <Button
                id={`tooltip-activity-${prop.id}`}
                onClick={() => handleActivityClick(prop.id)}
                color="info"
                size="sm"
                className="btn-link like"
              >
                {activityIcon}
              </Button>
              {activityTooltip}
            </>
          )}
          {/* use this button to view kind of action */}
          {otherIcon && (
            <>
              <Button
                id={`tooltip-other-${prop.id}`}
                onClick={() => handleOtherClick(prop.id)}
                color="info"
                size="sm"
                className="btn-link like"
              >
                {otherIcon}
              </Button>
                {otherTooltip &&
                  <TooltipElement
                    id={`tooltip-other-${prop.id}`}
                    placement="top"
                  >
                    {otherTooltip}
                  </TooltipElement>
                }
            </>
          )}
          {/* use this button to apply kind of action */}
          {applyIcon && (
            <Button
              onClick={() => handleApplyClick(prop.id)}
              color="info"
              size="sm"
              className="btn-link like"
              disabled={prop.status === 1}
            >
              {applyIcon}
            </Button>
          )}
          {/* use this button to view kind of action */}
          {isViewHidden === false && (
            <>
              <Button
                id={`tooltip-view-${prop.id}`}
                onClick={() =>
                  handleViewClick(
                    isYesNoFlag || shouldReturnProps ? prop : prop.id
                  )
                }
                color="info"
                size="sm"
                className="btn-link like"
              >
                {isYesNoFlag
                  ? prop.isExisting
                    ? "YES"
                    : "No"
                  : viewIcon
                  ? viewIcon
                  : eyeIcon}
              </Button>
              <TooltipElement
                position="top"
                id={`tooltip-view-${prop.id}`}
              >
                {!viewIcon && "View Details"}
                {viewIcon && (viewTooltip ? viewTooltip : "View Details")}
              </TooltipElement>
            </>
          )}
          {/* use this button to add a edit kind of action */}
          {((typeof isEditHidden === "function" && !isEditHidden(prop)) ||
            isEditHidden === false) && (
            <Button
              id={`EditBtn-${prop.id}`}
              onClick={() => handleEditClick(shouldReturnProps ? prop : prop.id)}
              color="warning"
              size="sm"
              className="btn-icon btn-link like"
            >
              <TooltipElement
                id={`EditBtn-${prop.id}`}
                position="top"
              >
                {
                  tooltipMsg ? tooltipMsg : "Edit"
                }
              </TooltipElement>
              <i className="tim-icons icon-pencil" />
            </Button>
          )}
          {/* use this button to Hide past date data row for Activity */}
          {isPastDateEditHidden && moment().diff(prop.date) <= 0 && (
            <Button
              onClick={() => handleEditClick(prop.id)}
              color="warning"
              size="sm"
              className="btn-icon btn-link like"
            >
              <i className="tim-icons icon-pencil" />
            </Button>
          )}
          {/* use this button to remove the data row */}
          {isDeleteHidden === false && (
            <Button
              id={`RemoveBtn-${prop.id}`}
              onClick={() => handleDeleteClick(prop.id)}
              color="danger"
              size="sm"
              className="btn-icon btn-link like"
            >
              <TooltipElement
                id={`RemoveBtn-${prop.id}`}
                position="top"
              >
                Remove
              </TooltipElement>
              <i className="tim-icons icon-trash-simple" />
            </Button>
          )}

          {/* use this button to remove the org participant data row */}
          {isDeleteHidden === true && isDeleteOrgParticipantHidden == false && (
            <Button
              id={`RemoveBtn-${prop.organizationUser.id,prop.id}`}
              onClick={() => handleOrgParticipantDeleteClick(prop.organizationUser.id,prop.id)}
              color="danger"
              size="sm"
              className="btn-icon btn-link like"
            >
              <TooltipElement
                id={`RemoveBtn-${prop.organizationUser.id,prop.id}`}
                position="top"
              >
                Remove
              </TooltipElement>
              <i className="tim-icons icon-trash-simple" />
            </Button>
          )}

          {/* use this button to Hide remove the data row  for Organization primary user */}
          {isPrimaryUserHidden && prop.user && orgCreatedId !== prop.user.id && (
            <Button
              id="RemoveBtnOrgPrimaryUser"
              onClick={() => handleDeleteClick(prop.id)}
              color="danger"
              size="sm"
              className="btn-icon btn-link like"
            >
              <TooltipElement
                id="RemoveBtnOrgPrimaryUser"
                placement="top"
                text="Remove"
              />
              <i className="tim-icons icon-trash-simple" />
            </Button>
          )}
          {/* use this button to Hide remove the data row for project primary organization */}
          {isPrimaryOrgHidden &&
            primaryOrganization &&
            prop.organizationId !== primaryOrganization && (
              <Button
                id="RemoveBtnProjectPrimaryOrg"
                onClick={() => handleDeleteClick(prop.id)}
                color="danger"
                size="sm"
                className="btn-icon btn-link like"
              >
              <TooltipElement
                id="RemoveBtnProjectPrimaryOrg"
                placement="top"
                text="Remove"
              />
                <i className="tim-icons icon-trash-simple" />
              </Button>
            )}
          {/* use this button to Hide past date data row for Activity */}
          {isPastDateHidden && moment().diff(prop.date) <= 0 && (
            <Button
              id="RemoveBtnActivity"
              onClick={() => handleDeleteClick(prop.id)}
              color="danger"
              size="sm"
              className="btn-icon btn-link like"
            >
              <TooltipElement
                id="RemoveBtnActivity"
                placement="top"
                text="Remove"
              />
              <i className="tim-icons icon-trash-simple" />
            </Button>
          )}
          {/* use this button to toggle button row for Activity */}
          {isToggleBtn && (
            <Switch
              offColor=""
              onColor=""
              defaultValue={prop.isAttended}
              onChange={(e, state) => handleSwitchChange(state, prop)}
            />
          )}
        </div>
      ),
    };
  });

  const NoDataComponent = () => {
    if (loading) return null;
    return <div className="rt-noData">No rows found</div>;
  };

  const getTrProps = (state, rowInfo, instance) => {
    if (rowInfo)
      return {
        style: {
          background: rowInfo.original.isPrimary ? "#415171" : "primary",
        },
      };
    return {};
  };

  const getArrayWithDivisor = (num, div) => {
    return Array(Math.floor(num / div))
      .fill(undefined)
      .map((el, i) => (i + 1) * div);
  };

  const sizeOptions = getArrayWithDivisor(data.length, PER_PAGE);

  const filterCaseInsensitive = (filter, row) => {
    const id = filter.pivotId || filter.id;
    const content = row[id];
    if (typeof content !== "undefined") {
      // filter by text in the table or if it's a object, filter by key
      if (typeof content === "object" && content !== null && content.key) {
        return String(content.key)
          .toLowerCase()
          .includes(filter.value.toLowerCase());
      } else {
        return String(content)
          .toLowerCase()
          .includes(filter.value.toLowerCase());
      }
    }
    return true;
  };

  return (
    <ReactTable
      data={loading ? [] : data}
      getTrProps={getTrProps}
      resizable={false}
      columns={columns}
      minRows={PER_PAGE}
      showPaginationBottom={true}
      defaultPageSize={PER_PAGE}
      pageSizeOptions={sizeOptions.length ? sizeOptions : [PER_PAGE]}
      className="-striped -highlight"
      loading={loading}
      NoDataComponent={NoDataComponent}
      filterable={filterable}
      defaultFilterMethod={filterCaseInsensitive}
      manual={isManual}
      onFetchData={fetchData}
      pages={Math.ceil(totalCount / PER_PAGE)}
    />
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object), // Columns to be render (see react-table docs for more)
  dataTable: PropTypes.arrayOf(PropTypes.object), // Data to render in the table
  actionsVisibility: PropTypes.shape({
    isViewHidden: PropTypes.bool,
    isEditHidden: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    isDeleteHidden: PropTypes.bool,
    isDeleteOrgParticipantHidden : PropTypes.bool
  }),
  orgCreatedId: PropTypes.string,
  primaryOrganization: PropTypes.string,
  totalCount: PropTypes.number,
  activityDetail: PropTypes.element,
  viewIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  otherIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  applyIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  activityIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  loading: PropTypes.bool,
  filterable: PropTypes.bool,
  isPastDateHidden : PropTypes.bool,
  isPastDateEditHidden : PropTypes.bool,
  isPrimaryUserHidden : PropTypes.bool,
  isToggleBtn : PropTypes.bool,
  isPrimaryOrgHidden: PropTypes.bool,
  isManual : PropTypes.bool,
  isYesNoFlag : PropTypes.bool,
  fetchData: PropTypes.func,
  handleDeleteClick: PropTypes.func,
  handleEditClick: PropTypes.func,
  handleViewClick: PropTypes.func,
  handleOtherClick: PropTypes.func,
  handleApplyClick: PropTypes.func,
  handleSwitchChange: PropTypes.func,
  handleActivityClick: PropTypes.func,
  handleActivityDetailClick: PropTypes.func,
  handleOrgParticipantDeleteClick : PropTypes.func
}

export default Table;
