import { FC } from 'react';
import { List } from "antd";
import styled from "styled-components";
import { BorderOutlined, CheckSquareOutlined } from '@ant-design/icons'
import { find } from 'lodash'

const governanceData = [
  {
    metricName: 'Discussion - Anti-Corruption and Bribery',
    displayName: 'Anti-Corruption and Bribery Document',
    hasPolicy: true
  },
  {
    metricName: 'Discussion - Tail Risks',
    displayName: 'Catostrophic/Tail-End Risks Document',
    hasPolicy: false
  },
  {
    metricName: 'Discussion - Governance Structure',
    displayName: 'Governance Structure Document',
    hasPolicy: false
  },
  {
    metricName: 'Discussion - Lobbying',
    displayName: 'Lobbying Document',
    hasPolicy: false
  },
  {
    metricName: 'Discussion - Regulatory Risk',
    displayName: 'Regulatory Risk Document',
    hasPolicy: false
  },
]

const Wrapper = styled.div`
    background: #fff;
    padding: 20px;
    grid-column: 1 / 5

  `

const GovernanceCheckList: FC<{ esgMetrics: any }> = props => {
  const hasPolicy = (item:any) => {
    return !!find(props.esgMetrics, { metric_subtype: item.metricName })
  }
    return (
      <Wrapper>
        <h3>Key Governance Documents</h3>
        <List
          grid={{
            gutter: 16,
            sm: 1,
            md: 3,
            lg: 3,
            xl: 3,
            xxl: 3
          }}
          dataSource={governanceData}
          style={{fontSize: '14px'}}
          renderItem={(item: any, idx) => (
            <List.Item style={{ padding: '10px', float: 'left'}}>
              {hasPolicy(item) ?
                <CheckSquareOutlined style={{ paddingRight: '5px'}} />
                : <BorderOutlined style={{ paddingRight: '5px'}} />}
              {item.displayName}
            </List.Item>
          )}
        />
      </Wrapper>
    )
}

export default GovernanceCheckList