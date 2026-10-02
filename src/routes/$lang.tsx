import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { isOtherLocale } from "@/i18n/locales";

// Language section: /en, /tr, /ar. Persian stays at the root without a prefix.
export const Route = createFileRoute("/$lang")({
  beforeLoad: ({ params }) => {
    if (!isOtherLocale(params.lang)) throw notFound();
  },
  component: () => <Outlet />,
});
