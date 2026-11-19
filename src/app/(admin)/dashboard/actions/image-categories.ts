'use server';

import { db } from '@/db/db';
import { imageCategories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { verifyLoggedInStatus } from './verify-auth';

// 1. Create a Category
export async function createCategory(prevState: any, formData: FormData) {
    await verifyLoggedInStatus();

    const name = formData.get('name') as string;
    const trimmedName = name?.trim();

    if (!trimmedName) {
        return { success: false, error: 'Category name is required.' };
    }

    try {
        await db.insert(imageCategories).values({ name: trimmedName });
        revalidatePath('/dashboard/art');
        return { success: true };
    } catch (error) {
        console.error('Error creating category:', error);
        return { success: false, error: 'Category already exists or could not be created.' };
    }
}

// 2. Update a Category
export async function updateCategory(prevState: any, formData: FormData) {
    await verifyLoggedInStatus();

    const currentName = formData.get('currentName') as string;
    const newName = formData.get('newName') as string;

    const trimmedNewName = newName?.trim();
    if (!trimmedNewName) {
        return { success: false, error: 'New category name is required.' };
    }

    try {
        await db
            .update(imageCategories)
            .set({ name: trimmedNewName })
            .where(eq(imageCategories.name, currentName));

        revalidatePath('/dashboard/art');
        return { success: true };
    } catch (error) {
        console.error('Error updating category:', error);
        return { success: false, error: 'Failed to update category.' };
    }
}

// 3. Delete a Category
export async function deleteCategory(prevState: any, formData: FormData) {
    await verifyLoggedInStatus();

    const name = formData.get('name') as string;

    if (!name) {
        return { success: false, error: 'Category name is required.' };
    }

    try {
        await db
            .delete(imageCategories)
            .where(eq(imageCategories.name, name));

        revalidatePath('/dashboard/art');
        return { success: true };
    } catch (error) {
        console.error('Error deleting category:', error);
        return { success: false, error: 'Failed to delete category.' };
    }
}