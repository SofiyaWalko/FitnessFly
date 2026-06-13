import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import styles from "./progressstats.module.css";

export default function ProgressChart({ data, metric }) {
	const chartData = data.map((item) => ({
		date: item.date,
		value: item[metric],
	}));

	const values = chartData.map((d) => d.value);

	const minValue = Math.min(...values);
	const maxValue = Math.max(...values);

	const padding = (maxValue - minValue) * 0.2 || 2;

	const yMin = Math.floor(minValue - padding);
	const yMax = Math.ceil(maxValue + padding);

	const formatDate = (date) => {
	const d = new Date(date);

	return new Intl.DateTimeFormat("ru-RU", {
		day: "numeric",
		month: "short",
	}).format(d);
};

	const CustomTooltip = ({ active, payload, label }) => {
		if (!active || !payload || !payload.length) return null;

		const date = new Date(label);

		const formattedDate = new Intl.DateTimeFormat("ru-RU", {
			day: "numeric",
			month: "short",
		}).format(date);

		return (
			<div
				style={{
					background: "#fff",
					border: "1px solid #ddd",
					padding: "10px 14px",
					borderRadius: "8px",
				}}
			>
				<div style={{ marginBottom: 6 }}>{formattedDate}</div>

				<div style={{ color: "#4F7DF3", fontWeight: 500 }}>
					значение: {payload[0].value}
				</div>
			</div>
		);
	};

	return (
		<div className={styles.chart}>
			<ResponsiveContainer width="100%" height={300}>
				<AreaChart data={chartData}>
					<XAxis
						dataKey="date"
						tickFormatter={formatDate}
						axisLine={false}
						tickLine={false}
						tick={{
							fill: "#1C2D52",
							fontSize: 16,
							fontWeight: 500,
						}}
						tickMargin={10}
					/>

					<YAxis
						domain={[yMin, yMax]}
						tickCount={5}
						axisLine={false}
						tickLine={false}
						tick={{
							fill: "#1C2D52",
							fontSize: 16,
							fontWeight: 500,
						}}
						tickFormatter={(v) =>
							`${v}${metric === "weight" ? " кг" : " см"}`
						}
						tickMargin={10}
					/>

					<Tooltip content={<CustomTooltip />} />

					<defs>
						<linearGradient
							id="colorValue"
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop
								offset="5%"
								stopColor="#4F7DF3"
								stopOpacity={0.25}
							/>
							<stop
								offset="95%"
								stopColor="#4F7DF3"
								stopOpacity={0}
							/>
						</linearGradient>
					</defs>

					<Area
						type="monotone"
						dataKey="value"
						stroke="#4F7DF3"
						strokeWidth={3}
						fill="url(#colorValue)"
						dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
						activeDot={{ r: 6 }}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}
