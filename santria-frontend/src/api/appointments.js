import client from "./axiosClient";

export const fetchAppointments = async (params = {}) => {
  const res = await client.get(`/appointments`, { params });
  return res.data.data;
};

export const fetchAppointment = async (id) => {
  const res = await client.get(`/appointments/${id}`);
  return res.data.data;
};

export const createAppointment = async (payload) => {
  const res = await client.post(`/appointments`, payload);
  return res.data.data;
};

export const updateAppointment = async (id, payload) => {
  const res = await client.put(`/appointments/${id}`, payload);
  return res.data.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const res = await client.patch(`/appointments/${id}/status`, { status });
  return res.data.data;
};
