import { apiFetch } from "./api";

interface RegistrationResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    studentId: number;
    sectionId: number;
  };
}

interface CheckoutResponse {
  success: boolean;
  message: string;
  data: {
    paymentId: number;
    checkoutUrl: string | null;
  };
}

interface StudentRegistration {
  id: number;
  studentId: number;
  sectionId: number;
  section: {
    id: number;
    name: string;
    course: {
      id: number;
      code: string;
      title: string;
      credits: number;
    };
  };
  payments: {
    id: number;
    amount: number;
    currency: string;
    status: "PENDING" | "PAID" | "FAILED";
    paidAt: string | null;
  }[];
}

export const createRegistration = (
  studentId: number,
  sectionId: number,
  accessToken: string
) => {
  return apiFetch<RegistrationResponse>("/registrations", {
    method: "POST",
    token: accessToken,
    body: JSON.stringify({
      studentId,
      sectionId,
    }),
  });
};


export const createCheckoutSession = (
  registrationId: number,
  accessToken: string
) => {
  return apiFetch<CheckoutResponse>("/payments/checkout", {
    method: "POST",
    token: accessToken,
    body: JSON.stringify({
      registrationId,
    }),
  });
};




interface MyRegistrationsResponse {
  success: boolean;
  message: string;
  data: StudentRegistration[];
}

export const getMyRegistrations = (accessToken: string) => {
  return apiFetch<MyRegistrationsResponse>("/registrations/mine", {
    method: "GET",
    token: accessToken,
  });
};

export interface RegistrationStats {
  totalRegistrations: number;
  paidRegistrations: number;
  pendingPayments: number;
}

interface RegistrationStatsResponse {
  success: boolean;
  message: string;
  data: RegistrationStats;
}

export const getAdminRegistrationStats = (
  accessToken: string
): Promise<RegistrationStats> => {
  return apiFetch<RegistrationStatsResponse>(
    "/registrations/admin-stats",
    {
      method: "GET",
      token: accessToken,
    }
  ).then((response) => response.data);
};

export interface AdminRegistration {
  id: number;
  studentId: number;
  sectionId: number;
  registeredAt: string;
  student: {
    id: number;
    studentId: string;
    name: string;
  };
  section: {
    id: number;
    name: string;
    course: {
      id: number;
      code: string;
      title: string;
    };
  };
  payments: {
    id: number;
    amount: number;
    currency: string;
    status: "PENDING" | "PAID" | "FAILED";
    paidAt: string | null;
  }[];
}

interface AdminRegistrationsResponse {
  success: boolean;
  message: string;
  data: AdminRegistration[];
}

export const getAllRegistrations = (
  accessToken: string
): Promise<AdminRegistration[]> => {
  return apiFetch<AdminRegistrationsResponse>(
    "/registrations/admin-all",
    {
      method: "GET",
      token: accessToken,
    }
  ).then((response) => response.data);
};