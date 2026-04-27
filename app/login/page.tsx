type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex flex-col items-center bg-background px-4 pt-10 sm:pt-16">
      <div className="text-center text-base sm:text-xl uppercase tracking-[0.3em] font-medium text-foreground/60 mb-3 sm:mb-5">
        Strava Visualizer
      </div>
      <h1 className="text-foreground font-black tracking-tighter leading-[0.9] text-[clamp(4rem,18vw,12rem)] mb-12 sm:mb-16 text-center">
        AKTIVITY
      </h1>

      <a
        href="/api/auth/login"
        className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-white hover:bg-[#FC4C02] font-semibold uppercase tracking-wider rounded-lg transition-colors"
      >
        Přihlásit přes Stravu
      </a>

      {error && (
        <div className="mt-6 text-sm text-red-600">Chyba přihlášení: {error}</div>
      )}
    </main>
  );
}
