'use client';

import { Phone, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'How do I place a bulk order with a supplier?',
    a: 'Browse the marketplace or a supplier profile, add the required products to your cart respecting each product\'s Minimum Order Quantity (MOQ), and proceed to checkout. You can review quantities and pricing before confirming.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'HoReCaConnect supports Cash on Delivery, UPI, Bank Transfer and Credit / Pay Later for verified business accounts. You can choose your preferred method at checkout.',
  },
  {
    q: 'How can I track my order status?',
    a: 'Go to My Orders from the sidebar and click on any order to see a live timeline covering Placed, Accepted, Packed, Dispatched and Delivered stages.',
  },
  {
    q: 'Are all suppliers on the platform verified?',
    a: 'Most suppliers go through a verification process and display a "Verified" badge on their profile. Some newer suppliers may still be pending verification — this is shown clearly on their profile page.',
  },
  {
    q: 'Can I contact a supplier directly before ordering?',
    a: 'Yes. Use the "Contact Supplier" button on any product or supplier page to send a message with your requirements, and the supplier will typically respond within their listed response time.',
  },
  {
    q: 'What is your return and cancellation policy?',
    a: 'Cancellation requests are handled directly with the supplier before an order is dispatched. Once delivered, returns are subject to each supplier\'s individual policy, available on request via Contact Supplier.',
  },
];

export default function SupportPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent, we'll get back to you within 24 hours");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Support" description="We're here to help with any questions about your orders or account" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-medium">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">Contact Us</h2>
            <div className="space-y-3 text-sm">
              <a href="tel:+911244567890" className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-50 text-forest-600">
                  <Phone className="h-4 w-4" />
                </span>
                +91 124 456 7890
              </a>
              <a href="mailto:support@horecaconnect.in" className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-50 text-forest-600">
                  <Mail className="h-4 w-4" />
                </span>
                support@horecaconnect.in
              </a>
              <p className="pt-1 text-xs text-muted-foreground">Support hours: Mon–Sat, 9:00 AM – 8:00 PM IST</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
              <MessageSquare className="h-5 w-5 text-forest-600" /> Send us a message
            </h2>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="s-name">Name</Label>
                <Input id="s-name" placeholder="Your name" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-email">Email</Label>
                <Input id="s-email" type="email" placeholder="you@business.com" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-message">Message</Label>
                <Textarea id="s-message" placeholder="How can we help?" rows={4} required />
              </div>
              <Button type="submit" className="w-full bg-forest-500 text-white hover:bg-forest-600">
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
