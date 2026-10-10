import { apiFetch } from "@/services/api";

interface InstructorCountResponse {
  success: boolean;
  message: string;
  data: number;
}

export async function getInstructorCount(
  token: string
): Promise<number> {
  const response = await apiFetch<InstructorCountResponse>(
    "/instructors/count",
    {
      method: "GET",
      token,
    }
  );

  return response.data;
}