import { ShieldCheck, Truck, Award } from "lucide-react";

const ITEMS = [
  { icon: Award, title: "کیفیت ممتاز", text: "زعفران درجه یک قائنات با تست آزمایشگاهی" },
  { icon: Truck, title: "ارسال سریع", text: "ارسال به سراسر ایران در کمتر از ۴۸ ساعت" },
  { icon: ShieldCheck, title: "ضمانت اصالت", text: "تضمین بازگشت وجه در صورت عدم اصالت کالا" },
];

export function PromiseStrip() {
  return (
    <section className="bg-[color:var(--brown-deep)] px-4 py-12 text-[color:var(--parchment)]">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[color:var(--saffron)]/20 text-[color:var(--saffron)]">
              <Icon className="size-6" />
            </div>
            <div>
              <h3 className="text-base font-bold">{title}</h3>
              <p className="mt-1 text-sm leading-7 text-white/75">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
