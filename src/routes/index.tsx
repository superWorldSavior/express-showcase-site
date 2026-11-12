import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

const WEBHOOK = "https://hook.eu2.make.com/rc172e32yim6cmrquvysl615whx9ejny";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atelier Nova — Site vitrine" },
      { name: "description", content: "Atelier Nova : contactez-nous via notre formulaire." },
      { property: "og:title", content: "Atelier Nova — Site vitrine" },
      { property: "og:description", content: "Atelier Nova : contactez-nous via notre formulaire." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, sentAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  const input = "w-full rounded-md border border-input bg-card px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-ring";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="font-display text-2xl">Atelier Nova</span>
        <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
      </header>
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-sm uppercase tracking-widest text-primary">Studio créatif</p>
        <h1 className="mt-4 font-display text-5xl leading-tight md:text-7xl">Des idées simples,<br />bien faites.</h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">Nous accompagnons les entreprises dans leur image, leur site et leur communication.</p>
        <a href="#contact" className="mt-8 inline-block rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90">Nous contacter</a>
      </section>
      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-20 md:grid-cols-3">
        {[["Identité", "Logo, couleurs, ton."], ["Web", "Sites rapides et clairs."], ["Contenu", "Textes et visuels qui parlent."]].map(([t, d]) => (
          <div key={t} className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-display text-2xl">{t}</h3>
            <p className="mt-2 text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>
      <section id="contact" className="bg-secondary py-20">
        <div className="mx-auto max-w-xl px-6">
          <h2 className="font-display text-4xl">Parlons de votre projet</h2>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <input name="name" required maxLength={100} placeholder="Nom" className={input} />
            <input name="email" type="email" required maxLength={255} placeholder="Email" className={input} />
            <input name="phone" maxLength={30} placeholder="Téléphone (optionnel)" className={input} />
            <textarea name="message" required maxLength={1000} rows={5} placeholder="Votre message" className={input} />
            <button disabled={status === "sending"} className="w-full rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
              {status === "sending" ? "Envoi…" : "Envoyer"}
            </button>
            {status === "ok" && <p className="text-primary">Merci, message envoyé !</p>}
            {status === "error" && <p className="text-destructive">Erreur d'envoi, réessayez.</p>}
          </form>
        </div>
      </section>
      <footer className="py-8 text-center text-sm text-muted-foreground">© Atelier Nova</footer>
    </main>
  );
}
