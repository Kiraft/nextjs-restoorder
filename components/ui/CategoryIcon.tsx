"use client"
import Image from "next/image"
import Link from "next/link"
import { useParams } from 'next/navigation'
import { Category } from "@prisma/client"

type CategoryIconProps = {
    category: Category
}

export default function CategoryIcon({ category }: CategoryIconProps) {
    const params = useParams<{category: string}>()

    return (
        <div
            className={`${category.slug === params.category ? 'bg-white ' : ''} flex items-center gap-4 w-full border-t border-gray-200 p-3 last-of-type:border-b`}
        >
            <div className="w-16 h-16 relative">
                <Image
                    fill
                    src={`/icon_${category.slug}.svg`}
                    alt="Imagen Categoria"
                />
            </div>

            <Link
                className={`${category.slug === params.category ? 'text-xl font-bold text-black' : 'text-xl font-bold text-white'}`}
                href={`/order/${category.slug}`}
            >{category.name}</Link>
        </div>
    )
}
