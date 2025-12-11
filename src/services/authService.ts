export const API_BASE_URL = "https://eco-health-naturals-backend.vercel.app";

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  password2: string;
}

export interface SigninPayload {
  username?: string;
  email?: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    username: string;
    email: string;
    date_joined?: string;
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = "Request failed";
    try {
      const data = await res.json();
      detail = (data && (data.detail || JSON.stringify(data))) || detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/accounts/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthResponse>(res);
}

export async function signin(payload: SigninPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/accounts/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthResponse>(res);
}

export function saveAuth(auth: AuthResponse) {
  localStorage.setItem("auth_token", auth.token);
  localStorage.setItem("auth_username", auth.user.username);
  localStorage.setItem("auth_email", auth.user.email);
  if (auth.user.date_joined) {
    localStorage.setItem("auth_date_joined", auth.user.date_joined);
  }
  try {
    window.dispatchEvent(new Event("auth-changed"));
  } catch {
    // ignore
  }
}

export function clearAuth() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_username");
  localStorage.removeItem("auth_email");
  localStorage.removeItem("auth_date_joined");
  try {
    window.dispatchEvent(new Event("auth-changed"));
  } catch {
    // ignore
  }
}

export function getStoredUsername(): string | null {
  return localStorage.getItem("auth_username");
}

export function getStoredToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function getStoredEmail(): string | null {
  return localStorage.getItem("auth_email");
}

export function getStoredDateJoined(): string | null {
  return localStorage.getItem("auth_date_joined");
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  new_password2: string;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  const token = getStoredToken();
  const res = await fetch(`${API_BASE_URL}/api/accounts/change-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  await handleResponse(res);
}
