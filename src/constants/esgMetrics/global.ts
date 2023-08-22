/*
    Any configurations for any code pertaining to ESG Metric Reports and Inputs should go here.
*/

/**
 * Mainly utilized for the Edit ESG metric data form so that existing ESG Metric data can be mapped to the proper dynamic field.
 */
export const ESG_FIELD_MAPPING_CONFIG: any = {
    "Community Grievances": {
        "address": "address",
        "basin": "basin",
        "city": "county",
        "contact_name": "name",
        "date": "date",
        "description": "call_reason",
        "email": "email",
        "narrative": "resolution",
        "organization": "organization",
        "phone_num": "phone_num",
        "risk": "risk",
        "source": "source",
        "state": "state",
        "timeframe": "timeframe",
        "type_a": "resolution_date_time",
        "type_b": "report_date"
    },
    "Employee Matching": {
        "date": "date",
        "employee_id": "employee_id",
        "narrative": "comments",
        "organization": "organization",
        "selection_json": "categories",
        "state": "state",
        "tax_id": "tax_id",
        "type_a": "employee_office",
        "value": "amount"
    },
    "Employee Volunteering Match": {
        "date": "date",
        "employee_id": "employee_id",
        "narrative": "comments",
        "organization": "organization",
        "selection_json": "categories",
        "state": "state",
        "tax_id": "tax_id",
        "type_a": "employee_office",
        "value": "hours"
    },
    "GHG Emissions": {
        "basin": "basin",
        "date": "date",
        "narrative": "comments",
        "num_1": "co2_emissions",
        "num_2": "ch4_emissions",
        "num_3": "n20_emissions",
        "organization": "organization",
        "risk": "risk",
        "source": "source",
        "state": "state",
        "timeframe": "timeframe"
    },
    "Production - Oil, Gas, Produced Water, Synthetic Oil, Synthetic Gas": {
        "basin": "basin",
        "date": "date",
        "num_1": "oil_production",
        "num_2": "gas_production",
        "num_3": "water_production",
        "num_4": "synthetic_oil_production",
        "num_5": "synthetic_gas_production",
        "narrative": "comments",
        "organization": "organization",
        "risk": "risk",
        "source": "source",
        "state": "state",
        "timeframe": "timeframe"
    },
    "TRIR - All Workers": {
        "basin": "basin",
        "date": "date",
        "num_1": "num_total_incidents",
        "num_2": "num_total_fatalities",
        "num_3": "num_total_lost_time_incidents",
        "denominator": "total_hours",
        "narrative": "comments",
        "organization": "organization",
        "risk": "risk",
        "source": "source",
        "state": "state",
        "timeframe": "timeframe"
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
        "basin": "basin",
        "date": "date",
        "narrative": "comments",
        "num_1": "white",
        "num_2": "black",
        "num_3": "asian",
        "num_4": "latino",
        "num_5": "native_american",
        "num_6": "other",
        "risk": "risk",
        "source": "source",
        "state": "state",
        "timeframe": "timeframe"
    },
    "Workforce Demographics - Gender": {
        "narrative": "comments",
        "num_1": "male",
        "num_2": "female",
        "num_3": "non_binary",
        "num_4": "no_response",
        "risk": "risk",
        "source": "source",
        "state": "state",
    }
}