/*
    Any configurations for any code pertaining to ESG Metric Reports and Inputs should go here.
*/

/**
 * Mainly utilized for the Edit ESG metric data form so that existing ESG Metric data can be mapped to the proper dynamic field.
 */
export const ESG_FIELD_MAPPING_CONFIG: any = {
    "Community Grievances": {
    },
    "Employee Matching": {
    },
    "Employee Volunteering Match": {
    },
    "GHG Emissions": {
    },
    "Production - Oil, Gas, Produced Water, Synthetic Oil, Synthetic Gas": {
    },
    "TRIR - Employees": {
    },
    "Social Investment": {
        "date": "date",
        "narrative": "comments",
        "organization": "organization",
        "selection_json": "categories",
        "state": "state",
        "tax_id": "tax_id",
        "type_a": "employee_office",
        "value": "amount"
    },
    "Workforce Demographics - Ethnicity": {
    },
    "Workforce Demographics - Gender": {
    }
}