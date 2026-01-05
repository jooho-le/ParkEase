import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID, randomBytes, createHash } from 'crypto';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
const DATA_FILE = path.join(__dirname, '..', 'data', 'sensor-readings.json');
const NFC_DATA_FILE = path.join(__dirname, '..', 'data', 'nfc-tags.json');
const DB_FILE = path.join(__dirname, '..', 'data', 'parkease.db');

async function ensureDataFile(filePath) {
  try {
    await fs.access(filePath);
  } catch (error) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, '[]', 'utf8');
  }
}

function openDatabase(filePath) {
  const db = new sqlite3.Database(filePath);
  return {
    run(sql, params = []) {
      return new Promise((resolve, reject) => {
        db.run(sql, params, function (error) {
          if (error) {
            reject(error);
            return;
          }
          resolve(this);
        });
      });
    },
    get(sql, params = []) {
      return new Promise((resolve, reject) => {
        db.get(sql, params, (error, row) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(row);
        });
      });
    },
    all(sql, params = []) {
      return new Promise((resolve, reject) => {
        db.all(sql, params, (error, rows) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(rows);
        });
      });
    },
  };
}

const database = openDatabase(DB_FILE);

async function initializeDatabase() {
  await database.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      user_type TEXT NOT NULL,
      car_number TEXT,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await database.run(`
    CREATE TABLE IF NOT EXISTS tokens (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
}

class SensorRepository {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async #readAll() {
    await ensureDataFile(this.filePath);
    const raw = await fs.readFile(this.filePath, 'utf8');
    try {
      return JSON.parse(raw);
    } catch (error) {
      throw new Error('데이터 파일이 손상되었습니다.');
    }
  }

  async #writeAll(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  async getAll() {
    const data = await this.#readAll();
    return [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getLatest() {
    const data = await this.#readAll();
    if (data.length === 0) {
      return null;
    }
    return data.reduce((prev, current) =>
      new Date(current.createdAt) > new Date(prev.createdAt) ? current : prev
    );
  }

  async getById(id) {
    const data = await this.#readAll();
    return data.find((item) => item.id === id) || null;
  }

  async create(entry) {
    const data = await this.#readAll();
    const record = {
      id: randomUUID(),
      sensorId: entry.sensorId,
      distanceCm: entry.distanceCm,
      thresholdCm: entry.thresholdCm,
      ledState: entry.ledState === true,
      createdAt: new Date().toISOString(),
      metadata: entry.metadata ?? {},
    };
    data.push(record);
    await this.#writeAll(data);
    return record;
  }

  async remove(id) {
    const data = await this.#readAll();
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    data.splice(index, 1);
    await this.#writeAll(data);
    return true;
  }
}

class NfcRepository {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async #readAll() {
    await ensureDataFile(this.filePath);
    const raw = await fs.readFile(this.filePath, 'utf8');
    try {
      return JSON.parse(raw);
    } catch (error) {
      throw new Error('NFC 데이터 파일이 손상되었습니다.');
    }
  }

  async #writeAll(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  async getAll() {
    const data = await this.#readAll();
    return [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getLatest() {
    const data = await this.#readAll();
    if (data.length === 0) {
      return null;
    }
    return data.reduce((prev, current) =>
      new Date(current.createdAt) > new Date(prev.createdAt) ? current : prev
    );
  }

  async create(entry) {
    const data = await this.#readAll();
    const record = {
      id: randomUUID(),
      cardId: entry.cardId,
      speakerTriggered: entry.speakerTriggered ?? true,
      createdAt: new Date().toISOString(),
      metadata: entry.metadata ?? {},
    };
    data.push(record);
    await this.#writeAll(data);
    return record;
  }
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function sendError(res, status, message) {
  sendJson(res, status, { error: message });
}

function getPathSegments(pathname) {
  return pathname.split('/').filter(Boolean);
}

async function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e6) {
        reject(new Error('요청 본문이 너무 큽니다.'));
        req.connection.destroy();
      }
    });
    req.on('end', () => {
      try {
        const parsed = data ? JSON.parse(data) : {};
        resolve(parsed);
      } catch (error) {
        reject(new Error('JSON 형식이 올바르지 않습니다.'));
      }
    });
    req.on('error', reject);
  });
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    userType: user.userType,
    carNumber: user.carNumber ?? null,
  };
}

function hashPassword(password, salt) {
  return createHash('sha256').update(`${salt}:${password}`).digest('hex');
}

function getBearerToken(req) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }
  return token;
}

class UserRepository {
  constructor(db) {
    this.db = db;
  }

  async getById(id) {
    const row = await this.db.get(
      `
      SELECT
        id,
        name,
        user_type as userType,
        car_number as carNumber,
        password_hash as passwordHash,
        password_salt as passwordSalt,
        created_at as createdAt,
        updated_at as updatedAt
      FROM users
      WHERE id = ?
    `,
      [id]
    );
    return row ?? null;
  }

  async create({ id, password, name, userType, carNumber }) {
    const existing = await this.getById(id);
    if (existing) {
      return null;
    }

    const salt = randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const now = new Date().toISOString();
    await this.db.run(
      `
      INSERT INTO users (
        id,
        name,
        user_type,
        car_number,
        password_hash,
        password_salt,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        id,
        name,
        userType,
        carNumber ?? null,
        passwordHash,
        salt,
        now,
        now,
      ]
    );
    return await this.getById(id);
  }
}

class TokenRepository {
  constructor(db) {
    this.db = db;
  }

  async getByToken(token) {
    const row = await this.db.get(
      `
      SELECT
        token,
        user_id as userId,
        created_at as createdAt
      FROM tokens
      WHERE token = ?
    `,
      [token]
    );
    return row ?? null;
  }

  async create(userId) {
    const record = {
      token: randomUUID(),
      userId,
      createdAt: new Date().toISOString(),
    };
    await this.db.run(
      `
      INSERT INTO tokens (token, user_id, created_at)
      VALUES (?, ?, ?)
    `,
      [record.token, record.userId, record.createdAt]
    );
    return record;
  }
}

const repository = new SensorRepository(DATA_FILE);
const nfcRepository = new NfcRepository(NFC_DATA_FILE);
const userRepository = new UserRepository(database);
const tokenRepository = new TokenRepository(database);

async function handleRequest(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = requestUrl.pathname;

  try {
    if (req.method === 'GET' && pathname === '/health') {
      sendJson(res, 200, { status: 'ok' });
      return;
    }

    if (req.method === 'POST' && pathname === '/auth/register') {
      const body = await parseJsonBody(req);
      const validationError = validateRegisterPayload(body);
      if (validationError) {
        sendError(res, 400, validationError);
        return;
      }

      const user = await userRepository.create(body);
      if (!user) {
        sendError(res, 409, '이미 존재하는 아이디입니다.');
        return;
      }

      const tokenRecord = await tokenRepository.create(user.id);
      sendJson(res, 201, { token: tokenRecord.token, user: sanitizeUser(user) });
      return;
    }

    if (req.method === 'POST' && pathname === '/auth/login') {
      const body = await parseJsonBody(req);
      const validationError = validateLoginPayload(body);
      if (validationError) {
        sendError(res, 400, validationError);
        return;
      }

      const user = await userRepository.getById(body.id);
      if (!user) {
        sendError(res, 401, '아이디 또는 비밀번호가 올바르지 않습니다.');
        return;
      }

      const passwordHash = hashPassword(body.password, user.passwordSalt);
      if (passwordHash !== user.passwordHash) {
        sendError(res, 401, '아이디 또는 비밀번호가 올바르지 않습니다.');
        return;
      }

      const tokenRecord = await tokenRepository.create(user.id);
      sendJson(res, 200, { token: tokenRecord.token, user: sanitizeUser(user) });
      return;
    }

    if (req.method === 'GET' && pathname === '/auth/verify') {
      const token = getBearerToken(req);
      if (!token) {
        sendError(res, 401, '인증 토큰이 필요합니다.');
        return;
      }

      const tokenRecord = await tokenRepository.getByToken(token);
      if (!tokenRecord) {
        sendError(res, 401, '유효하지 않은 토큰입니다.');
        return;
      }

      const user = await userRepository.getById(tokenRecord.userId);
      if (!user) {
        sendError(res, 401, '유효하지 않은 사용자입니다.');
        return;
      }

      sendJson(res, 200, { valid: true, user: sanitizeUser(user) });
      return;
    }

    if (pathname === '/api/nfc-tags') {
      if (req.method === 'GET') {
        const tags = await nfcRepository.getAll();
        sendJson(res, 200, { data: tags });
        return;
      }

      if (req.method === 'POST') {
        const body = await parseJsonBody(req);
        const validationError = validateNfcPayload(body);
        if (validationError) {
          sendError(res, 400, validationError);
          return;
        }
        const record = await nfcRepository.create(body);
        sendJson(res, 201, record);
        return;
      }
    }

    if (req.method === 'GET' && pathname === '/api/nfc-tags/latest') {
      const latest = await nfcRepository.getLatest();
      sendJson(res, 200, { data: latest });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/readings/latest') {
      const latest = await repository.getLatest();
      if (!latest) {
        sendJson(res, 200, { data: null });
        return;
      }
      sendJson(res, 200, { data: latest });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/led-state') {
      const latest = await repository.getLatest();
      if (!latest) {
        sendJson(res, 200, { ledState: 'unknown' });
        return;
      }
      sendJson(res, 200, {
        ledState: latest.ledState ? 'on' : 'off',
        updatedAt: latest.createdAt,
        sensorId: latest.sensorId,
        distanceCm: latest.distanceCm,
        thresholdCm: latest.thresholdCm,
      });
      return;
    }

    if (pathname === '/api/readings') {
      if (req.method === 'GET') {
        const readings = await repository.getAll();
        sendJson(res, 200, { data: readings });
        return;
      }

      if (req.method === 'POST') {
        const body = await parseJsonBody(req);
        const validationError = validatePayload(body);
        if (validationError) {
          sendError(res, 400, validationError);
          return;
        }
        const record = await repository.create(body);
        sendJson(res, 201, record);
        return;
      }
    }

    if (pathname.startsWith('/api/readings/')) {
      const segments = getPathSegments(pathname);
      if (segments.length === 2) {
        const id = segments[1];
        if (req.method === 'GET') {
          const record = await repository.getById(id);
          if (!record) {
            sendError(res, 404, '데이터를 찾을 수 없습니다.');
            return;
          }
          sendJson(res, 200, record);
          return;
        }

        if (req.method === 'DELETE') {
          const deleted = await repository.remove(id);
          if (!deleted) {
            sendError(res, 404, '이미 삭제되었거나 존재하지 않습니다.');
            return;
          }
          sendJson(res, 200, { success: true });
          return;
        }
      }
    }

    sendError(res, 404, '엔드포인트가 존재하지 않습니다.');
  } catch (error) {
    console.error(error);
    sendError(res, 500, error.message);
  }
}

function validatePayload(body) {
  if (!body || typeof body !== 'object') {
    return 'JSON 형식의 데이터가 필요합니다.';
  }

  if (!body.sensorId || typeof body.sensorId !== 'string') {
    return 'sensorId (문자열) 필드가 필요합니다.';
  }

  if (typeof body.distanceCm !== 'number' || Number.isNaN(body.distanceCm)) {
    return 'distanceCm (숫자) 필드가 필요합니다.';
  }

  if (typeof body.thresholdCm !== 'number' || Number.isNaN(body.thresholdCm)) {
    return 'thresholdCm (숫자) 필드가 필요합니다.';
  }

  if (typeof body.ledState !== 'boolean') {
    return 'ledState (불리언) 필드가 필요합니다.';
  }

  if (body.metadata && typeof body.metadata !== 'object') {
    return 'metadata 필드는 객체여야 합니다.';
  }

  return null;
}

function validateRegisterPayload(body) {
  if (!body || typeof body !== 'object') {
    return 'JSON 형식의 데이터가 필요합니다.';
  }

  if (!body.id || typeof body.id !== 'string') {
    return 'id (문자열) 필드가 필요합니다.';
  }

  if (!body.password || typeof body.password !== 'string') {
    return 'password (문자열) 필드가 필요합니다.';
  }

  if (!body.name || typeof body.name !== 'string') {
    return 'name (문자열) 필드가 필요합니다.';
  }

  if (!body.userType || typeof body.userType !== 'string') {
    return 'userType (문자열) 필드가 필요합니다.';
  }

  if (body.carNumber && typeof body.carNumber !== 'string') {
    return 'carNumber (문자열) 필드가 필요합니다.';
  }

  return null;
}

function validateLoginPayload(body) {
  if (!body || typeof body !== 'object') {
    return 'JSON 형식의 데이터가 필요합니다.';
  }

  if (!body.id || typeof body.id !== 'string') {
    return 'id (문자열) 필드가 필요합니다.';
  }

  if (!body.password || typeof body.password !== 'string') {
    return 'password (문자열) 필드가 필요합니다.';
  }

  return null;
}

function validateNfcPayload(body) {
  if (!body || typeof body !== 'object') {
    return 'JSON 형식의 데이터가 필요합니다.';
  }

  if (!body.cardId || typeof body.cardId !== 'string') {
    return 'cardId (문자열) 필드가 필요합니다.';
  }

  if (
    body.speakerTriggered !== undefined &&
    typeof body.speakerTriggered !== 'boolean'
  ) {
    return 'speakerTriggered 필드는 불리언이어야 합니다.';
  }

  if (body.metadata && typeof body.metadata !== 'object') {
    return 'metadata 필드는 객체여야 합니다.';
  }

  return null;
}

await ensureDataFile(DATA_FILE);
await ensureDataFile(NFC_DATA_FILE);
await initializeDatabase();

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`🚗 ParkEase API 서버가 포트 ${PORT}에서 대기 중입니다.`);
});
