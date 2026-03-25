import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { leaderboard, formatNumber } from "@/lib/mock-data"
import { Trophy } from "lucide-react"

export function LeaderboardTable() {
  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      <div className="overflow-x-auto">
      <Table className="min-w-160">
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-16 text-center">Rank</TableHead>
            <TableHead>Participant</TableHead>
            <TableHead className="text-right">Points</TableHead>
            <TableHead className="text-right">Win Rate</TableHead>
            <TableHead className="text-right">Predictions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.map((user) => (
            <TableRow
              key={user.rank}
              className="border-border hover:bg-secondary/50 cursor-pointer"
            >
              <TableCell className="text-center font-medium">
                {user.rank <= 3 ? (
                  <div className="flex items-center justify-center">
                    <Trophy
                      className={`h-5 w-5 ${
                        user.rank === 1
                          ? "text-yellow-500"
                          : user.rank === 2
                          ? "text-gray-400"
                          : "text-amber-600"
                      }`}
                    />
                  </div>
                ) : (
                  <span className="text-muted-foreground">{user.rank}</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                    {user.avatar}
                  </div>
                  <span className="font-medium">{user.username}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatNumber(user.points)}
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={
                    user.winRate >= 60
                      ? "text-emerald-500"
                      : user.winRate >= 50
                      ? "text-foreground"
                      : "text-red-500"
                  }
                >
                  {user.winRate.toFixed(1)}%
                </span>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {user.totalTrades}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}
