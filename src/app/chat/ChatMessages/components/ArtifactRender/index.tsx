"use client";

import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { Typography } from "@mui/material";
import type { TableData, ChartData, ArtifactRendererProps } from "@/app/utils/types/chat";

// ✅ Extended chart data type to handle backend variations
type ExtendedChartData = ChartData & {
  supply?: number[];
  demand?: number[];
  regions?: Array<{ name: string; price: number; change_pct?: number }>;
  y_label?: string;
};

export default function ChatArtifactRenderer({
  artifactType,
  artifactData,
  text,
}: ArtifactRendererProps) {
  if (artifactType === "chart")
    return <ChartRenderer data={artifactData as ExtendedChartData} />;
  if (artifactType === "table")
    return <TableRenderer data={artifactData as TableData} />;
  if (artifactType === "text")
    return (
      <p className="max-w-[80%] whitespace-pre-wrap text-sm text-gray-900">
        {text}
      </p>
    );
  return null;
}

function getYAxisLabel(title?: string): string {
  if (!title) return "Value";
  const lower = title.toLowerCase();
  if (lower.includes("price")) {
    return "Price (KSh per 90kg bag)";
  }
  if (lower.includes("volume") || lower.includes("export")) {
    return "Volume (million 60-kg bags)";
  }
  if (lower.includes("supply") || lower.includes("demand")) {
    return "Metric Tons";
  }
  return "Value";
}

function ChartRenderer({ data }: { data: ExtendedChartData }) {
  // ✅ Handle supply/demand chart structure
  if (data?.supply && data?.demand && data?.x) {
    return (
      <div className="rounded-1xl shadow-lg max-w-180 w-full overflow-hidden bg-white border border-gray-100">
        {data.title && (
          <Typography
            variant="subtitle1"
            align="center"
            className="text-gray-900 mb-3 font-semibold px-4 pt-4"
            sx={{ fontSize: '0.95rem' }}
          >
            {data.title}
          </Typography>
        )}
        <div className="px-4 pb-4">
          <div className="w-full" style={{ minHeight: '280px' }}>
            <BarChart
              xAxis={[
                {
                  data: data.x.map((label: string | number) => String(label)),
                  scaleType: "band",
                  label: "Period",
                },
              ]}
              yAxis={[{ label: getYAxisLabel(data.title) }]}
              series={[
                {
                  data: data.supply,
                  color: "#60a5fa",
                  label: "Supply",
                },
                {
                  data: data.demand,
                  color: "#f472b6",
                  label: "Demand",
                },
              ]}
              height={280}
              margin={{ top: 10, bottom: 50, left: 20, right: 20 }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ✅ Handle regions chart structure
  if (data?.regions && Array.isArray(data.regions)) {
    const xValues: string[] = data.regions.map((r: { name: string; price: number; change_pct?: number }) => r.name);
    const yValues: number[] = data.regions.map((r: { name: string; price: number; change_pct?: number }) => r.price);
    
    return (
      <div className="rounded-1xl shadow-lg max-w-180 w-full overflow-hidden bg-white border border-gray-100">
        {data.title && (
          <Typography
            variant="subtitle1"
            align="center"
            className="text-gray-900 mb-3 font-semibold px-4 pt-4"
            sx={{ fontSize: '0.95rem' }}
          >
            {data.title}
          </Typography>
        )}
        <div className="px-4 pb-4">
          <div className="w-full" style={{ minHeight: '280px' }}>
            <BarChart
              xAxis={[
                {
                  data: xValues,
                  scaleType: "band",
                  label: "Region",
                },
              ]}
              yAxis={[{ label: "Price (KSh per 90kg bag)" }]}
              series={[
                {
                  data: yValues,
                  color: "#60a5fa",
                  label: "Price",
                },
              ]}
              height={280}
              margin={{ top: 10, bottom: 50, left: 70, right: 20 }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ✅ Handle standard x/y chart structure
  if (!data?.x || !data?.y || !Array.isArray(data.x) || !Array.isArray(data.y) || data.x.length === 0 || data.y.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-200 shadow">
        <p className="text-sm text-red-600 font-medium">Invalid chart data</p>
        <pre className="text-[0.65rem] overflow-x-auto mt-2 text-gray-500">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }

  const minLength: number = Math.min(data.x.length, data.y.length);
  const xValues: (string | number)[] = data.x.slice(0, minLength);
  const yValues: number[] = data.y.slice(0, minLength);

  const chartType = data.chart_type || "line";
  const yAxisLabel = getYAxisLabel(data.title);
  const xAxisLabel = xValues.some((x: string | number) => String(x).includes("20")) ? "Year" : "Period";

  return (
    <div className="rounded-1xl shadow-lg max-w-180 w-full overflow-hidden bg-white border border-gray-100">
      {data.title && (
        <Typography
          variant="subtitle1"
          align="center"
          className="text-gray-900 mb-3 font-semibold px-4 pt-4"
          sx={{ fontSize: '0.95rem' }}
        >
          {data.title}
        </Typography>
      )}

      <div className="px-4 pb-4">
        <div className="w-full" style={{ minHeight: '280px' }}>
          {chartType === "bar" && (
            <BarChart
              xAxis={[
                {
                  data: xValues.map((label: string | number) => String(label)),
                  scaleType: "band",
                  label: xAxisLabel,
                },
              ]}
              yAxis={[{ label: yAxisLabel }]}
              series={[
                {
                  data: yValues,
                  color: "#60a5fa",
                },
              ]}
              height={280}
              margin={{ top: 10, bottom: 50, left: 70, right: 20 }}
            />
          )}

          {chartType === "line" && (
            <LineChart
              xAxis={[
                {
                  data: xValues.map((label: string | number) => String(label)),
                  scaleType: "band",
                  label: xAxisLabel,
                },
              ]}
              yAxis={[{ label: yAxisLabel }]}
              series={[
                {
                  data: yValues,
                  color: "#3b82f6",
                  curve: "linear",
                },
              ]}
              height={280}
              margin={{ top: 10, bottom: 50, left: 70, right: 20 }}
            />
          )}

          {chartType === "pie" && (
            <PieChart
              series={[
                {
                  data: xValues.map((label: string | number, index: number) => ({
                    id: index,
                    value: yValues[index] ?? 0,
                    label: String(label),
                    color: ["#60a5fa", "#f472b6", "#a78bfa", "#34d399", "#fbbf24"][index % 5],
                  })),
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 2,
                  cornerRadius: 4,
                },
              ]}
              height={280}
              margin={{ top: 10, bottom: 10, left: 20, right: 20 }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TableRenderer({ data }: { data: TableData }) {
  // ✅ Handle x/y format
  if (data?.x && data?.y && Array.isArray(data.x) && Array.isArray(data.y)) {
    const minLength: number = Math.min(data.x.length, data.y.length);
    return (
      <div className="rounded-2xl shadow-lg p-4 max-w-full w-full overflow-x-auto bg-white border border-gray-100">
        {data.title && (
          <p className="mb-3 text-blue-600 font-semibold text-sm">{data.title}</p>
        )}
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border-b border-gray-200 font-bold p-2 text-gray-700">Label</th>
              <th className="border-b border-gray-200 font-bold p-2 text-gray-700">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.x.slice(0, minLength).map((label: string | number, index: number) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border-b border-gray-100 p-2 text-gray-600">{String(label)}</td>
                <td className="border-b border-gray-100 p-2 text-gray-900 font-medium">{data.y?.[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ✅ Handle columns/rows format
  if (!data?.columns || !data?.rows || data.columns.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
        <p className="text-sm text-yellow-700">No table data available</p>
      </div>
    );
  }

  return (
    <div className="shadow-lg p-4 max-w-full w-full overflow-x-auto bg-white border border-gray-100 rounded-2xl">
      {data.title && (
        <p className="mb-3 text-blue-600 font-semibold text-sm">{data.title}</p>
      )}
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-800">
          <tr>
            {data.columns.map((col: string, index: number) => (
              <th key={index} className="border-b border-gray-600 font-bold p-2 text-white">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row: (string | number)[], rowIndex: number) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {row.map((cell: string | number, cellIndex: number) => (
                <td key={cellIndex} className="border-b border-gray-100 p-2 text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}