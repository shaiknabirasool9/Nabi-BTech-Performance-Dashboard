# Nabi B.Tech Performance Dashboard

An interactive dashboard for exploring B.Tech academic results by semester, subject, exam session, component, and grade.

## Run locally

The dashboard loads its records from `data/sample_results.csv`, so serve this folder over HTTP rather than opening `index.html` directly. From this folder, run:

```powershell
py -m http.server 8000
```

Then open http://localhost:8000. Chart.js is loaded from jsDelivr, so an internet connection is needed for charts.

## Data

`data/sample_results.csv` contains the detailed result records used by the dashboard. The CSV headers correspond to the source result fields.

## Screenshots

- [Overview](screenshots/overview.png)
- [Subject performance](screenshots/subjects.png)
- [Semester performance](screenshots/semesters.png)
