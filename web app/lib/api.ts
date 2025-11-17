import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await api.put("/users/profile", userData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put("/users/change-password", passwordData);
  return response.data;
};

export const analyzeSkin = async (imageFile, patientInfo) => {
  console.log(
    "API: Analyzing patient image",
    imageFile.name,
    "Patient:",
    patientInfo.name
  );

  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("patientName", patientInfo.name);
  formData.append("patientAge", patientInfo.age);
  formData.append("patientGender", patientInfo.gender);

  console.log("API: FormData created with image field");

  const customInstance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      customInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;
    }
  }

  try {
    console.log("API: Sending request to", `${API_URL}/scans/analyze`);

    const response = await customInstance.post("/scans/analyze", formData);

    console.log("API: Response received", response.status);
    return response.data;
  } catch (error: any) {
    console.error("API: Error during analysis", error);

    if (error.response) {
      console.error("API: Response data:", error.response.data);
      console.error("API: Response status:", error.response.status);
      console.error("API: Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("API: No response received:", error.request);
    } else {
      console.error("API: Error setting up request:", error.message);
    }

    throw error;
  }
};

export const getScanHistory = async (params = {}) => {
  const response = await api.get("/scans/history", { params });
  return response.data;
};

export const getScanById = async (scanId) => {
  const response = await api.get(`/scans/${scanId}`);
  return response.data;
};

export const deleteScan = async (scanId) => {
  const response = await api.delete(`/scans/${scanId}`);
  return response.data;
};

export default api;
