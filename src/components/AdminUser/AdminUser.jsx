import React, { useRef, useState, useEffect } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Space } from "antd";
import {
  PlusCircleFilled,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import ModalComponent from "../ModalComponent/ModalComponent";
import Loading from "../LoadingComponent/Loading";
import InputComponent from "../InputComponent/InputComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import * as message from "../Message/Message";
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import { useQuery } from "@tanstack/react-query";
import * as UserService from "../../services/UserService";
import { getBase64 } from "../../until";

const AdminUser = () => {
  const user = useSelector((state) => state.user);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const searchInput = useRef(null);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
    avatar: "",
    address: "",
  });
  const [form] = Form.useForm();

  const fetchUserDetails = async (rowSelected) => {
    const res = await UserService.getDetailsUser(
      rowSelected,
      user?.access_token
    );
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        isAdmin: res?.data?.isAdmin,
        avatar: res?.data?.avatar,
        address: res?.data?.address,
      });
    }

    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsOpenDrawer(true);
      fetchUserDetails(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };

  console.log({ stateUserDetails });

  const handleDeleteUser = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const handleDeleteManyUser = (ids) => {
    mutationDeleteMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "20px", cursor: "pointer" }}
          onClick={handleDetailsProduct}
        />
      </div>
    );
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rest } = data;
    return UserService.updateUser(id, token, { ...rest });
  });

  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    return UserService.deleteUser(id, token);
  });

  const mutationDeleteMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    return UserService.deleteManyUser(ids, token);
  });
  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    return res.data;
  };

  const queryUser = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const { data: users, isLoading: isLoadingUser } = queryUser;

  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDelete;

  const {
    data: dataDeletedMany,
    isLoading: isLoadingDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeleteMany;

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDeleted]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeletedMany) {
      message.error();
    }
  }, [isSuccessDeletedMany]);

  const handleOk = () => {
    setIsModalOpen(false);
    onFinish();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateUser({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
      avatar: "",
      address: "",
    });
    form.resetFields();
  };

  const handleChange = (e) => {
    setStateUser({
      ...stateUser,
      [e.target.name]: e.target.value,
    });
  };

  console.log(stateUserDetails?.avatar);

  const handleChangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeImageUser = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUser({
      ...stateUser,
      image: file.preview,
    });
    // handleUpdate();
  };

  const handleChangeImageUserDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview,
    });
    // handleUpdate();
  };

  const onUpdateUser = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateUserDetails,
      },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps("email"),
    },

    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps("address"),
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      filters: [
        {
          text: "True",
          value: true,
        },
        {
          text: "False",
          value: false,
        },
      ],
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Action",
      dataIndex: "address",
      render: renderAction,
    },
  ];

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const dataUser =
    users?.length &&
    users?.map((user) => {
      return {
        ...user,
        key: user._id,
        isAdmin: user?.isAdmin ? "Admin" : "No Admin",
      };
    });

  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>
      <div style={{ marginTop: "15px" }}>
        <Button
          style={{
            height: "150px",
            width: "150px",
            borderRadius: "6px",
            borderStyle: "dashed",
          }}
        >
          <PlusCircleFilled style={{ fontSize: "60px" }} />
        </Button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <TableComponent
          users={dataUser}
          isLoading={isLoadingUser}
          data={dataUser}
          columns={columns}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
          handleDeleteMany={handleDeleteManyUser}
        />
      </div>

      <DrawerComponent
        title="Thông tin người dùng"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width={"30%"}
      >
        <Loading isLoading={isLoadingUpdated || isLoadingUpdate}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            form={form}
            autoComplete="off"
            onFinish={onUpdateUser}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <InputComponent
                value={stateUserDetails.name}
                onChange={handleChangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <InputComponent
                value={stateUserDetails.email}
                onChange={handleChangeDetails}
                name="email"
              />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <InputComponent
                value={stateUserDetails.phone}
                onChange={handleChangeDetails}
                name="phone"
              />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleChangeDetails}
                name="address"
              />
            </Form.Item>

            <Form.Item
              label="Admin"
              name="isAdmin"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <InputComponent
                value={stateUserDetails.isAdmin}
                onChange={handleChangeDetails}
                name="isAdmin"
              />
            </Form.Item>

            <Form.Item
              label="Avatar"
              name="avatar"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <WrapperUploadFile
                maxCount={1}
                onChange={handleChangeImageUserDetails}
              >
                <Button icon={<UploadOutlined />} />
                {stateUserDetails.avatar && (
                  <img
                    src={stateUserDetails?.avatar}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    alt="avatar"
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Apply
            </Button>
          </Form>
        </Loading>
      </DrawerComponent>

      <ModalComponent
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onOk={handleDeleteUser}
        onCancel={handleCancelDelete}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc chắn muốn xóa sản phẩm này chứ?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminUser;
