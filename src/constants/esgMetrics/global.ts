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
        "basin": "basin",
        "date": "date",
        "num_1": "num_employee_incidents",
        "num_2": "num_employee_fatalities",
        "num_3": "num_employee_lost_time_incidents",
        "denominator": "employee_hours",
        "narrative": "comments",
        "organization": "organization",
        "risk": "risk",
        "source": "source",
        "state": "state",
        "timeframe": "timeframe"
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