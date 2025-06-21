
const { mounted, beforeUnmount, props } = Vue;


window.Highchart = {
    props: {
        chartOptions: {
            type: Object,
            required: true
        },
        chartData: {
            type: Object,
            required: true
        }
    },
    mounted() {
        this.chart = Highcharts.chart(this.$el, {
            ...this.chartOptions,
            series: this.chartData
        });
    },
    beforeUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    },
    template: `<div style="height: 600px; margin-left: 300px;"></div>`
};
