import {
    Button,
    Divider,
    Form,
    Input,
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

import {ESGMetricFactors, Standards} from '../../../../../global';

interface IEditFormProps {
    
};

/**
 * Handles both the logic and UI for editing ESG Metric Data.
 */
const ESGDataEditForm: FC = (): JSX.Element => {

    const [fields, setFields] = useState<ESGMetricFactors | null>();
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
            setFields(data[0].esg_metric_factors)
        })

    }, [searchParams, setStandard])

    const onFinish = () => {
        
    }

    useEffect(() => {
        getStandard();
    }, [getStandard]);

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <SharedFieldsSection 
                searchParams={searchParams}
                standards={standard}
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
    )
}

export default ESGDataEditForm;