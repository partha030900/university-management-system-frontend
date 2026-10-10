
"use client";

import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    toast.success("Message submitted successfully!");
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <section className="mx-auto max-w-5xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-3 text-muted-foreground">
            Have a question? Send us a message.
          </p>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Mail className="mt-1 size-5 text-primary" />
              <div>
                <h2 className="font-semibold">Email</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  university@example.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="mt-1 size-5 text-primary" />
              <div>
                <h2 className="font-semibold">Phone</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Contact the university office for assistance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="mt-1 size-5 text-primary" />
              <div>
                <h2 className="font-semibold">Address</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  University campus
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-xl border p-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="How can we help?"
                required
                rows={5}
              />
            </div>

            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
