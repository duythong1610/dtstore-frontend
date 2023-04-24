import { message } from "antd";

const success = (msg = "Success") => {
  message.success(msg);
};

const error = (msg = "Error") => {
  message.error(msg);
};

const warning = (msg = "Warning") => {
  message.warning(msg);
};

export { success, error, warning };
