import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import type { Review } from '../types';

export const orderStatus = pgEnum('order_status', ['accepted', 'paid', 'cancelled']);

export const products = pgTable(
  'products',
  {
    id: integer('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    price: numeric('price', { precision: 10, scale: 2, mode: 'number' }).notNull(),
    category: text('category').notNull(),
    thumbnail: text('thumbnail').notNull(),
    images: jsonb('images').$type<string[]>().notNull(),
    rating: numeric('rating', { precision: 3, scale: 2, mode: 'number' }).notNull(),
    stock: integer('stock').notNull(),
    brand: text('brand').notNull(),
    discountPercentage: numeric('discount_percentage', {
      precision: 5,
      scale: 2,
      mode: 'number',
    }).notNull(),
    reviews: jsonb('reviews').$type<Review[]>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('products_category_idx').on(table.category),
    index('products_title_idx').on(table.title),
  ]
);

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  status: orderStatus('status').notNull().default('accepted'),
  subtotal: numeric('subtotal', { precision: 10, scale: 2, mode: 'number' }).notNull(),
  shippingFee: numeric('shipping_fee', { precision: 10, scale: 2, mode: 'number' }).notNull(),
  total: numeric('total', { precision: 10, scale: 2, mode: 'number' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable(
  'order_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    productId: integer('product_id')
      .notNull()
      .references(() => products.id),
    quantity: integer('quantity').notNull(),
    unitPrice: numeric('unit_price', { precision: 10, scale: 2, mode: 'number' }).notNull(),
    lineTotal: numeric('line_total', { precision: 10, scale: 2, mode: 'number' }).notNull(),
  },
  (table) => [
    index('order_items_order_id_idx').on(table.orderId),
    index('order_items_product_id_idx').on(table.productId),
  ]
);

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
