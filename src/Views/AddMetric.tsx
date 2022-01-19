import {Button, Checkbox, Divider, Form, Input, InputNumber, notification, Select, Typography, Upload,} from 'antd';
import {
    BlockOutlined,
    BoldOutlined,
    CodeOutlined,
    InboxOutlined,
    ItalicOutlined,
    OrderedListOutlined,
    UnderlineOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import {getQuarterFromDate} from "../utils";
import {useCallback, useEffect, useMemo, useState} from "react";
import ResourceService from "../Services/ResourceService";

import {BaseEditor, createEditor, Descendant, Editor, Element as SlateElement, Transforms,} from 'slate'

import {Editable, ReactEditor, Slate, useSlate, withReact} from 'slate-react'

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }
declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor
        Element: CustomElement
        Text: CustomText
    }
}

const {Option} = Select;

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14},
};

const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

const LIST_TYPES = ['numbered-list', 'bulleted-list']


const toggleBlock = (editor: any, format: any) => {
    const isActive = isBlockActive(editor, format)
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: n =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type),
        split: true,
    })
    const newProperties: Partial<SlateElement> = {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
    Transforms.setNodes<SlateElement>(editor, newProperties)

    if (!isActive && isList) {
        const block = {type: format, children: []}
        Transforms.wrapNodes(editor, block)
    }
}

const toggleMark = (editor: any, format: any) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

const isBlockActive = (editor: any, format: any) => {
    const {selection} = editor
    if (!selection) return false

    // @ts-ignore
    const [match] = Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: n =>
            !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })

    return !!match
}

const isMarkActive = (editor: any, format: any) => {
    const marks = Editor.marks(editor)
    // @ts-ignore
    return marks ? marks[format] === true : false
}

// @ts-ignore
const Element = ({attributes, children, element}) => {
    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>
        case 'list-item':
            return <li {...attributes}>{children}</li>
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
        default:
            return <p {...attributes}>{children}</p>
    }
}

const Leaf = ({attributes, children, leaf}: any) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}

const BlockButton = ({format, icon}: any) => {
    const editor = useSlate()
    return (
        <Button
            type={isBlockActive(editor, format) ? 'default' : 'ghost'}
            onMouseDown={event => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}
        >
            {icon}
        </Button>
    )
}

const MarkButton = ({format, icon}: any) => {
    const editor = useSlate()
    return (
        <Button
            type={isBlockActive(editor, format) ? 'default' : 'ghost'}
            onMouseDown={event => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
        >
            {icon}
        </Button>
    )
}

const initialValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [
            {text: ''},
        ],
    }
]

const openNotificationWithIcon = (type: string) => {
    // @ts-ignore
    notification[type]({
        message: 'Metric Added!',
        description:
            `Successfully added metric.`,
    });
};

const AddMetric = () => {

    const [form] = Form.useForm()

    const [loading, setLoading] = useState(false)
    const [facilities, setFacilities] = useState([])

    const [metricTypes, setMetricTypes] = useState([])

    const [selectedMetricType, setSelectedMetricType] = useState<boolean | any>(false)

    const modMetricTypes = useMemo(() => {
        if (!metricTypes) {
            return []
        }
        return [
            ...metricTypes.map(({name, id}) => ({
                label: name,
                value: id
            }))]
    }, [metricTypes])


    // editor

    const [value, setValue] = useState<Descendant[]>(initialValue)
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const editor = useMemo(() => withReact(createEditor()), [])

    //...

    const getMetricTypes = useCallback((year) => {
        ResourceService.index({
            resourceName: 'metric-types',
            params: {
                year: year
            }
        }).then(({data}) => {
            setMetricTypes(data.metric_types)
        })

    }, [])

    const modFacilities = useMemo(() => {
        return facilities
    }, [facilities])

    const getFacilities = useCallback(() => {
        ResourceService.index({resourceName: 'facilities-only'}).then(({data}) => {
            setFacilities(data)
        })
    }, [setFacilities])

    useEffect(() => {
        getFacilities()
        getMetricTypes((new Date()).getFullYear())
    }, [getFacilities, getMetricTypes])

    const onFinish = (values: any) => {
        setLoading(true)
        ResourceService.store({
            resourceName: 'sessions',
            fields: {...values, notes: JSON.stringify(value), metric_type_id: selectedMetricType.id}
        }).then(() => {
            openNotificationWithIcon('success')
            form.resetFields()
        }).finally(() => setLoading(false))
    };


    return (
        <div>
            <Divider orientation={"center"}>
                <Typography.Title level={1}>
                    Add New Metric
                </Typography.Title>
            </Divider>
            <Form
                form={form}
                name="validate_other"
                {...formItemLayout}
                onFinish={onFinish}
                initialValues={{
                    year: (new Date()).getFullYear(),
                    period: "Q" + getQuarterFromDate()
                }}
            >
                <Form.Item label="Year" name={"year"}>
                    <InputNumber onChange={val => getMetricTypes(val)}/>
                </Form.Item>
                <Form.Item
                    name="period"
                    label="Period"
                    hasFeedback
                    rules={[{required: true, message: 'Please select period'}]}
                >
                    <Select placeholder="Please select a country">
                        {['Q1', 'Q2', 'Q3', 'Q4', 'YR'].map(y => (
                            <Option key={y} value={`${y}`}>{`${y}`}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="facility_id"
                    label="Facility"
                >
                    <Select showSearch
                            allowClear
                            filterOption={(input, option) => {

                                return ((option as any)?.label as unknown as string)?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }}
                            filterSort={(optionA, optionB) =>
                                ((optionA as any).label as unknown as string)?.toLowerCase().localeCompare(((optionB as any).label as string)?.toLowerCase())
                            }
                            placeholder="Please select a facility" optionLabelProp={"label"} options={modFacilities}
                            defaultActiveFirstOption>

                    </Select>
                </Form.Item>

                <Form.Item
                    name="metric_type_id"
                    label="Metric Type"
                >
                    <Select showSearch
                            onChange={(_id) => setSelectedMetricType(metricTypes.find(({id}) => id === _id))}
                            filterOption={(input, option) => {

                                return (option?.label as unknown as string)?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }}
                            filterSort={(optionA, optionB) =>
                                (optionA.label as string)?.toLowerCase().localeCompare((optionB.label as string)?.toLowerCase())
                            }
                            placeholder="Please select a Metric Type" optionLabelProp={"label"} options={modMetricTypes}
                            defaultActiveFirstOption>

                    </Select>
                </Form.Item>
                <Divider dashed/>
                <Form.Item label="Metric Name">
                    <Form.Item name="dimension_name">
                        <Input/>
                    </Form.Item>
                </Form.Item>

                <Form.Item label="Metric Value">
                    <Form.Item name="metric_value" noStyle>
                        {selectedMetricType.isNumeric ? <InputNumber style={{width: '55%'}} size={"large"}/> : <Input/>}
                    </Form.Item>
                    {selectedMetricType.measurement_units &&
                    <span className="ant-form-text"> {selectedMetricType.measurement_units}</span>}
                </Form.Item>

                <Form.Item label={"Notes"}>
                    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
                        <div>
                            <MarkButton format="bold" icon={<BoldOutlined/>}/>
                            <MarkButton format="italic" icon={<ItalicOutlined/>}/>
                            <MarkButton format="underline" icon={<UnderlineOutlined/>}/>
                            <MarkButton format="code" icon={<CodeOutlined/>}/>
                            <BlockButton format="heading-one" icon="H1"/>
                            <BlockButton format="heading-two" icon="H2"/>
                            <BlockButton format="block-quote" icon={<BlockOutlined/>}/>
                            <BlockButton format="numbered-list" icon={<OrderedListOutlined/>}/>
                            <BlockButton format="bulleted-list" icon={<UnorderedListOutlined/>}/>
                        </div>
                        <Editable
                            style={{background: '#fff', padding: 20}}
                            renderElement={renderElement}
                            renderLeaf={renderLeaf}
                            placeholder="Enter some rich text…"
                            spellCheck
                            autoFocus
                        />
                    </Slate>
                </Form.Item>
                <Form.Item label="Upload">
                    <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                        <Upload.Dragger name="files" action="/upload.do">
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form.Item>


                <Form.Item wrapperCol={{span: 12, offset: 6}} valuePropName={"checked"}>
                    <Checkbox>Request Approval</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{span: 12, offset: 6}}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default AddMetric