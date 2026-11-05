"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { FieldLabel, Input } from "@/components/ui/fields";
import { toast } from "@/components/ui/toast";
import { CURRENCIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { BankAccount, Payment } from "@/types";

export default function PaymentPage() {
  const [currency, setCurrency] = useState("PKR");
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [txRef, setTxRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verified, setVerified] = useState(false);

  const selected = CURRENCIES.find((c) => c.code === currency)!;
  const bank = banks.find((b) => b.currency === currency);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("bank_accounts").select("*").eq("active", true).then(({ data }) => {
      setBanks((data ?? []) as BankAccount[]);
    });
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const [{ data: prof }, { data: pays }] = await Promise.all([
        supabase.from("profiles").select("status").eq("id", data.user.id).single(),
        supabase
          .from("payments")
          .select("*")
          .eq("profile_id", data.user.id)
          .order("created_at", { ascending: false }),
      ]);
      setVerified(prof?.status === "Verified");
      setPayments((pays ?? []) as Payment[]);
    });
  }, []);

  async function submitPayment() {
    setSubmitting(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    // TODO: Integrate Stripe here. Create a Checkout Session server-side,
    // redirect the user, and confirm via webhook. Until then payments are
    // recorded as bank transfers and confirmed manually by an admin.
    const { error } = await supabase.from("payments").insert({
      profile_id: userData.user.id,
      amount: selected.amount,
      currency: selected.code,
      payment_method: "Bank Transfer",
      transaction_ref: txRef.trim() || null,
      status: "Pending Confirmation",
    });

    setSubmitting(false);
    if (error) {
      toast(error.message, "error");
      return;
    }
    toast(
      "Payment submitted. An admin will confirm it and verify your account."
    );
    setTxRef("");
    const { data: pays } = await supabase
      .from("payments")
      .select("*")
      .eq("profile_id", userData.user.id)
      .order("created_at", { ascending: false });
    setPayments((pays ?? []) as Payment[]);
  }

  return (
    <div className="bg-off-white py-12">
      <div className="mx-auto max-w-2xl px-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-10">
          <h1 className="text-3xl font-bold text-charcoal">Get verified</h1>
          <p className="mt-2 text-charcoal/60">
            A one-time payment. Three steps, and you&apos;re done.
          </p>

          {/* The whole process at a glance */}
          <ol className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["Pay the fee", "Bank transfer in PKR, GBP, EUR or USD"],
              ["Add your reference", "So we can match your payment"],
              ["Get verified", "Our team confirms it"],
            ].map(([title, text], i) => (
              <li key={title} className="rounded-xl border border-charcoal/10 p-4">
                <span className="text-2xl font-bold text-coral">0{i + 1}</span>
                <p className="mt-1 font-bold text-charcoal">{title}</p>
                <p className="text-sm text-charcoal/60">{text}</p>
              </li>
            ))}
          </ol>

          {/* What verification unlocks */}
          <div className="mt-4 rounded-xl bg-coral/5 p-4 text-sm text-charcoal/80">
            <p className="font-bold text-charcoal">What you get</p>
            <ul className="mt-2 space-y-1">
              <li>✓ Names and numbers of other verified members</li>
              <li>✓ A Verified badge on your profile</li>
              <li>✓ Our agents can introduce you on WhatsApp</li>
            </ul>
          </div>

          {verified && (
            <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm font-semibold text-green-700">
              ✓ Your account is already verified. No further payment is needed.
            </div>
          )}

          <h2 className="mt-10 mb-3 font-bold text-charcoal">
            <span className="text-coral">01</span> Choose your currency and pay
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                className={cn(
                  "cursor-pointer rounded-xl border-2 p-4 text-center transition-colors",
                  currency === c.code
                    ? "border-coral bg-coral/5"
                    : "border-gray-200 hover:border-coral-muted"
                )}
              >
                <div className="text-xl font-extrabold text-charcoal">
                  {c.symbol}
                  {c.amount.toLocaleString()}
                </div>
                <div className="mt-1 text-xs font-semibold text-charcoal/60">
                  {c.code}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-off-white p-5">
            <h3 className="font-bold text-charcoal">
              Bank Transfer ({selected.country})
            </h3>
            {bank ? (
              <dl className="mt-3 space-y-1.5 text-sm">
                <BankRow label="Bank" value={bank.bank_name} />
                <BankRow label="Branch" value={bank.branch} />
                <BankRow label="Account Name" value={bank.account_name} />
                <BankRow label="Account No" value={bank.account_no} />
                <BankRow label="IBAN" value={bank.iban} />
              </dl>
            ) : (
              <p className="mt-2 text-sm text-charcoal/60">
                Bank details for {selected.code} will be shared by our team.
                Contact us on WhatsApp for payment instructions.
              </p>
            )}
          </div>

          <h2 className="mt-10 mb-3 font-bold text-charcoal">
            <span className="text-coral">02</span> Add your transfer reference
          </h2>
          <div>
            <FieldLabel
              label="Transaction Reference"
              hint="Enter your bank transfer reference so we can match your payment"
            >
              <Input
                value={txRef}
                onChange={(e) => setTxRef(e.target.value)}
                placeholder="e.g. TRX-12345678"
              />
            </FieldLabel>
          </div>

          <Button
            className="mt-8 w-full"
            size="lg"
            onClick={submitPayment}
            loading={submitting}
            disabled={verified}
          >
            I Have Paid {selected.symbol}
            {selected.amount.toLocaleString()} {selected.code}
          </Button>
          <p className="mt-3 text-center text-xs text-charcoal/50">
            <span className="font-bold text-coral">03</span> We confirm your
            payment and your profile turns Verified. Card payments are coming
            soon.
          </p>
        </div>

        {payments.length > 0 && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-charcoal">
              Your Payments
            </h2>
            <div className="space-y-3">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-4 text-sm"
                >
                  <div>
                    <span className="font-bold text-charcoal">
                      {p.amount.toLocaleString()} {p.currency}
                    </span>
                    {p.transaction_ref && (
                      <span className="ml-2 text-charcoal/50">
                        Ref: {p.transaction_ref}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold",
                      p.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    )}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BankRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-charcoal/50">{label}</dt>
      <dd className="font-semibold text-charcoal">{value}</dd>
    </div>
  );
}
