import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Każda specjalizacja to plik .md w src/content/specjalizacje.
// Nazwa pliku = adres podstrony (spadki.md → /spadki).
const specjalizacje = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/specjalizacje' }),
  schema: z.object({
    title: z.string(), // nazwa na liście i w nagłówku
    order: z.number(), // kolejność na stronie głównej
    short: z.string(), // jedno zdanie na liście na stronie głównej
    lead: z.string(), // duży akapit pod nagłówkiem podstrony
    seoTitle: z.string(),
    seoDescription: z.string().max(170),
    services: z.array(z.object({ name: z.string(), text: z.string() })).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    draft: z.boolean().default(false), // true = treść niezatwierdzona przez radcę (noindex)
  }),
});

export const collections = { specjalizacje };
