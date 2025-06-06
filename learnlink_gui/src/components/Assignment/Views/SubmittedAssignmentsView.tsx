import React from "react";
import { Course } from "../../../types/course";
import { Assignment } from "../../../types/assignment";
import { ensureBoolean } from "../../../utils/assignmentFilters";
import BaseAssignmentView from "./BaseAssignmentView";

interface SubmittedAssignmentsViewProps {
  assignments: Assignment[];
  userCourses: Course[];
  adminCourses: Course[];
  onAssignmentUpdated: () => void;
  selectedCourse: string | null;
}

const SubmittedAssignmentsView: React.FC<SubmittedAssignmentsViewProps> = ({
  assignments,
  userCourses,
  adminCourses,
  onAssignmentUpdated,
  selectedCourse,
}) => {

  // Filter for submitted assignments (showing all submitted assignments, regardless of grading status)
  const filterSubmittedAssignments = (
    assignments: Assignment[]
  ): Assignment[] => {
    return assignments.filter((assignment) => {
      // Check if assignment is submitted (regardless of grading status)
      const isSubmitted = ensureBoolean(assignment.submitted);
      const isGraded = ensureBoolean(assignment.graded); // We capture this just for logging

      // For this view, we want all submitted assignments regardless of grading status
      const isEligible = isSubmitted;

      return isEligible;
    });
  };

  const filteredAssignments = filterSubmittedAssignments(assignments);

  return (
    <BaseAssignmentView
      assignments={assignments}
      filteredAssignments={filteredAssignments}
      userCourses={userCourses}
      adminCourses={adminCourses}
      onAssignmentUpdated={onAssignmentUpdated}
      emptyMessage={selectedCourse 
        ? "No submitted assignments found for this course." 
        : "No submitted assignments found."}
      viewName="Submitted Assignments"
      selectedCourse={selectedCourse}
    />
  );
};

export default SubmittedAssignmentsView;
