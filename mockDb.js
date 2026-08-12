export const db = {
  auth: {
    isAuthenticated: async () => true,
    me: async () => ({
      id: "mock_user_1",
      email: "student@example.com",
      full_name: "Mock Student",
      preferred_role: "Student",
    }),
    loginViaEmailPassword: async () => {},
    loginWithProvider: async () => {},
    register: async () => {},
    verifyOtp: async () => ({ access_token: "mock_token" }),
    resendOtp: async () => {},
    setToken: () => {},
    updateMe: async () => {},
    resetPasswordRequest: async () => {},
    resetPassword: async () => {},
    logout: () => { window.location.href = "/login" },
    redirectToLogin: () => { window.location.href = "/login" },
  },
  entities: new Proxy({}, {
    get: () => ({
      filter: async () => [],
      get: async () => null,
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
      list: async () => [],
    })
  }),
  integrations: {
    Core: {
      UploadFile: async () => ({ file_url: '' }),
      InvokeLLM: async () => ({}),
    }
  },
  functions: {
    invoke: async () => ({})
  },
  asServiceRole: {
    entities: new Proxy({}, {
      get: () => ({
        filter: async () => [],
        get: async () => null,
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
        list: async () => [],
      })
    }),
    integrations: {
      Core: {
        InvokeLLM: async () => ({})
      }
    }
  }
};

export const base44 = db;
export default db;
