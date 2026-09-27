export function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const csvContent =
    headers.join(",") + "\n" + rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  link.remove();
  URL.revokeObjectURL(url);
}
