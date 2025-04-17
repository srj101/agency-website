import { ContactForm } from "./contact-form"

export const metadata = {
  title: "Contact Us | Agency Website",
  description: "Get in touch with our team.",
}

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Contact Us</h1>
        <p className="mt-4 text-lg text-muted-foreground">Get in touch with our team. We'd love to hear from you.</p>
      </div>

      <div className="mt-16 grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">Contact Information</h2>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-semibold">Address</h3>
              <p className="text-muted-foreground">123 Street Name, City, Country</p>
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-muted-foreground">
                <a href="mailto:info@agency.com" className="hover:text-foreground">
                  info@agency.com
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-muted-foreground">
                <a href="tel:+1234567890" className="hover:text-foreground">
                  +1 (234) 567-890
                </a>
              </p>
            </div>
          </div>

          <h2 className="mt-8 text-2xl font-bold">Office Hours</h2>
          <div className="mt-4 space-y-2">
            <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM</p>
            <p className="text-muted-foreground">Saturday - Sunday: Closed</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold">Send Us a Message</h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
