export interface IResourceFields {
    title: string,
    dataIndex: string,
    type: string,
    required: boolean
}

export interface IFormFields {
    [key: string]: IResourceFields[]
}

const formFields: IFormFields = {
    standards : [
        {
            title: 'ESG Pillar',
            dataIndex: 'esg_pillar',
            type: 'text',
            required: false
        },
        {
            title: 'Reporting Standard',
            dataIndex: 'reporting_standard',
            type: 'text',
            required: false
        },
        {
            title: 'Metric Name',
            dataIndex: 'metric_name',
            type: 'text',
            required: false
        },
        {
            title: 'Metric Subtype',
            dataIndex: 'metric_subtype',
            type: 'text',
            required: false
        },
        {
            title: 'Metric Code',
            dataIndex: 'metric_code',
            type: 'text',
            required: false
        },
        {
            title: 'Measurement Units',
            dataIndex: 'measurement_units',
            type: 'text',
            required: false
        },
        {
            title: 'Description',
            dataIndex: 'description',
            type: 'textarea',
            required: false
        },
        {
            title: 'Formula',
            dataIndex: 'formula',
            type: 'text',
            required: false
        },
        {
            title: 'Calculation',
            dataIndex: 'calculation',
            type: 'text',
            required: false
        },
        {
            title: 'Calculation Description',
            dataIndex: 'calculation_description',
            type: 'textarea',
            required: true
        },
        {
            title: 'Additional Description',
            dataIndex: 'additional_description',
            type: 'textarea',
            required: false
        },
    ]
}

export default formFields