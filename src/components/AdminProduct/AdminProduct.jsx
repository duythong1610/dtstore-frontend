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
import { getBase64 } from "../../until";
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import Loading from "../../components/LoadingComponent/Loading";
import { useEffect } from "react";
import * as message from "../../components/Message/Message";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import axios from "axios";

const AdminProduct = () => {
  const user = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [typeSelect, setTypeSelect] = useState("");
  const [brandProduct, setBrandProduct] = useState("");
  const [imageInfo, setImageInfo] = useState("");
  // const [searchText, setSearchText] = useState("");
  // const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [stateProduct, setStateProduct] = useState({
    name: "",
    price: "",
    priceAfterDiscount: "",
    countInStock: "",
    rating: "",
    type: "",
    brand: "",
    image: "",
    description: "",
    discount: "",
    newType: "",
  });

  const [stateProductDetails, setStateProductDetails] = useState({
    name: "",
    price: "",
    countInStock: "",
    rating: "",
    type: "",
    image: "",
    description: "",
    discount: "",
    newType: "",
  });

  console.log(stateProductDetails);

  const [form] = Form.useForm();

  const fetchProductDetails = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data.name,
        price: res?.data.price,
        countInStock: res?.data.countInStock,
        rating: res?.data.rating,
        discount: res?.data.discount,
        type: res?.data.type,
        brand: res?.data.brand,
        image: res?.data.image,
        description: res?.data.description,
      });
    }

    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsOpenDrawer(true);
      fetchProductDetails(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetails);
    }
  }, [form, stateProductDetails]);

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };

  const handleDeleteProduct = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleDeleteManyProduct = (ids) => {
    mutationDeleteMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
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

  const mutation = useMutationHooks((data) => {
    const {
      name,
      price,
      priceAfterDiscount,
      countInStock,
      rating,
      type,
      brand,
      image,
      description,
      discount,
    } = data;

    return ProductService.createProduct({
      name,
      price,
      priceAfterDiscount,
      countInStock,
      rating,
      type,
      brand,
      image,
      description,
      discount,
    });
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rest } = data;
    return ProductService.updateProduct(id, token, { ...rest });
  });

  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    return ProductService.deleteProduct(id, token);
  });

  const mutationDeleteMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    return ProductService.deleteManyProduct(ids, token);
  });

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct();
    return res.data;
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };
  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
  });

  const { data: products, isLoading: isLoadingProduct } = queryProduct;

  const { data, isLoading, isSuccess, isError } = mutation;
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

  const onFinish = () => {
    const params = {
      name: stateProduct?.name,
      price: stateProduct?.price,
      priceAfterDiscount: (
        +stateProduct?.price * +stateProduct?.discount
      ).toString(),
      countInStock: stateProduct?.countInStock,
      discount: stateProduct?.discount,
      rating: stateProduct?.rating,
      type: stateProduct?.type,
      brand: stateProduct?.brand,
      image: stateProduct?.image,
      description: stateProduct?.description,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      price: "",
      countInStock: "",
      rating: "",
      type: "",
      brand: "",
      image: "",
      description: "",
    });
    form.resetFields();
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: "",
      price: "",
      countInStock: "",
      rating: "",
      type: "",
      brand: "",
      image: "",
      description: "",
    });
    form.resetFields();
  };

  const handleChange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeSelect = (value) => {
    if (value) {
      setTypeSelect(value);
    }
    setStateProduct({
      ...stateProduct,
      type: value,
    });
  };

  const handleChangeSelectBrand = (value) => {
    setStateProduct({
      ...stateProduct,
      brand: value,
    });
  };

  const fetchBrandByType = async (type) => {
    const res = await ProductService.getBrandByType(type);
    setBrandProduct(res);
    return res;
  };

  useEffect(() => {
    fetchBrandByType(typeSelect);
  }, [typeSelect]);

  const handleChangeSelectDetail = (value) => {
    // setStateProductDetails({
    //   ...stateProductDetails,
    //   type: { name: value },
    // });
    setStateProductDetails((prevState) => ({
      ...prevState,
      type: {
        ...prevState.type,
        name: value,
      },
    }));
  };

  const dataProduct =
    products?.length &&
    products?.map((product) => {
      return {
        ...product,
        key: product._id,
      };
    });

  const handleChangeImageProduct = async ({ fileList }) => {
    const file = fileList[0];
    console.log(file);
    const urlCreateImg = `https://storage.googleapis.com/my-image-products/${file.name}`;
    setImageInfo({
      name: file.name,
      type: file.type,
    });
    setStateProduct({
      ...stateProduct,
      image: urlCreateImg,
    });
    // handleUpdate();
  };

  const handleChangeThumbnail = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct((prevState) => ({
      ...prevState,
      type: {
        ...prevState.type,
        thumbnail: file.preview,
      },
    }));
    // handleUpdate();
  };

  const handleChangeThumbnailDetail = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails((prevState) => ({
      ...prevState,
      type: {
        ...prevState.type,
        thumbnail: file.preview,
      },
    }));
    // handleUpdate();
  };

  console.log(stateProduct, stateProductDetails);

  const handleChangeImageProductDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview,
    });
    // handleUpdate();
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateProductDetails,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
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
      title: "Tên sản phẩm",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Loại sản phẩm",
      dataIndex: ["type", "name"],
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: ">= 50",
          value: ">=",
        },
        {
          text: "<= 50",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.price >= 50;
        }
        return record.price <= 50;
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: ">= 3",
          value: ">=",
        },
        {
          text: "<= 3",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return +record.rating >= 3;
        }
        return +record.price <= 3;
      },
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

  const renderOptionsType = (arr) => {
    let result = [];
    console.log(arr);
    if (arr) {
      result = arr?.map((option) => {
        return {
          value: option._id,
          label: option.name,
        };
      });
    }
    return result;
  };

  const renderOptionsBrand = (arr) => {
    let result = [];
    console.log(arr);
    if (arr) {
      result = arr?.map((option) => {
        return {
          value: option._id,
          label: option.name,
        };
      });
    }
    return result;
  };

  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
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
          products={products}
          isLoading={isLoadingProduct}
          data={dataProduct}
          columns={columns}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
          handleDeleteMany={handleDeleteManyProduct}
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
                value={stateProduct.name}
                onChange={handleChange}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Select
                name="type"
                value={stateProduct?.type?.name}
                options={renderOptionsType(typeProduct?.data?.data)}
                onChange={handleChangeSelect}
              ></Select>
            </Form.Item>

            <Form.Item
              label="Brand"
              name="brand"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Select
                name="brand"
                value={stateProduct?.brand?.name}
                options={renderOptionsBrand(brandProduct?.data)}
                onChange={handleChangeSelectBrand}
              ></Select>
            </Form.Item>

            {/* <Form.Item
              label="Thumbnail Type"
              name="thumbnail"
              rules={[{ required: true, message: "Please input your image!" }]}
            >
              <WrapperUploadFile maxCount={1} onChange={handleChangeThumbnail}>
                <Button icon={<UploadOutlined />} />
                {stateProduct?.type?.thumbnail && (
                  <img
                    src={stateProduct.type?.thumbnail}
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
            </Form.Item> */}
            {stateProduct.type.name === "add_type" && (
              <Form.Item
                label="Type New"
                name="newType"
                rules={[
                  { required: true, message: "Please input your new type!" },
                ]}
              >
                <InputComponent
                  value={stateProduct.newType}
                  onChange={handleChange}
                  name="newType"
                />
              </Form.Item>
            )}

            <Form.Item
              label="Count In Stock"
              name="countInStock"
              rules={[
                {
                  required: true,
                  message: "Please input your count in stock!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.countInStock}
                onChange={handleChange}
                name="countInStock"
              />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please input your price!" }]}
            >
              <InputComponent
                value={stateProduct.price}
                onChange={handleChange}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[{ required: true, message: "Please input your rating!" }]}
            >
              <InputComponent
                value={stateProduct.rating}
                onChange={handleChange}
                name="rating"
              />
            </Form.Item>

            <Form.Item
              label="Discount"
              name="discount"
              rules={[
                { required: true, message: "Please input your discount!" },
              ]}
            >
              <InputComponent
                value={stateProduct.discount}
                onChange={handleChange}
                name="discount"
              />
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: "Please input your image!" }]}
            >
              <WrapperUploadFile
                maxCount={1}
                onChange={handleChangeImageProduct}
              >
                <Button icon={<UploadOutlined />} />
                {stateProduct.image && (
                  <img
                    src={stateProduct.image}
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

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <InputComponent
                value={stateProduct.description}
                onChange={handleChange}
                name="description"
              />
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
                value={stateProductDetails.name}
                onChange={handleChangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name={["type", "name"]}
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Select
                name={["type", "name"]}
                value={stateProductDetails?.type?.name}
                options={renderOptionsType(typeProduct?.data?.data)}
                onChange={handleChangeSelectDetail}
              ></Select>
            </Form.Item>

            {/* <Form.Item
              label="Type Product"
              name={["type", "name"]}
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <InputComponent
                value={
                  stateProductDetails.type.name && stateProductDetails.type.name
                }
                onChange={handleChangeSelectDetail}
                name="type"
              />
            </Form.Item> */}

            <Form.Item
              label="Thumbnail type"
              name="thumbnail"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <WrapperUploadFile
                maxCount={1}
                onChange={handleChangeThumbnailDetail}
              >
                <Button icon={<UploadOutlined />} />
                {stateProductDetails.type.thumbnail && (
                  <img
                    src={stateProductDetails.type.thumbnail}
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

            <Form.Item
              label="Count In Stock"
              name="countInStock"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.countInStock}
                onChange={handleChangeDetails}
                name="countInStock"
              />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.price}
                onChange={handleChangeDetails}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.rating}
                onChange={handleChangeDetails}
                name="rating"
              />
            </Form.Item>

            <Form.Item
              label="Discount"
              name="discount"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.discount}
                onChange={handleChangeDetails}
                name="discount"
              />
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <WrapperUploadFile
                maxCount={1}
                onChange={handleChangeImageProductDetails}
              >
                <Button icon={<UploadOutlined />} />
                {stateProductDetails.image && (
                  <img
                    src={stateProductDetails.image}
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

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.description}
                onChange={handleChangeDetails}
                name="description"
              />
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
        onOk={handleDeleteProduct}
        onCancel={handleCancelDelete}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc chắn muốn xóa sản phẩm này chứ?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;
