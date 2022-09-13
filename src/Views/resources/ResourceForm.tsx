import React from "react";
import styled from "styled-components";

interface IResourceFields {
    title: string,
    dataIndex: string,
    type: string,
    required: boolean
}

interface IResourceFormProps {
    fields: IResourceFields[],
    data: any,
    setData: React.Dispatch<React.SetStateAction<{[key: string]: any}>>
}

const InputWrapper = styled.div`
    padding: 8px 8px 2px 0;
`

const ResourceForm: React.FC<IResourceFormProps> = ({fields, data, setData}): JSX.Element => {

    const handleChange = (e: React.FormEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>): void => {
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
            return <textarea rows={5} cols={22} name={field.dataIndex} value={data[field.dataIndex] ? data[field.dataIndex] : ''} onChange={(e) => handleChange(e)} style={{width: 300}}/>
        } else if (field.type === "text") {
            return <input type={field.type} value={data[field.dataIndex] ? data[field.dataIndex] : ''} onChange={(e) => handleChange(e)} name={field.dataIndex}/>
        }
    }

    return (
        <form>
            {fields.map((field, key: number) => {
                return (
                    <div key={key}>
                        <label>{field['title']}:</label>
                        <br />
                        <InputWrapper>
                            {generateInput(field)}
                        </InputWrapper>
                        <br />
                    </div>
                )
            })}
        </form>
    )
}

export default ResourceForm;