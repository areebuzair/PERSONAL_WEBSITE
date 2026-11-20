import { getImageCategories } from "@/lib/queries";
import { CategoryCreator } from "./CategoryManager";
import { Suspense } from "react";
import ImageUploader from "./ImageUploader";

const CategoryList = async () => {
    const categories = await getImageCategories();
    return <ul>
        {categories.map(item => <li key={item.id}>- {item.name}</li>)}
    </ul>
}

const ArtSettings = async () => {
    const categories = await getImageCategories();
    return <div className="space-y-2">
        <h2 className="text-2xl font-bold">All Categories</h2>
        <CategoryCreator />
        <ul className="space-y-2">
            {categories.map(item => <li key={item.id} className="py-2">{item.name.toUpperCase()}</li>)}
        </ul>
        <ImageUploader AVAILABLE_TAGS={categories.map(elem => elem.name)} />
    </div>
}

export default async function Page() {
    return <>
        <h1 className="text-3xl font-bold text-center mb-2">Image Portfolio Settings</h1>
        <section className="p-5 rounded-2xl border w-fit space-y-2">
            <Suspense fallback={<b>Loading</b>}>
                <ArtSettings />
            </Suspense>
        </section>
    </>
}