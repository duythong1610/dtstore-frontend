import React, { useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Select, Space } from "antd";
import {
  PlusCircleFilled,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64, renderOptions } from "../../until";
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import Loading from "../../components/LoadingComponent/Loading";
import { useEffect } from "react";
import * as message from "../../components/Message/Message";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";

const AdminTypeProduct = () => {
  const user = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [typeSelect, setTypeSelect] = useState("");
  // const [searchText, setSearchText] = useState("");
  // const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [stateTypeProduct, setStateTypeProduct] = useState({
    name: "",
    thumbnail: "",
  });

  const [stateTypeProductDetails, setStateTypeProductDetails] = useState({
    name: "",
    thumbnail: "",
  });

  const [form] = Form.useForm();

  const fetchTypeProductDetails = async (rowSelected) => {
    const res = await ProductService.getDetailsTypeProduct(rowSelected);
    if (res?.data) {
      setStateTypeProductDetails({
        name: res?.data.name,
        thumbnail: res?.data.thumbnail,
      });
    }

    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsOpenDrawer(true);
      fetchTypeProductDetails(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateTypeProductDetails);
    }
  }, [form, stateTypeProductDetails]);

  const handleDetailsTypeProduct = () => {
    setIsOpenDrawer(true);
  };

  const handleDeleteTypeProduct = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryTypeProduct.refetch();
        },
      }
    );
  };

  const handleDeleteManyTypeProduct = (ids) => {
    mutationDeleteMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryTypeProduct.refetch();
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
          onClick={handleDetailsTypeProduct}
        />
      </div>
    );
  };

  const mutation = useMutationHooks((data) => {
    const { name, thumbnail } = data;
    return ProductService.createTypeProduct({
      name,
      thumbnail,
    });
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rest } = data;
    return ProductService.updateTypeProduct(id, token, { ...rest });
  });

  //   const mutationDelete = useMutationHooks((data) => {
  //     const { id, token } = data;
  //     return ProductService.deleteProduct(id, token);
  //   });

  //   const mutationDeleteMany = useMutationHooks((data) => {
  //     const { token, ...ids } = data;
  //     return ProductService.deleteManyProduct(ids, token);
  //   });

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res.data;
  };

  const queryTypeProduct = useQuery({
    queryKey: ["type-products"],
    queryFn: fetchAllTypeProduct,
  });

  const { data: typeProducts, isLoading: isLoadingProduct } = queryTypeProduct;
  console.log(typeProducts);

  const { data, isLoading, isSuccess, isError } = mutation;
  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  //   const {
  //     data: dataDeleted,
  //     isLoading: isLoadingDeleted,
  //     isSuccess: isSuccessDeleted,
  //     isError: isErrorDeleted,
  //   } = mutationDelete;

  //   const {
  //     data: dataDeletedMany,
  //     isLoading: isLoadingDeletedMany,
  //     isSuccess: isSuccessDeletedMany,
  //     isError: isErrorDeletedMany,
  //   } = mutationDeleteMany;

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);

  //   useEffect(() => {
  //     if (isSuccessDeleted && dataDeleted?.status === "OK") {
  //       message.success();
  //       handleCancelDelete();
  //     } else if (isErrorDeleted) {
  //       message.error();
  //     }
  //   }, [isSuccessDeleted]);

  //   useEffect(() => {
  //     if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
  //       message.success();
  //       handleCancelDelete();
  //     } else if (isErrorDeletedMany) {
  //       message.error();
  //     }
  //   }, [isSuccessDeletedMany]);

  const handleOk = () => {
    setIsModalOpen(false);
    onFinish();
  };

  const dataTypeProduct =
    typeProducts?.length &&
    typeProducts?.map((product) => {
      return {
        ...product,
        key: product._id,
      };
    });

  console.log(dataTypeProduct);

  const onFinish = () => {
    const params = {
      name: stateTypeProduct?.name,
      thumbnail: stateTypeProduct?.thumbnail,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryTypeProduct.refetch();
      },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateTypeProduct({
      name: "",
      thumbnail: "",
    });
    form.resetFields();
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateTypeProductDetails({
      name: "",
      thumbnail: "",
    });
    form.resetFields();
  };

  const handleChange = (e) => {
    setStateTypeProduct({
      ...stateTypeProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeDetails = (e) => {
    setStateTypeProductDetails({
      ...stateTypeProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeThumbnailTypeProduct = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateTypeProduct({
      ...stateTypeProduct,
      thumbnail: file.preview,
    });
    // handleUpdate();
  };

  const handleChangeThumbnailTypeProductDetail = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateTypeProductDetails((prevState) => ({
      ...prevState,

      thumbnail: file.preview,
    }));
    // handleUpdate();
  };
  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateTypeProductDetails,
      },
      {
        onSettled: () => {
          queryTypeProduct.refetch();
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
      title: "Tên loại sản phẩm",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      render: (thumbnail) => (
        <img
          src={thumbnail}
          alt="Thumbnail"
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
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

  return (
    <div>
      <WrapperHeader>Quản lý loại sản phẩm</WrapperHeader>
      <div style={{ marginTop: "15px" }}>
        <Button
          onClick={() => setIsModalOpen(true)}
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
          products={typeProducts}
          // isLoading={isLoadingTypeProduct}
          data={dataTypeProduct}
          columns={columns}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
          //   handleDeleteMany={handleDeleteManyProduct}
        />
      </div>

      <ModalComponent
        forceRender
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Loading isLoading={isLoading}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            form={form}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <InputComponent
                value={stateTypeProduct.name}
                onChange={handleChange}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Thumbnail Type"
              name="thumbnail"
              rules={[{ required: true, message: "Please input your image!" }]}
            >
              <WrapperUploadFile
                maxCount={1}
                onChange={handleChangeThumbnailTypeProduct}
              >
                <Button icon={<UploadOutlined />} />
                {stateTypeProduct.thumbnail && (
                  <img
                    src={stateTypeProduct.thumbnail}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    alt="thumbnail"
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>

      <DrawerComponent
        // forceRender
        title="Chi tiết sản phẩm"
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
            onFinish={onUpdateProduct}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <InputComponent
                value={stateTypeProductDetails.name}
                onChange={handleChangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Thumbnail type"
              name="thumbnail"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <WrapperUploadFile
                maxCount={1}
                onChange={handleChangeThumbnailTypeProductDetail}
              >
                <Button icon={<UploadOutlined />} />
                {stateTypeProductDetails.thumbnail && (
                  <img
                    src={stateTypeProductDetails.thumbnail}
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
        // onOk={handleDeleteProduct}
        onCancel={handleCancelDelete}
      >
        {/* <Loading isLoading={isLoadingDeleted}>
            <div>Bạn có chắc chắn muốn xóa sản phẩm này chứ?</div>
          </Loading> */}
      </ModalComponent>
    </div>
  );
};

export default AdminTypeProduct;
