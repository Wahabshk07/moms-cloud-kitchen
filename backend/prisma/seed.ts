import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const customerPassword = await bcrypt.hash('Customer@123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Kitchen Admin',
      phone: '03000000000',
      email: 'admin@momscloudkitchen.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Ayesha Khan',
      phone: '03001234567',
      password: customerPassword,
      role: 'CUSTOMER',
      address: '12 Gulberg III, Lahore',
    },
  });

  const categoryNames = [
    'Main Course',
    'Rice',
    'Snacks',
    'Desserts',
    'Drinks',
  ] as const;
  const categories = {} as Record<(typeof categoryNames)[number], string>;
  for (const name of categoryNames) {
    const created = await prisma.category.create({ data: { name } });
    categories[name] = created.id;
  }

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Chicken Karahi',
        description:
          'Homestyle karahi with tender chicken, tomatoes, ginger, and green chillies.',
        image:
          'https://images.unsplash.com/photo-1603894584372-c69e32bd27f3?w=900&q=80',
        ingredients: JSON.stringify([
          'Chicken',
          'Tomatoes',
          'Ginger',
          'Garlic',
          'Green chillies',
        ]),
        price: 890,
        categoryId: categories['Main Course'],
        isFeatured: true,
        isPopular: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Beef Nihari',
        description:
          'Slow-cooked nihari with bone marrow gravy and warm spices.',
        image:
          'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900&q=80',
        ingredients: JSON.stringify([
          'Beef',
          'Wheat flour',
          'Ginger',
          'Nihari masala',
        ]),
        price: 990,
        categoryId: categories['Main Course'],
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Chicken Biryani',
        description:
          'Fragrant basmati layered with spiced chicken and fried onions.',
        image:
          'https://images.unsplash.com/photo-1563379091339-03b21dff3bf1?w=900&q=80',
        ingredients: JSON.stringify([
          'Basmati rice',
          'Chicken',
          'Yogurt',
          'Saffron',
        ]),
        price: 650,
        categoryId: categories.Rice,
        isPopular: true,
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Vegetable Pulao',
        description: 'Light pulao with seasonal vegetables and whole spices.',
        image:
          'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=900&q=80',
        ingredients: JSON.stringify([
          'Basmati rice',
          'Peas',
          'Carrots',
          'Cumin',
        ]),
        price: 420,
        categoryId: categories.Rice,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Aloo Samosa (2 pcs)',
        description: 'Crispy pastry filled with spiced potato and peas.',
        image:
          'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=900&q=80',
        ingredients: JSON.stringify(['Potato', 'Peas', 'Pastry', 'Chaât masala']),
        price: 180,
        categoryId: categories.Snacks,
        isPopular: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Chicken Seekh Kebab',
        description: 'Chargrilled seekh kebabs with mint chutney.',
        image:
          'https://images.unsplash.com/photo-1599487488170-d11ec9c172f4?w=900&q=80',
        ingredients: JSON.stringify([
          'Chicken mince',
          'Onion',
          'Coriander',
          'Spices',
        ]),
        price: 520,
        categoryId: categories.Snacks,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Gulab Jamun (4 pcs)',
        description: 'Soft milk dumplings soaked in warm cardamom syrup.',
        image:
          'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=900&q=80',
        ingredients: JSON.stringify([
          'Milk solids',
          'Sugar syrup',
          'Cardamom',
          'Rose',
        ]),
        price: 280,
        categoryId: categories.Desserts,
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Kheer',
        description: 'Creamy rice pudding finished with pistachio and saffron.',
        image:
          'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&q=80',
        ingredients: JSON.stringify([
          'Milk',
          'Rice',
          'Sugar',
          'Pistachio',
          'Saffron',
        ]),
        price: 260,
        categoryId: categories.Desserts,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Kashmiri Chai',
        description: 'Pink tea with cardamom, milk, and crushed almonds.',
        image:
          'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=900&q=80',
        ingredients: JSON.stringify([
          'Green tea',
          'Milk',
          'Cardamom',
          'Almonds',
        ]),
        price: 180,
        categoryId: categories.Drinks,
        isPopular: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Fresh Lassi',
        description: 'Chilled yogurt lassi, lightly sweetened.',
        image:
          'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=900&q=80',
        ingredients: JSON.stringify(['Yogurt', 'Milk', 'Sugar', 'Cardamom']),
        price: 160,
        categoryId: categories.Drinks,
      },
    }),
  ]);

  const deliveryFee = Number(process.env.DELIVERY_FEE ?? 50);
  const karahi = products[0];
  const biryani = products[2];
  const samosa = products[4];

  await prisma.order.create({
    data: {
      orderNumber: 'MCK-SEED01',
      userId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      deliveryAddress: customer.address!,
      subtotal: karahi.price + biryani.price,
      deliveryFee,
      total: karahi.price + biryani.price + deliveryFee,
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',
      items: {
        create: [
          {
            productId: karahi.id,
            productName: karahi.name,
            productImage: karahi.image,
            unitPrice: karahi.price,
            quantity: 1,
            totalPrice: karahi.price,
          },
          {
            productId: biryani.id,
            productName: biryani.name,
            productImage: biryani.image,
            unitPrice: biryani.price,
            quantity: 1,
            totalPrice: biryani.price,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: 'MCK-SEED02',
      userId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      deliveryAddress: customer.address!,
      deliveryInstructions: 'Please call on arrival',
      subtotal: samosa.price * 2,
      deliveryFee,
      total: samosa.price * 2 + deliveryFee,
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      orderStatus: 'PREPARING',
      items: {
        create: [
          {
            productId: samosa.id,
            productName: samosa.name,
            productImage: samosa.image,
            unitPrice: samosa.price,
            quantity: 2,
            totalPrice: samosa.price * 2,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: 'MCK-SEED03',
      userId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      deliveryAddress: customer.address!,
      subtotal: products[6].price,
      deliveryFee,
      total: products[6].price + deliveryFee,
      paymentMethod: 'COD',
      paymentStatus: 'COLLECTED',
      orderStatus: 'DELIVERED',
      items: {
        create: [
          {
            productId: products[6].id,
            productName: products[6].name,
            productImage: products[6].image,
            unitPrice: products[6].price,
            quantity: 1,
            totalPrice: products[6].price,
          },
        ],
      },
    },
  });

  console.log('Seed complete');
  console.log(`Admin: ${admin.email} / Admin@123`);
  console.log(`Customer: ${customer.phone} / Customer@123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
