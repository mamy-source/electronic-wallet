import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register/RegisterForm";
import { SidebarBenefits } from "@/components/auth/register/SidebarBenefits";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Create Account — MONEXA",
  description: "Open your MONEXA personal or merchant account in minutes.",
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed type-caption-micro tracking-wider uppercase">
                Step 1 of 3
              </span>
              <span className="type-label-sm text-on-surface">Basic Details &amp; Phone SIM</span>
            </div>
            <button
              type="button"
              className="flex items-center gap-1 text-on-surface-variant hover:text-error type-caption-micro"
            >
              <Icon name="restart_alt" className="text-[15px]" />
              Clear Draft
            </button>
          </div>
          <div className="w-full grid grid-cols-3 gap-2 pt-1">
            <div className="h-1.5 rounded-full bg-primary" />
            <div className="h-1.5 rounded-full bg-surface-container-high" />
            <div className="h-1.5 rounded-full bg-surface-container-high" />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-10 shadow-md flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="mb-1"><Logo /></div>
            <h1 className="type-headline-md text-on-surface">
              Create your MONEXA Account
            </h1>
            <p className="type-body-md text-on-surface-variant max-w-xl">
              Start sending money, issuing dynamic QR codes, and receiving instant mobile money payments across Madagascar and beyond.
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
      <SidebarBenefits />
    </div>
  );
}