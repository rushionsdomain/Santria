import client from "./axiosClient";

export const fetchPatients = async (query = "") => {
  const res = await client.get(`/patients`, {
    params: query ? { q: query } : {},
  });
  return res.data.data;
};

export const createPatient = async (payload) => {
  const res = await client.post(`/patients`, payload);
  return res.data.data;
};

export const fetchPatient = async (id) => {
  const res = await client.get(`/patients/${id}`);
  return res.data.data;
};

export const updatePatient = async (id, payload) => {
  const res = await client.put(`/patients/${id}`, payload);
  return res.data.data;
};
