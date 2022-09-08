import React from "react";
import { Form, Input } from "antd";
import { IResourceFields } from "./FormFields";

interface IResourceFormProps {
    fields: IResourceFields[],
    data: any,
    setData: React.Dispatch<React.SetStateAction<{[key: string]: any}>>
}

const ResourceForm: React.FC<IResourceFormProps> = ({fields, data, setData}): JSX.Element => {
    const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;
        setData((current) => {
            let temp = {...current}
            temp[name] = value
            return temp
        })
    }

    const generateInput = (field: IResourceFields) => {
        if (field.type === "textarea") {
            return <Input.TextArea rows={3}/>
        } else if (field.type === "text") {
            return <Input value={data[field.dataIndex]} onChange={(e) => handleChange(e)} name={field.dataIndex} type={field.type}/>
        }
    }

    return (
        <Form>
            {fields.map((field, key: number) => {
                return (
                    <Form.Item
                        key={key}
                        label={field.title}
                        name={field.dataIndex}
                        required={field.required}
                    >
                        {generateInput(field)}
                    </Form.Item>
                )
            })}
        </Form>
    )
}

export default ResourceForm;