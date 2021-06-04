function Client() {
  const port = process.argv.find((_value, i, argv) => argv[i - 1] === "--port");
  return (path: string, init?: RequestInit) => {
    return fetch(`http://localhost:${port}${path}`, init);
  };
}

export const client = Client();
