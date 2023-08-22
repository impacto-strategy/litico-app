import {
    Button,
    Divider,
    Form,
    Input,
    message
} from 'antd';
import { 
    FC, 
    useCallback, 
    useEffect, 
    useState 
} from 'react';
import {useSearchParams} from 'react-router-dom';

import DynamicFieldsSection from '../../../../Components/InputFields/DynamicFieldsSection';
import SharedFieldsSection from '../../../../Components/InputFields/SharedFieldsSection';
import UploadDocField from '../../../../Components/InputFields/SharedFieldsComponents/UploadDocField';

import ResourceService from '../../../../Services/ResourceService';

import { ESGMetricFactors, Standards } from '../../../../../global';
import { ESG_FIELD_MAPPING_CONFIG } from '../../../../constants/esgMetrics/global';

/**
 * Handles both the logic and UI for editing ESG Metric Data.
 */
const ESGDataEditForm: FC<any> = ({ closeEditDrawer, data, reloadTable }): JSX.Element => {
    const [fields, setFields] = useState<ESGMetricFactors | null>();
    const [initialValues, setInitialValues] = useState<any>();
    const [standard, setStandard] = useState<Standards | null>();
    const [searchParams] = useSearchParams();
    const [form] = Form.useForm();

    /**
     * Single standard pertaining to metric subtype. Needed mainly for input fields needed.
     */
    const getStandard = useCallback(() => {
        ResourceService.index({
            resourceName: "standards",
            params: {metric_subtype: searchParams.get("metric_subtype")}
        }).then(({ data }: {data: Standards}) => {
            setStandard(data);
            setFields(data[0].esg_metric_factors);
        })

    }, [searchParams, setStandard])

    /**
     * Creates new object to map data to appropriate field for initial values in our form.
     */
    const getInitialValues = (data: any) => {
        let initialValues: any = {};
        const mapper = ESG_FIELD_MAPPING_CONFIG[searchParams.get("metric_subtype")!];
        Object.keys(mapper).forEach(function(key) {
            initialValues[mapper[key]] = data[key];
        });
        setInitialValues(initialValues);
    }

    const onFinish = (updatedValues: any) => {
        const mapper = ESG_FIELD_MAPPING_CONFIG[searchParams.get("metric_subtype")!]
        let finalData: any = {};

        Object.keys(mapper).forEach((key: any) => {
            if (updatedValues.hasOwnProperty(mapper[key])) {
                if (updatedValues[mapper[key]]) {
                    finalData[key] = updatedValues[mapper[key]];
                }
            } else if (updatedValues["factors"].hasOwnProperty(mapper[key])) {
                if (updatedValues["factors"][mapper[key]]) {
                    finalData[key] = updatedValues["factors"][mapper[key]];
                }
            }
        })

        // Add the remaining data we need for the backend:
        finalData["id"] = data["id"];
        finalData["company_id"] = data["company_id"]
        finalData["metric_subtype"] = data["metric_subtype"];

        ResourceService.update({
            fields: JSON.parse(JSON.stringify(finalData)),
            resourceName: 'esg-metrics',
            resourceID: finalData.id
        }).then((res) => {
            if (res.data) {
                message.success('Data was added successfully');
                form.resetFields();
                // Reload report component to show updated data.
                reloadTable();
                // Closes form
                closeEditDrawer();
            }
        }).catch((err) => {
            console.log(err);
            message.error(`Unable to update, Try again later`);
        })
    }

    useEffect(() => {
        getStandard();
        getInitialValues(data);
    }, [getStandard]);
    return (
        <>
            {initialValues !== undefined &&
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <SharedFieldsSection 
                        initialValues={initialValues}
                        searchParams={searchParams}
                        standards={standard}
                    />

                    <Divider />

                    <DynamicFieldsSection 
                        fields={fields}
                        initialValues={initialValues}
                    />

                    <Divider />

                    <UploadDocField />

                    <Divider />

                    <Form.Item 
                        name="comments"
                        label="Discussion and Analysis"
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item>
                        {(fields && fields?.length > 0) &&
                            <Button type="primary" htmlType="submit">Submit</Button>
                        }
                        {(!fields || fields?.length < 1) &&
                            <div>
                                <Button type="primary" disabled>Submit</Button>
                                <p>Form not available yet</p>
                            </div>
                        }
                    </Form.Item>
                </Form>
            }
        </>
    )
}

export default ESGDataEditForm;