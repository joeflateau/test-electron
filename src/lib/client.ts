function Client() {
  const port = process.argv.find((_value, i, argv) => argv[i - 1] === "--port");
  return async <T>(path: string, init?: RequestInit) => {
    const r = await fetch(`http://localhost:${port}${path}`, init);
    return (await r.json()) as T;
  };
}

export const client = Client();
