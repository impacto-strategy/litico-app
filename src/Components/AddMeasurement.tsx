import {Button, Form, InputNumber, notification, Select} from 'antd';
import {getQuarterFromDate} from "../utils";
import {FC, useCallback, useEffect, useMemo, useState} from "react";
import ResourceService from "../Services/ResourceService";
import Cookies from 'js-cookie';
import {BaseEditor, createEditor, Descendant, Editor, Element as SlateElement, Transforms,} from 'slate'

import {ReactEditor, useSlate, withReact} from 'slate-react'

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }
declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor
        Element: CustomElement
        Text: CustomText
    }
}

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14},
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

const AddMeasurement: FC<{ fields: any}> = props => {
    let token = Cookies.get('XSRF-TOKEN')
    const [form] = Form.useForm()
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

    return (
        <div>
            <Form
                form={form}
                name="validate_other"
                {...formItemLayout}
        >
          {props.fields.map((field: any) => (
            <Form.Item label={field.name} name={field.field_name} key={field.field_name}>
                <InputNumber onChange={val => getMetricTypes(val)}/>
            </Form.Item>
          ))}
            </Form>
        </div>
    )
}

export default AddMeasurement