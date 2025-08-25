import client from "./axiosClient";

export const fetchStats = async (date) => {
  const res = await client.get(`/dashboard/stats`, {
    params: date ? { date } : {},
  });
  return res.data.data || res.data; // depending on backend envelope
};
