'use client';

import { useActionState } from 'react';
import { createCategory, deleteCategory } from '../actions/image-categories';
import { IoMdAdd } from "react-icons/io";
import { IoMdTimer } from "react-icons/io";

export function CategoryCreator() {
    const [createState, createAction, isCreating] = useActionState(createCategory, null);

    return (
        <form action={createAction} className='max-w-90' >
            <div className='flex items-center justify-between border bg-white '>

                <input type="text" name="name" placeholder="New category name" required className='p-2 w-full' />

                <button type="submit" disabled={isCreating} className='cursor-pointer disabled:cursor-not-allowed hover:scale-110' aria-label="Create category">
                    {isCreating ? <IoMdTimer size={44}/> : <IoMdAdd size={44}/>}
                </button>

            </div>
            {createState?.error && <p className="text-red-500">{createState.error}</p>}
        </form >
    );
}
