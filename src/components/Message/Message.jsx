import { message } from "antd";

const success = (msg = "Success") => {
  message.success(msg);
};

const error = (msg = "Error") => {
  message.success(msg);
};

const warning = (msg = "Warning") => {
  message.success(msg);
};

export { success, error, warning };
