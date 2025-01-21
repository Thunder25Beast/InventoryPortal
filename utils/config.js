const config = {
  // SSO Configuration
  ssoUrl: process.env.NEXT_PUBLIC_SSO_URL || 'https://sso.tech-iitb.org',
  ssoProjectId: process.env.NEXT_PUBLIC_SSO_PROJECT_ID,

  // Admin Configuration
  adminPassword: process.env.ADMIN_PASSWORD,

  // Database Configuration
  databaseUrl: process.env.DATABASE_URL,

  // Server Configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
}

export default config 