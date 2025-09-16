import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Kureno's story, mission, and values",
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 -z-10" />
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Our Story</h1>
            <p className="text-xl text-muted-foreground">Discover the passion and purpose behind Kureno</p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=400&width=600" alt="Kureno founders" fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">How It All Began</h2>
              <p className="text-muted-foreground mb-4">
                Kureno was founded in 2015 by a group of friends who shared a passion for local craftsmanship and a
                vision to preserve traditional techniques while creating modern, functional products.
              </p>
              <p className="text-muted-foreground mb-4">
                What started as a small workshop in a garage has grown into a beloved brand that celebrates our
                community's unique identity and heritage. Our journey has been one of discovery, learning, and growth,
                but our core values have remained unchanged.
              </p>
              <p className="text-muted-foreground">
                Today, we work with over 20 local artisans and craftspeople, creating products that tell a story and
                connect people to our cultural roots.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Our Mission & Values</h2>
            <p className="text-lg text-muted-foreground">
              At Kureno, we're guided by a set of core principles that inform everything we do, from product design to
              customer service.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Quality Craftsmanship",
                description:
                  "We believe in creating products that last, using the finest materials and traditional techniques that have stood the test of time.",
              },
              {
                title: "Cultural Heritage",
                description:
                  "We honor and preserve our local traditions by incorporating elements of our cultural heritage into modern, functional designs.",
              },
              {
                title: "Sustainability",
                description:
                  "We're committed to environmentally responsible practices, from sourcing materials to packaging and shipping.",
              },
              {
                title: "Community Support",
                description:
                  "We invest in our local community by providing fair wages, training opportunities, and supporting other local businesses.",
              },
              {
                title: "Authenticity",
                description:
                  "We create genuine products with real stories, avoiding mass production in favor of thoughtful, meaningful items.",
              },
              {
                title: "Innovation",
                description:
                  "While respecting tradition, we continuously explore new techniques and designs to keep our offerings fresh and relevant.",
              },
            ].map((value, index) => (
              <div key={index} className="bg-background rounded-lg border p-6">
                <h3 className="text-xl font-medium mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground">
              The passionate individuals behind Kureno who bring our vision to life every day.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((member) => (
              <div key={member} className="text-center">
                <div className="relative h-[300px] w-full rounded-lg overflow-hidden mb-4">
                  <Image
                    src={`/placeholder.svg?height=300&width=300`}
                    alt={`Team member ${member}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium">Team Member {member}</h3>
                <p className="text-muted-foreground">Position</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
