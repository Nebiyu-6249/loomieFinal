import { Robot } from "@/components/Robot";

export const metadata = { robots: { index: false } };

export default function Probe() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-void p-step-4">
      <Robot className="w-[420px]" label="Loomie" />
    </main>
  );
}
