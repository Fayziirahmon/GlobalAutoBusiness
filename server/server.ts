import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// .env HAR DOIM shu papkadan (server/.env) o'qilsin — ildizdan ishga
// tushirilsa ham (npm run server). Aks holda MONGO_URI topilmaydi.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware'lar
app.use(cors());
app.use(express.json());

// Sog'liqni tekshirish — Render health check va API tirikligini bildiradi.
app.get('/', (_req: Request, res: Response) => {
  res.json({
    ok: true,
    service: 'GlobalAutoBusiness API',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'not-connected',
  });
});

// 1. Mahsulot strukturasi
interface IProduct {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true }
});

const Product = mongoose.model<IProduct>('Product', ProductSchema);

/* ─────────────────────────────────────────────────────────────
 *  XABARLAR (Contact formasi ↔ Admin panel)
 *
 *  clientId — tashrifchini tanib olish uchun (login yo'q).
 *  Brauzerda localStorage'da saqlanadi va har so'rov bilan yuboriladi.
 *  Admin javob yozsa, o'sha clientId egasi "Pochta" tugmasida ko'radi.
 * ───────────────────────────────────────────────────────────── */

const ReplySchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const MessageSchema = new mongoose.Schema({
  clientId: { type: String, required: true, index: true },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  company: { type: String, default: '' },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },        // adminlar o'qidimi
  replyUnread: { type: Boolean, default: false }, // mijoz javobni ko'rdimi
  replies: { type: [ReplySchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', MessageSchema);

// 4. Yangi xabar (Contact formasidan)
app.post('/api/messages', async (req: Request, res: Response) => {
  try {
    const { clientId, name, email, company, subject, message } = req.body;
    if (!clientId || !message) {
      return res.status(400).json({ error: 'clientId va message majburiy' });
    }
    const doc = await Message.create({ clientId, name, email, company, subject, message });
    res.status(201).json(doc);
  } catch {
    res.status(500).json({ error: 'Xabarni saqlashda xatolik' });
  }
});

// 5. Barcha xabarlar (ADMIN uchun) yoki bitta mijoznikilari (?clientId=)
app.get('/api/messages', async (req: Request, res: Response) => {
  try {
    const clientId = req.query.clientId as string | undefined;
    const filter = clientId ? { clientId } : {};
    const list = await Message.find(filter).sort({ createdAt: -1 }).limit(500);
    res.status(200).json(list);
  } catch {
    res.status(500).json({ error: 'Xabarlarni olishda xatolik' });
  }
});

// 6. Adminning javobi
app.post('/api/messages/:id/reply', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text majburiy' });

    const doc = await Message.findByIdAndUpdate(
      req.params.id,
      {
        $push: { replies: { text, createdAt: new Date() } },
        $set: { read: true, replyUnread: true },
      },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Xabar topilmadi' });
    res.status(200).json(doc);
  } catch {
    res.status(500).json({ error: 'Javob yuborishda xatolik' });
  }
});

// 7. O'qildi deb belgilash (admin: read, mijoz: replyUnread)
app.patch('/api/messages/:id/read', async (req: Request, res: Response) => {
  try {
    const { byAdmin } = req.body;
    const update = byAdmin ? { read: true } : { replyUnread: false };
    const doc = await Message.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!doc) return res.status(404).json({ error: 'Xabar topilmadi' });
    res.status(200).json(doc);
  } catch {
    res.status(500).json({ error: 'Belgilashda xatolik' });
  }
});

// 8. Xabarni o'chirish (admin)
app.delete('/api/messages/:id', async (req: Request, res: Response) => {
  try {
    const doc = await Message.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Xabar topilmadi' });
    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ error: 'O\'chirishda xatolik' });
  }
});

// 2. Mahsulotlarni olish (pagination bilan — har sahifada 50 ta)
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    // ?page=1&limit=50  (default: 1-sahifa, 50 tadan)
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const skip = (page - 1) * limit;

    // Ixtiyoriy qidiruv: ?q=matn  (title bo'yicha)
    const q = (req.query.q as string)?.trim();
    const filter = q ? { title: { $regex: q, $options: 'i' } } : {};

    const [products, totalProducts] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalProducts / limit)),
      totalProducts,
      limit,
    });
  } catch (error) {
    res.status(500).json({ error: 'Ma\'lumotlarni olishda xatolik yuz berdi' });
  }
});

// 2b. Bitta mahsulotni ID bo'yicha olish (alohida sahifa uchun)
app.get('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Mahsulot topilmadi' });
    }
    res.status(200).json(product);
  } catch (error) {
    // Noto'g'ri ID formati (CastError) ham shu yerga tushadi
    res.status(400).json({ error: 'Mahsulot topilmadi yoki ID noto\'g\'ri' });
  }
});

// 3. Mahsulot qo'shish
app.post('/api/products', async (req: Request, res: Response) => {
  try {
    const { title, description, price, imageUrl } = req.body;
    
    // Validatsiya: hamma maydonlar to'ldirilganligini tekshirish
    if (!title || !price || !imageUrl) {
      return res.status(400).json({ error: 'Iltimos, barcha kerakli maydonlarni to\'ldiring' });
    }

    const newProduct = new Product({ title, description, price, imageUrl });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Mahsulotni saqlashda xatolik yuz berdi' });
  }
});

// 4. Serverni ishga tushirish va bazaga ulanish
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  console.error('\n❌ MONGO_URI topilmadi. server/.env faylini tekshiring.\n');
  process.exit(1);
}

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 })
  .then(() => {
    console.log('✅ MongoDB ga ulanildi. Baza:', mongoose.connection.name);
    app.listen(PORT, () => console.log(`🚀 Server tayyor →  http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('\n❌ MongoDB ga ulanib bo\'lmadi:', err.message);
    console.error('   Tekshiring: (1) Atlas → Network Access → 0.0.0.0/0 ruxsat berilganmi');
    console.error('               (2) foydalanuvchi/parol to\'g\'rimi (server/.env)');
    console.error('               (3) internet/DNS ishlayaptimi\n');
    process.exit(1);
  });