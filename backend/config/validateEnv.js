const crypto = require('crypto');
const logger = require('../utils/logger');

const DEV_DEFAULTS = {
  NODE_ENV: 'development',
  MONGO_URI: 'mongodb://127.0.0.1:27017/eventx-studio',
  FRONTEND_URL: 'http://localhost:5173',
  FRONTEND_ORIGIN: 'http://localhost:5173',
};

const SECRET_DEFAULT_KEYS = [
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'CSRF_SECRET',
  'COOKIE_SIGNING_SECRET',
  'PAYMENT_HMAC_SECRET',
  'QR_HMAC_SECRET',
  'SESSION_ENCRYPTION_KEY',
];

const applyDevelopmentDefaults = () => {
  const appliedDefaults = [];

  Object.entries(DEV_DEFAULTS).forEach(([key, value]) => {
    if (!process.env[key]) {
      process.env[key] = value;
      appliedDefaults.push(key);
    }
  });

  SECRET_DEFAULT_KEYS.forEach((key) => {
    if (!process.env[key]) {
      process.env[key] = crypto.randomBytes(24).toString('hex');
      appliedDefaults.push(key);
    }
  });

  if (appliedDefaults.length > 0) {
    logger.warn(
      `Applied development defaults for: ${appliedDefaults.join(', ')}. ` +
      'Create a .env file to override these values.',
    );
  }
};

const validateEnv = () => {
  const initialNodeEnv = process.env.NODE_ENV || 'development';
  if (initialNodeEnv === 'development') {
    applyDevelopmentDefaults();
  }

  const requiredVars = [
    'MONGO_URI',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'CSRF_SECRET',
    'COOKIE_SIGNING_SECRET',
    'PAYMENT_HMAC_SECRET',
    'QR_HMAC_SECRET',
    'SESSION_ENCRYPTION_KEY',
    'FRONTEND_URL'
  ];
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    requiredVars.push('PAYMENT_PROVIDER_WEBHOOK_SECRET');
    requiredVars.push('PAYMENT_WEBHOOK_IP_ALLOWLIST');
  }

  const missing = requiredVars.filter(envVar => !process.env[envVar]);
  const isTest = process.env.NODE_ENV === 'test';
  const weakSecretPatterns = /(change_me|changeme|example|test|default|replace|sample|dummy|placeholder)/i;
  const secretVars = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'CSRF_SECRET',
    'COOKIE_SIGNING_SECRET',
    'PAYMENT_HMAC_SECRET',
    'QR_HMAC_SECRET',
    'SESSION_ENCRYPTION_KEY'
  ];

  if (missing.length > 0) {
    if (!isTest) { // Tests often mock these or use dotenvx inject
      logger.error(`Missing required environment variables: ${missing.join(', ')}`);
      process.exit(1);
    }
  }

  if (!isTest) {
    const weakSecrets = secretVars.filter((key) => {
      const value = process.env[key];
      if (!value) return false;
      if (value.length < 32) return true;
      return weakSecretPatterns.test(value);
    });

    if (weakSecrets.length > 0) {
      logger.error(`Weak or placeholder secret values detected: ${weakSecrets.join(', ')}`);
      process.exit(1);
    }
  }

  if (isProduction && String(process.env.ALLOW_NON_TXN_BOOKING || '').toLowerCase() === 'true') {
    logger.error(
      'ALLOW_NON_TXN_BOOKING must not be enabled in production (non-transactional booking fallback weakens integrity).',
    );
    process.exit(1);
  }

  if (isProduction && !process.env.REDIS_URL) {
    logger.warn(
      'REDIS_URL is not set: rate limiting uses in-memory counters per app instance (not shared across replicas). Set REDIS_URL for consistent distributed limits.',
    );
  }
};

module.exports = validateEnv;
