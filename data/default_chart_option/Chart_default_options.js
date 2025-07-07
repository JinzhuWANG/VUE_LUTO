window.Chart_default_options = {
    chart: {
        type: "column",
        marginRight: 300,
        height: 600,
    },
    title: {
        text: "Landuse Areas",
        align: "left",
    },
    yAxis: {
        title: {
            text: "Area (million km2)",
        },
    },
    legend: {
        itemStyle: {
            fontSize: "10.5px",
        },
        align: "right",
        layout: "vertical",
        x: -10,
        verticalAlign: "middle",
        itemMarginTop: 0,
        itemMarginBottom: 0.75,
        width: 220,
    },
    tooltip: {
        formatter: function () {
            return `<b>Year:</b> ${this.x}<br><b>${this.series.name
                }:</b>${this.y.toFixed(2)}<br/>`;
        },
    },
    plotOptions: {
        column: {
            stacking: "normal",
        },
    },
    credits: {
        enabled: false,
    },
    exporting: {
        enabled: false,
    },
};