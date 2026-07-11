import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware'lar
app.use(cors());
app.use(express.json());

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

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB ga muvaffaqiyatli ulanildi');
    app.listen(PORT, () => console.log(`Server ${PORT}-portda ishlayapti`));
  })
  .catch((err) => console.error('MongoDB ulanish xatosi:', err));