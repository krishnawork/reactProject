const USER_ROLES = {
  USER: "User",
  ADMIN: "Administrator",
  DIRECTOR: "Director",
  MANAGER: "Manager",
};

const US_STATE_ID = "231"; // 231 id of United States
const PROJECT_TYPES = [
  {
    label: "Public",
    value: true,
  },
  {
    label: "Invite-only",
    value: false,
  },
];

const AUTHORIZED_PLACE = [
  "U.S. Citizen",
  "U.S. Permanent Citizen",
  "Alien/Refuge Lawfully Admitted to U.S.",
];

const RECURRENCE = ["One Time", "Recurring"];
const RECURRENCE_TYPES = [
  { label: "Daily", value: 1 },
  { label: "Weekly", value: 2 },
  { label: "Monthly", value: 3 },
];

const PER_PAGE = 10;

export {
  US_STATE_ID,
  USER_ROLES,
  PROJECT_TYPES,
  AUTHORIZED_PLACE,
  RECURRENCE,
  RECURRENCE_TYPES,
  PER_PAGE,
};
