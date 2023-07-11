import {FC, useCallback, useEffect, useState} from 'react'
import ResourceService from "../../../../Services/ResourceService";
import {Button, Form, Input, InputNumber, Switch} from "antd";

type GoalViewerProps = {
    metricType: any
    year: number | string
    onClose?: () => void
}

const GoalViewer: FC<GoalViewerProps> = ({metricType, year, onClose = () => null}) => {
    const [form] = Form.useForm()

    const [existingGoal, setEditingExistingGoal] = useState<boolean|any>(false)
    const [isInverse, setIsInverse] = useState<boolean>(false)

    const [initLoading, setInitLoading] = useState(false)


    const createGoal = useCallback((fields: any) => {

        setInitLoading(true)
        ResourceService.store({
            resourceName: 'performance-indicators',
            fields
        }).then(() => {

            form.resetFields()
            onClose()

        }).catch(e => {
            console.log(e)
        }).finally(() => {
            setInitLoading(false)
        })
    }, [form, onClose])

    useEffect(() => {
        ResourceService.find({
            resourceName: 'performance-indicators',
            column: 'name',
            value: metricType.name
        })
            .then((res => {
                if(res.data){
                    setEditingExistingGoal(res.data)
                    form.setFieldsValue({
                        low: res.data.low,
                        moderate: res.data.moderate,
                        high: res.data.high,
                        isInverse: res.data.isInverse,
                        notifications: res.data.notifications
                    })
                }
            }))

    }, [form, metricType.name])

    const updateGoal = useCallback((fields: any, id: any) => {

        setInitLoading(true)
        ResourceService.update({
            resourceName: 'performance-indicators',
            resourceID: id,
            fields
        }).then(() => {
            form.resetFields()
            onClose()
        }).catch(e => {
            console.log(e)
        }).finally(() => {
            setInitLoading(false)
        })
    }, [form, onClose])

    return (
        <>
            <Form
                form={form}
                layout="inline"
                initialValues={{
                    year: year,
                    name: metricType.name,
                    isInverse: false,
                    notifications: true
                }}
                onFinish={(values) => existingGoal ? updateGoal(values, existingGoal.id) : createGoal(values)}
            >
                <Form.Item required label="Year" hidden name={"year"}>
                    <InputNumber readOnly disabled/>
                </Form.Item>

                <Form.Item required label="Metric Name" hidden name={"name"}>
                    <Input readOnly disabled/>
                </Form.Item>

                <Form.Item valuePropName={"checked"} label="Notifications?" name={"notifications"} hidden>
                    <Switch disabled/>
                </Form.Item>

                <Form.Item label="Low" name={"low"}>
                    <InputNumber addonBefore={isInverse ? "-" : "+"}/>
                </Form.Item>
                <Form.Item label="Moderate" name={"moderate"}>
                    <InputNumber addonBefore={isInverse ? "-" : "+"}/>
                </Form.Item>
                <Form.Item label="High" name={"high"}>
                    <InputNumber addonBefore={isInverse ? "-" : "+"}/>
                </Form.Item>


                <Form.Item valuePropName={"checked"} label="Is Inverse?" name={"isInverse"}>
                    <Switch onChange={setIsInverse}/>
                </Form.Item>
                <div style={{flex: 'auto', width: '100%'}}>
                    <hr/>
                    <Button loading={initLoading} type={"primary"} htmlType="submit">Submit</Button>
                </div>

            </Form>
        </>
    )
}

export default GoalViewer