window.area_1_total_area_wide_option = {
    chart: {
        type: "column",
        marginRight: 300,
        height: 600,
    },
    title: {
        text: "Landuse Areas",
        align: "left",
    },
    legend: {
        align: "right",
        verticalAlign: "middle",
        layout: "vertical",
        x: 50,
    },
    tooltip: {
        pointFormat: "{point.y:.2f}",
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