# B.Tech Academic Performance Dashboard

An interactive dashboard for exploring B.Tech academic results by semester, subject, exam session, grade, and assessment component. Built with HTML, CSS, JavaScript, and Chart.js.

## Dashboard

The dashboard summarizes the selected result records with these KPIs:

- Total marks and overall percentage
- Total credits and distinct subjects
- Pass rate and selected-record count

Charts show semester performance, grade distribution, and total marks by component. A subject ranking table and key insights update with the selected filters.

## Filters

Filter the results by semester, academic level, exam session, subject, component type, or grade. Select **Apply Filters** to update the dashboard, or **Reset All** to restore the complete dataset.

## Dataset

The dashboard loads 68 detailed result records from [`data/sample_results.csv`](data/sample_results.csv). Its fields are:

| Field | Description |
| --- | --- |
| `Semester` | Academic semester |
| `Academic_Level` | Year and semester level |
| `Exam_Session` | Examination session |
| `Subject_Code`, `Subject_Name` | Subject identifier and name |
| `Internal_Marks`, `External_Marks` | Internal and external assessment marks |
| `Total_Marks` | Total obtained marks |
| `Result_Status` | Result status |
| `Credits` | Subject credits |
| `Grade` | Obtained grade |
| `Component_Type` | Theory, lab, project, or other component type |
| `Standard_Max_Marks`, `Max_Marks` | Maximum-mark values from the source data |
| `Mark_Percentage` | Percentage recorded in the source data |

## Project Structure

```text
.
|-- index.html
|-- README.md
|-- assets/
|   |-- css/style.css
|   `-- js/app.js
|-- data/sample_results.csv
`-- screenshots/
	|-- overview.png
	|-- subjects.png
	`-- semesters.png
```

## Run Locally

The page fetches its CSV data, so run it through a local web server instead of opening the HTML file directly. From the project directory:

```powershell
py -m http.server 8000
```

Open http://localhost:8000. Chart.js is loaded from jsDelivr, so charts require an internet connection.

## Screenshots

- [Overview](screenshots/overview.png)
- [Subject performance](screenshots/subjects.png)
- [Semester performance](screenshots/semesters.png)

## Deployment

This static project can be hosted with GitHub Pages. In the repository settings, configure Pages to deploy from the `main` branch and the repository root. Once enabled, the dashboard URL will be:

https://shaiknabirasool9.github.io/Nabi-BTech-Performance-Dashboard/

## Future Improvements

- Add navigation tabs for overview, subjects, semesters, grades, and detailed records
- Add a detailed filtered-records table and semester summaries
- Add data export, semester comparison, CGPA analysis, and theme controls

## Author

Nabi Rasool, B.Tech Computer Science and Engineering graduate.

- GitHub: [shaiknabirasool9](https://github.com/shaiknabirasool9)
- LinkedIn: [nabirasool9](https://www.linkedin.com/in/nabirasool9)
- LeetCode: [Shaik_Nabi_Rasool](https://leetcode.com/u/Shaik_Nabi_Rasool/)
- HackerRank: [snabi63045](https://www.hackerrank.com/profile/snabi63045)

## License

Created for educational, portfolio, and demonstration purposes.
