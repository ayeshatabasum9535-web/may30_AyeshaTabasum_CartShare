import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;


const corsOrigin = process.env.CORS_ORIGIN || "https://fabulous-longma-607b5d.netlify.app";

app.use(cors({ origin: corsOrigin }));
app.use(express.json());


const BIN_ID = process.env.JSONBIN_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

async function readDb() {
  try {
    const res = await fetch(`${BIN_URL}/latest`, {
      headers: {
        'X-Master-Key': API_KEY
      }
    });
    if (!res.ok) throw new Error(`JSONBin read failed: ${res.status}`);
    const data = await res.json();
    return data.record;
  } catch (err) {
    console.error('readDb error:', err.message);
    return { rooms: [] };
  }
}

async function writeDb(data) {
  try {
    const res = await fetch(BIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`JSONBin write failed: ${res.status}`);
  } catch (err) {
    console.error('writeDb error:', err.message);
    throw err;
  }
}


app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.get('/api/rooms/:roomCode', async (req, res) => {
  try {
    const roomCode = req.params.roomCode.toUpperCase();
    const db = await readDb();
    const room = db.rooms.find((r) => r.roomCode === roomCode);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});


app.post('/api/rooms', async (req, res) => {
  try {
    const { roomCode } = req.body;
    if (!roomCode) return res.status(400).json({ error: 'roomCode is required' });

    const db = await readDb();
    if (db.rooms.some((r) => r.roomCode === roomCode.toUpperCase())) {
      return res.status(409).json({ error: 'Room already exists' });
    }

    const newRoom = {
      roomCode: roomCode.toUpperCase(),
      participants: [],
      items: [],
      activityLog: []
    };

    db.rooms.push(newRoom);
    await writeDb(db);
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});


app.put('/api/rooms/:roomCode', async (req, res) => {
  try {
    const roomCode = req.params.roomCode.toUpperCase();
    const payload = req.body;

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid room payload' });
    }

    const db = await readDb();
    const roomIndex = db.rooms.findIndex((r) => r.roomCode === roomCode);
    if (roomIndex === -1) return res.status(404).json({ error: 'Room not found' });

    db.rooms[roomIndex] = { ...db.rooms[roomIndex], ...payload, roomCode };
    await writeDb(db);
    res.json(db.rooms[roomIndex]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update room' });
  }
});


app.delete('/api/rooms/:roomCode', async (req, res) => {
  try {
    const roomCode = req.params.roomCode.toUpperCase();
    const db = await readDb();
    const roomIndex = db.rooms.findIndex((r) => r.roomCode === roomCode);
    if (roomIndex === -1) return res.status(404).json({ error: 'Room not found' });

    db.rooms.splice(roomIndex, 1);
    await writeDb(db);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

app.listen(PORT, () => {
  console.log(`CartShare server listening on http://localhost:${PORT}`);
});
