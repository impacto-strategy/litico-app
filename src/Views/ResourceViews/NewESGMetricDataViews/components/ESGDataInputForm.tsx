import { 
    Button,
    Divider,
    Form,
    Input,
    message,
    Upload
} from "antd";
import { InboxOutlined} from '@ant-design/icons';
import { find } from "lodash";
import { FC } from "react";

import DynamicFieldsSection from "./DynamicFieldsSection";
import SharedFieldsSection from "./SharedFieldsSection";

import ResourceService from "../../../../Services/ResourceService";

/**
 * Interface for form where ESG metric data is added pertaining to specific ESG submetric type.
 */
const ESGDataInputForm: FC<any> = ({fields, form, headers, searchParams, standards}): JSX.Element => {
    const baseUrl = process.env.API_URL || 'http://localhost';

    const createMeasurementMetrics = (measurementIds: any[]) => {
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

    const normFile = (e: any) => {
        console.log('Upload event:', e)
        if (e?.file?.status === 'done') {
            resources.push(e.file.response)
        }
        return e && e.fileList;
    };

    const onFinish = (values: any) => {
        let measurementIds: any[] = [];
        delete values.factors.employee_id
        delete values.factors.tax_id

        console.log("What are values?", values)
        let requests = Object.keys(values.factors).map(async (key) => {
            let formValues = Object.assign({}, values);
            let factor = find(fields, { 'col_label': key });
            formValues['value'] = values['factors'][key];
            formValues['value'] = values['factors'][key];
            formValues['esg_metric_factor_id'] = factor.id;
            formValues['esg_metric_factor_name'] = factor.name;
            formValues['measurement_unit'] = factor.measurement_units[0];
            formValues['resources'] = resources;
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
            console.log("create measurement metrics")
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

            <Form.Item label="Upload Supporting Documentation" tooltip="Upload any document that compliments this entry.">
                <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile}  noStyle>
                    <Upload.Dragger name="file" action={`${baseUrl}/api/resources`} withCredentials={true} headers={headers} accept=".csv,.pdf,.doc,.docx,.jpeg,.png,.jpg,.svg">
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined/>
                        </p>
                        <p className="ant-upload-text">
                            Click or drag file to this area to upload
                        </p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload.
                        </p>
                    </Upload.Dragger>
                </Form.Item>
            </Form.Item>

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