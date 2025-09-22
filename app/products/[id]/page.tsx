import Image from "next/image"
import { notFound } from "next/navigation"
import AddToCart from "@/app/products/[id]/product-add-to-cart"

async function fetchProduct(id: string) {
  const res = await fetch(`/api/products/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  return await res.json()
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const p = await fetchProduct(params.id)
  if (!p) return notFound()

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="grid gap-3">
          <div className="relative h-[420px] w-full overflow-hidden rounded-md border">
            <Image src={p.images?.[0] || "/placeholder.jpg"} alt={p.name} fill className="object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {(p.images || []).slice(0, 4).map((src: string, i: number) => (
              <div key={i} className="relative h-20 overflow-hidden rounded-md border">
                <Image src={src} alt={`${p.name} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold">{p.name}</h1>
          <p className="mt-2 text-muted-foreground">Category: {p.category}</p>
          <p className="mt-4 text-2xl font-semibold">${p.price?.toFixed?.(2) ?? p.price}</p>
          <p className="mt-6 whitespace-pre-wrap text-sm leading-6">{p.description}</p>
          <AddToCart id={p._id} name={p.name} price={p.price} image={p.images?.[0] || "/placeholder.jpg"} />
        </div>
      </div>
    </div>
  )
}
