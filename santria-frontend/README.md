# Santria Frontend – Patient Management UI

Tech

- React 18 + React Router
- Material UI (blue/white theme)
- Axios for API
- Recharts for charts

Available Scripts

```
npm start
npm run build
```

Environment

```
REACT_APP_API_BASE_URL=http://localhost:3000
```

Pages

- Dashboard: today’s count, status pie, 7‑day trend, status bar, quick actions
- Patients: search list, register patient (full validation fields)
- Patient Detail: info + appointment history (inline edits planned)
- Appointments: list with filters, booking form, status updates

What’s Next

- PostgreSQL persistence in backend (Prisma), frontend unchanged
- More responsive polish and validation messages
