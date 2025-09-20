// lib/analytics.ts

import { Product } from '@/lib/types';

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      eventParams: { [key: string]: any }
    ) => void;
  }
}

/**
 * Registra un evento de visualización de producto.
 */
export function trackViewItem(product: Product) {
  window.gtag?.('event', 'view_item', {
    currency: 'CRC',
    value: product.priceCRC,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.priceCRC,
        item_category: product.category,
      },
    ],
  });
}

/**
 * Registra un evento al agregar un producto al carrito.
 */
export function trackAddToCart(product: Omit<Product, 'qty'>, quantity: number) {
  window.gtag?.('event', 'add_to_cart', {
    currency: 'CRC',
    value: product.priceCRC * quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.priceCRC,
        quantity: quantity,
      },
    ],
  });
}

/**
 * Registra un evento al iniciar el proceso de checkout.
 */
export function trackBeginCheckout(cartTotal: number, itemCount: number) {
  window.gtag?.('event', 'begin_checkout', {
    currency: 'CRC',
    value: cartTotal,
    items: [
      // Aunque GA4 puede recibir un array de items, 
      // para "begin_checkout" a menudo es suficiente con el valor total.
      // Si quisieras detallar, aquí mapearías los items del carrito.
    ],
    coupon: '', // Puedes añadir cupones si implementas esa lógica
  });
}