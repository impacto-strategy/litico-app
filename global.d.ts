/* 
    Resuable interfaces go here.
*/

export type ArrOfObj = {
    [key: string]: any
}[]

export type ESGMetricFactor = {
    "col_label": string,
    "created_at": string | null,
    "factor_form_options": FactorFormOptions,
    "field_type": string | null,
    "id": number,
    "measurement_units": string[],
    "name": string,
    "pivot": {
        "standard_id": number,
        "esg_metric_factor_id": number
    }
    "type": string,
    "updated_at": string | null
}

export type ESGMetricFactors = ESGMetricFactor[]

export type FactorFormOption = {
    "created_at": string | null,
    "id": number,
    "option": string,
    "pivot": {
        "esg_metric_factor_id": number,
        "factor_form_option_id": number
    },
    "updated_at": string | null
}

export type FactorFormOptions = FactorFormOption[] | []

export type Standard = {
    "additional description": string | null,
    "calculation": string | null,
    "calculation_description": string,
    "created_at": string | null,
    "description": string | null,
    "esg_metric_factors": ESGMetricFactors,
    "esg_pillar": string | null,
    "formula": string | null,
    "id": number,
    "is_active": number,
    "location_type": string,
    "measurement_units": string | null,
    "metric_code": string,
    "metric_name": string,
    "metric_subtype": string,
    "reporting_standard": string,
    "resources": any, // I would be careful as this one can be a multitude of things.
    "updated_at": string
}

export type Standards = Standard[]