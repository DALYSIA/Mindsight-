"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const TAG_COLORS: Record<string, string> = {
  Interesting: "#3D5A80",
  "Follow up": "#B3572E",
  Outlier: "#6B8F71",
  Untagged: "#DEDACD",
};

export default function StudyStats({
  responses,
  totalContacts,
}: {
  responses: any[];
  totalContacts: number;
}) {
  const timelineData = useMemo(() => {
    const byDay: Record<string, number> = {};
    responses.forEach((r) => {
      const day = new Date(r.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      byDay[day] = (byDay[day] || 0) + 1;
    });
    return Object.entries(byDay).map(([day, count]) => ({ day, count }));
  }, [responses]);

  const tagData = useMemo(() => {
    const counts: Record<string, number> = {};
    responses.forEach((r) => {
      const tag = r.tag || "Untagged";
      counts[tag] = (counts[tag] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [responses]);

  const responseRate =
    totalContacts === 0 ? 0 : Math.round((responses.length / totalContacts) * 100);

  if (responses.length === 0) return null;

  return (
    <div className="mb-10 space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <div className="border border-line rounded-sm p-3 text-center">
          <p className="font-display text-2xl">{responses.length}</p>
          <p className="text-xs font-mono text-taupe uppercase mt-1">Replies</p>
        </div>
        <div className="border border-line rounded-sm p-3 text-center">
          <p className="font-display text-2xl">{responseRate}%</p>
          <p className="text-xs font-mono text-taupe uppercase mt-1">Response rate</p>
        </div>
        <div className="border border-line rounded-sm p-3 text-center">
          <p className="font-display text-2xl">{totalContacts}</p>
          <p className="text-xs font-mono text-taupe uppercase mt-1">Contacted</p>
        </div>
      </div>

      {timelineData.length > 1 && (
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-taupe mb-2">
            Replies over time
          </p>
          <div className="border border-line rounded-sm p-3" style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#8B8578" }}
                  axisLine={{ stroke: "#DEDACD" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#8B8578" }}
                  axisLine={false}
                  tickLine={false}
                  width={24}
                />
                <Tooltip
                  contentStyle={{
                    background: "#FAF8F3",
                    border: "1px solid #DEDACD",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="#3D5A80" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tagData.some((t) => t.name !== "Untagged") && (
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-taupe mb-2">
            Tag breakdown
          </p>
          <div className="flex items-center gap-4">
            <div style={{ width: 100, height: 100 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={tagData} dataKey="value" innerRadius={25} outerRadius={45}>
                    {tagData.map((entry, i) => (
                      <Cell key={i} fill={TAG_COLORS[entry.name] || "#8B8578"} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-1">
              {tagData.map((t) => (
                <li key={t.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: TAG_COLORS[t.name] || "#8B8578" }}
                  />
                  <span className="text-taupe">{t.name}</span>
                  <span className="font-mono">{t.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
