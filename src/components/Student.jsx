import { useEffect, useState } from 'react';
import { fetchData } from '../apiService';

import Classes from './Classes';


const Student = () => {

    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const getClasses = async () => {
          const data = await fetchData("courses");
          setClasses(data.records || []);
        };
        
        getClasses();
    }, []);

    console.log(classes);

    const classesData = [
        {
          id: 1,
          name: "Biology 101",
          teacherId: 1,
          assignments: [
            {
              id: 1,
              title: "Cell Structure",
              description: "Learn about cells and their structure.",
              dueDate: "04/06/24",
            },
            {
              id: 2,
              title: "Photosynthesis",
              description: "Explore how plants convert light into energy.",
              dueDate: "04/06/24",
            },
          ],
          enrollments: [
            { studentId: 2, enrollmentId: 1 },
          ],
        },
        {
          id: 2,
          name: "Chemistry 101",
          teacherId: 1,
          assignments: [
            {
              id: 3,
              title: "Periodic Table",
              description: "Memorize the elements of the periodic table.",
              dueDate: "04/06/24",
            },
          ],
          enrollments: [
            { studentId: 2, enrollmentId: 2 },
            { studentId: 3, enrollmentId: 3 },
          ],
        },
    ];

    return ( 
        <div>
            <h1 className="text-3xl font-bold purple-gradient-text m-3">Hello, Student</h1>
            <Classes classes={classesData} />
        </div>
    );
}
 
export default Student;