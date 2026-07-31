import axios from "axios";
import type { ResumeTemplate } from "@/types/resume.types";

export const getAllResumesApi = async () => {
  const response = await axios.get("/api/resume");
  return response.data;
};

export const getResumeByIdApi = async (resumeId: string) => {
  const response = await axios.get(`/api/resume/${resumeId}`);
  return response.data;
};

export const createResumeApi = async (template?: ResumeTemplate) => {
  const response = await axios.post(
    "/api/resume/create",
    template ? { template } : undefined
  );

  return response.data;
};

export const updateResumeApi = async (
  resumeId: string,
  payload: Record<string, unknown>
) => {
  const response = await axios.patch(`/api/resume/${resumeId}`, payload);

  return response.data;
};

export const deleteResumeApi = async (resumeId: string) => {
  const response = await axios.delete(`/api/resume/${resumeId}`);

  return response.data;
};

export const generateFinalResumeApi = async (resumeId: string) => {
  const response = await axios.post(`/api/resume/${resumeId}/generate`);

  return response.data;
};

export const toggleResumeShareApi = async (resumeId: string, isPublic: boolean) => {
  const response = await axios.patch(`/api/resume/${resumeId}/share`, { isPublic });

  return response.data;
};

export const downloadResumePdfApi = async (resumeId: string) => {
  const response = await axios.get(`/api/resume/${resumeId}/pdf`, {
    responseType: "blob",
  });

  const contentDisposition: string = response.headers["content-disposition"] || "";
  const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
  const fileName = fileNameMatch?.[1] || "resume.pdf";

  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};