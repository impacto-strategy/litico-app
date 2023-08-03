import {ChartOptions} from "chart.js";
import {DotMapConfig} from "@ant-design/maps";

export const INSPECTIONS_CONFIG: ChartOptions<any> = {
    responsive: true,

    plugins: {
        legend: {
            position: 'bottom',
        }
    },

    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                precision: 0
            },
            title: {
                text: "# of Monthly Inspections",
                display: true
            }
        },
        x: {
            title: {
                text: "Year - Month",
                display: true
            }
        }
    }
}

export const PERMIT_SURVEILLANCE_CONFIG = (data: any, hexColors: any): DotMapConfig => ({
    map: {
        type: 'mapbox',
        // style: "dark",
        token: 'pk.eyJ1Ijoic2toYW5uYTEwMDA1IiwiYSI6ImNsaDZjbzBxcDA0cTYza21wejhpZjl6MWMifQ.5sxEGc0Rgl8mwGJDuFpIvg',
        pitch: 0,
        center: [-104.991531, 39.742043],
        zoom: 8.2,
    },
    source: {
        data,
        parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
        },
    },
    tooltip: {
        items: ['permit_type', 'operator_name', 'county', 'approvalTime'],

        customItems: (data) => {
            console.log({data})
            return [
                {
                    name: 'Operator',
                    value: data.operator_name
                },
                {
                    name: 'Permit Type',
                    value: data.permit_type
                },
                {
                    name: 'Approval Time',
                    value: data.approvalTime < 90 ? data.approvalTime + ' Business Days' : (data.approvalTime > 900 ? Math.ceil(data.approvalTime / 365) + ' Years' : Math.ceil(data.approvalTime / 30) + ' Months')
                }
            ]
        }
    },
    label: {
        visible: false,
        field: 'operator_name',
        style: {
            fill: '#fff',
            opacity: 0.6,
            fontSize: 12,
            textAnchor: 'top',
            textOffset: [0, 20],
            spacing: 1,
            padding: [5, 5],
            stroke: '#ffffff',
            strokeWidth: 0.3,
            strokeOpacity: 1.0,
        },
    },

    legend: {
        position: 'bottomleft',
    },
    color: {
        field: 'operator_name',
        value: [
            ...hexColors
        ].reverse()
    },
    autoFit: true,
    zoom: {
        position: 'bottomright',
    },
    size: {
        field: 'approvalTime',
        value: [10, 30]
    },
    style: {
        opacity: 0.3,
        strokeWidth: 0,
    },
    state: {
        active: {
            color: '#FFF684',
        },
    },
})

