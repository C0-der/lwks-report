# TODO: Implement Classes Button in Principal Dashboard

## Backend Changes
- [ ] Add /get-all-student-classes endpoint in server.js to fetch all student classes with student names
- [ ] Add /get-all-lectures-with-courses endpoint in server.js to fetch all lectures with lecturer and course details

## Frontend Changes
- [ ] Add studentClasses and lectures state in PrincipalLecture component
- [ ] Add fetchStudentClasses function to call /get-all-student-classes
- [ ] Add fetchLectures function to call /get-all-lectures-with-courses
- [ ] Update handleClasses function to fetch data and set activeSection
- [ ] Update classes section to render two tables: Student Classes and Lectures

## Testing
- [ ] Run the app and verify tables populate correctly when clicking Classes button
