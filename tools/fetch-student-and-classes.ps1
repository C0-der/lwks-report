# Fetch a student username from the backend and then fetch that student's classes
# Usage: run from PowerShell. Requires backend running on http://localhost:3001

try {
    Write-Host "Fetching students from http://localhost:3001/get-students ..."
    $students = Invoke-RestMethod -Method GET -Uri "http://localhost:3001/get-students"
    if (-not $students -or $students.Count -eq 0) {
        Write-Host "No students found. Exiting." -ForegroundColor Yellow
        exit 1
    }
    # Pick the first student by default (you can change this logic)
    $student = $students[0]
    $username = $student.username
    Write-Host "Found student username:`t$username (`t$($student.firstname) $($student.lastname))"

    Write-Host "Fetching classes for $username ..."
    $classes = Invoke-RestMethod -Method GET -Uri "http://localhost:3001/get-classes?username=$username"
    if (-not $classes -or $classes.Count -eq 0) {
        Write-Host "No classes found for $username" -ForegroundColor Yellow
    } else {
        Write-Host "Classes for $username:`n"
        $classes | ConvertTo-Json -Depth 5 | Write-Host
    }
} catch {
    Write-Host "Error during requests: $($_.Exception.Message)" -ForegroundColor Red
    exit 2
}