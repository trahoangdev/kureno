import type { Metadata } from "next"
import ProductsClient from "@/app/products/products-client"

export const metadata: Metadata = {
  title: "Products",
  description: "Explore Kureno's unique collection of locally crafted products",
}

export default function ProductsPage() {
  return <ProductsClient />
}
