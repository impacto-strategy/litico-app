import {AutoComplete, Button, Col, Divider, Drawer, Form, notification, Row, Space} from "antd";
import {useEffect, useMemo, useState} from "react";
import ResourceService from "../Services/ResourceService";
import Title from "antd/es/typography/Title";


const openNotificationWithIcon = (type: string, name: string, from: string, to: string) => {
    // @ts-ignore
    notification[type]({
        message: 'Move Complete',
        description:
            `Successfully moved ${name} from ${from} to ${to}`,
    });
};

const MoveEquipment = ({equipment, onClose}: { equipment: any, onClose: any }) => {

    const [options, setOptions] = useState([])

    const modOptions = useMemo(() => {
        return options.map(({label}) => ({value: label}))
    }, [options])


    const handleSubmit = (value: any) => {
        const facility = value.new_facility

        const facilityID = (options.find(({label}) => facility === label) as any)?.value

        if (facilityID) {
            ResourceService.update({
                resourceName: 'equipments',
                resourceID: equipment.id,
                fields: {
                    'facility_id': facilityID
                }
            }).then(() => {

                openNotificationWithIcon('success', equipment.AQD_EU_ID, equipment.facility_name, facility)
                onClose()
            })
        }

    }

    useEffect(() => {
        ResourceService.index({resourceName: 'facilities-only'}).then(({data}) => {
            setOptions(data)
        })
    }, [])

    return (
        <div>
            <Drawer
                title="Create a new account"
                width={720}
                onClose={onClose}
                visible
                bodyStyle={{paddingBottom: 80}}
            >
                <Form layout="vertical" hideRequiredMark onFinish={handleSubmit}>
                    <Row gutter={24}>
                        <Col span={24}>
                            <h4 style={{textTransform: 'uppercase'}}>Current Facility</h4>
                            <Title level={3}>
                                {equipment.facility_name}
                            </Title>
                            <Divider/>
                        </Col>

                        <Col span={24}>

                            <Form.Item
                                name="new_facility"
                                label="NEW FACILITY"
                                rules={[{required: true, message: 'Please enter facility name'}]}
                            >
                                <AutoComplete options={modOptions} placeholder="Please enter facility name"
                                              onSelect={() => null}
                                              filterOption={(inputValue, option) => {

                                                  return (option?.value as unknown as string)?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                              }
                                              }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Space>
                                <Button htmlType={"submit"} type="primary">
                                    Submit
                                </Button>
                            </Space>
                        </Col>
                    </Row>

                </Form>
            </Drawer>
        </div>
    )
}

export default MoveEquipment