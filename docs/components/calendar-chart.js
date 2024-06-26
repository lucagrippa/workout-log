import * as Plot from "npm:@observablehq/plot";

export class MonthLine extends Plot.Mark {
    static defaults = { stroke: "currentColor", strokeWidth: 1 };
    constructor(data, options = {}) {
        const { x, y } = options;
        super(data, { x: { value: x, scale: "x" }, y: { value: y, scale: "y" } }, options, MonthLine.defaults);
    }
    render(index, { x, y }, { x: X, y: Y }, dimensions) {
        const { marginTop, marginBottom, height } = dimensions;
        const dx = x.bandwidth(), dy = y.bandwidth();
        return htl.svg`<path fill=none stroke=${this.stroke} stroke-width=${this.strokeWidth} d=${Array.from(index, (i) => `${Y[i] > marginTop + dy * 1.5 // is the first day a Monday?
            ? `M${X[i] + dx},${marginTop}V${Y[i]}h${-dx}`
            : `M${X[i]},${marginTop}`}V${height - marginBottom}`)
            .join("")
            }>`;
    }
}

export function calendar({
    date = Plot.identity,
    inset = 0.5,
    ...options
} = {}) {
    let D;
    return {
        fy: { transform: (data) => (D = Plot.valueof(data, date, Array)).map((d) => d.getUTCFullYear()) },
        x: { transform: () => D.map((d) => d3.utcWeek.count(d3.utcYear(d), d)) },
        y: { transform: () => D.map((d) => d.getUTCDay()) },
        inset,
        ...options
    };
}

export function calendarChart(dji) {
    const start = d3.utcDay.offset(d3.min(dji, (d) => d.Date)); // exclusive
    const end = d3.utcDay.offset(d3.max(dji, (d) => d.Date)); // exclusive
    return Plot.plot({
        width: 1152,
        height: d3.utcYear.count(start, end) * 160,
        axis: null,
        padding: 0,
        x: {
            domain: d3.range(53) // or 54, if showing weekends
        },
        y: {
            axis: "left",
            domain: [-1, 1, 2, 3, 4, 5], // hide 0 and 6 (weekends); use -1 for labels
            ticks: [1, 2, 3, 4, 5], // don’t draw a tick for -1
            tickSize: 0,
            tickFormat: Plot.formatWeekday()
        },
        fy: {
            padding: 0.1,
            reverse: true
        },
        color: {
            scheme: "piyg",
            domain: [-6, 6],
            legend: true,
            percent: true,
            ticks: 6,
            tickFormat: "+d",
            label: "Daily change (%)"
        },
        marks: [
            // Draw year labels, rounding down to draw a year even if the data doesn’t
            // start on January 1. Use y = -1 (i.e., above Sunday) to align the year
            // labels vertically with the month labels, and shift them left to align
            // them horizontally with the weekday labels.
            Plot.text(
                d3.utcYears(d3.utcYear(start), end),
                calendar({ text: d3.utcFormat("%Y"), frameAnchor: "right", x: 0, y: -1, dx: -20 })
            ),

            // Draw month labels at the start of each month, rounding down to draw a
            // month even if the data doesn’t start on the first of the month. As
            // above, use y = -1 to place the month labels above the cells. (If you
            // want to show weekends, round up to Sunday instead of Monday.)
            Plot.text(
                d3.utcMonths(d3.utcMonth(start), end).map(d3.utcMonday.ceil),
                calendar({ text: d3.utcFormat("%b"), frameAnchor: "left", y: -1 })
            ),

            // Draw a cell for each day in our dataset. The color of the cell encodes
            // the relative daily change. (The first value is not defined because by
            // definition we don’t have the previous day’s close.)
            Plot.cell(
                dji.slice(1),
                calendar({ date: "Date", fill: d3.pairs(Plot.valueof(dji, "Close"), (a, b) => (b - a) / a) })
            ),

            // Draw a line delineating adjacent months. Since the y-domain above is
            // set to hide weekends (day number 0 = Sunday and 6 = Saturday), if the
            // first day of the month is a weekend, round up to the first monday.
            new MonthLine(
                d3.utcMonths(d3.utcMonth(start), end)
                    .map((d) => d3.utcDay.offset(d, d.getUTCDay() === 0 ? 1
                        : d.getUTCDay() === 6 ? 2
                            : 0)),
                calendar({ stroke: "white", strokeWidth: 3 })
            ),

            // Lastly, draw the date for all days spanning the dataset, including
            // days for which there is no data.
            Plot.text(
                d3.utcDays(start, end),
                calendar({ text: d3.utcFormat("%-d") })
            )
        ]
    });
}