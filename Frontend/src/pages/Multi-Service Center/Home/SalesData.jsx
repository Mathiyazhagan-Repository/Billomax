
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ChartNoAxesColumn, TrendingUp } from "lucide-react";

const last30DaysData = [
  { date: "20 Sep 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "21 Sep 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "22 Sep 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "23 Sep 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "24 Sep 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "25 Sep 2024", pharmacy: 0, soojanya: 0, allLocations: 25 },
  { date: "26 Sep 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "27 Sep 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "28 Sep 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "29 Sep 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "30 Sep 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "01 Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "02 Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 15 },
  { date: "03 Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "04 Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "05 Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "06 Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "07 Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "08 Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "09 Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "10 Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "11 Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "12 Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "13 Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "14 Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "15 Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "16 Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "17 Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { date: "18 Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
];

const financialYearData = [
  { month: "Apr 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { month: "May 2024", pharmacy: 0, soojanya: 0, allLocations: 350 },
  { month: "Jun 2024", pharmacy: 0, soojanya: 0, allLocations: 110 },
  { month: "Jul 2024", pharmacy: 0, soojanya: 0, allLocations: 315 },
  { month: "Aug 2024", pharmacy: 0, soojanya: 0, allLocations: 910 },
  { month: "Sep 2024", pharmacy: 0, soojanya: 0, allLocations: 400 },
  { month: "Oct 2024", pharmacy: 0, soojanya: 0, allLocations: 365 },
  { month: "Nov 2024", pharmacy: 0, soojanya: 0, allLocations: 140 },
  { month: "Dec 2024", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { month: "Jan 2025", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { month: "Feb 2025", pharmacy: 0, soojanya: 0, allLocations: 0 },
  { month: "Mar 2025", pharmacy: 0, soojanya: 0, allLocations: 0 },
];

const chartColors = {
  pharmacy: "#1680FF",
  soojanya: "#17375E",
  allLocations: "#FF790B",
};

const legendNames = {
  pharmacy: "Pharmacy (BL0041)",
  soojanya: "Soojanya H V (bannerwerty0001)",
  allLocations: "All Locations",
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-[#E6EAF1] bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 text-sm font-bold text-[#183253]">{label}</p>
      {payload.map((item, index) => (
        <div
          key={`${item.dataKey}-${index}`}
          className="flex items-center justify-between gap-5 py-1 text-xs"
        >
          <span style={{ color: item.color }}>
            {legendNames[item.dataKey]}
          </span>
          <span className="font-bold text-[#173253]">
            {Number(item.value).toLocaleString("en-IN")} K
          </span>
        </div>
      ))}
    </div>
  );
}

function ChartLegend({ payload }) {
  if (!payload) return null;

  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 px-2 pb-2 pt-1 sm:gap-x-6">
      {payload.map((item, index) => (
        <div key={`${item.dataKey}-${index}`} className="flex items-center gap-2">
          <span
            className="h-[3px] w-6 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-[11px] font-medium text-[#183253] sm:text-xs">
            {legendNames[item.dataKey]}
          </span>
        </div>
      ))}
    </div>
  );
}

function SalesChartCard({
  title,
  highlight,
  icon: Icon,
  theme,
  data,
  dataKey,
  yMax,
  yTicks,
  showArea = false,
}) {
  const isOrange = theme === "orange";
  const gradientId = `sales-area-${dataKey}`;

  return (
    <section
      className={`min-w-0 overflow-hidden rounded-2xl border p-3 shadow-[0_6px_18px_rgba(30,50,80,0.04)] ${
        isOrange
          ? "border-[#FF9A55]/70 bg-gradient-to-br from-[#FFFAF5] to-white"
          : "border-[#71B1FF]/70 bg-gradient-to-br from-[#F5F9FF] to-white"
      }`}
    >
      {/* Card heading */}
      <div className="mb-3 flex items-center gap-3 px-1 py-1">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isOrange ? "bg-[#FFEBDD]" : "bg-[#E5F0FF]"
          }`}
        >
          <Icon
            size={22}
            strokeWidth={2.5}
            className={isOrange ? "text-[#F77712]" : "text-[#1680FF]"}
          />
        </div>

        <h2 className="app-section-title text-[#112D53]">
          {title}{" "}
          <span className={isOrange ? "text-[#F56B12]" : "text-[#1680FF]"}>
            {highlight}
          </span>
        </h2>
      </div>

      {/* Chart container */}
      <div className="h-[300px] overflow-hidden rounded-xl border border-[#EAECEF]/80 bg-white/75 px-1 pb-2 pt-3 shadow-[0_2px_8px_rgba(20,40,70,0.025)] sm:h-[340px] sm:px-2 sm:pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 8,
              right: 12,
              left: 5,
              bottom: 12,
            }}
          >
            <defs>
              <linearGradient
                id={gradientId}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={chartColors.allLocations}
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor={chartColors.allLocations}
                  stopOpacity={0.015}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#E9EDF2"
              strokeDasharray="5 4"
              vertical={false}
            />

            <XAxis
              dataKey={dataKey}
              tick={{
                fill: "#647E9E",
                fontSize: 9,
              }}
              angle={-42}
              textAnchor="end"
              height={70}
              tickMargin={6}
              axisLine={{ stroke: "#D9E0E8" }}
              tickLine={false}
              interval={isOrange ? 1 : 0}
            />

            <YAxis
              domain={[0, yMax]}
              ticks={yTicks}
              tick={{
                fill: "#7187A3",
                fontSize: 10,
              }}
              tickLine={false}
              axisLine={{ stroke: "#D9E0E8" }}
              width={38}
              label={{
                value: "Total Sales (K)",
                angle: -90,
                position: "insideLeft",
                fill: "#637E9F",
                fontSize: 10,
                offset: 0,
              }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#D9E1ED", strokeDasharray: "4 4" }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              content={<ChartLegend />}
              wrapperStyle={{
                paddingBottom: 8,
              }}
            />

            {showArea && (
              <Area
                type="linear"
                dataKey="allLocations"
                stroke="none"
                fill={`url(#${gradientId})`}
                legendType="none"
                tooltipType="none"
                isAnimationActive={false}
              />
            )}

            <Line
              type="linear"
              dataKey="pharmacy"
              name={legendNames.pharmacy}
              stroke={chartColors.pharmacy}
              strokeWidth={2}
              dot={{
                r: 3.5,
                fill: chartColors.pharmacy,
                strokeWidth: 0,
              }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />

            <Line
              type="linear"
              dataKey="soojanya"
              name={legendNames.soojanya}
              stroke={chartColors.soojanya}
              strokeWidth={2}
              dot={{
                r: 3.5,
                fill: chartColors.soojanya,
                strokeWidth: 0,
              }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />

            <Line
              type="linear"
              dataKey="allLocations"
              name={legendNames.allLocations}
              stroke={chartColors.allLocations}
              strokeWidth={2}
              dot={{
                r: 4,
                fill: chartColors.allLocations,
                strokeWidth: 0,
              }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default function SalseData() {
  return (
    <section
      aria-label="Sales trends"
      className="bg-[#FFFAF5] px-4 py-4 font-sans sm:px-5"
    >
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <SalesChartCard
          title="Sales"
          highlight="Last 30 Days"
          icon={ChartNoAxesColumn}
          theme="orange"
          data={last30DaysData}
          dataKey="date"
          yMax={30}
          yTicks={[0, 5, 10, 15, 20, 25, 30]}
        />

        <SalesChartCard
          title="Sales"
          highlight="Current Financial Year"
          icon={TrendingUp}
          theme="blue"
          data={financialYearData}
          dataKey="month"
          yMax={1000}
          yTicks={[0, 200, 400, 600, 800, 1000]}
          showArea
        />
      </div>
    </section>
  );
}
