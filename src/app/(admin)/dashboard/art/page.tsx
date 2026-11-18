import { getImageCategories } from "@/lib/queries";
import { CategoryCreator } from "./CategoryManager";
import { Suspense } from "react";

const CategoryList = async () => {
    const categories = await getImageCategories();
    return <ul>
        {categories.map(item => <li key={item.id}>- {item.name}</li>)}
    </ul>
}

export default async function Page() {
    return <section className="p-5 rounded-2xl border w-fit">
        <h2 className="font-bold">All Categories</h2>
        <Suspense fallback={<ul>Loading</ul>}>
            <CategoryList />
        </Suspense>
        <div>
            <CategoryCreator />
        </div>
    </section>
}