import React, { useEffect, useState } from "react";
import {
  WrapperContentProfile,
  WrapperHeader,
  WrapperInput,
  WrapperLabel,
  WrapperUploadFile,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import { WrapperInputNumber } from "../../components/ProductDetailsComponent/style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlice";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../until";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [avatar, setAvatar] = useState("");

  const dispatch = useDispatch();

  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    return UserService.updateUser(id, rests, access_token);
  });

  const { data, isLoading, isSuccess, isError } = mutation;
  console.log({ data }, { user }, { mutation });
  useEffect(() => {
    setName(user?.name),
      setEmail(user?.email),
      setPhone(user?.phone),
      setAddress(user?.address),
      setAvatar(user?.avatar);
  }, [data, user]);

  useEffect(() => {
    if (isSuccess) {
      message.success();
      handleGetDetailUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const handleGetDetailUser = async (id, access_token) => {
    const res = await UserService.getDetailsUser(id, access_token);
    dispatch(updateUser({ ...res?.data, access_token: access_token }));
  };
  const handleChangeName = (value) => {
    setName(value);
  };

  const handleChangeEmail = (value) => {
    setEmail(value);
  };

  const handleChangePhone = (value) => {
    setPhone(value);
  };

  const handleChangeAddress = (value) => {
    setAddress(value);
  };

  const handleChangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    console.log({ file }, { fileList });
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
    // handleUpdate();
  };

  console.log({ avatar });

  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      email,
      name,
      phone,
      address,
      avatar,
      access_token: user?.access_token,
    });
  };
  return (
    <div
      style={{
        width: "1270px",
        margin: "0 auto",
      }}
    >
      <WrapperHeader>Thông tin người dùng</WrapperHeader>
      <WrapperContentProfile>
        <WrapperInput>
          <WrapperLabel htmlFor="name">Name</WrapperLabel>
          <InputForm
            id="name"
            style={{ width: "500px" }}
            value={name}
            onChange={handleChangeName}
          />
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel htmlFor="email">Email</WrapperLabel>
          <InputForm
            id="email"
            style={{ width: "500px" }}
            value={email}
            onChange={handleChangeEmail}
          />
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
          <InputForm
            id="phone"
            style={{ width: "500px" }}
            value={phone}
            onChange={handleChangePhone}
          />
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel htmlFor="address">Address</WrapperLabel>
          <InputForm
            id="address"
            style={{ width: "500px" }}
            value={address}
            onChange={handleChangeAddress}
          />
        </WrapperInput>

        <WrapperInput>
          <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
          <WrapperUploadFile maxCount={1} onChange={handleChangeAvatar}>
            <Button icon={<UploadOutlined />} />
          </WrapperUploadFile>

          {avatar && (
            <img
              src={avatar}
              style={{
                height: "60px",
                width: "60px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              alt="avatar"
            />
          )}
        </WrapperInput>
        <ButtonComponent
          onClick={handleUpdate}
          size={40}
          styleButton={{
            color: "rgb(26,148,255)",
            fontSize: "15px",
            fontWeight: "700",
            height: "30px",
            width: "fit-content",
            border: "1px solid rgb(26,148,255)",
            borderRadius: "4px",
            padding: "4px 8px",
          }}
          textButton={"Cập nhật"}
        />
      </WrapperContentProfile>
    </div>
  );
};

export default ProfilePage;
