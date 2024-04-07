import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { fetchData } from '../apiService';
import Classes from './Classes';

const Teacher = (props) => {
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);

    const formatDate = (dateString) => {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    };

    useEffect(() => {
        const fetchAssignments = async () => {
            const assignmentsData = await fetchData("assignments");
            setAssignments(assignmentsData.records || []);
        };

        fetchAssignments();
    }, []);

    useEffect(() => {
        const fetchCoursesAndAssignments = async () => {
            const coursesData = await fetchData("courses");
            // Filter courses taught by the teacher
            const teacherCourses = (coursesData.records || []).filter(course => 
                course.teacher_id.value === props.teacherID
            );

            const formattedCourses = teacherCourses.map(course => {
                const courseID = course.id.value;
                const courseAssignments = assignments.filter(assignment => 
                    assignment.course_id.value === courseID
                ).map(assignment => ({
                    id: parseInt(assignment.assignment_id.value),
                    title: assignment.title.value,
                    description: assignment.description.value,
                    dueDate: formatDate(assignment.due.value),
                    problems: assignment.problems.value.map(file => ({
                        fileKey: file.fileKey,
                        name: file.name,
                        contentType: file.contentType,
                        size: file.size
                    })),
                    solutions: assignment.solutions.value.map(file => ({
                        fileKey: file.fileKey,
                        name: file.name,
                        contentType: file.contentType,
                        size: file.size
                    }))
                }));

                return {
                    id: parseInt(course.id.value),
                    name: course.title.value,
                    teacherId: parseInt(course.teacher_id.value),
                    assignments: courseAssignments,
                };
            });

            setCourses(formattedCourses);
        };

        if (assignments.length > 0) {
            fetchCoursesAndAssignments();
        }
    }, [props.teacherID, assignments]);

    return ( 
        <div>
            <h1 className="text-3xl font-bold text-[#272635] m-3">Hello, {props.teacherName}</h1>
            <Classes classes={courses} teacherView={true} />
        </div>
    );
}

Teacher.propTypes = {
  teacherID: PropTypes.string.isRequired,
  teacherName: PropTypes.string.isRequired,
};

export default Teacher;
