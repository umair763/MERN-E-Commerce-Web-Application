export const UiStatusPill = ({
  status,
  color = "#6B7280",
  backgroundColor,
  borderColor,
}) => (
  <span
    style={{
      color,
      backgroundColor: backgroundColor ?? `${color}1F`, // ~12% opacity for 6-digit hex
      border: `1px solid ${borderColor ?? color}`,
    }}
    className="inline-flex min-w-[76px] items-center justify-center rounded-full px-3.5 py-1 text-xs font-medium whitespace-nowrap"
  >
    {status}
  </span>
);
