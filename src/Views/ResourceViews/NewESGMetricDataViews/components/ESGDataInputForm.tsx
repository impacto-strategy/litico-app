import { 
    Button,
    Divider,
    Form,
    Input,
    message
} from "antd";
import { find } from "lodash";
import { FC } from "react";

import DynamicFieldsSection from "../../../../Components/InputFields/DynamicFieldsSection";
import SharedFieldsSection from "../../../../Components/InputFields/SharedFieldsSection";
import UploadDocField from "../../../../Components/InputFields/SharedFieldsComponents/UploadDocField";

import ResourceService from "../../../../Services/ResourceService";

/**
 * Interface for form where ESG metric data is added pertaining to specific ESG submetric type.
 */
const ESGDataInputForm: FC<any> = ({fields, form, searchParams, standards}): JSX.Element => {

    const createMeasurementMetrics = (measurementIds: any[]) => {
        console.log("What is factors?", form.getFieldValue('factors'))
        ResourceService.store({
            resourceName: 'measurement-esg-metrics',
            fields: {
                measurement_ids: measurementIds,
                metric_subtype: searchParams.get("metric_subtype"),
                year: form.getFieldValue('date').year(),
                employee_id: form.getFieldValue('factors').employee_id,
                tax_id: form.getFieldValue('factors').tax_id,
                factors: form.getFieldValue('factors')
            }
        }).then((res) => {
            message.success('Data was added successfully');
            form.resetFields()
        })
    };

    const onFinish = (values: any) => {
        let measurementIds: any[] = [];
        delete values.factors.employee_id
        delete values.factors.tax_id

        let requests = Object.keys(values.factors).map(async (key) => {
            let formValues = Object.assign({}, values);
            let factor = find(fields, { 'col_label': key });

            formValues['value'] = values['factors'][key];
            formValues['value'] = values['factors'][key];
            formValues['esg_metric_factor_id'] = factor.id;
            formValues['esg_metric_factor_name'] = factor.name;
            formValues['measurement_unit'] = factor.measurement_units[0];
            formValues['resources'] = resources;

            // The database expects timeframe to be added, so we add a value for those that don't use timeframe.
            if (typeof formValues['timeframe'] === "undefined") {
                formValues['timeframe'] = 'daily';
            }

            let request  = ResourceService.store({
                resourceName: 'measurements',
                fields: {...formValues}
            }).then((response) => {
                measurementIds.push(response.data.id)
            })

            return request;
        })

        // If there's an additional table needing updating, this function calls otherwise the promise is defaulted to resolved.
        if (searchParams.get("metric_subtype") === "Production - Oil, Gas, Produced Water, Synthetic Oil, Synthetic Gas") {
            requests.push(storeAdditionalMetrics(Object.assign({}, values)));
        }

        Promise.all(requests).then(() => {
            return createMeasurementMetrics(measurementIds);
        });
    };

    /**
     * Handles cases where data may need to be stored in tables other
     * than ESG metrics and Measurements (e.g., productions). Will look at
     * exploring alternatives in the future.
     * 
     * @param data The information to be stored
     * 
     */
    const storeAdditionalMetrics = async (data: any): Promise<void> => {
        /*
            This function only supports production and only if production is yearly.
        */
        if (searchParams.get("metric_subtype") === "Production - Oil, Gas, Produced Water, Synthetic Oil, Synthetic Gas") {
        return ResourceService.store({
            resourceName: 'productions',
            fields: {
                year: form.getFieldValue('date').year(),
                ...data
            }
        }).then((response) => {
            return;
        })
        }
    }

    // MISC
    let resources: any[] = [];

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <SharedFieldsSection 
                searchParams={searchParams}
                standards={standards}
            />

            <Divider />

            <DynamicFieldsSection fields={fields} />

            <Divider />

            <UploadDocField />

            <Divider />

            <Form.Item name="comments" label="Discussion and Analysis">
                <Input.TextArea />
            </Form.Item>

            <Form.Item>
                {(fields?.length > 0) &&
                    <Button type="primary" htmlType="submit">Submit</Button>
                }
                {(fields?.length < 1) &&
                    <div>
                        <Button type="primary" disabled>Submit</Button>
                        <p>Form not available yet</p>
                    </div>
                }
            </Form.Item>
        </Form>
    )
}

export default ESGDataInputForm;