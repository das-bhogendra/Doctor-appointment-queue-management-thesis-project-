# TODO - Fix "No token provided" in MERN (frontend)

- [x] Update `frontend/src/service/api.js`
  - [x] Add `console.log("TOKEN:", token);` inside interceptor
  - [x] Ensure Authorization header only set when token exists



- [x] Update `frontend/src/context/AppContext.jsx`
  - [x] Initialize token with `localStorage.getItem("token") || ""`
  - [x] Replace `axios` with centralized `api` for protected `/api/user/get-profile`
  - [x] Remove `headers: { token }`
  - [x] Keep protected call gated by `if (token)`


- [x] Update `frontend/src/pages/Profile.jsx`
  - [x] Replace `axios.post` with `api.post`
  - [x] Remove `headers: { token }`


- [x] Update `frontend/src/pages/Appointments.jsx`
  - [x] Replace `axios.get/post` with `api.get/post`
  - [x] Remove `headers: { token }`
  - [ ] Ensure `getUserAppointments` runs only when `token` exists (gate already exists; verify)


- [x] Update `frontend/src/pages/Appointment.jsx`
  - [x] Replace `axios.post` with `api.post`
  - [x] Remove `headers: { token }`
  - [x] Ensure booking only attempts after login (already checks token; verify)




