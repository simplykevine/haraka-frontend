"use client";

import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { Typography } from "@mui/material";
import type { TableData, ChartData, ArtifactRendererProps } from "@/app/utils/types/chat";

type ExtendedChartData = ChartData & {
  supply?: number[];
  demand?: number[];
  regions?: Array<{ name: string; price: number; change_pct?: number }>;
  y_label?: string;
  dual_forecast?: {
    unit_price?: { forecast: number; intervals: { lower: number[]; upper: number[]; mean: number[] } };
    total_revenue?: { forecast: number; intervals: { lower: number[]; upper: number[]; mean: number[] } };
    volume_kg?: number;
  };
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
    return "Price (KSh per kg)";
  }
  if (lower.includes("volume") || lower.includes("export")) {
    return "Volume (kg)";
  }
  if (lower.includes("revenue")) {
    return "Revenue (KSh)";
  }
  if (lower.includes("supply") || lower.includes("demand")) {
    return "Metric Tons";
  }
  return "Value";
}

function ChartRenderer({ data }: { data: ExtendedChartData }) {
  if (data?.dual_forecast) {
    return (
      <div className="space-y-4 w-full">
        {data.dual_forecast.unit_price && (
          <div className="rounded-lg shadow-lg max-w-full w-full overflow-hidden bg-white border border-gray-100">
            <Typography
              variant="subtitle1"
              align="center"
              className="text-gray-900 mb-2 font-semibold px-4 pt-4"
              sx={{ fontSize: '0.9rem' }}
            >
              Unit Price Forecast
            </Typography>
            <div className="px-4 pb-4">
              <div className="w-full" style={{ minHeight: '240px' }}>
                <BarChart
                  xAxis={[
                    {
                      data: ["Forecast"],
                      scaleType: "band",
                    },
                  ]}
                  yAxis={[{ label: "Price (KSh/kg)" }]}
                  series={[
                    {
                      data: [data.dual_forecast.unit_price.forecast],
                      color: "#60a5fa",
                    },
                  ]}
                  height={240}
                  margin={{ top: 10, bottom: 30, left: 60, right: 20 }}
                />
              </div>
            </div>
          </div>
        )}
        {data.dual_forecast.total_revenue && (
          <div className="rounded-lg shadow-lg max-w-full w-full overflow-hidden bg-white border border-gray-100">
            <Typography
              variant="subtitle1"
              align="center"
              className="text-gray-900 mb-2 font-semibold px-4 pt-4"
              sx={{ fontSize: '0.9rem' }}
            >
              Revenue Forecast
            </Typography>
            <div className="px-4 pb-4">
              <div className="w-full" style={{ minHeight: '240px' }}>
                <BarChart
                  xAxis={[
                    {
                      data: ["Forecast"],
                      scaleType: "band",
                    },
                  ]}
                  yAxis={[{ label: "Revenue (KSh)" }]}
                  series={[
                    {
                      data: [data.dual_forecast.total_revenue.forecast],
                      color: "#f472b6",
                    },
                  ]}
                  height={240}
                  margin={{ top: 10, bottom: 30, left: 60, right: 20 }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (data?.supply && data?.demand && data?.x) {
    return (
      <div className="rounded-lg shadow-lg max-w-full w-full overflow-hidden bg-white border border-gray-100">
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
          <div className="w-full" style={{ minHeight: '300px' }}>
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
              height={300}
              margin={{ top: 10, bottom: 50, left: 60, right: 20 }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (data?.regions && Array.isArray(data.regions)) {
    const xValues: string[] = data.regions.map((r: { name: string; price: number; change_pct?: number }) => r.name);
    const yValues: number[] = data.regions.map((r: { name: string; price: number; change_pct?: number }) => r.price);
    
    return (
      <div className="rounded-lg shadow-lg max-w-full w-full overflow-hidden bg-white border border-gray-100">
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
          <div className="w-full" style={{ minHeight: '300px' }}>
            <BarChart
              xAxis={[
                {
                  data: xValues,
                  scaleType: "band",
                  label: "Region",
                },
              ]}
              yAxis={[{ label: "Price (KSh per bag)" }]}
              series={[
                {
                  data: yValues,
                  color: "#60a5fa",
                  label: "Price",
                },
              ]}
              height={300}
              margin={{ top: 10, bottom: 50, left: 70, right: 20 }}
            />
          </div>
        </div>
      </div>
    );
  }

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
    <div className="rounded-lg shadow-lg max-w-full w-full overflow-hidden bg-white border border-gray-100">
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
        <div className="w-full" style={{ minHeight: '300px' }}>
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
              height={300}
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
              height={300}
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
              height={300}
              margin={{ top: 10, bottom: 10, left: 20, right: 20 }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TableRenderer({ data }: { data: TableData }) {
  if (data?.x && data?.y && Array.isArray(data.x) && Array.isArray(data.y)) {
    const minLength: number = Math.min(data.x.length, data.y.length);
    return (
      <div className="rounded-lg shadow-lg p-4 max-w-full w-full overflow-x-auto bg-white border border-gray-100">
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
  if (!data?.columns || !data?.rows || data.columns.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
        <p className="text-sm text-yellow-700">No table data available</p>
      </div>
    );
  }

  return (
    <div className="shadow-lg p-4 max-w-full w-full overflow-x-auto bg-white border border-gray-100 rounded-lg">
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