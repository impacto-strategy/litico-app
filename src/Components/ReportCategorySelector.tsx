import {AutoComplete} from "antd";
import {FC, useCallback, useEffect, useMemo, useState} from "react";
import ResourceService from "../Services/ResourceService";

const ReportCategorySelector: FC<{
    value?: number | string;
    onChange?: (id: number | string) => void
}> = ({value, onChange = () => null}) => {

    const [options, setOptions] = useState([])

    const modOptions = useMemo(() => {
        return options.map(({name, id}) => ({
            label: name,
            value: (id as number).toString()
        }))
    }, [options])

    const getOptions = useCallback(() => {
        ResourceService.index({
            resourceName: 'report-categories'
        }).then(({data}) => setOptions(data))
    }, [setOptions])

    useEffect(() => {

        getOptions()

    }, [getOptions])

    return (
        <AutoComplete options={modOptions} placeholder="Please enter category"
                      onSelect={() => null}
                      allowClear
                      defaultValue={value?.toString()}
                      onChange={onChange}
                      filterOption={(inputValue, option) => {
                          return (option?.label as unknown as string)?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }}
        />
    )
}

export default ReportCategorySelector