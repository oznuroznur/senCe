interface PercentageBarProps {
  yesPercentage: number
  noPercentage: number
  height?: string
  showLabels?: boolean
}

export function PercentageBar({
  yesPercentage,
  noPercentage,
  height = "h-1.5",
  showLabels = false,
}: PercentageBarProps) {
  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex justify-between text-xs mb-1">
          <span className="text-emerald-500">Yes {yesPercentage}%</span>
          <span className="text-red-500">No {noPercentage}%</span>
        </div>
      )}
      <div className={`flex w-full ${height} rounded-full overflow-hidden bg-secondary`}>
        <div
          className="bg-emerald-500 transition-all duration-300"
          style={{ width: `${yesPercentage}%` }}
        />
        <div
          className="bg-red-500 transition-all duration-300"
          style={{ width: `${noPercentage}%` }}
        />
      </div>
    </div>
  )
}
