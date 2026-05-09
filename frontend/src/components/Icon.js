function Icon({ name }) {
  const icons = {
    grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
    spark: "M12 3l1.8 4.8L18 9.5l-4.2 1.7L12 16l-1.8-4.8L6 9.5l4.2-1.7z",
    users:
      "M8 12a3 3 0 100-6 3 3 0 000 6zm8 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM3.5 19a4.5 4.5 0 019 0M13.5 19a4 4 0 018 0",
    building:
      "M5 20V6l7-2v16M5 20h14M14 20V9l5 1v10M8 8h1M8 11h1M8 14h1M11 8h1M11 11h1M11 14h1M16 12h1M16 15h1",
    chart: "M5 19V11M12 19V6M19 19v-9",
    arrowLeft: "M19 12H5M12 19l-7-7 7-7",
    gear:
      "M12 8.5A3.5 3.5 0 1112 15.5 3.5 3.5 0 0112 8.5zm0-5l1 2.3 2.6.4.7 2.5 2 1.7-1.3 2.2 1.3 2.2-2 1.7-.7 2.5-2.6.4-1 2.3-2.4-1-2.4 1-1-2.3-2.6-.4-.7-2.5-2-1.7 1.3-2.2-1.3-2.2 2-1.7.7-2.5 2.6-.4 1-2.3 2.4 1z",
    book: "M6 4.5A2.5 2.5 0 018.5 2H20v17.5A2.5 2.5 0 0017.5 17H6zM6 4.5V20M8.5 6H16",
    clock: "M12 7v5l3 2M21 12A9 9 0 113 12a9 9 0 0118 0z",
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={icons[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Icon;
