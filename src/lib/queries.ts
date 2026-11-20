import { db } from '@/db/db'; // Your initialized Drizzle DB instance
import { imageCategories } from '@/db/schema';
import { asc } from 'drizzle-orm';

export async function getImageCategories() {
  try {
    const allCategories = await db
      .select()
      .from(imageCategories)
      .orderBy(asc(imageCategories.name));
      
    return allCategories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw new Error('Could not fetch categories.');
  }
}