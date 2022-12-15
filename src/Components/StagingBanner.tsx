import { Alert } from "antd";

const StagingBanner = () => {
  return (
    <div>
      {(process.env.NODE_ENV === 'staging') &&
        <Alert
          style={{
            height: '64px',
            width: '50%',
            marginRight: 'auto',
            marginLeft: 'auto',
            position:'fixed',
            top: 0,
            right: 50,
            left: 50,
          }}
          message="You are currently in the test environment"
          type="info"
          showIcon
        />
      }
    </div>
  )
}

export default StagingBanner