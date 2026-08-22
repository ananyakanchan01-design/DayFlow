import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import mongoose from 'mongoose';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Helper function to hash passwords safely
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'dayflow_salt_2026').digest('hex');
}

// User Data Interface
export interface UserItem {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  avatar?: string;
}

// Task Data Interface
export interface TaskItem {
  id: string;
  title: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  dueDate: string;
  dueTime: string;
  note?: string;
  createdAt: string;
  userId?: string;
}

// Initial Seed Users
const INITIAL_USERS: UserItem[] = [
  {
    id: 'user_1',
    name: 'Ananya Sharma',
    email: 'ananya@dayflow.app',
    passwordHash: hashPassword('password123'),
    createdAt: new Date().toISOString(),
    avatar: '👩🏻‍💻',
  },
];

// Initial Seed Tasks
const INITIAL_TASKS: TaskItem[] = [
  {
    id: '1',
    title: 'Complete React Website',
    category: 'Personal Project',
    priority: 'High',
    completed: false,
    dueDate: 'Today',
    dueTime: '5:00 PM',
    note: 'Build cinematic 3D story view and workspace dashboard',
    createdAt: new Date().toISOString(),
    userId: 'user_1',
  },
  {
    id: '2',
    title: 'Study DBMS',
    category: 'College',
    priority: 'Medium',
    completed: true,
    dueDate: 'Today',
    dueTime: '7:00 PM',
    note: 'Revise ACID properties and B+ trees',
    createdAt: new Date().toISOString(),
    userId: 'user_1',
  },
  {
    id: '3',
    title: 'Solve 3 LeetCode Problems',
    category: 'Coding',
    priority: 'High',
    completed: false,
    dueDate: 'Today',
    dueTime: '9:00 PM',
    note: 'Focus on Dynamic Programming & Graphs',
    createdAt: new Date().toISOString(),
    userId: 'user_1',
  },
  {
    id: '4',
    title: 'Read 20 Pages',
    category: 'Personal Growth',
    priority: 'Low',
    completed: false,
    dueDate: 'Today',
    dueTime: '10:00 PM',
    note: 'Atomic Habits - Chapter 4',
    createdAt: new Date().toISOString(),
    userId: 'user_1',
  },
  {
    id: '5',
    title: 'Workout & Stretch',
    category: 'Fitness',
    priority: 'Medium',
    completed: false,
    dueDate: 'Today',
    dueTime: '6:30 AM',
    note: '45 mins cardio and mobility',
    createdAt: new Date().toISOString(),
    userId: 'user_1',
  },
  {
    id: '6',
    title: 'Team Meeting',
    category: 'Work',
    priority: 'High',
    completed: false,
    dueDate: 'Tomorrow',
    dueTime: '10:00 AM',
    note: 'Sprint sync & design review',
    createdAt: new Date().toISOString(),
    userId: 'user_1',
  },
  {
    id: '7',
    title: 'Review Design System',
    category: 'Work',
    priority: 'Medium',
    completed: false,
    dueDate: 'Tomorrow',
    dueTime: '2:00 PM',
    note: 'Check color accessibility and components',
    createdAt: new Date().toISOString(),
    userId: 'user_1',
  },
  {
    id: '8',
    title: 'Prepare for Exam',
    category: 'College',
    priority: 'High',
    completed: false,
    dueDate: 'Friday',
    dueTime: '9:00 AM',
    note: 'Complete practice question set',
    createdAt: new Date().toISOString(),
    userId: 'user_1',
  },
];

// Determine Storage Driver Strategy
type StorageDriver = 'neon' | 'mongodb' | 'local';
let activeDriver: StorageDriver = 'local';

// PostgreSQL / Neon Client Pool
let pgPool: pg.Pool | null = null;

// MongoDB Mongoose Schemas
const MongoUserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: String, required: true },
  avatar: { type: String, default: '👤' },
});

const MongoTaskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: String, required: true },
  dueTime: { type: String, required: true },
  note: { type: String },
  createdAt: { type: String, required: true },
  userId: { type: String },
});

const MongoUserModel = mongoose.model('User', MongoUserSchema);
const MongoTaskModel = mongoose.model('Task', MongoTaskSchema);

// Local File Persistence Helpers
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'tasks.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureLocalFilesExist() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_TASKS, null, 2), 'utf-8');
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(INITIAL_USERS, null, 2), 'utf-8');
  }
}

function readLocalTasks(): TaskItem[] {
  ensureLocalFilesExist();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return INITIAL_TASKS;
  }
}

function writeLocalTasks(tasks: TaskItem[]) {
  ensureLocalFilesExist();
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

function readLocalUsers(): UserItem[] {
  ensureLocalFilesExist();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

function writeLocalUsers(users: UserItem[]) {
  ensureLocalFilesExist();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

// Database Initialization Routine
async function initDatabase() {
  // 1. NEON / POSTGRESQL DRIVER
  if (process.env.DATABASE_URL) {
    try {
      console.log('🔄 Connecting to Neon PostgreSQL...');
      pgPool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes('localhost')
          ? false
          : { rejectUnauthorized: false },
      });

      const client = await pgPool.connect();
      try {
        // Explicitly create public.users table in Neon PostgreSQL
        await client.query(`
          CREATE TABLE IF NOT EXISTS public.users (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at VARCHAR(100) NOT NULL,
            avatar VARCHAR(50) DEFAULT '👤'
          );
        `);

        // Explicitly create public.tasks table with user_id and completed_at
        await client.query(`
          CREATE TABLE IF NOT EXISTS public.tasks (
            id VARCHAR(255) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            priority VARCHAR(50) NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            due_date VARCHAR(100) NOT NULL,
            due_time VARCHAR(100) NOT NULL,
            note TEXT,
            created_at VARCHAR(100) NOT NULL,
            completed_at VARCHAR(100),
            user_id VARCHAR(255)
          );
          ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS completed_at VARCHAR(100);
          ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS user_id VARCHAR(255);
        `);

        // Check if users table is empty and seed initial user
        const usersCount = await client.query('SELECT id FROM public.users LIMIT 1');
        if (usersCount.rowCount === 0) {
          for (const u of INITIAL_USERS) {
            await client.query(
              `INSERT INTO public.users (id, name, email, password_hash, created_at, avatar)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [u.id, u.name, u.email, u.passwordHash, u.createdAt, u.avatar || '👤']
            );
          }
          console.log('🌱 Seeded initial user into public.users table');
        }

        // Check if tasks table is empty and seed initial items
        const tasksCount = await client.query('SELECT id FROM public.tasks LIMIT 1');
        if (tasksCount.rowCount === 0) {
          for (const t of INITIAL_TASKS) {
            await client.query(
              `INSERT INTO public.tasks (id, title, category, priority, completed, due_date, due_time, note, created_at, user_id)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
              [t.id, t.title, t.category, t.priority, t.completed, t.dueDate, t.dueTime, t.note || '', t.createdAt, t.userId || 'user_1']
            );
          }
          console.log('🌱 Seeded initial tasks into public.tasks table');
        }

        activeDriver = 'neon';
        console.log('⚡ Connected & Verified: public.users & public.tasks tables ready in Neon PostgreSQL!');
        return;
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('❌ Failed to connect to Neon PostgreSQL:', err);
      console.warn('Falling back to secondary storage driver...');
    }
  }

  // 2. MONGODB DRIVER
  if (process.env.MONGODB_URI) {
    try {
      console.log('🔄 Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI);
      
      const count = await MongoUserModel.countDocuments();
      if (count === 0) {
        await MongoUserModel.insertMany(INITIAL_USERS);
      }

      activeDriver = 'mongodb';
      console.log('🍃 Connected & Verified: MongoDB Atlas Database Driver ready!');
      return;
    } catch (err) {
      console.error('❌ Failed to connect to MongoDB:', err);
      console.warn('Falling back to local file storage driver...');
    }
  }

  // 3. LOCAL FILE FALLBACK
  activeDriver = 'local';
  ensureLocalFilesExist();
  console.log('📦 Connected & Verified: Local JSON File Storage ready!');
}

// REST API Endpoints

// 0. Root Endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'DayFlow Backend REST API Server',
    status: 'online',
    activeDriver: activeDriver.toUpperCase(),
    endpoints: {
      health: '/api/health',
      signup: 'POST /api/auth/signup',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me',
      tasks: '/api/tasks',
    },
    message: 'To view the frontend Web Application UI, open http://localhost:5173 (or port shown in terminal).',
  });
});

// 1. Health & Database Status
app.get('/api/health', async (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    activeDriver,
    timestamp: new Date().toISOString(),
  });
});

// AUTH ENDPOINTS

// POST /api/auth/signup — Create a new user account in database
app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = hashPassword(password);
    const userId = `user_${Date.now()}`;
    const createdAt = new Date().toISOString();
    const avatar = '🌱';

    if (activeDriver === 'neon' && pgPool) {
      const existing = await pgPool.query('SELECT id FROM public.users WHERE email = $1', [cleanEmail]);
      if (existing.rowCount && existing.rowCount > 0) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }

      await pgPool.query(
        `INSERT INTO public.users (id, name, email, password_hash, created_at, avatar)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, name, cleanEmail, passwordHash, createdAt, avatar]
      );

      const token = `token_${userId}_${Date.now()}`;
      return res.status(201).json({
        user: { id: userId, name, email: cleanEmail, createdAt, avatar },
        token,
      });
    }

    if (activeDriver === 'mongodb') {
      const existing = await MongoUserModel.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }

      const newUser = await MongoUserModel.create({
        id: userId,
        name,
        email: cleanEmail,
        passwordHash,
        createdAt,
        avatar,
      });

      const token = `token_${userId}_${Date.now()}`;
      return res.status(201).json({
        user: { id: newUser.id, name: newUser.name, email: newUser.email, createdAt: newUser.createdAt, avatar: newUser.avatar },
        token,
      });
    }

    // Local Driver
    const users = readLocalUsers();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const newUser: UserItem = {
      id: userId,
      name,
      email: cleanEmail,
      passwordHash,
      createdAt,
      avatar,
    };
    users.push(newUser);
    writeLocalUsers(users);

    const token = `token_${userId}_${Date.now()}`;
    return res.status(201).json({
      user: { id: userId, name, email: cleanEmail, createdAt, avatar },
      token,
    });
  } catch (err) {
    console.error('Error signing up user:', err);
    res.status(500).json({ error: 'Failed to create user account' });
  }
});

// POST /api/auth/login — Authenticate user
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = hashPassword(password);

    if (activeDriver === 'neon' && pgPool) {
      const result = await pgPool.query('SELECT * FROM public.users WHERE email = $1', [cleanEmail]);
      if (result.rowCount === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const dbUser = result.rows[0];
      if (dbUser.password_hash !== passwordHash) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = `token_${dbUser.id}_${Date.now()}`;
      return res.json({
        user: {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          createdAt: dbUser.created_at,
          avatar: dbUser.avatar || '👤',
        },
        token,
      });
    }

    if (activeDriver === 'mongodb') {
      const dbUser = await MongoUserModel.findOne({ email: cleanEmail });
      if (!dbUser || dbUser.passwordHash !== passwordHash) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = `token_${dbUser.id}_${Date.now()}`;
      return res.json({
        user: {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          createdAt: dbUser.createdAt,
          avatar: dbUser.avatar || '👤',
        },
        token,
      });
    }

    // Local Driver
    const users = readLocalUsers();
    const dbUser = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!dbUser || dbUser.passwordHash !== passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = `token_${dbUser.id}_${Date.now()}`;
    return res.json({
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        createdAt: dbUser.createdAt,
        avatar: dbUser.avatar || '👤',
      },
      token,
    });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

// GET /api/auth/me — Verify user session
app.get('/api/auth/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const parts = token.split('_');
    if (parts.length < 2) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const userId = `${parts[1]}_${parts[2]}`;

    if (activeDriver === 'neon' && pgPool) {
      const result = await pgPool.query('SELECT * FROM public.users WHERE id = $1', [userId]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      const u = result.rows[0];
      return res.json({
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.created_at,
        avatar: u.avatar || '👤',
      });
    }

    if (activeDriver === 'mongodb') {
      const u = await MongoUserModel.findOne({ id: userId });
      if (!u) return res.status(404).json({ error: 'User not found' });
      return res.json({
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
        avatar: u.avatar || '👤',
      });
    }

    // Local Driver
    const users = readLocalUsers();
    const u = users.find((usr) => usr.id === userId);
    if (!u) return res.status(404).json({ error: 'User not found' });

    return res.json({
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.createdAt,
      avatar: u.avatar || '👤',
    });
  } catch (err) {
    console.error('Error fetching me:', err);
    res.status(500).json({ error: 'Failed to fetch user session' });
  }
});

// TASK ENDPOINTS

// 2. GET /api/tasks — Fetch all tasks (isolated by user if userId provided)
app.get('/api/tasks', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string | undefined;

    if (activeDriver === 'neon' && pgPool) {
      const query = userId
        ? 'SELECT * FROM public.tasks WHERE user_id = $1 ORDER BY created_at DESC'
        : 'SELECT * FROM public.tasks ORDER BY created_at DESC';
      const params = userId ? [userId] : [];
      const result = await pgPool.query(query, params);
      const tasks: TaskItem[] = result.rows.map((r) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        priority: r.priority as 'High' | 'Medium' | 'Low',
        completed: r.completed,
        dueDate: r.due_date,
        dueTime: r.due_time,
        note: r.note,
        createdAt: r.created_at,
        userId: r.user_id,
      }));
      return res.json(tasks);
    }

    if (activeDriver === 'mongodb') {
      const filter = userId ? { userId } : {};
      const docs = await MongoTaskModel.find(filter).sort({ createdAt: -1 });
      const tasks = docs.map((d) => d.toObject());
      return res.json(tasks);
    }

    // Default: Local Storage Driver
    let tasks = readLocalTasks();
    if (userId) {
      tasks = tasks.filter((t) => t.userId === userId);
    }
    return res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// 3. POST /api/tasks — Create a new task
app.post('/api/tasks', async (req: Request, res: Response) => {
  try {
    const { title, category, priority, dueDate, dueTime, note, userId } = req.body;
    if (!title || !category || !priority) {
      return res.status(400).json({ error: 'Missing required task fields' });
    }

    const newTask: TaskItem = {
      id: Date.now().toString(),
      title,
      category,
      priority,
      completed: false,
      dueDate: dueDate || 'Today',
      dueTime: dueTime || '12:00 PM',
      note: note || '',
      createdAt: new Date().toISOString(),
      userId: userId || 'user_1',
    };

    if (activeDriver === 'neon' && pgPool) {
      await pgPool.query(
        `INSERT INTO public.tasks (id, title, category, priority, completed, due_date, due_time, note, created_at, user_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          newTask.id,
          newTask.title,
          newTask.category,
          newTask.priority,
          newTask.completed,
          newTask.dueDate,
          newTask.dueTime,
          newTask.note,
          newTask.createdAt,
          newTask.userId,
        ]
      );
      return res.status(201).json(newTask);
    }

    if (activeDriver === 'mongodb') {
      const doc = await MongoTaskModel.create(newTask);
      return res.status(201).json(doc.toObject());
    }

    // Local Driver
    const tasks = readLocalTasks();
    tasks.unshift(newTask);
    writeLocalTasks(tasks);
    return res.status(201).json(newTask);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// 4. PUT /api/tasks/:id — Update existing task
app.put('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (activeDriver === 'neon' && pgPool) {
      const { title, category, priority, dueDate, dueTime, note } = updates;
      await pgPool.query(
        `UPDATE public.tasks 
         SET title = COALESCE($1, title),
             category = COALESCE($2, category),
             priority = COALESCE($3, priority),
             due_date = COALESCE($4, due_date),
             due_time = COALESCE($5, due_time),
             note = COALESCE($6, note)
         WHERE id = $7`,
        [title, category, priority, dueDate, dueTime, note, id]
      );
      return res.json({ id, ...updates });
    }

    if (activeDriver === 'mongodb') {
      const doc = await MongoTaskModel.findOneAndUpdate({ id }, updates, { new: true });
      return res.json(doc ? doc.toObject() : { id, ...updates });
    }

    // Local Driver
    const tasks = readLocalTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      writeLocalTasks(tasks);
      return res.json(tasks[index]);
    }
    return res.status(404).json({ error: 'Task not found' });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// 5. PATCH /api/tasks/:id/toggle — Toggle task completion
app.patch('/api/tasks/:id/toggle', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (activeDriver === 'neon' && pgPool) {
      const result = await pgPool.query('SELECT completed FROM public.tasks WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      const newStatus = !result.rows[0].completed;
      await pgPool.query('UPDATE public.tasks SET completed = $1 WHERE id = $2', [newStatus, id]);
      return res.json({ id, completed: newStatus });
    }

    if (activeDriver === 'mongodb') {
      const doc = await MongoTaskModel.findOne({ id });
      if (!doc) return res.status(404).json({ error: 'Task not found' });
      doc.completed = !doc.completed;
      await doc.save();
      return res.json({ id, completed: doc.completed });
    }

    // Local Driver
    const tasks = readLocalTasks();
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      writeLocalTasks(tasks);
      return res.json({ id, completed: task.completed });
    }
    return res.status(404).json({ error: 'Task not found' });
  } catch (err) {
    console.error('Error toggling task:', err);
    res.status(500).json({ error: 'Failed to toggle task' });
  }
});

// 6. DELETE /api/tasks/:id — Delete task
app.delete('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (activeDriver === 'neon' && pgPool) {
      await pgPool.query('DELETE FROM public.tasks WHERE id = $1', [id]);
      return res.json({ success: true, id });
    }

    if (activeDriver === 'mongodb') {
      await MongoTaskModel.deleteOne({ id });
      return res.json({ success: true, id });
    }

    // Local Driver
    let tasks = readLocalTasks();
    tasks = tasks.filter((t) => t.id !== id);
    writeLocalTasks(tasks);
    return res.json({ success: true, id });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Process Error Handlers
process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception in Backend Server:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('⚠️ Unhandled Promise Rejection in Backend Server:', reason);
});

// Server Initialization
async function startServer() {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Backend REST Server active on http://localhost:${PORT}`);
    console.log(`📦 Active Storage Driver: ${activeDriver.toUpperCase()}`);
  });
}

startServer();

// Keep process active
setInterval(() => {}, 1000 * 60 * 60);
